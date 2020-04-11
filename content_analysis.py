#!/usr/bin/python
# -*- coding: utf-8 -*-

import urllib.request
import re
import pymysql
from bs4 import BeautifulSoup  
import insert_db

import pynlpir
import jieba
from snownlp import SnowNLP
import thulac
import json
from collections import Counter
from pandas import DataFrame
import math

global count1, count2
count1 = 0
count2 = 0  

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
        paragraph = paragraph.replace(" ","").replace(u'\xa0',"") # 这里需要文本过滤
        article_content = insert_db.filter_text(paragraph)

        global count1
        count1 += 1
        print('访问url成功', count1, '篇\n')
    #print("正文：" + paragraph.replace(" ","") + "\n")
    except Exception as ex_results:
        global count2 
        count2 += 1
        print("content ex_results:",ex_results)
        title = university = article_content = ''
        print('访问url时出错', count2, '篇\n')
    return [title, university, article_content]

def insert_article_content_by_visiting_url(): # 从articles中取出文章url，访问后获得标题、作者、内容等信息插入article_content数据库
    db = pymysql.connect(host='localhost',port=3306,user='root',passwd='',db='mythesis',charset='utf8')
    cur = db.cursor()
    select_sql = "select __biz, msg_id, index_, url, publish_time from articles where comment_emotion = 0" #只对之前没有处理过的重新访问
    n = cur.execute(select_sql)
    db.commit() #提交
    msg_tuple = cur.fetchall()
    
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

def sentiments_analysis_for_comments(): # 2020/4/7进度：已完成对文章评论的情感分析，计算加权平均数，并插入数据库，提前对空缺值进行处理
    db = pymysql.connect(host='localhost',port=3306,user='root',passwd='',db='mythesis',charset='utf8')
    cur = db.cursor()
    #select_sql = "select title, text_content from article_content"
    sql = "select elected_comment, title, __biz, msg_id, index_ from articles where comment_emotion = 0"
    n = cur.execute(sql)
    db.commit() #提交
    msg_tuple = cur.fetchall()

    msg_new_tuple_for_update = ()
    msg = list(msg_tuple)
    for m in msg: #m为取出的这批文章中某一篇的详情，其中评论为json格式，依然是一个列表
        if(m[0] == '[]'):
            # print(m[1], 0) #m[1]: title，m[234]: __biz, msg_id, index_
            weighted_avg = 0
        else:
            msg_comments_list = json.loads(m[0]) #将这个列表转换成python可以读取操作的格式，内部是一个列表，每个元素是字典
            p_sum = 0
            comments_like_sum = 1
            for msg_comments in msg_comments_list: #这个msg_comments是一个字典，代表每一条评论
                try:
                    comments = json.loads(str(msg_comments).replace("\\",'').replace("'",'"')) #将字典转换成字符串用来做json解析
                    p = SnowNLP(comments['content']).sentiments
                    comments_like_sum += int(comments['like_num']) # 评论点赞总数
                    p_sum += p * (int(comments['like_num'])+1) #某条评论情感 * 评论点赞数
                except Exception as ex_results:
                    print(m[1], msg_comments) #看看是哪条评论有问题
                    print("ex_results:",ex_results)
            # if comments_like_sum == 0:
            #     weighted_avg = 0
            # else:
                weighted_avg = round(p_sum / comments_like_sum, 3) #评论情感分析的加权平均数，数据库中对应comment_emotion一列，精确到小数点后3位
        msg_new_tuple_for_update += ((weighted_avg, m[2],m[3],int(m[4])),)
        # print(m[1], weighted_avg) #这篇文章标题与评论的情感指数
    
    update_sql = "update articles set comment_emotion = %s where __biz = %s and msg_id = %s and index_ = %s"
    try:
        n = cur.executemany(update_sql, msg_new_tuple_for_update)    #使用executemany方法批量插入数据
        db.commit() #提交
        print("情感分析指数插入articles库成功！")
    except Exception as ex_results:
        print("ex_results:",ex_results)
    db.close()
    
def thulac_for_contents(stopwords, thu_model, text, title_weight = 1): # 分词函数，title_weight表示权重，标题权重更大，文章内容权重为默认值1，返回一个降序排列的词频字典
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

    db = pymysql.connect(host='localhost',port=3306,user='root',passwd='',db='mythesis',charset='utf8')
    cur = db.cursor()
    sql = "select title, text_content, __biz, msg_id, index_ from article_content"
    n = cur.execute(sql)
    db.commit() #提交
    msg_tuple = cur.fetchall()
    msg = list(msg_tuple) #数据库获取的文章信息列表
    
    msg_new_tuple_for_update = () # 分词统计后对数据库更新用
    # total_word_count = Counter({}) # 用于存储整个库中的分词统计
    keywords=[] # 文章关键词，分词后TOP5
    words_in_articles = [] # 列表，每个元素为一篇文章分词结果的列表，用于计算IDF |D| = len(words)

    for m in msg: #m为取出的这批文章中某一篇的详情
        title_words = thulac_for_contents(stopwords, thu_model, m[0], 5) #标题分词，权重为10
        content_words = thulac_for_contents(stopwords, thu_model, m[1], 1) #内容分词，权重为1
        
        msg_words = Counter(title_words) + Counter(content_words) #得到整合字典，为Counter类型
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

    return words_in_articles

def tf_idf(words_in_articles): # 用dataframe求出每篇文章tfidf值降序TOP3词，作为theme
    db = pymysql.connect(host='localhost',port=3306,user='root',passwd='',db='mythesis',charset='utf8')
    cur = db.cursor()
    sql = "select word_count, __biz, msg_id, index_ from article_content"
    n = cur.execute(sql)
    db.commit() #提交
    msg_tuple = cur.fetchall()
    msg = list(msg_tuple) #数据库获取的文章信息列表
    
    msg_new_tuple_for_update = () # 分词统计后对数据库更新用
    df = DataFrame(columns = ['word','tf','idf','tfidf'])
    
    for m in msg: #m为取出的这批文章中某一篇的详情
        df.drop(df.index, inplace=True) # 清空dataframe数据
        this_msg_total_word_count = 0
        word_count = json.loads(m[0])
        #print(type(word_count))
        #print(word_count)
        for word in word_count:
            this_msg_total_word_count += word_count[word]
        for word in word_count:
            tf = word_count[word]/this_msg_total_word_count
            count = 0 #包含改词的文章总数
            for article in words_in_articles:
                    if word in article:
                            count += 1
            idf = math.log(len(words_in_articles)/(count+1),10)# word这个词，在总共的words_in_articles中出现了几次
            df = df.append([{'word':word,'tf':tf,'idf':idf,'tfidf':tf*idf}],ignore_index=True)
            # print(df)
        df_sorted = df.sort_values(by="tfidf",ascending = False)
        theme = ' '.join(list(df_sorted[0:3]['word'])) # 输出TD-IDF值TOP3的词
        # print(theme)
        msg_new_tuple_for_update += ((theme, m[1],m[2],int(m[3])),)

    update_sql = "update article_content set theme = %s where __biz = %s and msg_id = %s and index_ = %s"
    try:
        n = cur.executemany(update_sql, msg_new_tuple_for_update)    #使用executemany方法批量插入数据
        db.commit() #提交
        print("主题插入article_content库成功！")
    except Exception as ex_results:
        print("ex_results:",ex_results)
    db.close()

def article_analysis(): #此脚本main函数
    insert_article_content_by_visiting_url()
    print("insert_article_content_by_visiting_url完成")
    sentiments_analysis_for_comments()
    print("sentiments_analysis_for_comments完成")
    words_in_articles = content_analysis()
    print("content_analysis完成")
    tf_idf(words_in_articles)
    print("TF-IDF完成")

#snow=SnowNLP(text)
#print("keywords:",snow.keywords(3))
#print("summary:", snow.summary(1))
#print("sentiments:", snow.sentiments)