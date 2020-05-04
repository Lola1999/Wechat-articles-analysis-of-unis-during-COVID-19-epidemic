#!/usr/bin/python
# -*- coding: utf-8 -*-

import urllib.request
import re
import pymysql
from bs4 import BeautifulSoup  
import insert_db
import time
import pynlpir
import jieba
from snownlp import SnowNLP
import thulac
import json
from collections import Counter
from collections import defaultdict
from pandas import DataFrame
import math
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import pandas
import numpy as np
global count1, count2
count1 = 0
count2 = 0  

def mysql_execute(sql):
    db = pymysql.connect(host='localhost',port=3306,user='root',passwd='',db='mythesis',charset='utf8')
    cur = db.cursor()
    n = cur.execute(sql)
    db.commit() #提交
    msg_tuple = cur.fetchall()
    return msg_tuple, db, cur

def msg_content_crawler(url):
    a = urllib.request.urlopen(url)#打开指定网址
    html = a.read() #读取网页源码
    html = html.decode("utf-8") 
    soup = BeautifulSoup(html,"html.parser") 
    paragraph = []

    try:
        tag = soup.find('div', class_='rich_media_wrp') #包含文章内容的div    
        title = tag.find('h2', class_='rich_media_title').get_text()  #标题
        title = insert_db.filter_text(title.strip())
        
        university = tag.find('span',class_='rich_media_meta rich_media_meta_nickname').find('a').get_text() #账户
        university = insert_db.filter_text(university.strip())
        
        content = tag.find('div',class_="rich_media_content") # 文章正文div
        seg_list = content.find_all({'p','span'}) # 文章正文文本列表
        for seg in seg_list:
            seg = seg.get_text()
            paragraph.append(seg)
        paragraph = "".join(paragraph).strip() # 文章文本内容字符串
        paragraph = paragraph.replace(" ","").replace(u'\xa0',"").replace("'","‘") # 这里需要文本过滤
        article_content = insert_db.filter_text(paragraph)

        global count1
        count1 += 1
        print('访问url成功', count1, '篇')
    #print("正文：" + paragraph.replace(" ","") + "\n")
    except Exception as ex_results:
        global count2 
        count2 += 1
        print("content ex_results:",ex_results)
        title = university = article_content = ''
        print('访问url时出错', count2, '篇\n')
    return [title, university, article_content]

def insert_article_content_by_visiting_url(): # 从articles中取出文章url，访问后获得标题、作者、内容等信息插入article_content数据库
    #select_sql = "select __biz, msg_id, index_, url, publish_time from articles where comment_emotion = 0" #只对之前没有处理过的重新访问，这里还不是很清楚，考虑设置标志位筛选
    select_sql = """
        select articles.__biz, articles.msg_id, articles.index_, articles.url, articles.publish_time 
        from 
            (select * from articles)articles
            left join
            (select * from article_content)article_content
            on articles.__biz = article_content.__biz and articles.msg_id = article_content.msg_id and articles.index_ = article_content.index_
        where article_content.text_content is null
    """

    msg_tuple, db, cur = mysql_execute(select_sql)
    
    insert_sql = "insert IGNORE into article_content (__biz, msg_id, index_, url, publish_time, title, name, text_content) values('%s','%s','%d','%s','%s','%s','%s','%s')" #用execute()时要注意'%s'加单引号
    
    for msg in msg_tuple: # msg: __biz, msg_id, index, url, publish_time, title, name, text_content
        msg_l = list(msg) # 元组本身不可以修改，需要转换为列表
        [title, name, text_content] = msg_content_crawler(msg[3])
        msg_l[4] = str(msg_l[4]) # 将datetime变成可以插入mysql的timestamp
        msg_l.append(title)
        msg_l.append(name)
        msg_l.append(text_content)
        temp = tuple(msg_l)
        temp_sql = insert_sql % temp
        # print(temp_sql)
        try:
            cur.execute(temp_sql)
            db.commit() #提交
        except Exception as ex_results: # 写入log
            print("ex_results:",ex_results)    
            print(temp)

    db.close() #释放数据库资源

def analysis_for_comments(): # 对文章评论的情感分析(数据库中对没有评论的文章设定其感情基调为0.5中立)，计算加权平均数，并插入数据库，提前对空缺值进行处理；完成对文章评论的分词，用于制作高校评论热词
    with open(r'./ForTHULAC/stopword.txt', 'r',encoding='utf-8') as f: #获取停用词列表
	    my_data = f.readlines() 
	    stopwords = ''.join([i.replace("\n"," ") for i in my_data]).split(' ') #得到停用词列表

    thu_model = thulac.thulac(user_dict=r"./ForTHULAC/user_dict.txt",seg_only=True, filt=True) # 分词模型，用户词典中包括学校行话、疫情主题行话

    #sql = "select elected_comment, title, __biz, msg_id, index_ from articles where comment_emotion = 0 and elected_comment_cnt > 0" #做评论情感分析用的
    sql = "select elected_comment, title, __biz, msg_id, index_ from articles where elected_comment_cnt > 0" #插入高校热词用的

    msg_tuple, db, cur = mysql_execute(sql)
    msg = list(msg_tuple)

    msg_new_tuple_for_update = ()
    comment_hotwords = {} # 字典 {学校1: hotwords1, 学校2:hotwords2}

    for m in msg: #m为取出的这批文章中某一篇的详情，其中评论为json格式，依然是一个列表
        comment_wordcount = Counter() #存储每篇文章评论词频，用于高校评论热词分析
        comment_hotwords[m[2]] = Counter() #存储每个学校评论词频
        if(m[0] == '[]'):# print(m[1], 0) #m[1]: title，m[2]: __biz, m[3]:msg_id, m[4]:index_
            weighted_avg = 0
        else:
            msg_comments_list = json.loads(m[0]) #将这个列表转换成python可以读取操作的格式，内部是一个列表，每个元素是字典
            p_sum = 0
            comments_like_sum = 1
            for msg_comments in msg_comments_list: #这个msg_comments是一个字典，代表每一条评论
                try:
                    comments = json.loads(str(msg_comments).replace("\\",'').replace("'",'"')) #将字典转换成字符串用来做json解析
                    p = SnowNLP(comments['content']).sentiments
                    comments_like_sum += int(comments['like_num']) + 1 # 评论点赞总数
                    p_sum += p * (int(comments['like_num']) + 1) #某条评论情感 * 评论点赞数

                    # 为了计算评论热词，数据库中添加一列为评论词频comment_wordcount，json格式 {comment: likenum}
                    thulac_c = thulac_for_contents(stopwords, thu_model, comments['content'], int(comments['like_num']) + 1)#对评论进行分词+统计词频，权重为like_num+1
                    comment_wordcount += Counter(thulac_c)

                except Exception as ex_results:
                    print(m[1], msg_comments) #看看是哪条评论有问题
                    print("ex_results:",ex_results)

                weighted_avg = round(p_sum / (len(msg_comments)+comments_like_sum), 3) #评论情感分析的加权平均数，数据库中对应comment_emotion一列，精确到小数点后3位
        comment_wordcount_json = json.dumps(comment_wordcount)
        msg_new_tuple_for_update += ((weighted_avg, comment_wordcount_json, m[2],m[3],int(m[4])),)
        # print(m[1],sorted(comment_wordcount.items(),key=lambda x:x[1],reverse=True)) #查看评论分词结果
        # print(m[1], weighted_avg) #这篇文章标题与评论的情感指数
        comment_hotwords[m[2]] += comment_wordcount #学校评论热词字典{学校1：词频Counter1}
    
    update_sql = "update articles set comment_emotion = %s, comment_wordcount = %s where __biz = %s and msg_id = %s and index_ = %s"

    try:
        n = cur.executemany(update_sql, msg_new_tuple_for_update)    #使用executemany方法批量插入数据
        db.commit() #提交
        print("情感分析指数、评论词频插入articles库成功！")
    except Exception as ex_results:
        print("ex_results:",ex_results)

    update_sql = "update account_info set comment_hotwords = %s where __biz = %s"
    fp = "D:/getcomment/"
    hotwords_tuple_for_update = ()
    for school in comment_hotwords:
        hotwords = json.dumps(comment_hotwords[school])
        hotwords_tuple_for_update += ((hotwords,school),)
        if hotwords == {}:
            print(school + "没有评论") 
        else:
            wc_from_word_count(dict(comment_hotwords[school]), str(fp + str(school) + ".jpg"))
    try:
        n = cur.executemany(update_sql, hotwords_tuple_for_update)    #使用executemany方法批量插入数据
        db.commit() #提交
        print("评论热词插入account_info库成功！")
    except Exception as ex_results:
        print("ex_results:",ex_results)
    db.close()

def thulac_for_contents(stopwords, thu_model, text, title_weight = 1): 
    # 分词函数，title_weight表示权重，标题权重更大，文章内容权重为默认值1，返回一个降序排列的词频字典
    words = thu_model.cut(text, text=True)
    l = words.split(' ')

    d={}
    for word in l:
        if word not in stopwords:
            if word in d:
                d[word] += 1 * title_weight # 如果是标题中的词，赋予高一些的权重
            else:
                d[word]=1 * title_weight
    d_order = sorted(d.items(),key=lambda x:x[1],reverse=True)  # 将字典按照词频降序排列
    return dict(d_order)

def content_analysis(): # 插入keywords, word_count，返回words_in_articles为所有文章分词结果（只有词）
    with open(r'./ForTHULAC/stopword.txt', 'r',encoding='utf-8') as f: #获取停用词列表
	    my_data = f.readlines() 
	    stopwords = ''.join([i.replace("\n"," ") for i in my_data]).split(' ') #得到停用词列表

    thu_model = thulac.thulac(user_dict=r"./ForTHULAC/user_dict.txt",seg_only=True, filt=True) # 分词模型，用户词典中包括学校行话、疫情主题行话

    sql = "select title, text_content, __biz, msg_id, index_ from article_content"
    msg_tuple, db, cur = mysql_execute(sql)
    msg = list(msg_tuple) #数据库获取的文章信息列表
    
    msg_new_tuple_for_update = () # 分词统计后对数据库更新用
    # total_word_count = Counter({}) # 用于存储整个库中的分词统计
    keywords=[] # 文章关键词，分词后TOP5
    words_in_articles = [] # 列表，每个元素为一篇文章分词结果的列表，用于计算IDF |D| = len(words)

    for m in msg: #m为取出的这批文章中某一篇的详情
        title_words = thulac_for_contents(stopwords, thu_model, m[0], 5) #标题分词，权重为5
        content_words = thulac_for_contents(stopwords, thu_model, m[1], 1) #内容分词，权重为1
        
        cw = [(i,content_words[i]) for i in content_words if content_words[i]>=3] #过滤词频<3的词
            
        msg_words = Counter(title_words) + Counter(dict(cw)) #得到整合字典，为Counter类型
        words_in_articles.append(list(msg_words.keys()))

        word_count = json.dumps(msg_words) #得到可以插入数据库的词频json文件，对应数据库的word_count字段
        # total_word_count = total_word_count + msg_words #整个数据库的分词统计

        d_order = sorted(dict(msg_words).items(),key=lambda x:x[1],reverse=True)
        keywords = ' '.join([i[0] for i in d_order[0:5]])
        msg_new_tuple_for_update += ((word_count, keywords, m[2],m[3],int(m[4])),)

    update_sql = "update article_content set word_count = %s, keywords = %s where __biz = %s and msg_id = %s and index_ = %s"
    try:
        n = cur.executemany(update_sql, msg_new_tuple_for_update)    #使用executemany方法批量插入数据
        db.commit() #提交
        print("文章词频统计和关键词插入article_content库成功！")
    except Exception as ex_results:
        print("ex_results:",ex_results)
    db.close()

    with open("./words_in_articles.txt", "w", encoding='utf-8') as f:
        f.write(str(words_in_articles))
        f.write("\n")

    return words_in_articles

def tf_idf(words_in_articles): # 用dataframe求出每篇文章tfidf值降序TOP20词，用来做文本相似度分析
    sql = "select word_count, __biz, msg_id, index_ from article_content"
    msg_tuple, db, cur = mysql_execute(sql)
    msg = list(msg_tuple) #数据库获取的文章信息列表
    D = len(words_in_articles)
    msg_new_tuple_for_update = () # 分词统计后对数据库更新用
    df = DataFrame(columns = ['word','tf','idf','tfidf'])
    print("dataframe加载完成")
    tp0 = time.time()

    total_word_count = Counter() #总体词频
    for m in msg:
        word_count = json.loads(m[0]) #这篇文章词频，只有词频>=3的词
        total_word_count += Counter(word_count) #总体词频，还需要一个总的列表，看每个词在几篇中出现过
    words_in_database = list(total_word_count.keys()) # 库中所有词
    tp1 = time.time()
    print("统计整体词频时间",str(tp1-tp0))

    times = Counter() # {word:库中几篇文章出现过time}
    for word in words_in_database:
        wordtime = 0
        for m in msg:
            word_count = json.loads(m[0])
            if word in word_count:
                wordtime += 1
        times[word] = wordtime
    tp2 = time.time() 
    print("所有词语总次数统计完毕", str(tp2-tp1)) #大约需要50分钟

    with open("./times.txt", "w", encoding='utf-8') as f:
        f.write(str(times))
        f.write("\n")

    # with open("./times.txt", "r", encoding='utf-8') as f:
    #     times = Counter(f.read())
    #     f.close()
    
    for m in msg: #m为取出的这批文章中某一篇的详情
        tp20 = time.time()
        df.drop(df.index, inplace=True) # 清空dataframe数据
        word_count = json.loads(m[0])
        #print(type(word_count))
        #print(word_count)
        this_msg_total_word_count = sum(word_count.values()) #这篇文章词数
        if this_msg_total_word_count == 0:
            print("这篇文章词数总和为0",m[1],m[2],m[3])
            this_msg_total_word_count = 1
        for word in word_count:
            tf = word_count[word]/this_msg_total_word_count
            idf = math.log(D/(int(times[word])+1),10)# word这个词，在总共的words_in_articles中出现了几次
            df = df.append([{'word':word,'tf':tf,'idf':idf,'tfidf':tf*idf}],ignore_index=True)
            # print(df)
        df_sorted = df.sort_values(by="tfidf",ascending = False)
        theme = ' '.join(list(df_sorted[0:20]['word'])) # 输出TD-IDF值TOP20的词
        # print(theme)
        msg_new_tuple_for_update += ((theme, m[1],m[2],int(m[3])),)
        tp21 = time.time()
        #print("一篇文章结束", str(tp21-tp20)) # 平均处理一篇文章需要1s
    df.to_csv(r'D:/getcomment/test.csv')

    # df = pandas.read_csv(r'D:/getcomment/test.csv')
    tp3=time.time()
    print("全部文章结束", str(tp3-tp0))

    update_sql = "update article_content set theme = %s where __biz = %s and msg_id = %s and index_ = %s"
    try:
        n = cur.executemany(update_sql, msg_new_tuple_for_update)    #使用executemany方法批量插入数据
        db.commit() #提交
        print("主题插入article_content库成功！")
    except Exception as ex_results:
        print("ex_results:",ex_results)
    db.close()

def wc_from_word_count(wordcount, fp):# 根据词频字典生成词云图
    wc = WordCloud(
        max_words=200,  # 最多显示词数
        font_path="C:\\Windows\\Fonts\\simsun.ttc",
        # max_font_size=100,  # 字体最大值
        background_color="white",  # 设置背景为白色，默认为黑色
        width = 1500,  # 设置图片的宽度1500
        height= 960,  # 设置图片的高度960
        margin= 10  # 设置图片的边缘
    )
    wc.generate_from_frequencies(wordcount)  # 从字典生成词云
    plt.imshow(wc)  # 显示词云
    plt.axis('off')  # 关闭坐标轴
    # plt.show()  # 显示图像
    wc.to_file(fp)  # 保存图片

def brand_confidence(): #计算学校品牌自信并入库
    w = {"中国传媒大学":[99,['中国传媒大学', '中传', '传传', '广院', 'CUC']],"清华大学":[228,['清华', 'THU']], "中国人民大学":[96,['中国人民大学', '人大', 'RUC']], "北京外国语大学":[22,['北京外国语大学', '北外', 'BFSU']], "首都医科大学":[43,['首都医科大学', '首医', 'CMU']]}
    
    sql = "select title, account_info.name from article_content,account_info where article_content.__biz = account_info.__biz"
    results, db, cur = mysql_execute(sql)
    new_tuple = ()

    for uni in w: # bc = 含有词的标题数t/该学校的文章总数w[uni][0]
        t = 0
        for brand_name in w[uni][1]:
            for result in results:
                if brand_name in result[0]:
                    t += 1
        bc = t/w[uni][0]
        #w[uni].append(bc) 
        new_tuple += ((bc, uni),)

    update_sql = "update account_info set brand_confidence = %s where name = %s"
    try:
        n = cur.executemany(update_sql, new_tuple)    #使用executemany方法批量插入数据
        db.commit() #提交
        print("学校品牌自信插入account_info库成功！")
    except Exception as ex_results:
        print("ex_results:",ex_results)
    db.close()

def theme2vec(tuple1, tuple2):#tuple为查询出的文章信息，其中t1,t2为两个theme的列表，列表元素为词，将这两组合并为新集合，然后去wordcount中找到词频，生成两个向量v1，v2，再计算余弦相似度sim，返回sim
    wordcount1 = json.loads(tuple1[9])    
    wordcount2 = json.loads(tuple2[9]) 
    l = list(set(tuple1[8].split(" ") + tuple2[8].split(" ")))
    v1=[0]*len(l)
    v2=[0]*len(l)
    for word in l:
        try:
            v1[l.index(word)] = wordcount1[word]
        except:
            v1[l.index(word)] = 0
        try:
            v2[l.index(word)] = wordcount2[word]
        except:
            v2[l.index(word)] = 0
    sim = vec_cos(v1, v2)
    return sim
    
def vec_cos(v1, v2): #计算两个向量的余弦相似度，返回一个数字
    v1 = np.mat(v1)
    v2 = np.mat(v2)
    num = float(v1 * v2.T)
    denom = np.linalg.norm(v1) * np.linalg.norm(v2)
    sim = num / denom
    return sim

def similarity(): #计算库中所有文章的文本相似度，若大于0.8则入库
    msg_tuple, db, cur = mysql_execute("select * from article_content")
    for msg1 in msg_tuple:
        for msg2 in msg_tuple[msg_tuple.index(msg1)+1:]:
            if msg1 == msg2:
                pass
            else:
                sim = theme2vec(msg1,msg2)
                if sim >= 0.8:
                    title1, title2 = msg1[3], msg2[3]
                    school1, school2 = msg1[0], msg2[0]
                    n = cur.execute("insert into similarity (uni1, uni2, title1, title2, similarity) values ('%s','%s','%s','%s', %f)" % (school1, school2, title1, title2, float(sim)))
                    db.commit() #提交
                else:
                    pass
    print("计算文本相似度结束")

def hotwords_in_articles():#按照学校，选wordcount中的热词
    msg_tuple, db, cur = mysql_execute("select __biz, word_count from article_content")
    school_keywords_count = defaultdict(Counter) #{学校1：词频Counter字典，学校2：词频字典……}
    for msg in msg_tuple:
        school_keywords_count[msg[0]] += Counter(json.loads(msg[1]))

    update_sql = "update account_info set keywords = %s where __biz = %s"
    fp = "D:/getcomment/"
    hotwords_tuple_for_update = ()
    for school in school_keywords_count:
        keywords_L = sorted(school_keywords_count[school].items(),key=lambda x:x[1],reverse=True)
        keywords = [word[0] for word in keywords_L][0:200]
	    # print(keywords)
        hotwords_tuple_for_update += ((str(keywords),school),)
        wc_from_word_count(dict(school_keywords_count[school]), str(fp + str(school) + "_文章热词.jpg"))

    try:
        n = cur.executemany(update_sql, hotwords_tuple_for_update)    #使用executemany方法批量插入数据
        db.commit() #提交
        print("文章热词插入account_info库成功！")
    except Exception as ex_results:
        print("ex_results:",ex_results)
    db.close()

def article_analysis(): #此脚本main函数
    #insert_article_content_by_visiting_url()
    #print("insert_article_content_by_visiting_url完成")
    # analysis_for_comments()
    # print("analysis_for_comments完成")
    words_in_articles = content_analysis()
    print("content_analysis完成")
    print("initial time:", str(time.time()))
    # with open("./words_in_articles.txt", "r", encoding='utf-8') as f:
    #     words_in_articles = list(f.read())
    tf_idf(words_in_articles)
    print("TF-IDF完成")
    print("last time:", time.time())


if __name__ == "__main__":
    sql = "select keywords from account_info where name = '中国传媒大学'"
    msg,db,cur=mysql_execute(sql)
    print(msg[0][0])
    d={}
    for i in msg[0][0]:
        d[i]=1
   # wc_from_word_count(d,"D:\Study\毕业设计\面向校园公众号推文的数据分析与可视化\数据库建立+数据获取\网站\酒店\html\img\cuc_keywords.png")
