#!/usr/bin/python
# coding = utf-8

import urllib.request
import re
import pymysql
from bs4 import BeautifulSoup  
import insert_db

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
