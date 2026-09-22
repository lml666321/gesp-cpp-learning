// Sources verified against local GESP papers where noted; new unit questions are original.
window.GESP_QUESTIONS = {
  "lessons": {
    "u1-l1": [
      {
        "prompt": "机器人通过摄像头观察周围环境。哪一项不能作为输入设备？",
        "options": [
          "摄像头",
          "重力传感器",
          "遥控器",
          "预装的控制程序"
        ],
        "answer": 3,
        "explain": "控制程序负责处理和控制，不负责从外界采集信息。",
        "source": "教学变式 · GESP C++ 二级 2026 年 3 月 单选第 1 题",
        "id": "u1-l1-q1",
        "lesson": "u1-l1",
        "hint": "想一想：它是采集外界信息，还是处理已有信息？",
        "wrong": [
          "摄像头把图像送入系统，是输入设备。",
          "重力传感器采集重心信息，是输入设备。",
          "遥控器把动作指令送入系统，是输入设备。",
          ""
        ]
      },
      {
        "prompt": "程序要先接收温度，再把温度加 1，最后输出。正确顺序是？",
        "options": [
          "输出 → 输入 → 处理",
          "输入 → 处理 → 输出",
          "处理 → 输出 → 输入",
          "输入 → 输出 → 处理"
        ],
        "answer": 1,
        "explain": "程序从上到下执行，要先得到数据，再处理并输出。",
        "id": "u1-l1-q2",
        "lesson": "u1-l1",
        "hint": "处理前必须先拿到数据。",
        "wrong": [
          "一开始输出时还没有输入数据。",
          "",
          "处理放在输入之前，缺少待处理数据。",
          "输出发生在处理前，显示的不是处理后的结果。"
        ],
        "source": "原创练习"
      }
    ],
    "u1-l2": [
      {
        "prompt": "要把键盘输入的数据保存到变量 age，应使用哪一行？",
        "options": [
          "cout >> age;",
          "cin >> age;",
          "cin << age;",
          "age >> cin;"
        ],
        "answer": 1,
        "explain": "cin 用于输入，输入运算符写作 >>。",
        "id": "u1-l2-q1",
        "lesson": "u1-l2",
        "hint": "先确认输入对象的名字，再确认箭头方向。",
        "wrong": [
          "cout 用于输出，这里需要输入。",
          "",
          "cin 的输入运算符是 >>，不是 <<。",
          "输入流应在左侧，变量在 >> 的右侧。"
        ],
        "source": "原创练习"
      },
      {
        "prompt": "输入为下方两个整数。程序输出哪一项（两个数之间有一个空格）？",
        "options": [
          "12 6",
          "6 12",
          "age grade",
          "grade age"
        ],
        "answer": 1,
        "explain": "第一个数进入 age，第二个数进入 grade；输出顺序与变量出现顺序一致。",
        "source": "教学练习（旧标签 GESP 2025 年 9 月，具体对应题未核实）",
        "id": "u1-l2-q2",
        "lesson": "u1-l2",
        "hint": "先写下每个变量读到了哪个数，再看 cout 的顺序。",
        "wrong": [
          "你沿用了读入顺序，没有交换输出顺序。",
          "",
          "未加引号的 age、grade 表示变量的值，不是名字。",
          "cout 输出变量的值，不会输出变量名。"
        ],
        "input": "12 6",
        "code": "#include <iostream>\nusing namespace std;\nint main() {\n    int age, grade;\n    cin >> age >> grade;\n    cout << grade << ' ' << age;\n    return 0;\n}"
      }
    ],
    "u1-l3": [
      {
        "prompt": "执行下方代码后，a 的值是？",
        "options": [
          "6",
          "8",
          "10",
          "12"
        ],
        "answer": 2,
        "explain": "a 先从 3 更新为 5，再使用新值计算 5×2=10。",
        "id": "u1-l3-q1",
        "lesson": "u1-l3",
        "hint": "每一行都使用上一行更新后的 a。",
        "wrong": [
          "你似乎跳过了 a=a+2。",
          "加 2 后得到 5，再乘 2，不能把两次变化混算。",
          "",
          "初值是 3，不要把加 2 当成加 3。"
        ],
        "source": "原创练习",
        "code": "int a = 3;\na = a + 2;\na = a * 2;"
      },
      {
        "prompt": "在函数局部声明变量时，下面哪个名称因属于 C++ 关键字而不能使用？",
        "options": [
          "score2",
          "student_score",
          "_score",
          "for"
        ],
        "answer": 3,
        "explain": "for 是 C++ 关键字，不能作为变量名。",
        "source": "教学变式 · GESP C++ 二级 2025 年 12 月 单选第 3 题",
        "id": "u1-l3-q2",
        "lesson": "u1-l3",
        "hint": "关键字已经被 C++ 语言用于特定语法。",
        "wrong": [
          "数字可以出现在标识符中间或末尾。",
          "下划线可以连接单词。",
          "这里问关键字；_score 在函数局部可用，但应避免保留标识符命名。",
          ""
        ]
      }
    ],
    "u1-l4": [
      {
        "prompt": "保存单个字符 'A'，最合适的数据类型是？",
        "options": [
          "int",
          "double",
          "char",
          "bool"
        ],
        "answer": 2,
        "explain": "char 用于保存单个字符，字符常量使用单引号。",
        "id": "u1-l4-q1",
        "lesson": "u1-l4",
        "hint": "留意题目说的是单个字符。",
        "wrong": [
          "int 虽可保存编码，但表达单个字符应选 char。",
          "double 表示浮点数，不是字符类型。",
          "",
          "bool 只表示真假，不适合保存字母身份。"
        ],
        "source": "原创练习"
      },
      {
        "prompt": "下方代码默认输出什么？",
        "options": [
          "报错",
          "10",
          "11",
          "true"
        ],
        "answer": 2,
        "explain": "true 参与整数运算时可以转换为 1，所以结果是 11。",
        "source": "教学变式 · GESP C++ 二级 2026 年 3 月 判断题（bool 运算）",
        "id": "u1-l4-q2",
        "lesson": "u1-l4",
        "hint": "布尔值参与整数运算时会转换成整数。",
        "wrong": [
          "bool 可以参与算术运算。",
          "true 转成 1，不是 0。",
          "",
          "这里输出的是加法结果，不是 passed 本身。"
        ],
        "code": "bool passed = true;\ncout << (10 + passed);"
      }
    ],
    "u1-l5": [
      {
        "prompt": "C++ 整数表达式 13 / 5 的结果是？",
        "options": [
          "2",
          "2.5",
          "3",
          "5"
        ],
        "answer": 0,
        "explain": "两个操作数都是整数，整数除法只保留整数部分。",
        "id": "u1-l5-q1",
        "lesson": "u1-l5",
        "hint": "观察两个操作数是否都为整数。",
        "wrong": [
          "",
          "整数除法不会产生小数部分。",
          "整数除法不四舍五入。",
          "5 是除数，不是商。"
        ],
        "source": "原创练习"
      },
      {
        "prompt": "下方代码输出哪个数位的值？",
        "options": [
          "5",
          "2",
          "7",
          "52"
        ],
        "answer": 1,
        "explain": "527/10 得到 52，再计算 52%10 得到十位数字 2。",
        "source": "教学变式 · GESP C++ 二级 2025 年 9 月 单选第 4 题",
        "id": "u1-l5-q2",
        "lesson": "u1-l5",
        "hint": "分两步写出 /10 和 %10 的结果。",
        "wrong": [
          "5 是百位，不是十位。",
          "",
          "7 是个位；第一步已经去掉个位。",
          "52 是中间结果，还需要取余。"
        ],
        "code": "int n = 527;\ncout << n / 10 % 10;"
      }
    ],
    "u1-l6": [
      {
        "prompt": "int(3.8) 的结果是？",
        "options": [
          "3",
          "4",
          "3.8",
          "报错"
        ],
        "answer": 0,
        "explain": "小数强制转换为 int 时会直接去掉小数部分，不是四舍五入。",
        "id": "u1-l6-q1",
        "lesson": "u1-l6",
        "hint": "去掉小数部分与四舍五入是不同操作。",
        "wrong": [
          "",
          "转换向 0 截断，不会四舍五入。",
          "目标是 int，不保留小数部分。",
          "3.8 在可表示范围内，转换合法。"
        ],
        "source": "原创练习"
      },
      {
        "prompt": "下方代码默认输出什么？",
        "options": [
          "3",
          "6",
          "6.5",
          "报错"
        ],
        "answer": 2,
        "explain": "整数 3 参与浮点运算时转换为 3.0，结果为 6.5。",
        "source": "教学变式 · GESP C++ 二级 2026 年 6 月 单选第 3 题",
        "id": "u1-l6-q2",
        "lesson": "u1-l6",
        "hint": "加法含 double 时，先考虑整数操作数的转换。",
        "wrong": [
          "这里只输出和，不能忽略 b。",
          "结果没有赋给 int，不会截成 6。",
          "",
          "int 与 double 可以混合运算。"
        ],
        "code": "int a = 3;\ndouble b = 3.5;\ncout << a + b;"
      }
    ],
    "u1-l7": [
      {
        "prompt": "采用 ASCII 编码时，下方代码输出什么？",
        "options": [
          "A",
          "1",
          "65",
          "97"
        ],
        "answer": 2,
        "explain": "大写字母 'A' 的 ASCII 编码是 65。",
        "id": "u1-l7-q1",
        "lesson": "u1-l7",
        "hint": "题目把字符转换成了整数。",
        "wrong": [
          "int() 要显示编码，不显示字母。",
          "A 不是按字母序号 1 编码。",
          "",
          "97 是小写 a 的编码。"
        ],
        "source": "原创练习",
        "code": "cout << int('A');"
      },
      {
        "prompt": "采用 ASCII 编码时，下方代码输出什么？",
        "options": [
          "9",
          "54",
          "57",
          "'9'"
        ],
        "answer": 2,
        "explain": "字符 '5' 使用 ASCII 编码 53 参与整数运算，53+4=57。",
        "source": "教学变式 · GESP C++ 二级 2025 年 9 月 判断第 10 题",
        "id": "u1-l7-q2",
        "lesson": "u1-l7",
        "hint": "先把字符转换为编码，再做加法。",
        "wrong": [
          "把字符 '5' 当成整数 5 了。",
          "53+4 不是 54，请检查加法。",
          "",
          "加法结果为整数；只有转回 char 才会显示字符。"
        ],
        "code": "cout << ('5' + 4);"
      }
    ],
    "u1-l8": [
      {
        "prompt": "“分数不低于 60，并且缺勤次数少于 3”应写成？",
        "options": [
          "score>60 || absence<3",
          "score>=60 && absence<3",
          "score>=60 || absence<3",
          "score<60 && absence>3"
        ],
        "answer": 1,
        "explain": "“不低于”包含等于，对应 >=；“并且”对应 &&。",
        "id": "u1-l8-q1",
        "lesson": "u1-l8",
        "hint": "分别翻译“不低于”和“并且”。",
        "wrong": [
          "> 漏掉 60，|| 也不表示同时满足。",
          "",
          "|| 会允许仅一个条件成立。",
          "分数与缺勤的两个方向都写反了。"
        ],
        "source": "原创练习"
      },
      {
        "prompt": "哪个表达式与 !(x>5 && y<=10) 等价？",
        "options": [
          "x<=5 && y>10",
          "x>5 || y<=10",
          "x<=5 || y>10",
          "!x>5 && !y<=10"
        ],
        "answer": 2,
        "explain": "整体否定“两个条件同时成立”，等价于两个条件分别否定后使用 ||。",
        "source": "历年真题 · GESP C++ 二级 2026 年 3 月 单选第 4 题",
        "id": "u1-l8-q2",
        "lesson": "u1-l8",
        "hint": "整体否定“同时成立”，只要一个原条件不成立就应为真。",
        "wrong": [
          "否定后连接词也要从 && 改成 ||。",
          "只改连接词，还没有否定两边条件。",
          "",
          "! 的优先级高，这样先否定变量，不等于否定比较结果。"
        ]
      }
    ],
    "u2-l1": [
      {
        "id": "u2-l1-q1",
        "lesson": "u2-l1",
        "prompt": "输入 29 时，输出是什么？",
        "code": "int t; cin >> t;\nif (t >= 30) { cout << \"HOT \"; }\ncout << \"DONE\";",
        "options": [
          "HOT DONE",
          "DONE",
          "没有输出",
          "HOT"
        ],
        "answer": 1,
        "hint": "检查 DONE 是否在花括号里。",
        "explain": "29>=30 为假，跳过 HOT；DONE 在 if 外，仍会输出。",
        "wrong": [
          "29 不满足 >=30，不会输出 HOT。",
          "",
          "条件不成立只跳过 if 块，不会结束整个程序。",
          "HOT 被跳过，而 DONE 不在条件控制内。"
        ],
        "source": "原创练习",
        "input": "29"
      },
      {
        "id": "u2-l1-q2",
        "lesson": "u2-l1",
        "prompt": "执行后输出什么？",
        "code": "int x = 0;\nif (x > 0)\n    cout << \"A\";\ncout << \"B\";",
        "options": [
          "A",
          "AB",
          "B",
          "没有输出"
        ],
        "answer": 2,
        "hint": "没有花括号的 if 只控制紧随其后的一个语句。",
        "explain": "x>0 为假，仅跳过 cout<<\"A\"，随后输出 B。",
        "wrong": [
          "A 需要 x>0。",
          "你把假条件当成了真。",
          "",
          "B 是 if 后的独立语句，仍要执行。"
        ],
        "source": "原创练习"
      }
    ],
    "u2-l2": [
      {
        "id": "u2-l2-q1",
        "lesson": "u2-l2",
        "prompt": "输入 60 时，输出是什么？",
        "code": "int score; cin >> score;\nif (score >= 60) cout << \"PASS\";\nelse cout << \"RETRY\";",
        "options": [
          "PASS",
          "RETRY",
          "PASSRETRY",
          "60"
        ],
        "answer": 0,
        "hint": "不低于包含等于。",
        "explain": "60>=60 为真，执行 PASS 分支，跳过 else。",
        "wrong": [
          "",
          ">= 包含等于，不会进入 else。",
          "同一组 if-else 只选一条路径。",
          "代码输出字符串，不直接输出分数。"
        ],
        "source": "原创练习",
        "input": "60"
      },
      {
        "id": "u2-l2-q2",
        "lesson": "u2-l2",
        "prompt": "x=-2 时，输出是什么？",
        "code": "int x = -2;\nif (x < 0) x = -x;\nelse x = x + 1;\ncout << x;",
        "options": [
          "-2",
          "2",
          "3",
          "-1"
        ],
        "answer": 1,
        "hint": "进入 if 分支后会不会再执行它的 else？",
        "explain": "x<0 为真，x 变为 2；else 被跳过，最后输出 2。",
        "wrong": [
          "漏掉了 if 内的赋值。",
          "",
          "执行 if 后不会再执行 else 中的加 1。",
          "你误选了 else 分支。"
        ],
        "source": "原创练习"
      }
    ],
    "u2-l3": [
      {
        "id": "u2-l3-q1",
        "lesson": "u2-l3",
        "prompt": "输入 95 时，这段程序实际输出什么？",
        "code": "int s; cin >> s;\nif (s >= 60) cout << \"B\";\nelse if (s >= 90) cout << \"A\";\nelse cout << \"C\";",
        "options": [
          "A",
          "AB",
          "B",
          "C"
        ],
        "answer": 2,
        "hint": "按代码实际顺序找第一个成立的条件。",
        "explain": "95>=60 已成立，输出 B，后续 else if 不再判断。这说明分类顺序有问题。",
        "wrong": [
          "你按目标分类了，却忽略程序先检查 >=60。",
          "else if 链不会进入两个分支。",
          "",
          "95 已满足首个条件，不会进入兜底 else。"
        ],
        "source": "原创练习",
        "input": "95"
      },
      {
        "id": "u2-l3-q2",
        "lesson": "u2-l3",
        "prompt": "目标：90 分及以上为 A，60～89 为 B，其余为 C。哪种结构正确？",
        "code": "// s 是 0～100 的整数",
        "options": [
          "先 if(s>=60) B，再 else if(s>=90) A",
          "先 if(s>=90) A，再 else if(s>=60) B，最后 else C",
          "if(s>90) A；else if(s<90) C",
          "两个独立 if：>=90 输出 A，>=60 输出 B"
        ],
        "answer": 1,
        "hint": "高门槛应优先；检查恰好 90 和一个 95。",
        "explain": "先判断 >=90，未进入时才判断 >=60；else 覆盖剩下的 0～59。",
        "wrong": [
          ">=60 遮住了 >=90 的情况。",
          "",
          "遗漏 90，也没有 B 等级。",
          "95 会输出 AB，不是单一等级。"
        ],
        "source": "原创练习"
      }
    ],
    "u2-l4": [
      {
        "id": "u2-l4-q1",
        "lesson": "u2-l4",
        "prompt": "age=10，prepared=true，输出是什么？",
        "code": "if (age >= 12) {\n    if (prepared) cout << \"ENTER\";\n    else cout << \"PREPARE\";\n} else cout << \"TOO_YOUNG\";",
        "options": [
          "ENTER",
          "PREPARE",
          "TOO_YOUNG",
          "没有输出"
        ],
        "answer": 2,
        "hint": "先看外层是否允许进入内层。",
        "explain": "外层 age>=12 不成立，整个内层被跳过，执行外层 else。",
        "wrong": [
          "即使准备好了，也没有通过外层年龄条件。",
          "PREPARE 需要先进入外层。",
          "",
          "外层有 else，因此仍有输出。"
        ],
        "source": "原创练习"
      },
      {
        "id": "u2-l4-q2",
        "lesson": "u2-l4",
        "prompt": "执行后输出什么？注意 else 的配对。",
        "code": "int a = 1, b = 0;\nif (a > 0)\n    if (b > 0) cout << \"X\";\n    else cout << \"Y\";",
        "options": [
          "X",
          "Y",
          "没有输出",
          "XY"
        ],
        "answer": 1,
        "hint": "else 与最近的未配对 if 匹配。",
        "explain": "外层为真，内层为假；else 属于内层 if，所以输出 Y。",
        "wrong": [
          "b>0 不成立，不能输出 X。",
          "",
          "不能把 else 配给外层 if。",
          "内层 if-else 只执行一支。"
        ],
        "source": "原创练习"
      }
    ],
    "u2-l5": [
      {
        "id": "u2-l5-q1",
        "lesson": "u2-l5",
        "prompt": "choice=1 时，输出是什么？",
        "code": "switch (choice) {\ncase 1: cout << \"A\";\ncase 2: cout << \"B\"; break;\ndefault: cout << \"X\";\n}",
        "options": [
          "A",
          "B",
          "AB",
          "ABX"
        ],
        "answer": 2,
        "hint": "找到入口，再找到第一个 break。",
        "explain": "匹配 case 1 后输出 A；没有 break，继续输出 B；随后 break 退出。",
        "wrong": [
          "case 1 后没有 break。",
          "匹配入口是 case 1，先输出 A。",
          "",
          "case 2 后的 break 阻止执行 default。"
        ],
        "source": "原创练习"
      },
      {
        "id": "u2-l5-q2",
        "lesson": "u2-l5",
        "prompt": "执行下方三目表达式，输出什么？",
        "code": "int a = 4, b = 7;\ncout << (a > b ? a : b);",
        "options": [
          "4",
          "7",
          "1",
          "47"
        ],
        "answer": 1,
        "hint": "条件 ? 成立时的值 : 不成立时的值。",
        "explain": "4>7 为假，选择冒号后面的 b，输出 7。",
        "wrong": [
          "条件为假，要选冒号后面的值。",
          "",
          "表达式选择 a 或 b，不是只输出真假。",
          "三目运算仅选择一个表达式的值。"
        ],
        "source": "原创练习"
      }
    ],
    "u2-l6": [
      {
        "id": "u2-l6-q1",
        "lesson": "u2-l6",
        "prompt": "要检测 >=60 被误写成 >60，哪个输入最直接？",
        "code": "if (score >= 60) cout << \"PASS\";\nelse cout << \"RETRY\";",
        "options": [
          "59",
          "60",
          "61",
          "100"
        ],
        "answer": 1,
        "hint": "两个关系运算符只在哪个位置有不同结果？",
        "explain": "只有恰好 60 时，>=60 与 >60 的真假不同。",
        "wrong": [
          "59 在两个版本中都未及格。",
          "",
          "61 在两个版本中都及格。",
          "100 在两个版本中都及格。"
        ],
        "source": "原创练习"
      },
      {
        "id": "u2-l6-q2",
        "lesson": "u2-l6",
        "prompt": "分类范围为 0～100，60、90 是等级门槛。哪组兼顾合法范围与等级的边界两侧？",
        "code": "// 范围外 INVALID；>=90 为 A；>=60 为 B；其余 C",
        "options": [
          "50、75、95",
          "0、60、90、100",
          "-1、0、59、60、89、90、100、101",
          "60、60、60"
        ],
        "answer": 2,
        "hint": "除了各门槛，还要测试范围外与相邻值。",
        "explain": "第三组覆盖合法范围两端及范围外，也覆盖两个门槛前后的分数。",
        "wrong": [
          "只有正常内部值，没有边界。",
          "缺少 59、89 及范围外值。",
          "",
          "重复同一数据无法增加路径覆盖。"
        ],
        "source": "原创练习"
      }
    ]
  },
  "chapters": {
    "u1-c1": [
      {
        "prompt": "程序解决问题最常见的基本顺序是？",
        "options": [
          "输出→输入→处理",
          "输入→处理→输出",
          "处理→输入→输出",
          "输入→输出→处理"
        ],
        "answer": 1,
        "explain": "先获得数据，再处理数据，最后输出结果。",
        "id": "u1-c1-q1",
        "lesson": "u1-l1",
        "source": "原创专项练习",
        "hint": "处理前必须先拿到数据。",
        "wrong": [
          "一开始输出时还没有输入数据。",
          "",
          "处理放在输入之前，缺少待处理数据。",
          "输出发生在处理前，显示的不是处理后的结果。"
        ]
      },
      {
        "prompt": "下面哪一个属于输入设备？",
        "options": [
          "显示器",
          "打印机",
          "温度传感器",
          "扬声器"
        ],
        "answer": 2,
        "explain": "传感器把外界信息送入计算机。",
        "id": "u1-c1-q2",
        "lesson": "u1-l1",
        "source": "原创专项练习",
        "hint": "哪种设备把外界数据送进计算机？",
        "wrong": [
          "显示器把结果展示出来，是输出设备。",
          "打印机输出纸面结果。",
          "",
          "扬声器向外播放声音，是输出设备。"
        ]
      },
      {
        "prompt": "输入整数 n 应使用？",
        "options": [
          "cout << n;",
          "cin >> n;",
          "cin << n;",
          "cout >> n;"
        ],
        "answer": 1,
        "explain": "cin 与 >> 组合完成输入。",
        "id": "u1-c1-q3",
        "lesson": "u1-l2",
        "source": "原创专项练习",
        "hint": "回忆 cin 的数据流向。",
        "wrong": [
          "cout << n 输出已有数据。",
          "",
          "输入应写 >>。",
          "cout 用于输出，且不使用 >> 完成输入。"
        ]
      },
      {
        "prompt": "执行下方代码后，n 的值是多少？",
        "options": [
          "8",
          "10",
          "13",
          "16"
        ],
        "answer": 3,
        "explain": "5+3=8，再用新值计算 8×2=16。",
        "id": "u1-c1-q4",
        "lesson": "u1-l3",
        "source": "原创专项练习",
        "hint": "依次记录每行结束后的 n。",
        "wrong": [
          "8 是第一步的结果，还没乘 2。",
          "10 是直接用初值乘 2，漏了加法。",
          "程序是先加 3 再乘 2，不是把变化相加。",
          ""
        ],
        "code": "int n = 5;\nn = n + 3;\nn = n * 2;"
      },
      {
        "prompt": "下面哪个不能作为变量名？",
        "options": [
          "score",
          "score2",
          "student_score",
          "for"
        ],
        "answer": 3,
        "explain": "for 是关键字。",
        "id": "u1-c1-q5",
        "lesson": "u1-l3",
        "source": "原创专项练习",
        "hint": "关键字已经被 C++ 语言用于特定语法。",
        "wrong": [
          "数字可以出现在标识符中间或末尾。",
          "下划线可以连接单词。",
          "这里问关键字；_score 在函数局部可用，但应避免保留标识符命名。",
          ""
        ]
      },
      {
        "prompt": "保存 'A' 应选择？",
        "options": [
          "int",
          "double",
          "char",
          "bool"
        ],
        "answer": 2,
        "explain": "单个字符使用 char。",
        "id": "u1-c1-q6",
        "lesson": "u1-l4",
        "source": "原创专项练习",
        "hint": "留意题目说的是单个字符。",
        "wrong": [
          "int 虽可保存编码，但表达单个字符应选 char。",
          "double 表示浮点数，不是字符类型。",
          "",
          "bool 只表示真假，不适合保存字母身份。"
        ]
      }
    ],
    "u1-c2": [
      {
        "prompt": "下方 C++ 代码默认输出什么？",
        "options": [
          "2",
          "2.5",
          "3",
          "5"
        ],
        "answer": 0,
        "explain": "整数除法只保留整数部分。",
        "id": "u1-c2-q1",
        "lesson": "u1-l5",
        "source": "原创专项练习",
        "hint": "观察两个操作数是否都为整数。",
        "wrong": [
          "",
          "整数除法不会产生小数部分。",
          "整数除法不四舍五入。",
          "5 是除数，不是商。"
        ],
        "code": "cout << 13 / 5;"
      },
      {
        "prompt": "下方 C++ 代码默认输出什么？",
        "options": [
          "1",
          "2",
          "3",
          "5"
        ],
        "answer": 2,
        "explain": "13 除以 5 余 3。",
        "id": "u1-c2-q2",
        "lesson": "u1-l5",
        "source": "原创专项练习",
        "hint": "想一想 13 = 5 × 商 + 余数。",
        "wrong": [
          "1 不能满足除法等式。",
          "2 是商，不是余数。",
          "",
          "余数的绝对值应小于除数的绝对值。"
        ],
        "code": "cout << 13 % 5;"
      },
      {
        "prompt": "下方 C++ 代码默认输出什么？",
        "options": [
          "5",
          "2",
          "7",
          "52"
        ],
        "answer": 1,
        "explain": "先去掉个位，再取得新个位。",
        "id": "u1-c2-q3",
        "lesson": "u1-l5",
        "source": "原创专项练习",
        "hint": "分两步写出 /10 和 %10 的结果。",
        "wrong": [
          "5 是百位，不是十位。",
          "",
          "7 是个位；第一步已经去掉个位。",
          "52 是中间结果，还需要取余。"
        ],
        "code": "int n = 527;\ncout << n / 10 % 10;"
      },
      {
        "prompt": "下方代码未启用 boolalpha，默认 cout 输出什么？",
        "options": [
          "0",
          "1",
          "60",
          "报错"
        ],
        "answer": 1,
        "explain": "60>=60 的逻辑值为 true；默认 cout 把 true 输出为 1。",
        "code": "int score = 60;\ncout << (score >= 60);",
        "id": "u1-c2-q4",
        "lesson": "u1-l5",
        "source": "原创专项练习",
        "hint": "先判断 >= 是否包含等于，再看默认布尔输出格式。",
        "wrong": [
          "60>=60 为真，不是 0。",
          "",
          "关系表达式输出真假，不输出 score 本身。",
          "关系比较及 cout 输出都是合法操作。"
        ]
      },
      {
        "prompt": "下方 C++ 代码默认输出什么？",
        "options": [
          "4",
          "5",
          "4.9",
          "报错"
        ],
        "answer": 0,
        "explain": "强制转换为 int 时去掉小数部分。",
        "id": "u1-c2-q5",
        "lesson": "u1-l6",
        "source": "原创专项练习",
        "hint": "去掉小数部分与四舍五入是不同操作。",
        "wrong": [
          "",
          "转换向 0 截断，不会四舍五入。",
          "目标是 int，不保留小数部分。",
          "3.8 在可表示范围内，转换合法。"
        ],
        "code": "cout << int(4.9);"
      },
      {
        "prompt": "采用 ASCII 编码时，下方代码输出什么？",
        "options": [
          "1",
          "26",
          "65",
          "97"
        ],
        "answer": 2,
        "explain": "'A' 的 ASCII 编码是 65。",
        "id": "u1-c2-q6",
        "lesson": "u1-l7",
        "source": "原创专项练习",
        "hint": "大写字母和小写字母的编码不同。",
        "wrong": [
          "编码不是字母的排序序号。",
          "26 是字母总数，不是 A 的编码。",
          "",
          "97 对应小写 a。"
        ],
        "code": "cout << int('A');"
      },
      {
        "prompt": "“而且”对应哪个运算符？",
        "options": [
          "||",
          "&&",
          "!",
          "%"
        ],
        "answer": 1,
        "explain": "&& 表示左右条件同时成立。",
        "id": "u1-c2-q7",
        "lesson": "u1-l8",
        "source": "原创专项练习",
        "hint": "需要两个条件同时为真。",
        "wrong": [
          "|| 表示至少一个成立。",
          "",
          "! 只表示否定。",
          "% 是取余，与逻辑连接不同。"
        ]
      },
      {
        "prompt": "!(x>5 && y<=10) 等价于？",
        "options": [
          "x<=5 || y>10",
          "x<=5 && y>10",
          "x>5 || y<=10",
          "x>5 && y<=10"
        ],
        "answer": 0,
        "explain": "分别否定两个条件，再把 && 变为 ||。",
        "id": "u1-c2-q8",
        "lesson": "u1-l8",
        "source": "原创专项练习",
        "hint": "整体否定时，同时翻转比较条件和连接词。",
        "wrong": [
          "",
          "否定后 && 应换为 ||。",
          "原来的两个条件还没有取反。",
          "原式未否定，与要求相反。"
        ]
      }
    ],
    "u2-c1": [
      {
        "id": "u2-c1-q1",
        "lesson": "u2-l1",
        "prompt": "x=-1，执行后输出什么？",
        "code": "int x=-1;\nif(x>0) cout << \"P\";\ncout << \"E\";",
        "options": [
          "PE",
          "E",
          "P",
          "没有输出"
        ],
        "answer": 1,
        "hint": "确认最后一行受谁控制。",
        "explain": "x>0 为假，只跳过 P，E 仍输出。",
        "wrong": [
          "条件为假不会输出 P。",
          "",
          "P 在假分支内。",
          "E 不受 if 控制。"
        ],
        "source": "原创专项练习"
      },
      {
        "id": "u2-c1-q2",
        "lesson": "u2-l2",
        "prompt": "输入 0 时输出什么？",
        "code": "int n; cin >> n;\nif(n%2==0) cout << \"EVEN\";\nelse cout << \"ODD\";",
        "options": [
          "EVEN",
          "ODD",
          "EVENODD",
          "没有输出"
        ],
        "answer": 0,
        "hint": "计算 0 除以 2 的余数。",
        "explain": "0%2=0，进入 EVEN 分支。",
        "wrong": [
          "",
          "0 是偶数，余数是 0。",
          "if-else 只进入一支。",
          "两个分支覆盖所有整数。"
        ],
        "source": "原创专项练习",
        "input": "0"
      },
      {
        "id": "u2-c1-q3",
        "lesson": "u2-l3",
        "prompt": "输入 90 时输出什么？",
        "code": "int s; cin >> s;\nif(s>90) cout << \"A\";\nelse if(s>=60) cout << \"B\";\nelse cout << \"C\";",
        "options": [
          "A",
          "B",
          "C",
          "AB"
        ],
        "answer": 1,
        "hint": "区分 >90 与 >=90。",
        "explain": "90>90 为假，但 90>=60 为真，实际输出 B。",
        "wrong": [
          "> 不包含等于。",
          "",
          "第二个条件已成立。",
          "else if 链不进入两支。"
        ],
        "source": "原创专项练习",
        "input": "90"
      },
      {
        "id": "u2-c1-q4",
        "lesson": "u2-l3",
        "prompt": "输入 95，为什么程序输出 AB？",
        "code": "int s; cin >> s;\nif(s>=90) cout << \"A\";\nif(s>=60) cout << \"B\";",
        "options": [
          "两个独立 if 都成立",
          "else 没写所以出错",
          "cout 自动补了 B",
          "只有第二个 if 执行"
        ],
        "answer": 0,
        "hint": "两个 if 有没有通过 else 连接？",
        "explain": "两个独立 if 都会检查，95 满足两个条件，依次输出 A、B。",
        "wrong": [
          "",
          "if 可以没有 else。",
          "cout 只输出程序明确指定的内容。",
          "第一个条件也成立。"
        ],
        "source": "原创专项练习",
        "input": "95"
      }
    ],
    "u2-c2": [
      {
        "id": "u2-c2-q1",
        "lesson": "u2-l4",
        "prompt": "x=5,y=-1，输出什么？",
        "code": "if(x>0) {\n  if(y>0) cout << 1;\n  else cout << 2;\n} else cout << 3;",
        "options": [
          "1",
          "2",
          "3",
          "23"
        ],
        "answer": 1,
        "hint": "从外向内只走一条完整路径。",
        "explain": "外层为真、内层为假，输出 2。",
        "wrong": [
          "y>0 为假。",
          "",
          "x>0 为真，不进入外层 else。",
          "内外 else 不会一起执行。"
        ],
        "source": "原创专项练习"
      },
      {
        "id": "u2-c2-q2",
        "lesson": "u2-l5",
        "prompt": "输入 3 时输出什么？",
        "code": "int k; cin >> k;\nswitch(k) {\ncase 1: cout << \"A\"; break;\ncase 2: cout << \"B\"; break;\ndefault: cout << \"X\";\n}",
        "options": [
          "A",
          "B",
          "X",
          "ABX"
        ],
        "answer": 2,
        "hint": "没有匹配的 case 时从哪里开始？",
        "explain": "3 没有对应 case，执行 default，输出 X。",
        "wrong": [
          "3 不匹配 1。",
          "3 不匹配 2。",
          "",
          "不会从第一个 case 开始执行。"
        ],
        "source": "原创专项练习",
        "input": "3"
      },
      {
        "id": "u2-c2-q3",
        "lesson": "u2-l5",
        "prompt": "三目表达式的值是？",
        "code": "int x=-3;\nint y = (x<0 ? -x : x);",
        "options": [
          "-3",
          "0",
          "1",
          "3"
        ],
        "answer": 3,
        "hint": "条件决定选哪个值，随后才得到 y。",
        "explain": "x<0 为真，选择 -x，即 3。",
        "wrong": [
          "选错了冒号后的值。",
          "取相反数不是变成 0。",
          "不是把条件的真假赋给 y。",
          ""
        ],
        "source": "原创专项练习"
      },
      {
        "id": "u2-c2-q4",
        "lesson": "u2-l6",
        "prompt": "仅测试 50、75、95 都正确，能说明什么？",
        "code": "// 正确规则：0～59 C，60～89 B，90～100 A",
        "options": [
          "所有边界必然正确",
          "这些样例正确，还需测边界及非法输入",
          "程序已经通过完整在线评测",
          "无需再测试"
        ],
        "answer": 1,
        "hint": "区分“这些输入正确”和“所有输入正确”。",
        "explain": "正常样例没有覆盖门槛和范围外，仍需补充边界及非法输入。",
        "wrong": [
          "正常值没有验证边界。",
          "",
          "这里仅是前端模拟，未进行完整评测。",
          "应补测门槛与范围两端。"
        ],
        "source": "原创专项练习"
      }
    ]
  }
};
