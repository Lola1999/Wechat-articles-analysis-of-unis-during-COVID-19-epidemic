#!/usr/bin/python
# coding = utf-8

import insert_db
import emoji
import content_analysis

if __name__ == "__main__":
    path = "D:/getcomment/20200411.txt"
    insert_db.insert_db(path)
    print("【基础数据入库部分完成】")
    content_analysis.article_analysis()
    print("【文本分析部分完成】")