// Stable unit, lesson and question IDs preserve existing learning records.
window.GESP_LESSONS = [
  {
    "id": "u1-l1",
    "chapter": "u1-c1",
    "title": "程序如何工作",
    "mission": "唤醒智能温室控制器",
    "duration": "8 分钟",
    "icon": "IO",
    "goal": "理解输入、处理、输出和程序的顺序执行。",
    "intro": "温度传感器已经读到 28℃。请把这条数据送进控制器，经过处理后显示出来。",
    "keywords": [
      "输入",
      "处理",
      "输出",
      "顺序结构"
    ],
    "summary": "程序通常按照输入、处理、输出的顺序解决问题。先准备数据，再使用数据。",
    "next": "下一节，我们会让程序真正接收和输出数据。",
    "legacyId": 1,
    "labId": 1,
    "order": 1,
    "unit": "u1",
    "notes": [
      {
        "title": "程序结构",
        "text": "源文件先经过编译，生成可执行程序，再运行。#include <iostream> 引入输入输出声明；main 是入口；语句通常以分号结束。下面实验只模拟输入、处理、输出，不执行任意 C++。",
        "code": "#include <iostream>\nusing namespace std;\nint main() {\n    int temperature = 28;\n    cout << temperature;\n    return 0;\n}"
      }
    ],
    "criteria": "依次接通输入、处理、输出"
  },
  {
    "id": "u1-l2",
    "chapter": "u1-c1",
    "title": "输入与输出",
    "mission": "和程序建立通信",
    "duration": "7 分钟",
    "icon": "↔",
    "goal": "看懂 cin 和 cout，观察数据怎样进入变量并显示在屏幕上。",
    "intro": "在控制台输入一个年龄，观察它怎样进入变量 age，再被程序输出。",
    "keywords": [
      "cin",
      "cout",
      "控制台",
      "数据流向"
    ],
    "summary": "cin 把数据送入程序，cout 把程序中的数据送到屏幕。C++ 区分变量名的大小写。",
    "next": "下一节，我们会观察变量中的数据怎样被修改。",
    "legacyId": 2,
    "labId": 2,
    "order": 2,
    "unit": "u1",
    "notes": [
      {
        "title": "输入顺序与输出格式",
        "text": "cin >> a >> b 按顺序读入。cout 不会自动插入空格或换行，要显式输出空格或 \\n。进阶：<iomanip> 中的 fixed 与 setprecision(2) 可保留两位小数。",
        "code": "int a, b;\ncin >> a >> b;\ncout << b << ' ' << a << '\\n';"
      }
    ],
    "criteria": "输入一个 0～150 的整数并运行"
  },
  {
    "id": "u1-l3",
    "chapter": "u1-c1",
    "title": "变量与赋值",
    "mission": "追踪数据储存盒",
    "duration": "9 分钟",
    "icon": "x",
    "goal": "理解变量保存数据、赋值覆盖旧值，并能逐行追踪变量变化。",
    "intro": "变量 score 的值会随着每一行代码变化。逐步运行，看看旧数据去了哪里。",
    "keywords": [
      "变量",
      "赋值",
      "更新",
      "变量名"
    ],
    "summary": "程序中的 = 表示赋值：先计算右边，再把结果保存到左边的变量。",
    "next": "下一节，我们会给不同种类的数据选择合适的变量类型。",
    "legacyId": 3,
    "labId": 3,
    "order": 3,
    "unit": "u1",
    "notes": [
      {
        "title": "变量与常量",
        "text": "变量名区分大小写。const int LIMIT = 100; 定义后不能重新赋值。= 是赋值，== 才是比较。先算等号右侧，再覆盖左侧。",
        "code": "const int LIMIT = 100;\nint score = 60;\nscore = score + 5;"
      }
    ],
    "criteria": "执行全部四行，追踪 score 的变化"
  },
  {
    "id": "u1-l4",
    "chapter": "u1-c1",
    "title": "基本数据类型",
    "mission": "给数据找到正确房间",
    "duration": "9 分钟",
    "icon": "{}",
    "goal": "区分 int、double、char 和 bool 保存的数据。",
    "intro": "年龄、身高、等级和是否通过是四种不同的数据，请把它们放进正确的类型房间。",
    "keywords": [
      "int",
      "double",
      "char",
      "bool"
    ],
    "summary": "整数使用 int，小数使用 double，单个字符使用 char，真假状态使用 bool。",
    "next": "第一章学习完成，接下来先做一组专项练习。",
    "legacyId": 4,
    "labId": 4,
    "order": 4,
    "unit": "u1",
    "notes": [
      {
        "title": "分层认识更多类型",
        "text": "本节先分清 int、double、char、bool。进阶：long long 保存更大范围的整数；float 与 double 都保存浮点数，double 通常精度更高。类型能表示的范围有限，浮点数也不保证精确表示每个小数。分类实验按数据含义选择最合适的类型。",
        "code": "long long population = 3000000000LL;\nfloat rate = 0.5f;\ndouble height = 1.65;"
      }
    ],
    "criteria": "正确分类全部六张数据卡"
  },
  {
    "id": "u1-l5",
    "chapter": "u1-c2",
    "title": "算术与关系运算",
    "mission": "启动表达式计算机",
    "duration": "10 分钟",
    "icon": "%",
    "goal": "计算基础表达式，理解整数除法、取余和关系运算。",
    "intro": "输入两个整数并切换运算符，观察同样的数据如何得到不同结果。",
    "keywords": [
      "+ - * / %",
      "整数除法",
      "关系运算",
      "=="
    ],
    "summary": "整数除法保留整数部分，% 得到余数；关系表达式的结果是 true 或 false。",
    "next": "下一节，我们会观察不同类型的数据一起运算时发生什么。",
    "legacyId": 5,
    "labId": 5,
    "order": 5,
    "unit": "u1",
    "notes": [
      {
        "title": "先后顺序与负数",
        "text": "先括号，再乘除取余，再加减，再关系比较。相同优先级的这些二元运算从左向右结合。整数除法向 0 截断：-13/5 为 -2，-13%5 为 -3。实验将输入限制在 -10000 到 10000，避免超出整数范围。",
        "code": "cout << 2 + 3 * 4;     // 14\ncout << (2 + 3) * 4;   // 20"
      }
    ],
    "criteria": "用合法整数完成一次运算"
  },
  {
    "id": "u1-l6",
    "chapter": "u1-c2",
    "title": "数据类型转换",
    "mission": "通过数据变形通道",
    "duration": "9 分钟",
    "icon": "⇄",
    "goal": "理解隐式转换、强制转换，以及转换顺序对结果的影响。",
    "intro": "整数和小数一起运算时，数据会先经过转换。选择一个实验观察结果。",
    "keywords": [
      "隐式转换",
      "强制转换",
      "int()",
      "小数"
    ],
    "summary": "整数和小数混合运算时会发生类型转换；int(小数) 会直接去掉小数部分。",
    "next": "下一节，我们会发现字符在计算机内部也有数字编号。",
    "legacyId": 6,
    "labId": 6,
    "order": 6,
    "unit": "u1",
    "notes": [
      {
        "title": "转换发生在什么时候",
        "text": "int(3.8) 为 3，int(-3.8) 为 -3，都是向 0 截断。转换前先确认值在目标类型范围内。double(3/2) 为 1.0；double(3)/2 才是 1.5。",
        "code": "cout << double(3 / 2); // 默认输出 1\ncout << double(3) / 2; // 1.5"
      }
    ],
    "criteria": "比较三个转换实验"
  },
  {
    "id": "u1-l7",
    "chapter": "u1-c2",
    "title": "字符与 ASCII",
    "mission": "破解字符密码",
    "duration": "10 分钟",
    "icon": "A",
    "goal": "区分数字与字符，理解字符编码和简单字符运算。",
    "intro": "数字 5 和字符 “5” 看起来一样，但在计算机中的身份完全不同。",
    "keywords": [
      "char",
      "ASCII",
      "'5'",
      "字符运算"
    ],
    "summary": "字符有对应的整数编码。'5' 的 ASCII 编码是 53，它和整数 5 不是同一个数据。",
    "next": "下一节，我们会把自然语言规则翻译成逻辑表达式。",
    "legacyId": 7,
    "labId": 7,
    "order": 7,
    "unit": "u1",
    "notes": [
      {
        "title": "字符、编码与显示",
        "text": "本课程字符题使用 ASCII 编码。'0' 到 '9'、'A' 到 'Z'、'a' 到 'z' 各自连续。char(65) 显示 A；int('A') 显示 65；空格编码是 32。",
        "code": "cout << char(65);\ncout << int('A');"
      }
    ],
    "criteria": "移动滑块或选择一个字符编码"
  },
  {
    "id": "u1-l8",
    "chapter": "u1-c2",
    "title": "逻辑表达式",
    "mission": "设置智能温室启动规则",
    "duration": "12 分钟",
    "icon": "&&",
    "goal": "使用 &&、||、! 构造规则，并区分规则正确与运行结果为真。",
    "intro": "只有温度低于 30 并且水箱有水，灌溉系统才能启动。请把中文规则交给程序。",
    "keywords": [
      "&&",
      "||",
      "!",
      "true / false"
    ],
    "summary": "&& 要求同时成立，|| 要求至少一个成立，! 会翻转真假。规则写对不代表当前结果一定为 true。",
    "next": "先完成第二章专项练习，再进入智能温室综合挑战。",
    "legacyId": 8,
    "labId": 8,
    "order": 8,
    "unit": "u1",
    "notes": [
      {
        "title": "规则与本次结果",
        "text": "先判断中文规则是否正确翻译，再代入当前数据求真假。! 优先于关系比较，&& 优先于 ||；复杂条件建议写括号。不要写数学式 0 < x < 10，应写 0 < x && x < 10。",
        "code": "bool ready = (temperature < 30) && (water > 0);"
      }
    ],
    "criteria": "正确翻译“而且”，结果可为 TRUE 或 FALSE"
  },
  {
    "id": "u2-l1",
    "unit": "u2",
    "order": 1,
    "chapter": "u2-c1",
    "title": "条件如何决定执行路径",
    "mission": "给温度报警器画出路径",
    "duration": "10 分钟",
    "icon": "if",
    "goal": "判断条件真假，区分被执行和被跳过的语句。",
    "intro": "温度达到 30℃ 才输出 HOT；最后一行 DONE 不受条件控制。请分别试一次成立与不成立。",
    "keywords": [
      "if",
      "条件",
      "代码块"
    ],
    "summary": "if 只控制它的语句或花括号代码块。条件不成立时跳过该块，之后的语句继续执行。",
    "next": "下一节用 else 明确另一条路径。",
    "criteria": "分别运行 temperature < 30 与 temperature >= 30 的输入",
    "notes": [
      {
        "title": "先判断，再决定执行",
        "text": "if (条件) { 语句; }：条件为真才执行花括号内语句。缩进帮助阅读，但真正决定范围的是花括号。if 后误写分号会形成空语句。"
      }
    ],
    "lab": {
      "kind": "if",
      "label": "temperature（-50～60 的整数）",
      "min": -50,
      "max": 60,
      "value": 28,
      "code": "int temperature;\ncin >> temperature;\nif (temperature >= 30) {\n    cout << \"HOT \";\n}\ncout << \"DONE\";"
    }
  },
  {
    "id": "u2-l2",
    "unit": "u2",
    "order": 2,
    "chapter": "u2-c1",
    "title": "if-else 二选一",
    "mission": "设计及格提醒",
    "duration": "10 分钟",
    "icon": "↗",
    "goal": "根据输入预测两个互斥分支的输出。",
    "intro": "60 分及以上输出 PASS，否则输出 RETRY。改变分数并比较恰好 60 分两侧的路径。",
    "keywords": [
      "if",
      "else",
      "互斥"
    ],
    "summary": "一组 if-else 恰好执行其中一个分支，执行后汇合到后续语句。",
    "next": "下一节扩展到三个等级，观察判断顺序。",
    "criteria": "分别运行及格与未及格输入",
    "notes": [
      {
        "title": "成对的分支",
        "text": "else 不写条件，它表示前面 if 不成立的其余情况。只有两个分支时，常用 if-else 避免重复判断。"
      }
    ],
    "lab": {
      "kind": "else",
      "label": "score（0～100 的整数）",
      "min": 0,
      "max": 100,
      "value": 60,
      "code": "int score;\ncin >> score;\nif (score >= 60) {\n    cout << \"PASS\";\n} else {\n    cout << \"RETRY\";\n}"
    }
  },
  {
    "id": "u2-l3",
    "unit": "u2",
    "order": 3,
    "chapter": "u2-c1",
    "title": "多分支与判断顺序",
    "mission": "修好分数等级分类器",
    "duration": "12 分钟",
    "icon": "ABC",
    "goal": "发现区间重叠与遗漏，理解第一个成立的分支优先。",
    "intro": "90～100 为 A，60～89 为 B，0～59 为 C。把 >=60 放在前面会发生什么？",
    "keywords": [
      "else if",
      "区间",
      "顺序"
    ],
    "summary": "if-else if 链只进入第一个成立的分支。大范围在前可能遮住小范围；注意边界等号与兜底 else。",
    "next": "第一章结束，先用专项练习检查路径追踪。",
    "criteria": "用 95 分比较两种顺序，再用正确顺序测试 59、60、90",
    "notes": [
      {
        "title": "范围重叠与遗漏",
        "text": "score>=90 是 score>=60 的子集，应该先判断更高门槛。两个独立 if 可能都执行；else if 链最多进入一个分支。若只写 >90 和 <90，会遗漏恰好 90。"
      }
    ],
    "lab": {
      "kind": "order",
      "label": "score（0～100 的整数）",
      "min": 0,
      "max": 100,
      "value": 95
    }
  },
  {
    "id": "u2-l4",
    "unit": "u2",
    "order": 4,
    "chapter": "u2-c2",
    "title": "嵌套条件",
    "mission": "追踪报名资格审核",
    "duration": "12 分钟",
    "icon": "↳",
    "goal": "逐层判断，外层不成立时跳过整个内层。",
    "intro": "年龄达到 12 岁才检查是否完成准备。分别观察 TOO_YOUNG、PREPARE、ENTER 三条路径。",
    "keywords": [
      "嵌套",
      "外层",
      "内层"
    ],
    "summary": "先过外层，再看内层。没有花括号时，else 与最近的尚未配对的 if 匹配；初学时使用花括号更清楚。",
    "next": "下一节比较离散选择与简单二选一表达式。",
    "criteria": "运行三种输出路径",
    "notes": [
      {
        "title": "把路径逐层写出来",
        "text": "例如 age=10，即使 prepared=true，外层不成立也不会检查内层。代码块能明确 else 属于哪个 if，不能只凭缩进判断。"
      }
    ],
    "lab": {
      "kind": "nested",
      "label": "age（0～100 的整数）",
      "min": 0,
      "max": 100,
      "value": 12,
      "code": "int age; bool prepared;\ncin >> age >> prepared; // prepared 输入 0 或 1\nif (age >= 12) {\n    if (prepared) {\n        cout << \"ENTER\";\n    } else {\n        cout << \"PREPARE\";\n    }\n} else {\n    cout << \"TOO_YOUNG\";\n}"
    }
  },
  {
    "id": "u2-l5",
    "unit": "u2",
    "order": 5,
    "chapter": "u2-c2",
    "title": "switch 与三目运算",
    "mission": "追踪菜单选择与较大值",
    "duration": "14 分钟",
    "icon": "?:",
    "goal": "理解 case、break、default 与 条件 ? 值1 : 值2 的用途。",
    "intro": "switch 适合整型或字符的离散值匹配。试试去掉 break，再用三目运算挑选两个整数中的较大值。",
    "keywords": [
      "switch",
      "case",
      "break",
      "?:"
    ],
    "summary": "break 退出 switch；省略它会继续执行后面的语句。default 处理未匹配的情况。三目运算根据条件选择一个表达式的值。",
    "next": "最后一节为分类程序设计测试。",
    "criteria": "比较输入 1 时有无 break，运行 default 路径，并完成三目比较",
    "notes": [
      {
        "title": "选择适合的写法",
        "text": "case 标签是整型常量表达式，例如 case 1 或 case 'A'。不能直接用 switch 判断小数或区间。三目写法为 condition ? valueWhenTrue : valueWhenFalse；复杂分支优先使用 if-else。"
      }
    ],
    "lab": {
      "kind": "switch",
      "label": "choice（0～3 的整数）",
      "min": 0,
      "max": 3,
      "value": 1
    }
  },
  {
    "id": "u2-l6",
    "unit": "u2",
    "order": 6,
    "chapter": "u2-c2",
    "title": "综合挑战与边界测试",
    "mission": "为成绩分类器设计测试",
    "duration": "15 分钟",
    "icon": "✓",
    "goal": "选择正常值和边界值，并用路径解释预期输出。",
    "intro": "合法分数是 0～100 的整数。90 分起为 A，60 分起为 B，其余为 C；非法分数输出 INVALID。先输入测试，再预测输出。",
    "keywords": [
      "正常输入",
      "边界",
      "覆盖"
    ],
    "summary": "测试要覆盖每条路径，边界两侧与边界本身都要考虑。样例通过仅说明这些样例通过，不能证明任意程序都正确。",
    "next": "完成第二章专项练习后，进入单元二综合挑战与报告。",
    "criteria": "正确预测并运行 -1、0、59、60、89、90、100、101 和一个区间内部值",
    "notes": [
      {
        "title": "先写预期，再运行",
        "text": "门槛 60 的相邻值是 59、60，门槛 90 是 89、90；输入范围还要检查 -1、0、100、101。50、75、95 是各等级的正常内部值。测试程序的同时，也要检查预期答案是否符合题意。"
      }
    ],
    "lab": {
      "kind": "boundary",
      "label": "测试分数（-10～110 的整数）",
      "min": -10,
      "max": 110,
      "value": 60,
      "code": "int score;\ncin >> score;\nif (score < 0 || score > 100) cout << \"INVALID\";\nelse if (score >= 90) cout << \"A\";\nelse if (score >= 60) cout << \"B\";\nelse cout << \"C\";"
    }
  }
];

window.CSP_UNITS = [
  {
    "id": "u1",
    "number": "01",
    "title": "程序基础与数据表达",
    "description": "读懂数据从哪里来、保存在哪里、怎样计算并输出；在 GESP 基础上准备 CSP-J。",
    "prerequisite": "能使用键盘、打开文件；建议先了解编译运行",
    "chapters": [
      {
        "id": "u1-c1",
        "title": "程序、变量与数据类型"
      },
      {
        "id": "u1-c2",
        "title": "运算、转换与逻辑表达式"
      }
    ],
    "challenge": "智能温室启动程序"
  },
  {
    "id": "u2",
    "number": "02",
    "title": "条件分支与程序决策",
    "description": "从条件真假出发，追踪分支路径，解释输出，并为分类程序设计边界测试。",
    "prerequisite": "单元一：变量、关系运算与逻辑表达式",
    "chapters": [
      {
        "id": "u2-c1",
        "title": "条件、二选一与多分支"
      },
      {
        "id": "u2-c2",
        "title": "嵌套、离散选择与边界测试"
      }
    ],
    "challenge": "成绩分类器与测试设计"
  }
];

window.CSP_ROADMAP = [
  [
    "学前",
    "学前准备",
    "计算机、操作系统、网络、文件、位与字节、编译运行",
    "无",
    "准备"
  ],
  [
    "01",
    "程序基础与数据表达",
    "程序结构、输入输出、变量与常量、类型、运算与表达式",
    "学前准备",
    "基础"
  ],
  [
    "02",
    "条件分支与程序决策",
    "if、else if、嵌套、switch、三目与边界测试",
    "01",
    "基础"
  ],
  [
    "03",
    "循环与重复计算",
    "for、while、do-while、循环控制与多层循环",
    "02",
    "基础"
  ],
  [
    "04",
    "数组与批量数据",
    "一维数组、下标、批量统计与多维数组",
    "03",
    "基础"
  ],
  [
    "05",
    "字符与字符串",
    "字符数组、string、查找与逐字符处理",
    "04",
    "基础"
  ],
  [
    "06",
    "函数与程序组织",
    "作用域、参数、递归；分层学习结构体、联合体、指针、引用",
    "04、05",
    "基础"
  ],
  [
    "07",
    "数学与数据表示",
    "进制、位运算、取整、模运算、数论、埃氏筛与线性筛、计数、基础代数几何",
    "03、04；按先修穿插",
    "算法"
  ],
  [
    "08",
    "枚举、模拟与高精度",
    "枚举候选、按规则模拟、高精度四则运算",
    "04～07",
    "算法"
  ],
  [
    "09",
    "排序与二分",
    "冒泡、选择、插入、计数排序；二分查找",
    "04、06、08",
    "算法"
  ],
  [
    "10",
    "基础算法策略",
    "递推、贪心、前缀和、差分、倍增",
    "07～09",
    "算法"
  ],
  [
    "11",
    "线性数据结构与 STL",
    "链表、栈、队列、vector、list 与常用算法",
    "04～06",
    "结构与搜索"
  ],
  [
    "12",
    "树、图与搜索",
    "树、二叉树、哈夫曼树、二叉搜索树、图的存储、DFS/BFS、Flood Fill",
    "06、11",
    "结构与搜索"
  ],
  [
    "13",
    "动态规划入门",
    "一维状态、简单背包、简单区间 DP",
    "08～10",
    "综合"
  ],
  [
    "14",
    "综合训练与复盘",
    "第一轮程序阅读与完善程序；第二轮解题设计、实现与测试",
    "01～13",
    "综合"
  ]
];
