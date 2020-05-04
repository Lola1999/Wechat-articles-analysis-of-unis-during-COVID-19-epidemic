横1河流图：

数据：
select count(*) as num, a.hour, a.name
from
(
select DATE_FORMAT(publish_time, '%H') as hour, name #%W是星期几，%H是几点
from article_content
) a
group by a.hour, a.name

for msg in msg_tuple:
	l.append([int(msg[1]),msg[0],msg[2]])
js代码：
option = {

    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line',
            lineStyle: {
                color: 'rgba(0,0,0,0.2)',
                width: 1,
                type: 'solid'
            }
        }
    },

    legend: {
        data: ['清华大学', '中国传媒大学', '中国人民大学', '首都医科大学', '北京外国语大学']
    },

    singleAxis: {
        top: 50,
        bottom: 50,
        axisTick: {},
        axisLabel: {},
        axisPointer: {
            animation: true,
            label: {
                show: true
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed',
                opacity: 0.2
            }
        }
    },

    series: [
        {
            type: 'themeRiver',
            emphasis: {
                itemStyle: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.8)'
                }
            },
            data:[[0, 1, '中国人民大学'], [0, 5, '中国传媒大学'], [0, 1, '清华大学'], [7, 6, '清华大学'], [8, 2, '中国传媒大学'], [8, 1, '北京外国语大学'], [8, 14, '清华大学'], [9, 2, '中国人民大学'], [9, 2, '中国传媒大学'], [9, 9, '清华大学'], [10, 4, '中国人民大学'], [10, 13, '中国传媒大学'], [10, 3, '北京外国语大学'], [10, 15, '清华大学'], [10, 3, '首都医科大学'], [11, 4, '中国人民大学'], [11, 3, '中国传媒大学'], [11, 3, '北京外国语大学'], [11, 8, '清华大学'], [11, 5, '首都医科大学'], [12, 4, '中国人民大学'], [12, 8, '中国传媒大学'], [12, 16, '清华大学'], [12, 3, '首都医科大学'], [13, 6, '中国人民大学'], [13, 7, '中国传媒大学'], [13, 13, '清华大学'], [13, 3, '首都医科大学'], [14, 2, '中国人民大学'], [14, 3, '中国传媒大学'], [14, 2, '北京外国语大学'], [14, 26, '清华大学'], [14, 6, '首都医科大学'], [15, 14, '中国人民大学'], [15, 9, '中国传媒大学'], [15, 1, '北京外国语大学'], [15, 15, '清华大学'], [15, 3, '首都医科大学'], [16, 8, '中国人民大学'], [16, 6, '中国传媒大学'], [16, 1, '北京外国语大学'], [16, 11, '清华大学'], [16, 4, '首都医科大学'], [17, 10, '中国人民大学'], [17, 5, '中国传媒大学'], [17, 1, '北京外国语大学'], [17, 14, '清华大学'], [17, 1, '首都医科大学'], [18, 5, '中国人民大学'], [18, 3, '中国传媒大学'], [18, 3, '北京外国语大学'], [18, 15, '清华大学'], [18, 6, '首都医科大学'], [19, 13, '中国人民大学'], [19, 6, '中国传媒大学'], [19, 2, '北京外国语大学'], [19, 18, '清华大学'], [20, 5, '中国人民大学'], [20, 14, '中国传媒大学'], [20, 2, '北京外国语大学'], [20, 18, '清华大学'], [20, 6, '首都医科大学'], [21, 8, '中国人民大学'], [21, 5, '中国传媒大学'], [21, 1, '北京外国语大学'], [21, 12, '清华大学'], [21, 1, '首都医科大学'], [22, 6, '中国人民大学'], [22, 8, '中国传媒大学'], [22, 1, '北京外国语大学'], [22, 14, '清华大学'], [22, 1, '首都医科大学'], [23, 4, '中国人民大学'], [23, 1, '北京外国语大学'], [23, 3, '清华大学'], [23, 1, '首都医科大学']]
            
            
        }
    ]
};

横1桑基图：
数据：
select count(*) as num, a.day, a.name
from
(
select DATE_FORMAT(publish_time, '%W') as day, name #%W是星期几，%H是几点
from article_content
) a
group by a.day, a.name

for msg in msg_tuple:
	d={'source':msg[2],'target':msg[1],'value':msg[0]}
	l.append(d)
作图：
option = {
    series: {
        type: 'sankey',
        layout: 'none',
        focusNodeAdjacency: 'allEdges',
        data: [{
            name: '中国传媒大学'
        }, {
            name: '清华大学'
        }, {
            name: '中国人民大学'
        }, {
            name: '北京外国语大学'
        }, {
            name: '首都医科大学'
        }, {
            name: 'Monday'
        },{
            name: 'Tuesday'
        }, {
            name: 'Wednesday'
        }, {
            name: 'Thursday'
        }, {
            name: 'Friday'
        }, {
            name: 'Saturday'
        }, {
            name: 'Sunday'
        }
        ],
        links: [{'source': '中国人民大学', 'target': 'Friday', 'value': 15}, {'source': '中国传媒大学', 'target': 'Friday', 'value': 15}, {'source': '北京外国语大学', 'target': 'Friday', 'value': 7}, {'source': '清华大学', 'target': 'Friday', 'value': 32}, {'source': '首都医科大学', 'target': 'Friday', 'value': 5}, {'source': '中国人民大学', 'target': 'Monday', 'value': 15}, {'source': '中国传媒大学', 'target': 'Monday', 'value': 18}, {'source': '北京外国语大学', 'target': 'Monday', 'value': 4}, {'source': '清华大学', 'target': 'Monday', 'value': 39}, {'source': '首都医科大学', 'target': 'Monday', 'value': 9}, {'source': '中国人民大学', 'target': 'Saturday', 'value': 12}, {'source': '中国传媒大学', 'target': 'Saturday', 'value': 9}, {'source': '北京外国语大学', 'target': 'Saturday', 'value': 2}, {'source': '清华大学', 'target': 'Saturday', 'value': 30}, {'source': '首都医科大学', 'target': 'Saturday', 'value': 1}, {'source': '中国人民大学', 'target': 'Sunday', 'value': 12}, {'source': '中国传媒大学', 'target': 'Sunday', 'value': 14}, {'source': '北京外国语大学', 'target': 'Sunday', 'value': 2}, {'source': '清华大学', 'target': 'Sunday', 'value': 31}, {'source': '中国人民大学', 'target': 'Thursday', 'value': 15}, {'source': '中国传媒大学', 'target': 'Thursday', 'value': 12}, {'source': '北京外国语大学', 'target': 'Thursday', 'value': 2}, {'source': '清华大学', 'target': 'Thursday', 'value': 35}, {'source': '首都医科大学', 'target': 'Thursday', 'value': 9}, {'source': '中国人民大学', 'target': 'Tuesday', 'value': 15}, {'source': '中国传媒大学', 'target': 'Tuesday', 'value': 17}, {'source': '北京外国语大学', 'target': 'Tuesday', 'value': 3}, {'source': '清华大学', 'target': 'Tuesday', 'value': 29}, {'source': '首都医科大学', 'target': 'Tuesday', 'value': 10}, {'source': '中国人民大学', 'target': 'Wednesday', 'value': 12}, {'source': '中国传媒大学', 'target': 'Wednesday', 'value': 14}, {'source': '北京外国语大学', 'target': 'Wednesday', 'value': 2}, {'source': '清华大学', 'target': 'Wednesday', 'value': 32}, {'source': '首都医科大学', 'target': 'Wednesday', 'value': 9}]
    }
};

横1折线图：
select count(*) as num, a.date
from
(
select DATE_FORMAT(publish_time, '%Y-%m-%d') as date #%W是星期几，%H是几点
from article_content
) a
group by a.date

date=[]
num=[]
for msg in msg_tuple:
	date.append(msg[1])
	num.append(msg[0])
单独折线图：
option = {
    xAxis: {
        type: 'category',
        data:['2020-01-23', '2020-01-24', '2020-01-25', '2020-01-26', '2020-01-27', '2020-01-28', '2020-01-29', '2020-01-30', '2020-01-31', '2020-02-01', '2020-02-02', '2020-02-03', '2020-02-04', '2020-02-05', '2020-02-06', '2020-02-07', '2020-02-08', '2020-02-09', '2020-02-10', '2020-02-11', '2020-02-12', '2020-02-13', '2020-02-14', '2020-02-15', '2020-02-16', '2020-02-17', '2020-02-18', '2020-02-19', '2020-02-20', '2020-02-21', '2020-02-22', '2020-02-23', '2020-02-24', '2020-02-25', '2020-02-26', '2020-02-27', '2020-02-28', '2020-02-29', '2020-03-01', '2020-03-02', '2020-03-03', '2020-03-04', '2020-03-05', '2020-03-06', '2020-03-07', '2020-03-08', '2020-03-09', '2020-03-10', '2020-03-11', '2020-03-12', '2020-03-13', '2020-03-14', '2020-03-15', '2020-03-16', '2020-03-17', '2020-03-18', '2020-03-19', '2020-03-20', '2020-03-21', '2020-03-22', '2020-03-23', '2020-03-24', '2020-03-25', '2020-03-26', '2020-03-27', '2020-03-28', '2020-03-29', '2020-03-30', '2020-03-31', '2020-04-01']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [4, 4, 2, 4, 5, 6, 3, 7, 11, 9, 9, 13, 14, 10, 10, 7, 5, 6, 10, 6, 9, 7, 9, 5, 9, 12, 9, 6, 6, 9, 5, 7, 8, 9, 8, 11, 7, 9, 8, 8, 6, 9, 8, 7, 5, 4, 9, 6, 7, 7, 9, 6, 5, 5, 6, 8, 6, 7, 5, 3, 8, 5, 5, 7, 4, 3, 4, 7, 7, 4],
        type: 'line'
    }]
};

横2气泡图：
sql：
select b.name, a.read_cnt, a.like_cnt, a.elected_comment_cnt, a.copyright_stat
from
(
select __biz, read_cnt, like_cnt, elected_comment_cnt, copyright_stat
from articles
) a
join
(
select __biz, name
from account_info
) b
on a.__biz=b.__biz

python：
unisd = {'中国传媒大学':[],'中国人民大学':[],'北京外国语大学':[],'首都医科大学':[],'清华大学':[]}
msg_tuple = mysql_execute(sql)
for msg in msg_tuple:
    unisd[msg[0]].append([msg[1],msg[2],msg[3],msg[4]])
for i in unisd:
    print(i,unisd[i])

图：var dataCUC = [[5908, 94, 76, 0], [9336, 140, 46, 1], [24485, 91, 35, 0], [100001, 445, 44, 0], [9587, 61, 13, 0], [17646, 31, 2, 0], [9867, 36, 8, 0], [21826, 101, 33, 2], [19520, 200, 37, 0], [12393, 67, 13, 1], [7600, 134, 18, 0], [4807, 33, 12, 1], [6567, 56, 17, 1], [14128, 157, 27, 0], [4153, 37, 10, 2], [22650, 158, 18, 1], [7887, 35, 0, 1], [10464, 70, 7, 0], [6918, 92, 11, 0], [4069, 60, 22, 1], [3833, 12, 4, 1], [16962, 303, 51, 1], [8816, 39, 9, 1], [10527, 207, 33, 1], [7067, 39, 11, 1], [9189, 119, 54, 1], [10111, 58, 8, 0], [5051, 59, 12, 0], [19798, 17, 2, 1], [7454, 87, 14, 0], [6911, 33, 8, 0], [13814, 209, 28, 1], [13280, 124, 13, 1], [8666, 62, 22, 1], [5914, 29, 6, 1], [12428, 137, 13, 1], [11356, 172, 31, 0], [7852, 74, 15, 0], [5546, 45, 11, 1], [18053, 353, 43, 1], [2481, 30, 2, 0], [11128, 128, 15, 0], [63758, 594, 100, 1], [3529, 26, 6, 2], [4736, 91, 14, 2], [7452, 86, 33, 1], [3576, 17, 4, 0], [6150, 117, 15, 2], [5178, 66, 12, 0], [4712, 56, 6, 0], [5678, 25, 2, 0], [16270, 132, 13, 0], [3116, 12, 1, 1], [11405, 72, 6, 2], [4927, 34, 4, 2], [2604, 23, 1, 0], [4017, 41, 3, 1], [2748, 23, 7, 0], [2685, 18, 1, 0], [5393, 96, 24, 1], [6256, 53, 6, 0], [4392, 53, 5, 1], [5163, 48, 22, 1], [5159, 50, 22, 0], [2958, 37, 2, 0], [28087, 279, 34, 0], [13674, 126, 13, 1], [15174, 97, 33, 1], [2688, 31, 3, 0], [4482, 19, 2, 0], [4532, 40, 6, 1], [2429, 10, 5, 0], [8302, 35, 7, 1], [3036, 10, 0, 0], [2421, 13, 3, 0], [3538, 55, 8, 0], [4434, 48, 11, 0], [18053, 121, 47, 0], [3538, 33, 15, 0], [4528, 45, 7, 2], [2021, 15, 4, 0], [6280, 37, 13, 1], [2519, 30, 5, 0], [4531, 51, 19, 1], [12782, 308, 28, 0], [11155, 96, 25, 1], [4041, 21, 5, 0], [13132, 39, 4, 2], [4505, 62, 10, 1], [7224, 69, 15, 0], [5087, 28, 15, 1], [2516, 15, 5, 0], [3222, 13, 1, 1], [10790, 162, 23, 1], [3320, 23, 10, 1], [1045, 9, 0, 1], [13673, 294, 76, 1], [9976, 74, 55, 0], [9654, 144, 25, 0]];

var dataRD = [[18688, 217, 0, 0], [72860, 498, 6, 0], [27276, 233, 15, 0], [20021, 38, 0, 0], [27683, 80, 10, 0], [9956, 16, 0, 0], [7219, 27, 0, 2], [6846, 84, 0, 2], [61837, 270, 0, 0], [17128, 38, 0, 0], [13772, 139, 12, 0], [4723, 26, 0, 0], [35147, 431, 32, 1], [23287, 149, 2, 0], [17200, 309, 33, 0], [12234, 175, 27, 0], [7423, 25, 0, 0], [9667, 37, 0, 0], [13411, 138, 13, 0], [10501, 54, 3, 0], [10173, 64, 0, 0], [21723, 420, 38, 0], [11269, 86, 7, 0], [29299, 48, 19, 0], [16156, 44, 0, 0], [6910, 68, 5, 0], [11407, 27, 4, 0], [6648, 66, 3, 0], [6303, 27, 0, 0], [21280, 40, 1, 0], [16025, 38, 2, 2], [9543, 18, 0, 0], [5262, 58, 7, 1], [5840, 28, 3, 2], [7162, 49, 0, 1], [16485, 53, 1, 0], [10331, 65, 3, 1], [3930, 23, 0, 0], [6136, 38, 1, 0], [14900, 38, 0, 0], [7819, 54, 0, 0], [16903, 180, 61, 0], [23598, 75, 52, 0], [15993, 22, 0, 0], [4398, 21, 0, 0], [3050, 12, 0, 0], [6355, 111, 8, 0], [4913, 29, 0, 0], [13288, 148, 6, 0], [20396, 47, 1, 0], [2604, 17, 0, 2], [13328, 97, 6, 0], [9881, 18, 2, 0], [54279, 461, 3, 1], [2233, 12, 0, 0], [4671, 61, 13, 1], [11991, 75, 32, 0], [18245, 54, 37, 0], [12682, 133, 27, 1], [13837, 93, 6, 0], [16030, 52, 4, 0], [8017, 38, 0, 0], [3131, 20, 0, 0], [5320, 33, 0, 0], [9649, 89, 0, 2], [5437, 29, 0, 0], [52265, 451, 0, 0], [10674, 153, 92, 1], [51728, 280, 23, 0], [7121, 21, 0, 0], [19812, 37, 7, 0], [3505, 13, 0, 0], [7256, 56, 0, 0], [11666, 14, 0, 0], [7228, 26, 0, 0], [8728, 55, 0, 0], [43823, 152, 100, 0], [42484, 120, 10, 0], [8967, 46, 7, 0], [41843, 710, 100, 1], [12296, 131, 11, 0], [8743, 31, 1, 0], [6881, 47, 7, 0], [8293, 50, 7, 1], [8590, 19, 0, 0], [5084, 48, 1, 2], [13168, 34, 0, 0], [9453, 28, 3, 0], [20718, 427, 66, 1], [5043, 23, 0, 0], [10469, 221, 32, 1], [6944, 49, 0, 0], [4916, 21, 0, 0], [4416, 13, 0, 0], [19612, 94, 0, 2], [9443, 67, 0, 0]];

var dataBW = [[4632, 68, 0, 0], [30282, 126, 0, 0], [7231, 71, 0, 0], [5915, 152, 8, 2], [100001, 2213, 5, 0], [6195, 122, 8, 0], [15320, 87, 0, 0], [21651, 151, 16, 0], [90204, 282, 0, 0], [7627, 22, 0, 0], [5941, 43, 0, 0], [21622, 50, 0, 0], [2746, 31, 0, 0], [3243, 40, 0, 0], [3618, 59, 0, 0], [3534, 31, 1, 0], [5696, 195, 13, 2], [3319, 19, 0, 0], [1171, 8, 0, 0], [16567, 294, 4, 0], [15064, 484, 19, 1], [2590, 16, 0, 0]];

var dataSY = [[1495, 5, 0, 0], [8290, 34, 0, 0], [6420, 123, 18, 0], [840, 2, 0, 0], [2599, 22, 2, 0], [1935, 12, 0, 0], [1670, 31, 2, 0], [3270, 54, 2, 0], [1313, 7, 1, 0], [1103, 13, 2, 0], [681, 4, 0, 0], [1999, 6, 0, 0], [983, 3, 0, 0], [855, 6, 0, 0], [1926, 3, 0, 0], [771, 11, 0, 0], [2198, 66, 4, 0], [1324, 7, 2, 0], [2840, 19, 0, 0], [2575, 26, 1, 0], [2201, 19, 0, 0], [1043, 9, 0, 0], [3263, 46, 0, 2], [2158, 7, 0, 0], [1315, 1, 1, 0], [1940, 13, 0, 0], [5429, 71, 3, 0], [743, 8, 0, 0], [1232, 14, 0, 0], [2306, 25, 0, 0], [2337, 14, 0, 0], [1547, 10, 0, 0], [1189, 6, 0, 0], [2685, 35, 4, 0], [2925, 56, 0, 0], [1040, 3, 0, 0], [3510, 27, 0, 0], [269, 1, 0, 0], [2974, 31, 3, 0], [1495, 7, 1, 0], [1093, 8, 0, 0], [1543, 10, 0, 0], [678, 11, 0, 0]];

var dataTH = [[8723, 59, 0, 0], [48120, 358, 2, 0], [32136, 397, 9, 0], [6618, 38, 0, 0], [63508, 495, 21, 0], [100001, 1997, 76, 1], [44616, 493, 31, 2], [49104, 575, 24, 1], [53548, 365, 14, 1], [31016, 83, 9, 2], [100001, 824, 67, 1], [38531, 207, 15, 2], [10964, 55, 1, 1], [59725, 474, 12, 0], [3319, 20, 0, 0], [25544, 64, 4, 0], [18933, 94, 7, 0], [48626, 154, 6, 0], [60567, 325, 19, 1], [59192, 313, 17, 0], [100001, 382, 33, 0], [51170, 181, 16, 0], [100001, 2198, 26, 0], [62022, 277, 25, 1], [86842, 396, 18, 0], [70964, 912, 38, 1], [24904, 151, 5, 0], [90737, 313, 28, 0], [25207, 258, 13, 1], [21667, 75, 1, 1], [45296, 525, 13, 1], [74796, 312, 27, 0], [42877, 300, 22, 1], [35241, 300, 27, 0], [43154, 110, 17, 0], [100001, 1139, 46, 2], [51888, 112, 5, 1], [19737, 110, 8, 0], [20052, 87, 7, 1], [42589, 379, 12, 1], [40815, 209, 11, 0], [34959, 341, 11, 0], [26960, 173, 17, 1], [16995, 218, 14, 2], [100001, 1368, 47, 0], [95147, 266, 22, 0], [36653, 269, 23, 2], [22954, 86, 9, 0], [63022, 648, 31, 1], [23485, 172, 22, 0], [27367, 301, 38, 1], [27689, 111, 5, 1], [17207, 50, 7, 0], [19267, 108, 3, 0], [78782, 446, 28, 0], [52838, 121, 30, 0], [22363, 265, 7, 1], [14482, 85, 8, 1], [67389, 541, 29, 1], [38441, 263, 28, 0], [49170, 245, 19, 2], [81196, 944, 38, 1], [33976, 185, 14, 2], [30887, 117, 10, 1], [10795, 108, 8, 0], [29211, 243, 12, 1], [26977, 106, 2, 0], [49379, 849, 38, 1], [66672, 215, 19, 1], [68964, 484, 28, 1], [22988, 95, 7, 1], [100001, 596, 38, 1], [27251, 59, 11, 0], [18320, 82, 10, 0], [100001, 1540, 30, 2], [13605, 82, 7, 1], [13208, 72, 6, 1], [12807, 65, 2, 1], [62723, 154, 20, 1], [12588, 57, 4, 1], [100001, 1036, 35, 1], [57424, 453, 23, 1], [19738, 87, 5, 1], [16828, 80, 7, 1], [76474, 404, 16, 0], [23550, 129, 6, 1], [22320, 97, 5, 1], [62759, 245, 20, 0], [23937, 82, 8, 1], [25132, 351, 20, 0], [43824, 245, 14, 0], [39419, 276, 10, 0], [18148, 124, 16, 1], [16803, 73, 13, 1], [20013, 60, 5, 0], [100001, 1127, 31, 1], [29106, 283, 12, 2], [71911, 720, 24, 0], [17457, 71, 5, 1], [73026, 193, 40, 0], [20566, 139, 10, 1], [20055, 66, 12, 0], [28767, 93, 9, 0], [11105, 43, 4, 0], [36414, 412, 17, 0], [68096, 297, 12, 0], [14420, 96, 8, 2], [22342, 65, 6, 1], [24486, 149, 10, 0], [26351, 203, 13, 2], [21374, 258, 13, 2], [13673, 61, 5, 0], [36504, 200, 27, 0], [24830, 108, 10, 2], [18331, 73, 11, 1], [53689, 747, 32, 0], [16655, 72, 10, 2], [25526, 105, 5, 0], [18207, 65, 4, 2], [42775, 269, 9, 2], [8478, 24, 0, 2], [45559, 613, 21, 1], [19869, 139, 7, 0], [43789, 269, 46, 1], [10568, 69, 6, 2], [45944, 333, 29, 1], [17900, 50, 7, 0], [11686, 88, 0, 0], [10578, 34, 5, 2], [40360, 134, 10, 0], [42676, 162, 14, 0], [19877, 70, 4, 0], [36563, 188, 5, 0], [28702, 311, 19, 0], [100001, 746, 34, 1], [22506, 53, 5, 0], [47388, 384, 18, 2], [27359, 247, 9, 2], [100001, 903, 24, 0], [12281, 94, 7, 1], [10146, 50, 6, 1], [59108, 208, 20, 2], [27270, 239, 28, 0], [15434, 155, 6, 2], [7366, 53, 0, 0], [25432, 72, 9, 0], [13373, 45, 10, 0], [34827, 156, 10, 1], [11207, 64, 8, 1], [18351, 93, 11, 0], [33148, 352, 38, 1], [31030, 228, 37, 2], [17656, 104, 13, 1], [26955, 519, 46, 1], [19405, 95, 3, 0], [37342, 393, 21, 1], [19059, 133, 7, 1], [44194, 367, 27, 1], [11254, 67, 5, 1], [13166, 72, 11, 0], [66708, 236, 27, 1], [16104, 100, 6, 1], [18816, 79, 9, 0], [13609, 58, 8, 1], [21607, 81, 5, 0], [21407, 185, 14, 2], [10012, 71, 8, 1], [47605, 407, 21, 1], [33503, 74, 8, 0], [20614, 106, 10, 1], [17472, 79, 13, 1], [82683, 606, 49, 1], [27050, 113, 9, 0], [11409, 58, 8, 1], [17924, 82, 7, 1], [22509, 89, 21, 0], [11374, 56, 0, 0], [12101, 94, 11, 2], [7786, 56, 8, 0], [11424, 55, 3, 1], [15738, 101, 14, 1], [16390, 61, 4, 0], [50167, 691, 45, 1], [13746, 60, 5, 0], [52389, 534, 39, 2], [19116, 147, 18, 0], [5831, 29, 4, 1], [13291, 99, 9, 0], [46742, 535, 34, 0], [19309, 72, 9, 2], [60820, 456, 40, 0], [40074, 314, 24, 1], [100001, 1926, 74, 2], [37388, 222, 16, 0], [19373, 99, 11, 0], [13168, 136, 9, 0], [22407, 223, 24, 0], [100001, 862, 52, 1], [23024, 203, 41, 1], [11231, 104, 16, 0], [7262, 70, 9, 1], [13590, 55, 5, 1], [68687, 654, 48, 1], [23872, 182, 12, 1], [8747, 72, 3, 0], [20374, 94, 12, 0], [7296, 55, 6, 0], [74668, 688, 51, 2], [17094, 103, 14, 0], [13860, 79, 8, 2], [6080, 33, 5, 0], [92736, 1530, 71, 1], [14992, 84, 9, 0], [27638, 143, 21, 1], [65842, 409, 42, 2], [36498, 476, 24, 1], [32402, 319, 47, 1], [13104, 87, 12, 1], [26525, 169, 28, 1], [83323, 894, 56, 2], [14977, 73, 16, 1], [43467, 345, 24, 0], [41842, 384, 15, 2], [46299, 251, 51, 0], [22623, 148, 16, 0], [15365, 210, 19, 0], [11527, 73, 13, 0], [7627, 46, 8, 1]];

var schema = [
    {name: 'read_cnt', index: 0, text: '阅读量'},
    {name: 'like_cnt', index: 1, text: '点赞数'},
    {name: 'comment_cnt', index: 2, text: '评论数'},
    {name: 'copyright', index: 3, text: '原创文章'}
];


var itemStyle = {
    opacity: 0.8,
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'rgba(0, 0, 0, 0.5)'
};

option = {
    backgroundColor: '#404a59',
    color: [
        '#dd4444', '#fec42c', '#80F1BE','#ba55d3','#6a5acd'
    ],
    legend: {
        top: 10,
        data: unis = ['中国传媒大学','中国人民大学','北京外国语大学','首都医科大学','清华大学'],
        textStyle: {
            color: '#fff',
            fontSize: 16
        }
    },
    grid: {
        left: '10%',
        right: 150,
        top: '18%',
        bottom: '10%'
    },
    tooltip: {
        padding: 10,
        backgroundColor: '#222',
        borderColor: '#777',
        borderWidth: 1,
        formatter: function (obj) {
            var value = obj.value;
            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 18px;padding-bottom: 7px;margin-bottom: 7px">'
                + obj.seriesName + '</div>'
                + schema[0].text + '：' + value[0] + '<br>'
                + schema[1].text + '：' + value[1] + '<br>'
                + schema[2].text + '：' + value[2] + '<br>'
                + schema[3].text + '：' + value[3] + '<br>';
        }
    },
    xAxis: {
        type: 'value',
        name: '阅读数',
        nameGap: 16,
        nameTextStyle: {
            color: '#fff',
            fontSize: 14
        },
        // max: 100001,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#eee'
            }
        }
    },
    yAxis: {
        type: 'value',
        name: '点赞数',
        nameLocation: 'end',
        nameGap: 20,
        nameTextStyle: {
            color: '#fff',
            fontSize: 16
        },
        axisLine: {
            lineStyle: {
                color: '#eee'
            }
        },
        splitLine: {
            show: false
        }
    },
    visualMap: [
        {
            left: 'right',
            top: '10%',
            dimension: 2,
            min: 0,
            max: 100,
            itemWidth: 30,
            itemHeight: 120,
            calculable: true,
            precision: 0,
            text: ['圆形大小：评论数'],
            textGap: 30,
            textStyle: {
                color: '#fff'
            },
            inRange: {
                symbolSize: [0, 50]
            },
            outOfRange: {
                symbolSize: [10, 70],
                color: ['rgba(255,255,255,.2)']
            },
            controller: {
                inRange: {
                    color: ['#c23531']
                },
                outOfRange: {
                    color: ['#444']
                }
            }
        },
        {
            left: 'right',
            bottom: '5%',
            dimension: 3,
            min: 0,
            max: 2,
            itemHeight: 120,

            precision: 0,
            text: ['明暗：是否为原创文章'],
            textGap: 0,
            textStyle: {
                color: '#fff'
            },
            inRange: {
                colorLightness: [1, 0.5]
            },
            outOfRange: {
                color: ['rgba(255,255,255,.2)']
            },
            controller: {
                inRange: {
                    color: ['#c23531']
                },
                outOfRange: {
                    color: ['#444']
                }
            }
        }
    ],
    series: [
        {
            name: '中国传媒大学',
            type: 'scatter',
            itemStyle: itemStyle,
            data: dataCUC
        },
        {
            name: '清华大学',
            type: 'scatter',
            itemStyle: itemStyle,
            data: dataTH
        },
        {
            name: '北京外国语大学',
            type: 'scatter',
            itemStyle: itemStyle,
            data: dataBW
        },
        {
            name: '首都医科大学',
            type: 'scatter',
            itemStyle: itemStyle,
            data: dataSY
        },
        {
            name: '中国人民大学',
            type: 'scatter',
            itemStyle: itemStyle,
            data: dataRD
        }
    ]
};

纵1单轴集合气泡图：
select DATE_FORMAT(publish_time, '%H') as hour,
DATE_FORMAT(publish_time, '%W') as day, 
count(*) as num #%W是星期几，%H是几点
from article_content
where name = '中国传媒大学'
group by hour, day

week = {'Monday':1,'Tuesday':2,'Wednesday':3,'Thursday':4, 'Friday':5,'Saturday':6,'Sunday':7}
l=[]
msg_tuple = mysql_execute(sql)
for msg in msg_tuple:
    l.append([week[msg[1]]-1,int(msg[0]),msg[2]])
print(l)

var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a','10a','11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'];
var days = ['Monday','Tuesday','Wednesday','Thursday', 'Friday', 
           'Saturday','Sunday'];
           
var data = [[4, 0, 1], [0, 0, 1], [5, 0, 1], [6, 0, 1], [1, 0, 1], [4, 8, 1], [0, 8, 1], [1, 9, 2], [4, 10, 1], [0, 10, 2], [5, 10, 2], [6, 10, 3], [3, 10, 4], [1, 10, 1], [5, 11, 1], [6, 11, 1], [2, 11, 1], [4, 12, 1], [0, 12, 2], [5, 12, 2], [1, 12, 2], [2, 12, 1], [4, 13, 3], [1, 13, 1], [2, 13, 3], [6, 14, 2], [3, 14, 1], [0, 15, 3], [6, 15, 3], [3, 15, 2], [2, 15, 1], [4, 16, 1], [0, 16, 2], [3, 16, 1], [1, 16, 2], [4, 17, 1], [3, 17, 1], [1, 17, 2], [2, 17, 1], [0, 18, 1], [5, 18, 2], [6, 19, 1], [1, 19, 1], [2, 19, 4], [4, 20, 4], [0, 20, 4], [5, 20, 1], [6, 20, 1], [3, 20, 2], [1, 20, 1], [2, 20, 1], [6, 21, 1], [3, 21, 1], [1, 21, 1], [2, 21, 2], [4, 22, 2], [0, 22, 2], [6, 22, 1], [1, 22, 3]];
option = {
    tooltip: {
        position: 'top'
    },
    title: [],
    singleAxis: [],
    series: []
};

echarts.util.each(days, function (day, idx) {
    option.title.push({
        textBaseline: 'middle',
        top: (idx + 0.5) * 100 / 7 + '%',
        text: day
    });
    option.singleAxis.push({
        left: 150,
        type: 'category',
        boundaryGap: false,
        data: hours,
        top: (idx * 100 / 7 + 5) + '%',
        height: (100 / 7 - 10) + '%',
        axisLabel: {
            interval: 2
        }
    });
    option.series.push({
        singleAxisIndex: idx,
        coordinateSystem: 'singleAxis',
        type: 'scatter',
        data: [],
        symbolSize: function (dataItem) {
            return dataItem[1] * 15;
        }
    });
});

echarts.util.each(data, function (dataItem) {
    option.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
});


纵1发文时间与发文数量面积图：
sql = """
select date_format(publish_time,'%m-%d') as date, count(*) as num
from article_content where name = '中国传媒大学'
group by date
"""
msg_tuple = mysql_execute(sql)
date = []
num = []
for msg in msg_tuple:
    date.append(msg[0])
    num.append(msg[1])
print(date)
print(num)

option = {
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['01-24', '01-25', '01-26', '01-27', '01-28', '01-29', '01-30', '01-31', '02-02', '02-03', '02-04', '02-05', '02-06', '02-07', '02-08', '02-09', '02-10', '02-11', '02-12', '02-13', '02-14', '02-15', '02-16', '02-17', '02-18', '02-19', '02-20', '02-21', '02-23', '02-24', '02-25', '02-26', '02-27', '02-28', '02-29', '03-01', '03-02', '03-03', '03-04', '03-06', '03-07', '03-08', '03-09', '03-10', '03-11', '03-12', '03-13', '03-14', '03-16', '03-17', '03-18', '03-19', '03-20', '03-21', '03-22', '03-23', '03-24', '03-25', '03-26', '03-27', '03-29', '03-30', '03-31', '04-01']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [1, 1, 1, 1, 1, 1, 1, 3, 2, 5, 4, 2, 3, 1, 1, 2, 3, 1, 2, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 1, 1, 1, 3, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1],
        type: 'line',
        areaStyle: {}
    }]
};



横3 k-spread分布 堆积缩放
sql = """
select name, COUNT(*) 'count',
case when k_spread >=0 and k_spread <30 then '0' when k_spread >=30 and k_spread <60 then '1' when k_spread >=60 and k_spread <90 then '2' when k_spread >=90 and k_spread <120 then '3' when k_spread >=120 and k_spread <150 then '4' when k_spread >=150 and k_spread <180 then '5' when k_spread >=180 and k_spread <210 then '6' when k_spread >=210 and k_spread <240 then '7' when k_spread >=240 and k_spread <270 then '8' when k_spread >=270 and k_spread <300 then '9' when k_spread >=300 and k_spread <330 then '10' when k_spread >=330 and k_spread <360 then '11' when k_spread >=360 and k_spread <390 then '12' when k_spread >=390 and k_spread <420 then '13' when k_spread >=420 and k_spread <450 then '14' when k_spread >=450 and k_spread <480 then '15' when k_spread >=480 and k_spread <510 then '16' when k_spread >=510 and k_spread <540 then '17' when k_spread >=540 and k_spread <570 then '18' when k_spread >=570 and k_spread <600 then '19' when k_spread >=600 and k_spread <630 then '20' when k_spread >=630 and k_spread <660 then '21' when k_spread >=660 and k_spread <690 then '22' when k_spread >=690 and k_spread <720 then '23' when k_spread >=720 and k_spread <750 then '24' when k_spread >=750 and k_spread <780 then '25' when k_spread >=780 and k_spread <810 then '26' when k_spread >=810 and k_spread <840 then '27' when k_spread >=840 and k_spread <870 then '28' when k_spread >=870 and k_spread <900 then '29' when k_spread >=900 and k_spread <930 then '30' when k_spread >=930 and k_spread <960 then '31' when k_spread >=960 and k_spread <990 then '32' when k_spread >=990 and k_spread <1020 then '33' when k_spread >=1020 and k_spread <1050 then '34' when k_spread >=1050 and k_spread <1080 then '35' when k_spread >=1080 and k_spread <1110 then '36' when k_spread >=1110 and k_spread <1140 then '37' when k_spread >=1140 and k_spread <1170 then '38' when k_spread >=1170 and k_spread <1200 then '39' when k_spread >=1200 and k_spread <1230 then '40' when k_spread >=1230 and k_spread <1260 then '41' when k_spread >=1260 and k_spread <1290 then '42' when k_spread >=1290 and k_spread <1320 then '43' when k_spread >=1320 and k_spread <1350 then '44' when k_spread >=1350 and k_spread <1380 then '45' when k_spread >=1380 and k_spread <1410 then '46' when k_spread >=1410 and k_spread <1440 then '47' when k_spread >=1440 and k_spread <1470 then '48' when k_spread >=1470 and k_spread <1500 then '49' when k_spread >=1500 and k_spread <1530 then '50' when k_spread >=1530 and k_spread <1560 then '51' when k_spread >=1560 and k_spread <1590 then '52' when k_spread >=1590 and k_spread <1620 then '53' when k_spread >=1620 and k_spread <1650 then '54' when k_spread >=1650 and k_spread <1680 then '55' when k_spread >=1680 and k_spread <1710 then '56' when k_spread >=1710 and k_spread <1740 then '57' when k_spread >=1740 and k_spread <1770 then '58' when k_spread >=1770 and k_spread <1800 then '59' when k_spread >=1800 and k_spread <1830 then '60' end
from articles, account_info
where articles.__biz = account_info.__biz
group by name,
case when k_spread >=0 and k_spread <30 then '0' when k_spread >=30 and k_spread <60 then '1' when k_spread >=60 and k_spread <90 then '2' when k_spread >=90 and k_spread <120 then '3' when k_spread >=120 and k_spread <150 then '4' when k_spread >=150 and k_spread <180 then '5' when k_spread >=180 and k_spread <210 then '6' when k_spread >=210 and k_spread <240 then '7' when k_spread >=240 and k_spread <270 then '8' when k_spread >=270 and k_spread <300 then '9' when k_spread >=300 and k_spread <330 then '10' when k_spread >=330 and k_spread <360 then '11' when k_spread >=360 and k_spread <390 then '12' when k_spread >=390 and k_spread <420 then '13' when k_spread >=420 and k_spread <450 then '14' when k_spread >=450 and k_spread <480 then '15' when k_spread >=480 and k_spread <510 then '16' when k_spread >=510 and k_spread <540 then '17' when k_spread >=540 and k_spread <570 then '18' when k_spread >=570 and k_spread <600 then '19' when k_spread >=600 and k_spread <630 then '20' when k_spread >=630 and k_spread <660 then '21' when k_spread >=660 and k_spread <690 then '22' when k_spread >=690 and k_spread <720 then '23' when k_spread >=720 and k_spread <750 then '24' when k_spread >=750 and k_spread <780 then '25' when k_spread >=780 and k_spread <810 then '26' when k_spread >=810 and k_spread <840 then '27' when k_spread >=840 and k_spread <870 then '28' when k_spread >=870 and k_spread <900 then '29' when k_spread >=900 and k_spread <930 then '30' when k_spread >=930 and k_spread <960 then '31' when k_spread >=960 and k_spread <990 then '32' when k_spread >=990 and k_spread <1020 then '33' when k_spread >=1020 and k_spread <1050 then '34' when k_spread >=1050 and k_spread <1080 then '35' when k_spread >=1080 and k_spread <1110 then '36' when k_spread >=1110 and k_spread <1140 then '37' when k_spread >=1140 and k_spread <1170 then '38' when k_spread >=1170 and k_spread <1200 then '39' when k_spread >=1200 and k_spread <1230 then '40' when k_spread >=1230 and k_spread <1260 then '41' when k_spread >=1260 and k_spread <1290 then '42' when k_spread >=1290 and k_spread <1320 then '43' when k_spread >=1320 and k_spread <1350 then '44' when k_spread >=1350 and k_spread <1380 then '45' when k_spread >=1380 and k_spread <1410 then '46' when k_spread >=1410 and k_spread <1440 then '47' when k_spread >=1440 and k_spread <1470 then '48' when k_spread >=1470 and k_spread <1500 then '49' when k_spread >=1500 and k_spread <1530 then '50' when k_spread >=1530 and k_spread <1560 then '51' when k_spread >=1560 and k_spread <1590 then '52' when k_spread >=1590 and k_spread <1620 then '53' when k_spread >=1620 and k_spread <1650 then '54' when k_spread >=1650 and k_spread <1680 then '55' when k_spread >=1680 and k_spread <1710 then '56' when k_spread >=1710 and k_spread <1740 then '57' when k_spread >=1740 and k_spread <1770 then '58' when k_spread >=1770 and k_spread <1800 then '59' when k_spread >=1800 and k_spread <1830 then '60' end
"""

unisdd = {'中国传媒大学':Counter(),'中国人民大学':Counter(),'北京外国语大学':Counter(),'首都医科大学':Counter(),'清华大学':Counter()}

l=[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170, 1200, 1230, 1260, 1290, 1320, 1350, 1380, 1410, 1440, 1470, 1500, 1530, 1560, 1590, 1620, 1650, 1680, 1710, 1740, 1770, 1800, 1830]

msg_tuple = mysql_execute(sql)
for msg in msg_tuple:
    unisdd[msg[0]][msg[2]] = msg[1]
for uni in unisdd:
	print(uni)
	for i in range(0,61):
		if unisdd[uni][i] == 0:
			unisdd[uni][i] = -1
	unisdd[uni] = sorted(unisdd[uni].items(),key=lambda x:int(x[0]))
	td = dict(unisdd[uni])
	for key in td:
		if td[key]==-1:
			td[key]=0
	td = dict(sorted(td.items(),key=lambda x:int(x[0])))
	n=[]
	for k in td:
		n.append(td[k])
    print(n)
    
    var xAxisData =[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570, 600, 630, 660, 690, 720, 750, 780, 810, 840, 870, 900, 930, 960, 990, 1020, 1050, 1080, 1110, 1140, 1170, 1200, 1230, 1260, 1290, 1320, 1350, 1380, 1410, 1440, 1470, 1500, 1530, 1560, 1590, 1620, 1650, 1680, 1710, 1740, 1770, 1800, 1830];
    var data1 = [1, 0, 19, 0, 24, 0, 11, 0, 10, 0, 10, 0, 6, 0, 4, 0, 3, 0, 2, 0, 3, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var data2 = [0, 7, 0, 13, 0, 16, 0, 13, 0, 4, 0, 10, 0, 8, 0, 4, 0, 4, 0, 1, 0, 2, 0, 1, 0, 4, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 1, 0, 2, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var data3 = [1, 0, 5, 0, 3, 0, 4, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0];
    var data4 = [27, 0, 13, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var data5 = [0, 1, 0, 2, 0, 7, 0, 5, 0, 14, 0, 16, 0, 10, 0, 18, 0, 16, 0, 8, 0, 12, 0, 8, 0, 7, 0, 6, 0, 1, 0, 5, 0, 7, 0, 5, 0, 6, 0, 4, 0, 4, 0, 5, 0, 7, 0, 2, 0, 2, 0, 1, 0, 4, 0, 5, 0, 3, 0, 2, 0, 3, 0, 2, 0, 2, 0, 1, 0, 2, 0, 1, 0, 3, 0, 0, 0, 2, 0, 1, 0, 2, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 3, 0, 0, 2, 0, 2, 0, 1, 0, 0, 1, 0, 0, 0, 0, 2, 0, 1, 0];
    
    
    var emphasisStyle = {
        itemStyle: {
            barBorderWidth: 1,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
        }
    };
    
    option = {
        backgroundColor: '#eee',
        legend: {
            data: ['中国传媒大学','中国人民大学','北京外国语大学','首都医科大学','清华大学'],
            left: 10
        },
        dataZoom:[{
     　　　　type:"inside"         //详细配置可见echarts官网
     　　　}],
        brush: {
            toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
            xAxisIndex: 0
        },
        toolbox: {
            feature: {
                magicType: {
                    type: ['stack', 'tiled']
                },
                dataView: {}
            }
        },
        tooltip: {},
        xAxis: {
            data: xAxisData,
            name: 'X Axis',
            axisLine: {onZero: true},
            splitLine: {show: false},
            splitArea: {show: false}
        },
        yAxis: {
            splitArea: {show: false}
        },
        grid: {
            left: 100
        },
        series: [
            {
                name: '中国传媒大学',
                type: 'bar',
                stack: 'one',
                emphasis: emphasisStyle,
                data: data1
            },
            {
                name: '中国人民大学',
                type: 'bar',
                stack: 'one',
                emphasis: emphasisStyle,
                data: data2
            },
            {
                name: '北京外国语大学',
                type: 'bar',
                stack: 'two',
                emphasis: emphasisStyle,
                data: data3
            },
            {
                name: '首都医科大学',
                type: 'bar',
                stack: 'two',
                emphasis: emphasisStyle,
                data: data4
            },
            {
                name: '清华大学',
                type: 'bar',
                stack: 'one',
                emphasis: emphasisStyle,
                data: data5
            }
        ]
    };
    
    myChart.on('brushSelected', renderBrushed);
    
    function renderBrushed(params) {
        var brushed = [];
        var brushComponent = params.batch[0];
    
        for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
            var rawIndices = brushComponent.selected[sIdx].dataIndex;
            brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
        }
    }

横5 原创性
option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    legend: {
        data: ['原创', '非原创']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'value'
        }
    ],
    yAxis: [
        {
            type: 'category',
            axisTick: {
                show: false
            },
            data: ['中国传媒大学','中国人民大学','北京外国语大学','首都医科大学','清华大学']
        }
    ],
    series: [
        {
            name: '原创',
            type: 'bar',
            label: {
                show: true,
                position: 'inside'
            },
            data: [42, 12, 1, 0, 93]
        },
        {
            name: '非原创',
            type: 'bar',
            stack: '总量',
            label: {
                show: true,
                position: 'left'
            },
            data: [-57, -84, -21, -43, -135]
        }
    ]
};

横4 整体情感条形图


横5 原创文章类型饼图
select ori_article_type, count(*)
from articles
where copyright_stat=1
group by  ori_article_type

option = {
    title: {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        left: 'center'
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['其他', '图片', '教育培训', '文学', '社会新闻', '艺术文化', '视频']
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
                {value: 93, name: '其他'},
                {value: 7, name: '图片'},
                {value: 12, name: '教育培训'},
                {value: 30, name: '文学'},
                {value: 2, name: '社会新闻'},
                {value: 1, name: '艺术文化'},
                {value: 3, name: '视频'}
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

横4 情感条形图，选择区域
var emphasisStyle = {
    itemStyle: {
        barBorderWidth: 1,
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: 'rgba(0,0,0,0.5)'
    }
};

option = {
title: {
    text: '整体评论加权情感指数',
    subtext: ''
},
tooltip: {
    trigger: 'axis',
    axisPointer: {
        type: 'shadow'
    }
},
grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
},
brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0
    },
xAxis: {
    type: 'value',
    max:1.0,
    boundaryGap: [0, 0.01]
},
yAxis: {
    type: 'category',
    data: ['中国传媒大学','中国人民大学','北京外国语大学','首都医科大学','清华大学']
},
series: [
    {
        name: '整体评论加权情感指数',
        type: 'bar',
        data:  [0.61,0.56,0.57,0.40,0.77],
        emphasis: emphasisStyle,
        markLine: {
            symbol: ['none', 'none'],//去掉箭头
            itemStyle: {
                normal: { lineStyle: { type: 'solid', color:'black'}
                ,label: { show: false, position:'left' } }
            },
            data: [
                {
                    name: '中性',
                    xAxis: 0.40
                },
                {
                    name: '正面',
                    xAxis: 0.60
                }
            ]
    }   
    }
    
]
};

myChart.on('brushSelected', renderBrushed);

function renderBrushed(params) {
    var brushed = [];
    var brushComponent = params.batch[0];

    for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
        var rawIndices = brushComponent.selected[sIdx].dataIndex;
        brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
    }
}

横9，同步发表
option = {
    series: {
        type: 'sankey',
        layout: 'none',
        focusNodeAdjacency: 'allEdges',
        data: [{
            name: '中国传媒大学'
        }, {
            name: '中国人民大学'
        }, {
            name: '北京外国语大学'
        }, {
            name: '首都医科大学'
        }, {
            name: '清华大学'
        }],
        links: [{
            source: '北京外国语大学',
            target: '清华大学',
            value: 1
        }, {
            source: '北京外国语大学',
            target: '中国传媒大学',
            value: 6
        }, {
            source: '北京外国语大学',
            target: '中国人民大学',
            value: 6
        }, {
            source: '清华大学',
            target: '首都医科大学',
            value: 8
        }, {
            source: '清华大学',
            target: '中国传媒大学',
            value: 3
        }, {
            source: '清华大学',
            target: '中国人民大学',
            value: 4
        }, {
            source: '中国传媒大学',
            target: '中国人民大学',
            value: 4
        }]
    }
};


横8文本相似度桑基图
option = {
    series: {
        type: 'sankey',
        layout: 'none',
        focusNodeAdjacency: 'allEdges',
        data: [{
            name: '中国传媒大学'
        }, {
            name: '中国人民大学'
        }, {
            name: '北京外国语大学'
        }, {
            name: '首都医科大学'
        }, {
            name: '清华大学'
        }],
        links: [{
            source: '北京外国语大学',
            target: '清华大学',
            value: 1
        }, {
            source: '北京外国语大学',
            target: '中国传媒大学',
            value: 6
        }, {
            source: '北京外国语大学',
            target: '中国人民大学',
            value: 6
        }, {
            source: '清华大学',
            target: '首都医科大学',
            value: 8
        }, {
            source: '清华大学',
            target: '中国传媒大学',
            value: 3
        }, {
            source: '清华大学',
            target: '中国人民大学',
            value: 4
        }, {
            source: '中国传媒大学',
            target: '中国人民大学',
            value: 4
        }]
    },
    tooltip: {
        formatter: '{b} : {c} '
    }
};

综合雷达图：
option = {
    title: {
        text: '基础雷达图'
    },
    tooltip: {},
    legend: {
        data: ['中国传媒大学','中国人民大学','北京外国语大学','首都医科大学','清华大学']
    },
    radar: {
        // shape: 'circle',
        name: {
            textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [3, 5]
            }
        },
        indicator: [
            { name: '发文频率', max: 3.5},
            { name: '品牌自信指数', max: 1},
            { name: '平均传播指数', max: 550},
            { name: '原创比例', max: 1},
            { name: '整体加权情感指数', max: 1},
            { name: '最大阅读量', max: 100001},
            { name: '最高点赞数', max: 2300}
        ]
    },
    series: [{
        name: '五所学校公众号传播力综合评价',
        type: 'radar',
        // areaStyle: {normal: {}},
        data: [
            {
                value:[0.32, 0.455, 266.89, 0.0455, 0.57, 100001, 2213],
                name:'北京外国语大学'
            },
            {
                value:[1.39, 0.531, 218.09, 0.125, 0.56, 72860, 710],
                name:'中国人民大学'
            },
            {
                value:[3.3, 0.68, 532.1, 0.4079, 0.77, 100001, 2198],
                name:'清华大学'
            },
            {
                value:[1.43, 0.768, 153.08, 0.4242, 0.61, 100001, 594],
                name:'中国传媒大学'
            },
            {
                value:[0.62, 0.419, 32.0, 0.0, 0.4, 8290, 123],
                name:'首都医科大学'
            }
        ]
    }]
};