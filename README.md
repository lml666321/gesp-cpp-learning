# GESP C++ 二级互动学习

面向 GESP C++ 二级的互动学习网页，当前提供「单元一｜程序基础与数据表达」。这是独立制作的教学 Demo。

- 在线学习：https://lml666321.github.io/gesp-cpp-learning/
- 项目仓库：https://github.com/lml666321/gesp-cpp-learning

## 学习内容

- 第一章：程序如何工作、输入与输出、变量与赋值、基本数据类型。
- 第二章：算术与关系运算、数据类型转换、字符与 ASCII、逻辑表达式。
- 每个知识点包含「认识与实验 → 自己试 → 真题挑战 → 本节小结」。
- 16 道课内题、14 道章节练习、智能温室综合挑战及学习报告。

综合挑战通过前端规则检查模拟评测，不提供真实的 C++ 编译或运行服务。

## 本地使用

直接双击 `GESP_Unit1_Interactive_Demo/index.html`，无需安装依赖或联网加载资源。

学习记录保存在当前浏览器的 `localStorage`。不同设备、浏览器以及本地文件与线上网址之间不会自动同步；清理网站数据会移除记录。可以在学习报告中重置本机记录。

## 项目结构

```text
GESP_Unit1_Interactive_Demo/
├── index.html          # 页面骨架与本地资源加载
├── styles.css          # 页面和响应式样式
├── app.js              # 页面状态、互动、反馈和进度保存
└── data/
    ├── lessons.js      # 知识点内容
    └── questions.js    # 课内题与章节练习
.github/workflows/pages.yml  # GitHub Pages 自动发布
CODE_QUEST_GESP_CPP_Demo_升级版.html  # 历史版本，仅供对比
```

## 发布与更新

GitHub 仓库使用 `main` 分支，已启用 GitHub Actions 发布。复制项目到其他仓库时，需要在仓库 Settings → Pages 中将 Source 设为 GitHub Actions。

推送新版网页或部署配置的修改后，Actions 会检查三个 JavaScript 文件的语法，只打包上述五个网页文件并发布到 GitHub Pages。也可以在 Actions 中手动运行 `Deploy GESP learning site`。

网页从发布地址的根路径打开，原有源码目录结构保持不变。历史版本、项目说明和课程原始资料不进入站点发布包。

维护时先检查 JavaScript 语法和主要页面跳转，再提交明确选择的文件。需要恢复旧版时，对相应修改创建还原提交并推送，自动发布会随之更新。

## 文件与内容来源

当前公开仓库仅纳入已选择的网站代码、历史 HTML 和维护配置。项目根目录中的 PDF、Word、海报、ZIP 以及机器文件保留在本地；`.gitignore` 使用允许清单，新增资源需明确纳入后才能提交。

题目中的来源标签记录其参考考试或教学变式来源。公开源码不代表第三方试题、图像或文档获得额外转载授权。今后引入外部内容时，应逐项核对来源、许可证和适用范围，并保留必要的署名及声明。
