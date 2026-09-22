(function () {
  'use strict';

  const app = document.querySelector('#app');
  const lessons = window.GESP_LESSONS || [];
  const questionBank = window.GESP_QUESTIONS || { lessons: {}, chapter1: [], chapter2: [] };
  const STORAGE_KEY = 'gesp-unit1-demo-v2';
  const lessonSteps = [
    ['learn', '认识与实验'],
    ['practice', '自己试'],
    ['exam', '真题挑战'],
    ['summary', '本节小结'],
  ];

  const defaultState = {
    completed: [],
    attempts: {},
    hints: {},
    chapterScores: {},
    challengePassed: 0,
    lastLesson: 1,
  };

  let state = loadState();
  let currentLessonId = 1;
  let currentLessonStep = 'learn';
  let variableStep = 0;
  let flowStep = 0;
  let selectedDataCard = null;
  let sortedData = {};
  let quizSession = null;

  function loadState() {
    try {
      return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    } catch (_) {
      return { ...defaultState };
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
    updateHeaderProgress();
  }

  function updateHeaderProgress() {
    const total = lessons.length + 3;
    const chapters = Number(state.chapterScores[1] !== undefined) + Number(state.chapterScores[2] !== undefined);
    const done = state.completed.length + chapters + Number(state.challengePassed === 4);
    const percent = Math.round((done / total) * 100);
    document.querySelector('#headerProgressBar').style.width = `${percent}%`;
    document.querySelector('#headerProgressText').textContent = `${percent}%`;
  }

  function setActiveNav(name) {
    document.querySelectorAll('.nav-link').forEach((item) => item.classList.toggle('active', item.dataset.nav === name));
  }

  function showToast(message) {
    const toast = document.querySelector('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2100);
  }

  function goTop() {
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function getNextLesson() {
    return lessons.find((lesson) => !state.completed.includes(lesson.id)) || lessons[lessons.length - 1];
  }

  function statusForLesson(id) {
    if (state.completed.includes(id)) return ['已完成', 'done'];
    if (state.attempts[id] || state.hints[id]) return ['学习中', 'learning'];
    return ['未开始', 'new'];
  }

  function renderHome() {
    const next = getNextLesson();
    setActiveNav('home');
    app.innerHTML = `
      <section class="page">
        <div class="hero-grid">
          <article class="hero-copy">
            <p class="eyebrow">GESP C++ 二级互动学习</p>
            <h1>从数据开始，读懂第一段 C++ 程序</h1>
            <p class="lead">沿着知识地图学习输入输出、变量、数据类型、运算、ASCII 和逻辑表达式。每个知识点都先演示，再练习，最后用真题检查。</p>
            <div class="hero-actions">
              <button class="btn btn-primary" type="button" data-action="unit">查看单元路线</button>
              <span class="plain-note">当前只开放单元一 · 进度保存在本机</span>
            </div>
          </article>
          <aside class="continue-card">
            <div>
              <p class="eyebrow">${state.completed.length ? '继续学习' : '当前学习'}</p>
              <h2>知识点 ${String(next.id).padStart(2, '0')}<br>${next.title}</h2>
              <p>${next.goal}</p>
            </div>
            <button class="btn btn-light" type="button" data-action="continue">${state.completed.length ? '继续上次进度' : '从第一节开始'} →</button>
          </aside>
        </div>

        <div class="section-head">
          <div><p class="eyebrow">Knowledge Map</p><h2>知识地图</h2><p>清楚知道正在学习什么，以及后面的知识怎样连接。</p></div>
        </div>
        <section class="surface map-surface">
          <article class="unit-card current">
            <span class="unit-number">01</span>
            <div><h3>程序基础与数据表达</h3><p>输入输出、变量、基本类型、运算、转换、ASCII 与逻辑表达式</p></div>
            <span class="status-pill">当前开放</span>
          </article>
          <div class="route-preview home-route">
            <button class="route-block" type="button" data-action="unit">
              <small>第一章</small><strong>程序和数据</strong><span>4 个知识点</span>
            </button>
            <span class="route-arrow" aria-hidden="true">→</span>
            <button class="route-block" type="button" data-action="unit">
              <small>第二章</small><strong>运算和表达式</strong><span>4 个知识点</span>
            </button>
            <span class="route-arrow" aria-hidden="true">→</span>
            <button class="route-block" type="button" data-action="challenge">
              <small>单元挑战</small><strong>智能温室程序</strong><span>4 个测试点</span>
            </button>
          </div>
          <div class="future-units">
            ${['条件分支与程序决策', '循环结构', '多层结构', '二级核心知识', '二级综合复习'].map((name, i) => `
              <div><span>0${i + 2}</span><strong>${name}</strong><small>暂未开放</small></div>`).join('')}
          </div>
        </section>
      </section>`;

    app.querySelectorAll('[data-action="unit"]').forEach((button) => button.addEventListener('click', renderUnit));
    app.querySelector('[data-action="continue"]').addEventListener('click', () => renderLesson(next.id, 'learn'));
    app.querySelector('[data-action="challenge"]').addEventListener('click', renderChallenge);
    goTop();
  }

  function renderUnit() {
    setActiveNav('unit');
    app.innerHTML = `
      <section class="page">
        <div class="unit-hero">
          <div>
            <p class="eyebrow">Unit 01 · 当前开放</p>
            <h1>程序基础与数据表达</h1>
            <p class="lead">学会看懂基础 C++ 程序中的数据从哪里来、保存在哪里、经过什么运算，最后怎样得到结果。</p>
          </div>
          <div class="unit-facts"><div><strong>8</strong><span>知识点</span></div><div><strong>2</strong><span>章节练习</span></div><div><strong>1</strong><span>综合挑战</span></div></div>
        </div>
        ${renderChapter(1, '第一章', '程序、变量与数据类型')}
        ${renderChapter(2, '第二章', '运算、转换与逻辑表达式')}
        <section class="challenge-banner">
          <div><p class="eyebrow">Unit Challenge</p><h2>完成智能温室启动程序</h2><p>连接本单元的变量、类型、输入输出、关系运算和逻辑表达式。</p></div>
          <button class="btn btn-light" type="button" data-open-challenge>进入综合挑战 →</button>
        </section>
        <div class="unit-footer-actions">
          <button class="btn btn-secondary" type="button" data-open-report>查看学习报告</button>
          <button class="btn btn-ghost" type="button" data-back-home>返回知识地图</button>
        </div>
      </section>`;

    app.querySelectorAll('[data-lesson]').forEach((button) => button.addEventListener('click', () => renderLesson(Number(button.dataset.lesson), 'learn')));
    app.querySelectorAll('[data-quiz]').forEach((button) => button.addEventListener('click', () => renderChapterQuiz(Number(button.dataset.quiz))));
    app.querySelector('[data-open-challenge]').addEventListener('click', renderChallenge);
    app.querySelector('[data-open-report]').addEventListener('click', renderReport);
    app.querySelector('[data-back-home]').addEventListener('click', renderHome);
    goTop();
  }

  function renderChapter(number, kicker, title) {
    const chapterLessons = lessons.filter((lesson) => lesson.chapter === number);
    const score = state.chapterScores[number];
    return `
      <section class="chapter-section">
        <div class="chapter-heading"><div><p class="eyebrow">${kicker}</p><h2>${title}</h2></div><span>${chapterLessons.filter((l) => state.completed.includes(l.id)).length}/${chapterLessons.length} 个知识点完成</span></div>
        <div class="lesson-grid">
          ${chapterLessons.map((lesson) => {
            const status = statusForLesson(lesson.id);
            return `<button class="lesson-card ${status[1]}" type="button" data-lesson="${lesson.id}">
              <span class="lesson-index">${String(lesson.id).padStart(2, '0')}</span>
              <span class="lesson-icon">${lesson.icon}</span>
              <span class="lesson-copy"><small>${lesson.mission}</small><strong>${lesson.title}</strong><em>${lesson.goal}</em></span>
              <span class="lesson-state">${status[0]}</span>
            </button>`;
          }).join('')}
        </div>
        <button class="chapter-quiz-card" type="button" data-quiz="${number}">
          <span>章节练习</span><strong>${number === 1 ? '6' : '8'} 道专项题</strong><small>${score === undefined ? '完成本章后检查掌握情况' : `上次答对 ${score} 题`}</small><b>开始练习 →</b>
        </button>
      </section>`;
  }

  function renderLesson(id, step) {
    currentLessonId = id;
    currentLessonStep = step;
    state.lastLesson = id;
    saveState();
    const lesson = lessons.find((item) => item.id === id);
    const index = lessonSteps.findIndex(([key]) => key === step);
    setActiveNav('unit');
    app.innerHTML = `
      <section class="lesson-shell">
        <aside class="lesson-sidebar">
          <button class="back-link" type="button" data-back-unit>← 返回单元一</button>
          <div class="sidebar-number">${String(lesson.id).padStart(2, '0')}</div>
          <p class="eyebrow">${lesson.mission}</p>
          <h2>${lesson.title}</h2>
          <p class="sidebar-goal">${lesson.goal}</p>
          <div class="keyword-list">${lesson.keywords.map((word) => `<span>${word}</span>`).join('')}</div>
          <ol class="step-list">
            ${lessonSteps.map(([key, label], i) => `<li><button class="${key === step ? 'active' : ''} ${i < index ? 'visited' : ''}" type="button" data-step="${key}"><span>${i + 1}</span>${label}</button></li>`).join('')}
          </ol>
        </aside>
        <main class="lesson-main">
          <header class="lesson-topline">
            <span>单元一 · ${lesson.chapter === 1 ? '第一章' : '第二章'}</span>
            <span>知识点 ${lesson.id}/8 · ${lesson.duration}</span>
          </header>
          <div id="lessonContent">${renderLessonStep(lesson, step)}</div>
        </main>
      </section>`;

    app.querySelector('[data-back-unit]').addEventListener('click', renderUnit);
    app.querySelectorAll('[data-step]').forEach((button) => button.addEventListener('click', () => renderLesson(id, button.dataset.step)));
    bindLessonStep(lesson, step);
    goTop();
  }

  function renderLessonStep(lesson, step) {
    if (step === 'learn') return `
      <section class="lesson-stage">
        <div class="stage-heading"><div><p class="eyebrow">认识与实验</p><h1>${lesson.mission}</h1><p class="lead">${lesson.intro}</p></div><div class="goal-card"><small>本节目标</small><strong>${lesson.goal}</strong></div></div>
        ${renderInteractive(lesson.id)}
        <div class="lesson-actions"><button class="btn btn-primary" type="button" data-next-step="practice">我理解了，自己试试 →</button></div>
      </section>`;
    if (step === 'practice') return renderQuestionStep(lesson, 0, '自己试', '先独立判断，再查看针对你的答案给出的解释。');
    if (step === 'exam') return renderQuestionStep(lesson, 1, '真题挑战', '把刚学到的方法用到接近 GESP 考试表达的题目中。');
    const completed = state.completed.includes(lesson.id);
    return `
      <section class="lesson-stage summary-stage">
        <div class="summary-check">${completed ? '✓' : '…'}</div>
        <p class="eyebrow">本节小结</p>
        <h1>${completed ? '这个知识点已经点亮' : '还差一次真题挑战'}</h1>
        <p class="summary-text">${lesson.summary}</p>
        <div class="takeaway"><small>带走一句话</small><strong>${lesson.summary}</strong></div>
        <p class="next-copy">${lesson.next}</p>
        <div class="lesson-actions center">
          ${completed ? `<button class="btn btn-primary" type="button" data-next-lesson>${lesson.id < 8 ? '进入下一个知识点 →' : '返回单元路线 →'}</button>` : '<button class="btn btn-primary" type="button" data-next-step="exam">完成真题挑战 →</button>'}
          <button class="btn btn-ghost" type="button" data-back-unit>返回单元一</button>
        </div>
      </section>`;
  }

  function renderQuestionStep(lesson, questionIndex, title, description) {
    const question = questionBank.lessons[lesson.id][questionIndex];
    return `
      <section class="lesson-stage question-stage">
        <p class="eyebrow">${title}</p>
        <h1>${description}</h1>
        ${question.source ? `<span class="source-tag">${question.source}</span>` : ''}
        <article class="question-card">
          <div class="question-number">${questionIndex === 0 ? '练习' : '真题'} · 单选题</div>
          <h2>${escapeHtml(question.prompt)}</h2>
          <div class="answer-list">
            ${question.options.map((option, i) => `<button type="button" data-answer="${i}"><span>${String.fromCharCode(65 + i)}</span>${escapeHtml(option)}</button>`).join('')}
          </div>
          <div class="answer-feedback" id="answerFeedback" aria-live="polite">请选择一个答案。</div>
        </article>
        <div class="question-tools"><button class="text-button" type="button" data-hint>查看提示</button><span id="hintText"></span></div>
        <div class="lesson-actions"><button class="btn btn-primary" type="button" id="questionContinue" disabled>${questionIndex === 0 ? '进入真题挑战 →' : '完成本节 →'}</button></div>
      </section>`;
  }

  function bindLessonStep(lesson, step) {
    app.querySelectorAll('[data-next-step]').forEach((button) => button.addEventListener('click', () => renderLesson(lesson.id, button.dataset.nextStep)));
    app.querySelectorAll('[data-back-unit]').forEach((button) => button.addEventListener('click', renderUnit));
    const nextLesson = app.querySelector('[data-next-lesson]');
    if (nextLesson) nextLesson.addEventListener('click', () => lesson.id < 8 ? renderLesson(lesson.id + 1, 'learn') : renderUnit());
    if (step === 'learn') bindInteractive(lesson.id);
    if (step === 'practice' || step === 'exam') bindQuestion(lesson, step === 'practice' ? 0 : 1);
  }

  function bindQuestion(lesson, questionIndex) {
    const question = questionBank.lessons[lesson.id][questionIndex];
    const feedback = app.querySelector('#answerFeedback');
    const continueButton = app.querySelector('#questionContinue');
    let solved = false;
    app.querySelectorAll('[data-answer]').forEach((button) => button.addEventListener('click', () => {
      if (solved) return;
      const selected = Number(button.dataset.answer);
      state.attempts[lesson.id] = (state.attempts[lesson.id] || 0) + 1;
      app.querySelectorAll('[data-answer]').forEach((item) => item.classList.remove('correct', 'wrong'));
      if (selected === question.answer) {
        solved = true;
        button.classList.add('correct');
        feedback.className = 'answer-feedback ok';
        feedback.innerHTML = `<strong>回答正确</strong>${escapeHtml(question.explain)}`;
        continueButton.disabled = false;
      } else {
        button.classList.add('wrong');
        feedback.className = 'answer-feedback bad';
        feedback.innerHTML = '<strong>再想一步</strong>先回到本节的核心规则，不要只凭选项外观判断。';
      }
      saveState();
    }));
    app.querySelector('[data-hint]').addEventListener('click', () => {
      state.hints[lesson.id] = (state.hints[lesson.id] || 0) + 1;
      app.querySelector('#hintText').textContent = `提示：${lesson.summary}`;
      saveState();
    });
    continueButton.addEventListener('click', () => {
      if (questionIndex === 0) renderLesson(lesson.id, 'exam');
      else {
        if (!state.completed.includes(lesson.id)) state.completed.push(lesson.id);
        saveState();
        renderLesson(lesson.id, 'summary');
      }
    });
  }

  function renderInteractive(id) {
    const renderers = {
      1: () => `<section class="lab-card"><div class="lab-title"><div><small>DATA FLOW LAB</small><h2>按顺序接通数据流</h2></div><span id="flowCount">0/3</span></div><div class="flow-lab"><button data-flow="input"><b>01</b><strong>温度传感器</strong><small>读取外界 28℃</small></button><i>→</i><button data-flow="process"><b>02</b><strong>中央控制器</strong><small>处理温度数据</small></button><i>→</i><button data-flow="output"><b>03</b><strong>显示屏</strong><small>显示处理结果</small></button></div><div class="lab-feedback" id="labFeedback">从数据最先出现的地方开始点击。</div></section>`,
      2: () => `<section class="lab-card console-lab"><div><p class="code-label">main.cpp</p><pre><code><span>int</span> age;
<b>cin</b> &gt;&gt; age;
<b>cout</b> &lt;&lt; age;</code></pre></div><div class="console-panel"><label>在这里输入年龄<input id="ioInput" type="number" value="12"></label><button class="btn btn-primary" id="ioRun" type="button">运行程序</button><div class="data-hop"><span>输入</span><strong id="ioVariable">—</strong><span>变量 age</span><strong id="ioOutput">—</strong><span>输出</span></div></div></section>`,
      3: () => `<section class="lab-card variable-lab"><div class="code-lines" id="variableCode"><button data-line="0">int score = 60;</button><button data-line="1">score = 80;</button><button data-line="2">score = score + 5;</button><button data-line="3">cout &lt;&lt; score;</button></div><div class="variable-box"><small>变量名称</small><b>score</b><strong id="variableValue">?</strong><span id="variableNote">点击“执行下一行”开始追踪</span></div><button class="btn btn-primary" id="variableNext" type="button">执行下一行</button><button class="btn btn-ghost" id="variableReset" type="button">重新开始</button></section>`,
      4: () => `<section class="lab-card"><div class="lab-title"><div><small>TYPE SORTER</small><h2>先选数据，再点击它的类型房间</h2></div><span id="sortCount">0/6</span></div><div class="data-cards">${[['12','int'],['3.5','double'],["'A'",'char'],['true','bool'],['0','int'],["'2'",'char']].map(([v,t],i)=>`<button type="button" data-card="${i}" data-type="${t}">${v}</button>`).join('')}</div><div class="type-bins">${[['int','整数'],['double','小数'],['char','单个字符'],['bool','真假']].map(([t,n])=>`<button type="button" data-bin="${t}"><strong>${t}</strong><small>${n}</small></button>`).join('')}</div><div class="lab-feedback" id="labFeedback">选择一张数据卡开始分类。</div></section>`,
      5: () => `<section class="lab-card operator-lab"><div class="operator-inputs"><label>第一个整数<input id="opA" type="number" value="13"></label><select id="operator" aria-label="选择运算符"><option>+</option><option>-</option><option>*</option><option selected>/</option><option>%</option><option>&gt;</option><option>&lt;</option><option>==</option><option>!=</option></select><label>第二个整数<input id="opB" type="number" value="5"></label><button class="btn btn-primary" id="opRun" type="button">计算</button></div><div class="operator-result"><small>表达式结果</small><strong id="opExpression">13 / 5</strong><b id="opResult">2</b><p id="opExplain">两个整数相除，只保留整数部分。</p></div></section>`,
      6: () => `<section class="lab-card conversion-lab"><div class="conversion-tabs"><button class="active" data-convert="mixed">整数 + 小数</button><button data-convert="cast">int(3.8)</button><button data-convert="order">转换顺序</button></div><div id="conversionStage"><div class="conversion-flow"><span>int 3</span><i>自动转换</i><span>double 3.0</span><i>+ 3.5</i><strong>6.5</strong></div><p>整数和小数一起运算时，整数会参与浮点运算。</p></div></section>`,
      7: () => `<section class="lab-card ascii-lab"><div class="identity-compare"><div><small>整数</small><strong>5</strong><span>数值就是 5</span></div><div><small>字符</small><strong>'5'</strong><span>ASCII 编码是 53</span></div></div><label class="ascii-slider">拖动查看连续字符<input id="asciiRange" type="range" min="48" max="122" value="65"></label><div class="ascii-readout"><span id="asciiChar">'A'</span><i>对应编码</i><strong id="asciiCode">65</strong></div><div class="ascii-anchors"><button data-ascii="32">空格 32</button><button data-ascii="48">'0' 48</button><button data-ascii="65">'A' 65</button><button data-ascii="97">'a' 97</button></div></section>`,
      8: () => `<section class="lab-card logic-lab"><div class="logic-rule"><small>中文规则</small><strong>温度低于 30，而且水箱中有水</strong></div><div class="logic-controls"><label>temperature<input id="logicTemp" type="number" value="28"></label><label>中文连接词<select id="logicOp"><option value="">请选择</option><option value="&&">而且（&&）</option><option value="||">或者（||）</option></select></label><label>water<input id="logicWater" type="number" value="10"></label><button class="btn btn-primary" id="logicRun" type="button">检查规则</button></div><div class="truth-grid"><div><small>左条件</small><strong id="truthLeft">28 &lt; 30 → TRUE</strong></div><div><small>右条件</small><strong id="truthRight">10 &gt; 0 → TRUE</strong></div><div><small>规则翻译</small><strong id="ruleCorrect">等待选择</strong></div><div><small>当前结果</small><strong id="truthFinal">—</strong></div></div><div class="lab-feedback" id="labFeedback">先选择与“而且”对应的逻辑运算符。</div></section>`,
    };
    return renderers[id]();
  }

  function bindInteractive(id) {
    const next = app.querySelector('[data-next-step]');
    if (id === 1) {
      flowStep = 0;
      const order = ['input', 'process', 'output'];
      app.querySelectorAll('[data-flow]').forEach((button) => button.addEventListener('click', () => {
        if (button.dataset.flow === order[flowStep]) {
          button.classList.add('active'); flowStep += 1;
          app.querySelector('#flowCount').textContent = `${flowStep}/3`;
          app.querySelector('#labFeedback').textContent = flowStep === 3 ? '连接完成：输入 → 处理 → 输出。' : '正确，继续沿着箭头找到下一步。';
          if (flowStep === 3) next.classList.add('ready');
        } else app.querySelector('#labFeedback').textContent = '再看箭头：数据应该从哪里开始流动？';
      }));
    }
    if (id === 2) app.querySelector('#ioRun').addEventListener('click', () => {
      const value = app.querySelector('#ioInput').value || '0';
      app.querySelector('#ioVariable').textContent = value;
      setTimeout(() => { app.querySelector('#ioOutput').textContent = value; }, 260);
      next.classList.add('ready');
    });
    if (id === 3) {
      variableStep = 0;
      const values = [60, 80, 85, 85];
      const notes = ['定义变量并放入初始值 60', '新值 80 覆盖旧值 60', '先计算 80+5，再把 85 放回 score', 'cout 读取 score，输出 85'];
      const run = () => {
        if (variableStep >= values.length) return;
        app.querySelectorAll('[data-line]').forEach((line, i) => line.classList.toggle('active', i === variableStep));
        app.querySelector('#variableValue').textContent = values[variableStep];
        app.querySelector('#variableNote').textContent = notes[variableStep];
        variableStep += 1;
        if (variableStep === values.length) { app.querySelector('#variableNext').textContent = '执行完成'; next.classList.add('ready'); }
      };
      app.querySelector('#variableNext').addEventListener('click', run);
      app.querySelector('#variableReset').addEventListener('click', () => renderLesson(id, 'learn'));
    }
    if (id === 4) {
      selectedDataCard = null; sortedData = {};
      app.querySelectorAll('[data-card]').forEach((card) => card.addEventListener('click', () => {
        if (sortedData[card.dataset.card]) return;
        app.querySelectorAll('[data-card]').forEach((item) => item.classList.remove('selected'));
        selectedDataCard = card; card.classList.add('selected');
        app.querySelector('#labFeedback').textContent = `已选择 ${card.textContent}，它属于哪种类型？`;
      }));
      app.querySelectorAll('[data-bin]').forEach((bin) => bin.addEventListener('click', () => {
        if (!selectedDataCard) { app.querySelector('#labFeedback').textContent = '请先选择一张数据卡。'; return; }
        if (bin.dataset.bin === selectedDataCard.dataset.type) {
          sortedData[selectedDataCard.dataset.card] = true;
          selectedDataCard.classList.remove('selected'); selectedDataCard.classList.add('sorted');
          selectedDataCard = null;
          const count = Object.keys(sortedData).length;
          app.querySelector('#sortCount').textContent = `${count}/6`;
          app.querySelector('#labFeedback').textContent = count === 6 ? '全部正确：不同数据要进入合适的类型房间。' : '分类正确，继续选择下一张卡。';
          if (count === 6) next.classList.add('ready');
        } else app.querySelector('#labFeedback').textContent = '类型不匹配。注意单引号、是否有小数点，以及真假状态。';
      }));
    }
    if (id === 5) {
      const calculate = () => {
        const a = Number(app.querySelector('#opA').value); const b = Number(app.querySelector('#opB').value); const op = app.querySelector('#operator').value;
        let result; let explain = '按从左到右的表达式进行计算。';
        if (op === '+') result = a + b; if (op === '-') result = a - b; if (op === '*') result = a * b;
        if (op === '/') { result = b === 0 ? '不能除以 0' : Math.trunc(a / b); explain = '两个整数相除，只保留整数部分。'; }
        if (op === '%') { result = b === 0 ? '不能除以 0' : a % b; explain = '% 得到整数除法的余数。'; }
        if (op === '>') result = a > b ? 'true' : 'false'; if (op === '<') result = a < b ? 'true' : 'false';
        if (op === '==') { result = a === b ? 'true' : 'false'; explain = '== 判断左右是否相等。'; }
        if (op === '!=') result = a !== b ? 'true' : 'false';
        app.querySelector('#opExpression').textContent = `${a} ${op} ${b}`; app.querySelector('#opResult').textContent = result; app.querySelector('#opExplain').textContent = explain; next.classList.add('ready');
      };
      app.querySelector('#opRun').addEventListener('click', calculate); app.querySelector('#operator').addEventListener('change', calculate);
    }
    if (id === 6) app.querySelectorAll('[data-convert]').forEach((button) => button.addEventListener('click', () => {
      app.querySelectorAll('[data-convert]').forEach((item) => item.classList.toggle('active', item === button));
      const stages = {
        mixed: '<div class="conversion-flow"><span>int 3</span><i>自动转换</i><span>double 3.0</span><i>+ 3.5</i><strong>6.5</strong></div><p>整数和小数一起运算时，整数会参与浮点运算。</p>',
        cast: '<div class="conversion-flow"><span>double 3.8</span><i>int()</i><strong>int 3</strong></div><p>强制转换为 int 会直接去掉小数部分，不是四舍五入。</p>',
        order: '<div class="compare-result"><div><code>int(3.9)+int(3.9)</code><strong>6</strong></div><div><code>int(3.9+3.9)</code><strong>7</strong></div></div><p>先转换还是先计算，结果可能不同。</p>',
      };
      app.querySelector('#conversionStage').innerHTML = stages[button.dataset.convert]; next.classList.add('ready');
    }));
    if (id === 7) {
      const update = (code) => { app.querySelector('#asciiRange').value = code; app.querySelector('#asciiChar').textContent = code === 32 ? '空格' : `'${String.fromCharCode(code)}'`; app.querySelector('#asciiCode').textContent = code; next.classList.add('ready'); };
      app.querySelector('#asciiRange').addEventListener('input', (event) => update(Number(event.target.value)));
      app.querySelectorAll('[data-ascii]').forEach((button) => button.addEventListener('click', () => update(Number(button.dataset.ascii))));
    }
    if (id === 8) {
      const updateTruth = () => {
        const temp = Number(app.querySelector('#logicTemp').value); const water = Number(app.querySelector('#logicWater').value); const op = app.querySelector('#logicOp').value;
        const left = temp < 30; const right = water > 0;
        app.querySelector('#truthLeft').textContent = `${temp} < 30 → ${left ? 'TRUE' : 'FALSE'}`;
        app.querySelector('#truthRight').textContent = `${water} > 0 → ${right ? 'TRUE' : 'FALSE'}`;
        app.querySelector('#ruleCorrect').textContent = op ? (op === '&&' ? '✓ 正确' : '✗ 应使用 &&') : '等待选择';
        app.querySelector('#truthFinal').textContent = op ? ((op === '&&' ? left && right : left || right) ? 'TRUE' : 'FALSE') : '—';
        if (op === '&&') { app.querySelector('#labFeedback').textContent = '规则翻译正确。注意：改变数据后，当前结果仍然可能是 FALSE。'; next.classList.add('ready'); }
        else if (op) app.querySelector('#labFeedback').textContent = '“而且”要求两个条件同时成立，对应 &&。';
      };
      app.querySelector('#logicRun').addEventListener('click', updateTruth); app.querySelector('#logicTemp').addEventListener('input', updateTruth); app.querySelector('#logicWater').addEventListener('input', updateTruth);
    }
  }

  function renderChapterQuiz(chapter) {
    const questions = questionBank[`chapter${chapter}`];
    quizSession = { chapter, index: 0, score: 0, answered: false };
    renderQuizQuestion(questions);
  }

  function renderQuizQuestion(questions) {
    const q = questions[quizSession.index];
    setActiveNav('unit');
    app.innerHTML = `<section class="quiz-page page"><button class="back-link" type="button" data-back-unit>← 返回单元一</button><div class="quiz-header"><div><p class="eyebrow">第${quizSession.chapter === 1 ? '一' : '二'}章专项练习</p><h1>第 ${quizSession.index + 1} 题 / ${questions.length}</h1></div><strong>当前答对 ${quizSession.score} 题</strong></div><div class="quiz-progress"><i style="width:${((quizSession.index + 1) / questions.length) * 100}%"></i></div><article class="question-card wide"><h2>${escapeHtml(q.prompt)}</h2><div class="answer-list">${q.options.map((option, i) => `<button type="button" data-quiz-answer="${i}"><span>${String.fromCharCode(65 + i)}</span>${escapeHtml(option)}</button>`).join('')}</div><div class="answer-feedback" id="quizFeedback">选择答案后会立即看到解析。</div></article><div class="lesson-actions"><button class="btn btn-primary" type="button" id="quizNext" disabled>${quizSession.index === questions.length - 1 ? '查看练习结果' : '下一题 →'}</button></div></section>`;
    app.querySelector('[data-back-unit]').addEventListener('click', renderUnit);
    app.querySelectorAll('[data-quiz-answer]').forEach((button) => button.addEventListener('click', () => {
      if (quizSession.answered) return;
      quizSession.answered = true; const selected = Number(button.dataset.quizAnswer); const right = selected === q.answer;
      if (right) { quizSession.score += 1; button.classList.add('correct'); } else { button.classList.add('wrong'); app.querySelector(`[data-quiz-answer="${q.answer}"]`).classList.add('correct'); }
      const feedback = app.querySelector('#quizFeedback'); feedback.className = `answer-feedback ${right ? 'ok' : 'bad'}`; feedback.innerHTML = `<strong>${right ? '回答正确' : '这一步需要复习'}</strong>${escapeHtml(q.explain)}`; app.querySelector('#quizNext').disabled = false;
    }));
    app.querySelector('#quizNext').addEventListener('click', () => {
      if (quizSession.index < questions.length - 1) { quizSession.index += 1; quizSession.answered = false; renderQuizQuestion(questions); }
      else { state.chapterScores[quizSession.chapter] = quizSession.score; saveState(); renderQuizResult(questions.length); }
    });
    goTop();
  }

  function renderQuizResult(total) {
    const solid = quizSession.score >= Math.ceil(total * .75);
    app.innerHTML = `<section class="page result-center"><div class="summary-check">${solid ? '✓' : '↻'}</div><p class="eyebrow">章节练习完成</p><h1>答对 ${quizSession.score} / ${total}</h1><p class="lead">${solid ? '本章基础比较扎实，可以继续后面的学习。' : '已经完成检测，建议先回到标记的知识点再练一次。'}</p><div class="lesson-actions center"><button class="btn btn-primary" type="button" data-back-unit>返回单元路线</button><button class="btn btn-ghost" type="button" data-retry>重新练习</button></div></section>`;
    app.querySelector('[data-back-unit]').addEventListener('click', renderUnit); app.querySelector('[data-retry]').addEventListener('click', () => renderChapterQuiz(quizSession.chapter));
  }

  function renderChallenge() {
    setActiveNav('unit');
    app.innerHTML = `<section class="page challenge-page"><button class="back-link" type="button" data-back-unit>← 返回单元一</button><div class="stage-heading"><div><p class="eyebrow">Unit Challenge</p><h1>完成智能温室启动程序</h1><p class="lead">温度低于 30、水量大于 0、运行模式为字符 'A'，三个条件同时满足时输出 START。</p></div><div class="goal-card"><small>完成标准</small><strong>补全类型与规则，通过 4 个测试点</strong></div></div><div class="challenge-layout"><article class="challenge-form"><h2>检查点 1 · 选择数据类型</h2>${typeSelect('temperature','temperature','double')}${typeSelect('water','water','int')}${typeSelect('mode','mode','char')}<h2>检查点 2 · 构造启动规则</h2><label class="field-row"><span>温度条件</span><select id="tempRule"><option value="">请选择</option><option value="lt">temperature &lt; 30</option><option value="le">temperature &lt;= 30</option></select></label><label class="field-row"><span>条件连接</span><select id="joinRule"><option value="">请选择</option><option value="and">三个条件使用 &amp;&amp;</option><option value="or">三个条件使用 ||</option></select></label><label class="field-row"><span>模式条件</span><select id="modeRule"><option value="">请选择</option><option value="char">mode == 'A'</option><option value="name">mode == A</option><option value="assign">mode = 'A'</option></select></label><button class="btn btn-primary full-button" type="button" id="submitChallenge">运行 4 个测试点</button></article><article class="code-preview"><div class="code-label">greenhouse.cpp</div><pre id="challengeCode"></pre><div class="test-results" id="testResults"><p>完成左侧检查点后运行测试。</p></div></article></div></section>`;
    const controls = app.querySelectorAll('select'); controls.forEach((control) => control.addEventListener('change', updateChallengeCode));
    app.querySelector('[data-back-unit]').addEventListener('click', renderUnit); app.querySelector('#submitChallenge').addEventListener('click', runChallenge); updateChallengeCode(); goTop();
  }

  function typeSelect(id, name, correct) {
    return `<label class="field-row"><span>${name}</span><select id="${id}Type" data-correct="${correct}"><option value="">选择类型</option><option>int</option><option>double</option><option>char</option><option>bool</option></select></label>`;
  }

  function selected(id, fallback) { const el = app.querySelector(`#${id}`); return el && el.value ? el.value : fallback; }

  function updateChallengeCode() {
    const tempType = selected('temperatureType', '_____'); const waterType = selected('waterType', '_____'); const modeType = selected('modeType', '_____');
    const tempRule = selected('tempRule', '') === 'lt' ? 'temperature < 30' : selected('tempRule', '') === 'le' ? 'temperature <= 30' : '________________';
    const join = selected('joinRule', '') === 'and' ? '&&' : selected('joinRule', '') === 'or' ? '||' : '__';
    const modeMap = { char: "mode == 'A'", name: 'mode == A', assign: "mode = 'A'" };
    const modeRule = modeMap[selected('modeRule', '')] || '____________';
    app.querySelector('#challengeCode').textContent = `${tempType} temperature;\n${waterType} water;\n${modeType} mode;\n\ncin >> temperature >> water >> mode;\n\nbool ready =\n  ${tempRule}\n  ${join} water > 0\n  ${join} ${modeRule};\n\nif (ready) cout << "START";\nelse cout << "WAIT";`;
  }

  function runChallenge() {
    const typesRight = selected('temperatureType','') === 'double' && selected('waterType','') === 'int' && selected('modeType','') === 'char';
    const tempRight = selected('tempRule','') === 'lt'; const joinRight = selected('joinRule','') === 'and'; const modeRight = selected('modeRule','') === 'char';
    const checks = [typesRight, tempRight, joinRight, modeRight];
    const passed = checks.filter(Boolean).length;
    state.challengePassed = passed; saveState();
    const testNames = ['数据类型', '温度边界', '同时成立', '字符比较'];
    app.querySelector('#testResults').innerHTML = testNames.map((name, i) => `<div class="test-row"><span>TEST ${String(i + 1).padStart(2, '0')}</span><em>${name}</em><strong class="${checks[i] ? 'pass' : 'fail'}">${checks[i] ? '✓ PASSED' : '✗ FAILED'}</strong></div>`).join('') + `<div class="challenge-feedback ${passed === 4 ? 'ok' : 'bad'}">${challengeFeedback(typesRight, tempRight, joinRight, modeRight)}</div>` + (passed === 4 ? '<button class="btn btn-light full-button" type="button" data-report>查看单元学习报告 →</button>' : '');
    const report = app.querySelector('[data-report]'); if (report) report.addEventListener('click', renderReport);
  }

  function challengeFeedback(typesRight, tempRight, joinRight, modeRight) {
    if (!typesRight) return '先检查数据身份：温度有小数、水量是整数、模式是单个字符。';
    if (!tempRight) return '题目说“低于 30”，不包含 30，应使用 < 而不是 <=。';
    if (!joinRight) return '三个条件必须同时成立，应使用 && 连接。';
    if (!modeRight) return "判断是否相等要用 ==，字符 A 还需要单引号。";
    return '4 个测试点全部通过。你已经把本单元的知识连接成一段完整程序。';
  }

  function renderReport() {
    const completed = lessons.filter((lesson) => state.completed.includes(lesson.id));
    const independent = completed.filter((lesson) => (state.hints[lesson.id] || 0) === 0).length;
    setActiveNav('unit');
    app.innerHTML = `<section class="page report-page"><button class="back-link" type="button" data-back-unit>← 返回单元一</button><div class="report-hero"><div><p class="eyebrow">Learning Report</p><h1>单元一学习报告</h1><p class="lead">报告只记录真实完成情况、答题尝试和提示使用，不生成虚构能力分数。</p></div><div class="report-count"><strong>${completed.length}/8</strong><span>知识点完成</span></div></div><div class="report-stats"><div><strong>${independent}</strong><span>未使用提示完成</span></div><div><strong>${Object.values(state.hints).reduce((a,b)=>a+b,0)}</strong><span>查看提示</span></div><div><strong>${state.chapterScores[1] ?? '—'}/6</strong><span>第一章练习</span></div><div><strong>${state.chapterScores[2] ?? '—'}/8</strong><span>第二章练习</span></div><div><strong>${state.challengePassed}/4</strong><span>综合测试</span></div></div><section class="surface report-list"><div class="report-list-head"><h2>知识点状态</h2><span>学习依据</span></div>${lessons.map((lesson) => { const done = state.completed.includes(lesson.id); const hints = state.hints[lesson.id] || 0; return `<div><span class="mini-index">${String(lesson.id).padStart(2,'0')}</span><strong>${lesson.title}</strong><em class="${done ? 'mastered' : 'pending'}">${done ? (hints ? '提示后完成' : '已完成') : '尚未完成'}</em><small>${done ? `作答 ${state.attempts[lesson.id] || 0} 次${hints ? `，使用 ${hints} 次提示` : '，独立完成'}` : '完成真题挑战后记录'}</small><button type="button" data-review="${lesson.id}">${done ? '复习' : '开始'}</button></div>`; }).join('')}</section><div class="report-advice"><p class="eyebrow">下一步建议</p><h2>${completed.length === 8 ? '单元知识已经全部学完' : `继续完成知识点 ${String(getNextLesson().id).padStart(2,'0')} · ${getNextLesson().title}`}</h2><p>${completed.length === 8 ? '可以重做章节练习，或再次挑战智能温室程序。' : getNextLesson().goal}</p></div><div class="unit-footer-actions"><button class="btn btn-secondary" type="button" data-back-unit>返回单元路线</button><button class="btn btn-ghost" type="button" data-reset-progress>重置本机学习记录</button></div></section>`;
    app.querySelectorAll('[data-back-unit]').forEach((button) => button.addEventListener('click', renderUnit));
    app.querySelectorAll('[data-review]').forEach((button) => button.addEventListener('click', () => renderLesson(Number(button.dataset.review),'learn')));
    app.querySelector('[data-reset-progress]').addEventListener('click', () => {
      if (!window.confirm('确定清除本机上的单元一学习记录吗？')) return;
      state = { ...defaultState, completed: [], attempts: {}, hints: {}, chapterScores: {} };
      saveState();
      renderHome();
      showToast('本机学习记录已重置');
    });
    goTop();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
  }

  document.querySelectorAll('[data-nav]').forEach((button) => button.addEventListener('click', () => button.dataset.nav === 'unit' ? renderUnit() : renderHome()));
  updateHeaderProgress();
  renderHome();
})();
