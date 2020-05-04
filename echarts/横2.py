import pymysql
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from collections import Counter

def mysql_execute(sql):
    db = pymysql.connect(host='localhost',port=3306,user='root',passwd='',db='mythesis',charset='utf8')
    cur = db.cursor()
    n = cur.execute(sql)
    db.commit() #提交
    msg_tuple = cur.fetchall()
    db.close()
    return msg_tuple

def wc_from_word_count(wordcount):# 根据词频字典生成词云图
    wc = WordCloud(
        max_words=200,  # 最多显示词数
        font_path="C:\\Windows\\Fonts\\simsun.ttc",
        # max_font_size=100,  # 字体最大值
        background_color="white",  # 设置背景为白色，默认为黑色
        width = 1500,  # 设置图片的宽度
        height= 960,  # 设置图片的高度
        margin= 10  # 设置图片的边缘
    )
    wc.generate_from_frequencies(wordcount)  # 从字典生成词云
    plt.imshow(wc)  # 显示词云
    plt.axis('off')  # 关闭坐标轴
    plt.show()  # 显示图像
    
sql = """
select name, f, brand_confidence, avg_k_spread, ori, avg_emotion, max_read_cnt, max_like_cnt
from account_info
"""
unis = ['中国传媒大学','中国人民大学','北京外国语大学','首都医科大学','清华大学']

unisd = {'中国传媒大学':[],'中国人民大学':[],'北京外国语大学':[],'首都医科大学':[],'清华大学':[]}

msg_tuple = mysql_execute(sql)
for msg in msg_tuple:
    print("{value:"+str(list(msg[1:]))+",")
    print("name:'"+msg[0]+"'}")
