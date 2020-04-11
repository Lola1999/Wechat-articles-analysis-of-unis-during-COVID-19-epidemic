#!/usr/bin/python
# coding = utf-8

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

def fetch_database(): # 从articles中取出文章url，访问后获得标题、作者、内容等信息插入article_content数据库
    db = pymysql.connect(host='localhost',port=3306,user='root',passwd='',db='mythesis',charset='utf8')
    cur = db.cursor()
    select_sql = "select __biz, msg_id, index_, url, publish_time from articles"
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

def sentiments_analysis_for_comments(): # 2020/4/5进度：已完成对文章评论的情感分析，加权平均数可以计算，仍需插入数据库和异常值处理的方法
    db = pymysql.connect(host='localhost',port=3306,user='root',passwd='',db='mythesis',charset='utf8')
    cur = db.cursor()
    #select_sql = "select title, text_content from article_content"
    sql = "select elected_comment, title, __biz, msg_id, index_ from articles"
    n = cur.execute(sql)
    db.commit() #提交
    msg_tuple = cur.fetchall()

    msg_new_tuple_for_update = ()
    msg = list(msg_tuple)
    for m in msg: #m为取出的这批文章中某一篇的详情，其中评论为json格式，依然是一个列表
        if(m[0] == '[]'):
            print(m[1], 0) #m[1]: title，m[234]: __biz, msg_id, index_
            weighted_avg = 0
        else:
            msg_comments_list = json.loads(m[0]) #将这个列表转换成python可以读取操作的格式，内部是一个列表，每个元素是字典
            p_sum = 0
            comments_like_sum = 0
            for msg_comments in msg_comments_list: #这个msg_comments是一个字典
                try:
                    comments = json.loads(str(msg_comments).replace("'",'"')) #将字典转换成字符串用来做json解析
                    p = SnowNLP(comments['content']).sentiments
                    comments_like_sum += int(comments['like_num']) # 评论点赞总数
                    p_sum += p * int(comments['like_num']) #某条评论情感 * 评论点赞数
                except Exception as ex_results:
                    print(m[1])
                    print("ex_results:",ex_results)
            if comments_like_sum == 0:
                weighted_avg = 0
            else:
                weighted_avg = p_sum / comments_like_sum #评论情感分析的加权平均数，数据库中对应comment_emotion一列
        msg_new_tuple_for_update += ((weighted_avg, m[2],m[3],m[4]),)
        print(m[1], weighted_avg) #这篇文章标题与评论的情感指数
    
    update_sql = "update articles set comment_emotion = %d where __biz = '%s' and msg_id = '%s' and index_ = %d"
    try:
        n = cur.executemany(update_sql, msg_new_tuple_for_update)    #使用executemany方法批量插入数据
        db.commit() #提交
        print("情感分析指数插入articles库成功！")
    except Exception as ex_results:
        print("ex_results:",ex_results)
    db.close()

        #snow=SnowNLP(text)
        #print("keywords:",snow.keywords(3))
        #print("summary:", snow.summary(1))
        #print("sentiments:", snow.sentiments)
    
def thulac_for_contents(text): # 需要对正文进行去停用词、分词、计算TF-IDF，还需要在字典中加入“新冠病毒”等词
    thu1 = thulac.thulac(seg_only=True)
    thu = thu1.cut(text, text=True)


if __name__ == "__main__":
    sentiments_analysis_for_comments()