#!/usr/bin/python
# coding = utf-8

import pymysql
import ast
import re
import time
import emoji

null = None

def get_datalist(path): #读txt，将文章数据存入元组，便于mysql批量插入
    l = [] #数组l中每个数据项为一个字典，键值与mysql对应
    msg_tuple = () #用于存储每篇文章原始信息的元组，元素为字典
    msg = () #用于存储校验后的文章信息元组，元素不是字典，是数据列表，便于mysql批量插入

    count = 0
    with open(path,'r',encoding='utf-8') as f:    # 打开存储数据的文件，将数据存入字典数组
        content = f.readline()
        while content != "---finish---": 
            s = ""   
            while content != "*****\n":
                if 'elected_comment' in content and 'elected_comment_cnt' not in content:
                    elected_comment = filter_text(content[18:]) #得到过滤emoji后精选评论
                else:
                    if 'publish_time' in content:
                        publish_time = time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(int(content[15:-1])))
                        #print(content)
                    else:
                        s = s + content
                content = f.readline()
            t = s.replace("\n",",").strip()[:-1] #不包含精选评论的所有数据
            t = eval(t) #先得到不包含精选评论的所有数据字典

            #将所有值为null的都换成0，防止video_cnt, img_cnt处入库出错
            for k in t:
                if t[k] == "null" or t[k] is None:
                    t[k] = 0

            t['publish_time'] = publish_time
            t['elected_comment'] = elected_comment[1:-2]
            #l.append(t) #将完整字典存入数列
            t['comment_emotion'] = "0"
            msg_tuple = msg_tuple + (t,) #将完整字典存入元组
            content = f.readline()

    for i in msg_tuple: #验证数组中数据有效性，即msgid, __biz是否对应
        if i['msg_id'] == i['appmsgid_verify'] and i['__biz'] == i['__biz_verify']:
            count = count + 1
            print("成功校验",count,"篇~\n")
            msg = msg + (tuple(i.values()),)
        else:
            print('账号',i['__biz'],"，文章",i['msg_id'],"校验失败。文章标题为：",i['title'])
    return msg

def connect_mysql(msg): # msg是元组，元素仍为元组，为每篇文章数据
    count = 0 #用于存储保存成功数据条数
    #获取一个数据库连接，注意如果是UTF-8类型的，需要制定数据库
    db = pymysql.connect(host='localhost',port=3306,user='root',passwd='',db='mythesis',charset='utf8')
    # 使用cursor()方法创建一个游标对象
    cur = db.cursor()#【存疑】cursor是否为一次性声明？否
    sql = "insert IGNORE into articles values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)" #用executemany()时全写%s即可
    test_str = sql % msg[0]
    #print(test_str)

    try:
        n = cur.executemany(sql,msg)    #使用executemany方法批量插入数据
        db.commit() #提交
        print("数据入articles库成功！")
    except Exception as ex_results:
        print("ex_results:",ex_results)
    db.close() #释放数据库资源

def filter_text(text): # 文本过滤，只保留中文、英文、数字、标点
    text.encode('utf-8').decode('utf-8')
    text = emoji.demojize(text) # 过滤emoji
    try:
        f = re.compile(u"[^\u4e00-\u9fa5^.^,^，^。^！^\"^'^“^”^‘^’^@^!^:^-^_^：^；^;^&^*^(^)^（^）^<^>^《^》^{^}^【^】^[^]^|^、^~^`^=^\+^#^$^￥^%^……^\?^？^/^a-z^A-Z^0-9]")
    except Exception as ex_results:
        print("ex_results:",ex_results)
    results = f.sub("", text)
    for s in results:
        s = s.encode('utf-8')
    return results

def insert_db(path): # 'D:/getcomment/articles.txt'
    msg_tuple = get_datalist(path)
    connect_mysql(msg_tuple)
