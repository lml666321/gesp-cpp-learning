window.GESP_QUESTIONS = {
  lessons: {
    1: [
      { prompt: '机器人通过摄像头观察周围环境。哪一项不能作为输入设备？', options: ['摄像头', '重力传感器', '遥控器', '预装的控制程序'], answer: 3, explain: '控制程序负责处理和控制，不负责从外界采集信息。', source: '2026 年 3 月二级真题变式' },
      { prompt: '程序要先接收温度，再把温度加 1，最后输出。正确顺序是？', options: ['输出 → 输入 → 处理', '输入 → 处理 → 输出', '处理 → 输出 → 输入', '输入 → 输出 → 处理'], answer: 1, explain: '程序从上到下执行，要先得到数据，再处理并输出。' },
    ],
    2: [
      { prompt: '要把键盘输入的数据保存到变量 age，应使用哪一行？', options: ['cout >> age;', 'cin >> age;', 'cin << age;', 'age >> cin;'], answer: 1, explain: 'cin 用于输入，输入运算符写作 >>。' },
      { prompt: '输入为 12 6，代码先输出 grade 再输出 age，结果是？', options: ['12 6', '6 12', 'age grade', 'grade age'], answer: 1, explain: '第一个数进入 age，第二个数进入 grade；输出顺序与变量出现顺序一致。', source: '2025 年 9 月二级真题知识点' },
    ],
    3: [
      { prompt: '执行 int a=3; a=a+2; a=a*2; 后，a 的值是？', options: ['6', '8', '10', '12'], answer: 2, explain: 'a 先从 3 更新为 5，再使用新值计算 5×2=10。' },
      { prompt: '下面哪个不能作为 C++ 变量名？', options: ['score2', 'student_score', '_score', 'for'], answer: 3, explain: 'for 是 C++ 关键字，不能作为变量名。', source: '2025 年 12 月二级真题变式' },
    ],
    4: [
      { prompt: "保存单个字符 'A'，最合适的数据类型是？", options: ['int', 'double', 'char', 'bool'], answer: 2, explain: 'char 用于保存单个字符，字符常量使用单引号。' },
      { prompt: 'bool passed=true; cout << (10+passed); 通常输出什么？', options: ['报错', '10', '11', 'true'], answer: 2, explain: 'true 参与整数运算时可以转换为 1，所以结果是 11。', source: '2026 年 3 月二级判断题变式' },
    ],
    5: [
      { prompt: 'C++ 整数表达式 13 / 5 的结果是？', options: ['2', '2.5', '3', '5'], answer: 0, explain: '两个操作数都是整数，整数除法只保留整数部分。' },
      { prompt: 'int n=527; 表达式 n/10%10 得到什么？', options: ['5', '2', '7', '52'], answer: 1, explain: '527/10 得到 52，再计算 52%10 得到十位数字 2。', source: '2025 年 9 月二级真题变式' },
    ],
    6: [
      { prompt: 'int(3.8) 的结果是？', options: ['3', '4', '3.8', '报错'], answer: 0, explain: '小数强制转换为 int 时会直接去掉小数部分，不是四舍五入。' },
      { prompt: 'int a=3; double b=3.5; cout << a+b; 输出什么？', options: ['3', '6', '6.5', '报错'], answer: 2, explain: '整数 3 参与浮点运算时转换为 3.0，结果为 6.5。', source: '2026 年 6 月二级真题变式' },
    ],
    7: [
      { prompt: "cout << int('A'); 的输出是？", options: ['A', '1', '65', '97'], answer: 2, explain: "大写字母 'A' 的 ASCII 编码是 65。" },
      { prompt: "cout << ('5'+4); 的输出是？", options: ['9', '54', '57', "'9'"], answer: 2, explain: "字符 '5' 使用 ASCII 编码 53 参与整数运算，53+4=57。", source: '2025 年 9 月二级判断题变式' },
    ],
    8: [
      { prompt: '“分数不低于 60，并且缺勤次数少于 3”应写成？', options: ['score>60 || absence<3', 'score>=60 && absence<3', 'score>=60 || absence<3', 'score<60 && absence>3'], answer: 1, explain: '“不低于”包含等于，对应 >=；“并且”对应 &&。' },
      { prompt: '哪个表达式与 !(x>5 && y<=10) 等价？', options: ['x<=5 && y>10', 'x>5 || y<=10', 'x<=5 || y>10', '!x>5 && !y<=10'], answer: 2, explain: '整体否定“两个条件同时成立”，等价于两个条件分别否定后使用 ||。', source: '2026 年 3 月二级真题' },
    ],
  },
  chapter1: [
    { prompt: '程序解决问题最常见的基本顺序是？', options: ['输出→输入→处理', '输入→处理→输出', '处理→输入→输出', '输入→输出→处理'], answer: 1, explain: '先获得数据，再处理数据，最后输出结果。' },
    { prompt: '下面哪一个属于输入设备？', options: ['显示器', '打印机', '温度传感器', '扬声器'], answer: 2, explain: '传感器把外界信息送入计算机。' },
    { prompt: '输入整数 n 应使用？', options: ['cout << n;', 'cin >> n;', 'cin << n;', 'cout >> n;'], answer: 1, explain: 'cin 与 >> 组合完成输入。' },
    { prompt: 'int n=5; n=n+3; n=n*2; 最终 n 是？', options: ['8', '10', '13', '16'], answer: 3, explain: '5+3=8，再用新值计算 8×2=16。' },
    { prompt: '下面哪个不能作为变量名？', options: ['score', 'score2', 'student_score', 'for'], answer: 3, explain: 'for 是关键字。' },
    { prompt: "保存 'A' 应选择？", options: ['int', 'double', 'char', 'bool'], answer: 2, explain: '单个字符使用 char。' },
  ],
  chapter2: [
    { prompt: '13/5 的结果是？', options: ['2', '2.5', '3', '5'], answer: 0, explain: '整数除法只保留整数部分。' },
    { prompt: '13%5 的结果是？', options: ['1', '2', '3', '5'], answer: 2, explain: '13 除以 5 余 3。' },
    { prompt: 'n=527，n/10%10 得到？', options: ['5', '2', '7', '52'], answer: 1, explain: '先去掉个位，再取得新个位。' },
    { prompt: 'score=60，score>=60 的结果是？', options: ['0', '1', '60', '报错'], answer: 1, explain: '条件成立，默认输出 true 为 1。' },
    { prompt: 'int(4.9) 的结果是？', options: ['4', '5', '4.9', '报错'], answer: 0, explain: '强制转换为 int 时去掉小数部分。' },
    { prompt: "int('A') 的结果是？", options: ['1', '26', '65', '97'], answer: 2, explain: "'A' 的 ASCII 编码是 65。" },
    { prompt: '“而且”对应哪个运算符？', options: ['||', '&&', '!', '%'], answer: 1, explain: '&& 表示左右条件同时成立。' },
    { prompt: '!(x>5 && y<=10) 等价于？', options: ['x<=5 || y>10', 'x<=5 && y>10', 'x>5 || y<=10', 'x>5 && y<=10'], answer: 0, explain: '分别否定两个条件，再把 && 变为 ||。' },
  ],
};
