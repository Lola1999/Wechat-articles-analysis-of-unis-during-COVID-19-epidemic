#设置联合主键，先删除原有主键再创建
#ALTER TABLE article_content DROP PRIMARY KEY;
#ALTER TABLE articles ADD PRIMARY KEY(__biz,msg_id);

#设置非主键Id为自增，先设Id为键，再更改属性为自增
#ALTER TABLE articles ADD KEY comp_index(Id);
#ALTER TABLE articles modify Id INT(11) auto_increment;

#连接查找
#select *
#from
#(
#select *
#from articles
#where __biz=1 and msg_id=12
#)x
#join
#(
#select *
#from article_content
#)y
#on (x.__biz=y.__biz)
