(function () {
  'use strict';
  const app = document.querySelector('#app');
  const lessons = window.GESP_LESSONS;
  const units = window.CSP_UNITS;
  const questionBank = window.GESP_QUESTIONS;
  const STORAGE_KEY = 'gesp-unit1-demo-v2';
  const lessonSteps = [['learn','认识与实验'],['practice','自己试'],['exam','应用挑战'],['summary','本节小结']];
  const blankUnit = () => ({ completed:[], evidence:{}, questions:{}, chapters:{}, challenge:{best:0,latest:null,draft:{}}, quiz:null });
  let storageError = '';
  let state = loadState();
  let currentUnitId = state.lastPosition?.unit || 'u1';
  if (!units.some(u=>u.id===currentUnitId)) currentUnitId='u1';
  let currentLessonId = 'u1-l1', currentLessonStep='learn';
  let variableStep=0, flowStep=0, selectedDataCard=null, sortedData={}, quizSession=null;
  let ioTimer;
  const unit = () => units.find(u=>u.id===currentUnitId);
  const progress = () => state.units[currentUnitId];
  const unitLessons = () => lessons.filter(l=>l.unit===currentUnitId);
  const lessonById = id => lessons.find(l=>l.id===id);
  function loadState() {
    let old={};
    try { old=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}') || {}; }
    catch (_) { storageError='无法读取本机记录；本次学习暂存在内存中。'; }
    if (old.schemaVersion===3 && old.units) {
      units.forEach(u=> {old.units[u.id]={...blankUnit(),...old.units[u.id]};});
      return old;
    }
    const migrated={...old,schemaVersion:3,units:{u1:blankUnit(),u2:blankUnit()},lastPosition:null};
    const p=migrated.units.u1;
    p.completed=(Array.isArray(old.completed)?old.completed:[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=8).map(n=>`u1-l${n}`);
    p.legacy={completed:[...p.completed],attempts:old.attempts||{},hints:old.hints||{},chapterScores:old.chapterScores||{},challengePassed:old.challengePassed||0};
    for (const c of [1,2]) if (Number.isFinite(old.chapterScores?.[c])) p.chapters[`u1-c${c}`]={legacy:true,score:old.chapterScores[c]};
    p.challenge.best=Math.min(4,Math.max(0,Number(old.challengePassed)||0));
    p.challenge.legacy=p.challenge.best>0;
    if (Number.isInteger(old.lastLesson)&&old.lastLesson>=1&&old.lastLesson<=8) migrated.lastPosition={type:'lesson',unit:'u1',id:`u1-l${old.lastLesson}`,step:'learn',legacy:true};
    return migrated;
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); storageError=''; }
    catch (_) { storageError='记录未能写入本机：存储不可用或空间不足。请保持当前页面。'; }
    updateHeaderProgress();
    let notice=document.querySelector('#storageNotice');
    if (storageError&&!notice) {notice=document.createElement('div');notice.id='storageNotice';notice.setAttribute('role','status');document.querySelector('.topbar').after(notice);}
    if (notice) {notice.textContent=storageError;notice.hidden=!storageError;}
  }
  function remember(position) { state.lastPosition={...position,unit:currentUnitId}; saveState(); }
  function evidence(id=currentLessonId) {
    const p=state.units[lessonById(id).unit];
    return p.evidence[id] || (p.evidence[id]={seen:[],lab:{},steps:{}});
  }
  function recordFor(q) { return progress().questions[q.id] || (progress().questions[q.id]={answers:[],hint:false,solution:false,solved:false}); }
  function markLab(key='done') { const e=evidence();e.lab[key]=true;saveState(); }
  function labDone(id) {
    const l=lessonById(id), lab=state.units[l.unit].evidence[id]?.lab||{};
    const required={1:['done'],2:['done'],3:['done'],4:['done'],5:['done'],6:['mixed','cast','order'],7:['done'],8:['done']};
    const u2={if:['true','false'],else:['PASS','RETRY'],order:['95-good','95-bad','59-good','60-good','90-good'],nested:['TOO_YOUNG','PREPARE','ENTER'],switch:['1-break','1-fall','default','ternary'],boundary:['-1','0','59','60','89','90','100','101','normal']};
    return (l.lab ? u2[l.lab.kind] : required[l.labId]).every(k=>lab[k]);
  }
  function lessonReady(id) { const l=lessonById(id);return labDone(id)&&questionBank.lessons[id].every(q=>state.units[l.unit].questions[q.id]?.solved); }
  function updateHeaderProgress() {
    const p=progress(), ls=unitLessons();
    const done=p.completed.length+Object.keys(p.chapters).length+Number(p.challenge.best===4);
    const percent=Math.round(done/(ls.length+unit().chapters.length+1)*100);
    document.querySelector('#headerProgressBar').style.width=`${percent}%`;
    document.querySelector('#headerProgressText').textContent=`${percent}%`;
    document.querySelector('.header-progress > span').textContent=`单元 ${unit().number} 进度`;
  }
  function setActiveNav(name) {document.querySelectorAll('.nav-link').forEach(x=>x.classList.toggle('active',x.dataset.nav===name));}
  function showToast(message) {const t=document.querySelector('#toast');t.textContent=message;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),2100);}
  function goTop() {clearTimeout(ioTimer);app.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});}
  function escapeHtml(v) {return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
  function codeBlock(code) {return `<div class="code-frame"><p class="code-caption">C++ 代码 · 长行可左右滚动</p><pre class="reading-code" tabindex="0" aria-label="C++ 代码，可横向滚动"><code>${code.split('\n').map(line=>`<span class="code-line">${escapeHtml(line)||' '}</span>`).join('')}</code></pre></div>`;}
  function questionBody(q) {return `<span class="source-tag">${escapeHtml(q.source)}</span><h2>${escapeHtml(q.prompt)}</h2>${q.code?codeBlock(q.code):''}${q.input?`<div class="sample"><strong>输入</strong><pre>${escapeHtml(q.input)}</pre></div>`:''}`;}
  function statusForLesson(id) {
    const p=state.units[lessonById(id).unit];
    if(p.completed.includes(id))return[p.legacy?.completed.includes(id)&&!p.evidence[id]?.steps.summary?'历史完成':'已完成','done'];
    return p.evidence[id] ? ['学习中','learning']:['未开始','new'];
  }
  function recommendation() {
    for(const u of units){
      const p=state.units[u.id];
      for(const c of u.chapters){
        for(const l of lessons.filter(l=>l.chapter===c.id)) if(!p.completed.includes(l.id)) return {type:'lesson',unit:u.id,id:l.id,step:'learn',label:l.title};
        if(!p.chapters[c.id])return {type:'quiz',unit:u.id,chapter:c.id,label:c.title+' · 专项练习'};
      }
      if(p.challenge.best<4)return {type:'challenge',unit:u.id,label:u.challenge};
    }
    return {type:'report',unit:'u2',label:'已完成全部开放内容，查看报告与复习'};
  }
  function openPosition(pos) {
    if(!pos)return renderLesson('u1-l1','learn');
    currentUnitId=units.some(u=>u.id===pos.unit)?pos.unit:'u1';
    if(pos.type==='lesson'&&lessonById(pos.id))return renderLesson(pos.id,lessonSteps.some(s=>s[0]===pos.step)?pos.step:'learn');
    if(pos.type==='quiz'&&questionBank.chapters[pos.chapter])return renderChapterQuiz(pos.chapter,true);
    if(pos.type==='challenge')return renderChallenge();
    if(pos.type==='report')return renderReport();
    return renderUnit();
  }
  function positionLabel(pos) {
    if(!pos)return '从第一节开始';
    if(pos.type==='lesson')return `${lessonById(pos.id)?.title||'课程'} · ${lessonSteps.find(s=>s[0]===pos.step)?.[1]||'认识与实验'}`;
    if(pos.type==='quiz')return '章节专项练习（恢复作答位置）';
    return pos.type==='challenge'?'单元综合挑战':pos.type==='report'?'单元学习报告':'单元概览';
  }
  function renderHome() {
    setActiveNav('home');const next=recommendation();
    app.innerHTML=`<section class="page"><div class="hero-grid"><article class="hero-copy"><p class="eyebrow">C++ 基础 · 算法思维 · 编程实践</p><h1>从读懂程序，到独立解决问题</h1><p class="lead">沿着学习路线掌握 C++、数据结构与基础算法，通过互动实验、程序阅读和解题练习逐步准备 CSP-J。</p><p class="plain-note">单元 01、02 已开放 · 学习记录保存在本机</p><div class="recommendation"><small>推荐下一步</small><strong>${next.label}</strong><button class="text-button" data-recommend>前往推荐任务 →</button></div></article><aside class="continue-card"><p class="eyebrow">继续上次位置</p><h2>${positionLabel(state.lastPosition)}</h2><p>${state.lastPosition?.legacy?'已保留旧版知识点位置；旧记录没有步骤信息，从认识与实验开始。':'当前目标：完成实验、两道课内题，再确认本节小结。允许预览其他步骤。'}</p><button class="btn btn-light" data-continue>继续学习 →</button></aside></div><div class="section-head"><div><p class="eyebrow">CSP-J 学习路线</p><h2>从基础到综合解题</h2><p>依据 2025 年 NOI 大纲 2.1 入门级编排；以下为教学路线，不是官方章节名称。数学按先修需要穿插。</p></div></div>${['准备','基础','算法','结构与搜索','综合'].map(stage=>`<section class="route-stage"><h3>${stage}</h3><div class="roadmap-grid">${window.CSP_ROADMAP.filter(r=>r[4]===stage).map(r=>{const u=units.find(u=>u.number===r[0]);return `<article class="unit-card ${u?'current':'planned'}"><span class="unit-number">${r[0]}</span><div><h3>${r[1]}</h3><p>${r[2]}</p><small>先修：${r[3]}</small>${u?`<button class="text-button" data-unit="${u.id}">进入单元 →</button>`:''}</div><span class="status-pill ${u?'':'muted'}">${u?'已开放':'规划中'}</span></article>`;}).join('')}</div></section>`).join('')}</section>`;
    app.querySelector('[data-continue]').onclick=()=>openPosition(state.lastPosition);
    app.querySelector('[data-recommend]').onclick=()=>openPosition(next);
    app.querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>{currentUnitId=b.dataset.unit;renderUnit();});goTop();
  }
  function renderUnit() {
    setActiveNav('unit');saveState();
    const u=unit();
    app.innerHTML=`<section class="page"><div class="unit-switch">${units.map(x=>`<button class="btn ${x.id===u.id?'btn-primary':'btn-secondary'}" data-unit="${x.id}">单元 ${x.number}</button>`).join('')}</div><div class="unit-hero"><div><p class="eyebrow">单元 ${u.number} · 已开放</p><h1>${u.title}</h1><p class="lead">${u.description}</p><p class="plain-note">先修：${u.prerequisite}</p></div><div class="unit-facts"><div><strong>${unitLessons().length}</strong><span>知识点</span></div><div><strong>2</strong><span>章节练习</span></div><div><strong>1</strong><span>综合挑战</span></div></div></div><p class="completion-note">完成标准：完成各节实验、答对两道课内题并确认小结；章节练习记录真实成绩；综合挑战需通过全部要求检查。历史记录保留并单独注明。</p>${u.chapters.map((c,i)=>renderChapter(c,i)).join('')}<section class="challenge-banner"><div><p class="eyebrow">综合挑战 · 前端模拟</p><h2>${u.challenge}</h2><p>当前历史最佳：${progress().challenge.best}/4 项要求检查。失败重做不会取消历史完成。</p></div><button class="btn btn-light" data-open-challenge>进入综合挑战 →</button></section><div class="unit-footer-actions"><button class="btn btn-secondary" data-open-report>查看学习报告</button><button class="btn btn-ghost" data-back-home>返回学习路线</button></div></section>`;
    app.querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>{currentUnitId=b.dataset.unit;renderUnit();});
    app.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>renderLesson(b.dataset.lesson,'learn'));
    app.querySelectorAll('[data-quiz]').forEach(b=>b.onclick=()=>renderChapterQuiz(b.dataset.quiz,true));
    app.querySelector('[data-open-challenge]').onclick=renderChallenge;app.querySelector('[data-open-report]').onclick=renderReport;app.querySelector('[data-back-home]').onclick=renderHome;goTop();
  }
  function renderChapter(c,i) {
    const ls=lessons.filter(l=>l.chapter===c.id),score=progress().chapters[c.id];
    return `<section class="chapter-section"><div class="chapter-heading"><div><p class="eyebrow">第 ${i+1} 章</p><h2>${c.title}</h2></div><span>${ls.filter(l=>progress().completed.includes(l.id)).length}/${ls.length} 节完成</span></div><div class="lesson-grid">${ls.map(l=>{const s=statusForLesson(l.id);return `<button class="lesson-card ${s[1]}" data-lesson="${l.id}"><span class="lesson-index">${String(l.order).padStart(2,'0')}</span><span class="lesson-icon">${escapeHtml(l.icon)}</span><span class="lesson-copy"><strong>${l.title}</strong><small>${l.mission}</small><em>${l.goal}</em></span><span class="lesson-state">${s[0]}</span></button>`;}).join('')}</div><button class="chapter-quiz-card" data-quiz="${c.id}"><span>章节练习</span><strong>${questionBank.chapters[c.id].length} 道专项题</strong><small>${score?`${score.legacy?'历史':'最近'}答对 ${score.score} 题`:'完成本章后检查学习情况'}</small><b>${progress().quiz?.chapter===c.id?'继续练习':'开始练习'} →</b></button></section>`;
  }
  function renderLesson(id,step) {
    const l=lessonById(id);if(!l)return renderHome();
    currentUnitId=l.unit;currentLessonId=id;currentLessonStep=step;
    const e=evidence();if(!e.seen.includes(step))e.seen.push(step);
    remember({type:'lesson',id,step});setActiveNav('unit');
    app.innerHTML=`<section class="lesson-shell"><aside class="lesson-sidebar"><button class="back-link" data-back-unit>← 返回单元 ${unit().number}</button><div class="sidebar-number">${String(l.order).padStart(2,'0')}</div><p class="eyebrow">${l.mission}</p><h2>${l.title}</h2><p class="sidebar-goal">${l.goal}</p><div class="keyword-list">${l.keywords.map(k=>`<span>${escapeHtml(k)}</span>`).join('')}</div><ol class="step-list">${lessonSteps.map(([key,label],i)=>`<li><button class="${key===step?'active':''} ${e.steps[key]?'visited':''}" ${key===step?'aria-current="step"':''} data-step="${key}"><span>${e.steps[key]?'✓':i+1}</span>${label}</button></li>`).join('')}</ol><p class="plain-note">✓ 表示已完成的步骤；可自由预览。</p></aside><div class="lesson-main"><header class="lesson-topline"><span>单元 ${unit().number} · 第 ${unit().chapters.findIndex(c=>c.id===l.chapter)+1} 章</span><span>第 ${l.order}/${unitLessons().length} 节 · ${l.duration}</span></header><div id="lessonContent">${renderLessonStep(l,step)}</div></div></section>`;
    app.querySelectorAll('[data-back-unit]').forEach(b=>b.onclick=renderUnit);app.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>renderLesson(id,b.dataset.step));bindLessonStep(l,step);goTop();
  }
  function nextAfter(l) {
    const ls=unitLessons(),next=ls[ls.indexOf(l)+1];
    if(!next||next.chapter!==l.chapter)return {type:'quiz',unit:l.unit,chapter:l.chapter,label:'进入本章专项练习 →'};
    return {type:'lesson',unit:l.unit,id:next.id,step:'learn',label:`下一节：${next.title} →`};
  }
  function missingSteps(l) {const p=progress();return [!labDone(l.id)?'实验':null,!p.questions[questionBank.lessons[l.id][0].id]?.solved?'自己试':null,!p.questions[questionBank.lessons[l.id][1].id]?.solved?'应用挑战':null].filter(Boolean);}
  function renderLessonStep(l,step) {
    if(step==='learn')return `<section class="lesson-stage"><div class="stage-heading"><div><p class="eyebrow">认识与实验 · ${l.mission}</p><h1>${l.title}</h1><p class="lead">${l.intro}</p></div><div class="goal-card"><small>本节目标</small><strong>${l.goal}</strong></div></div><div class="teaching-notes">${l.notes.map(n=>`<article><h3>${n.title}</h3><p>${escapeHtml(n.text)}</p>${n.code?codeBlock(n.code):''}</article>`).join('')}</div><p class="completion-note"><strong>当前任务：</strong>${l.criteria}。随后答对两题并确认小结。</p>${l.lab?renderBranchLab(l):renderInteractive(l.labId)}<p id="experimentStatus" class="plain-note" aria-live="polite">${labDone(l.id)?'已有实验完成记录，可复习或继续。':'完成上方实验后可继续；侧栏允许预览。'}</p><div class="lesson-actions"><button class="btn btn-primary ${labDone(l.id)?'ready':''}" data-next-step="practice" ${labDone(l.id)?'':'disabled'}>进入自己试 →</button></div></section>`;
    if(step==='practice'||step==='exam')return renderQuestionStep(l,step==='practice'?0:1);
    const done=progress().completed.includes(l.id),missing=missingSteps(l);
    return `<section class="lesson-stage summary-stage"><div class="summary-check">${done?'✓':'…'}</div><p class="eyebrow">本节小结</p><h1>${l.title}</h1><p class="summary-text">${l.summary}</p><div class="takeaway"><small>完成依据</small><strong>${done?statusForLesson(l.id)[0]:missing.length?`还需完成：${missing.join('、')}`:'实验和两题已完成，请确认读完小结。'}</strong>${progress().legacy?.completed.includes(l.id)?'<p>旧版历史完成已保留；不推断当时是否完成实验或各步骤。</p>':''}</div><p class="next-copy">${l.next}</p><div class="lesson-actions center">${!missing.length&&!evidence().steps.summary?'<button class="btn btn-primary" data-confirm-summary>确认小结，完成本节</button>':''}${missing.length&&!done?'<button class="btn btn-primary" data-fill-missing>补全学习步骤 →</button>':''}<button class="btn btn-secondary" data-next-lesson>${nextAfter(l).label}</button><button class="btn btn-ghost" data-back-unit>返回单元路线</button></div></section>`;
  }
  function bindLessonStep(l,step) {
    app.querySelectorAll('[data-next-step]').forEach(b=>b.onclick=()=>renderLesson(l.id,b.dataset.nextStep));
    const next=app.querySelector('[data-next-lesson]');if(next)next.onclick=()=>openPosition(nextAfter(l));
    const confirm=app.querySelector('[data-confirm-summary]');if(confirm)confirm.onclick=()=>{if(!lessonReady(l.id))return;evidence().steps.summary=true;if(!progress().completed.includes(l.id))progress().completed.push(l.id);saveState();renderLesson(l.id,'summary');};
    const fill=app.querySelector('[data-fill-missing]');if(fill)fill.onclick=()=>renderLesson(l.id,!labDone(l.id)?'learn':!progress().questions[questionBank.lessons[l.id][0].id]?.solved?'practice':'exam');
    if(step==='learn'){if(l.lab)bindBranchLab(l);else bindInteractive(l.labId);}
    if(step==='practice'||step==='exam')bindQuestion(l,step==='practice'?0:1);
  }
  function renderQuestionStep(l,index) {
    const q=questionBank.lessons[l.id][index],r=progress().questions[q.id];
    return `<section class="lesson-stage question-stage"><p class="eyebrow">${index?'应用挑战':'自己试'}</p><h1>${l.title}</h1><p class="question-description">先独立判断，再根据具体错因修正。代码片段默认位于 main 内，并已包含需要的头文件与名字空间。</p><article class="question-card">${questionBody(q)}<div class="answer-list">${q.options.map((o,i)=>`<button data-answer="${i}" ${r?.solved?'disabled':''}><span>${String.fromCharCode(65+i)}</span><code>${escapeHtml(o)}</code></button>`).join('')}</div><div class="answer-feedback ${r?.solved?'ok':''}" id="answerFeedback" aria-live="polite">${r?.solved?`已答对（${answerEvidence(r)}）。${escapeHtml(q.explain)}`:'请选择一个答案。'}</div></article><div class="question-tools"><button class="text-button" data-hint ${r?.hint?'disabled':''}>${r?.hint?'已查看提示':'查看提示'}</button><button class="text-button" data-solution>查看完整解析</button><span id="hintText">${r?.hint?escapeHtml(q.hint):''}</span></div><div class="lesson-actions"><button class="btn btn-primary" id="questionContinue" ${r?.solved?'':'disabled'}>${index?'前往本节小结':'进入应用挑战'} →</button></div></section>`;
  }
  function answerEvidence(r) {
    if(!r?.solved)return r?.answers.length?`已尝试 ${r.answers.length} 次，尚未答对`:'未作答';
    const s=r.firstSolved;
    if(s.solution)return '查看解析后答对';if(s.hint)return '提示后答对';if(s.attempt>1)return '重试后答对';return '首次答对（未查看提示或解析）';
  }
  function bindQuestion(l,index) {
    const q=questionBank.lessons[l.id][index],r=recordFor(q),feedback=app.querySelector('#answerFeedback'),next=app.querySelector('#questionContinue');
    app.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
      if(r.solved)return;const selected=Number(b.dataset.answer),right=selected===q.answer;
      r.answers.push({selected,right,at:Date.now(),hint:r.hint,solution:r.solution});
      app.querySelectorAll('[data-answer]').forEach(x=>x.classList.remove('wrong','correct'));b.classList.add(right?'correct':'wrong');
      feedback.className=`answer-feedback ${right?'ok':'bad'}`;feedback.textContent=right?`回答正确。${q.explain}`:`再想一步：${q.wrong[selected]} 提示：${q.hint}`;
      if(right){r.solved=true;r.firstSolved={attempt:r.answers.length,hint:r.hint,solution:r.solution};evidence().steps[index?'exam':'practice']=true;app.querySelectorAll('[data-answer]').forEach(x=>x.disabled=true);next.disabled=false;}
      saveState();
    });
    app.querySelector('[data-hint]').onclick=e=>{r.hint=true;e.currentTarget.disabled=true;e.currentTarget.textContent='已查看提示';app.querySelector('#hintText').textContent=q.hint;saveState();};
    app.querySelector('[data-solution]').onclick=()=>{r.solution=true;feedback.textContent=`完整解析：${q.explain}${r.solved?'':' 请仍选择一个答案，查看解析本身不算答对。'}`;saveState();};
    next.onclick=()=>renderLesson(l.id,index?'summary':'exam');
  }
  function refreshLabReady(valid=true) {
    const done=labDone(currentLessonId),next=app.querySelector('[data-next-step]');
    if(done)evidence().steps.learn=true;
    next.disabled=!done;next.classList.toggle('ready',done&&valid);
    app.querySelector('#experimentStatus').textContent=done?(valid?'实验完成记录已保存。可以继续或修改输入复习。':'当前输入需修正；历史实验完成记录仍保留。'):'请继续完成任务要求中的实验路径。';saveState();
  }
  function readInteger(selector,min,max,label) {
    const raw=app.querySelector(selector).value.trim();
    if(!raw)throw new Error(`${label}不能为空，请输入 ${min}～${max} 的整数。`);
    if(!Number.isFinite(Number(raw)))throw new Error(`${label}必须是有限整数，不能使用无穷大或非数字。`);
    if(!/^[+-]?\d+$/.test(raw))throw new Error(`${label}只接受整数；小数和科学计数写法不属于本实验输入格式。`);
    const n=Number(raw);if(!Number.isSafeInteger(n)||n<min||n>max)throw new Error(`${label}范围是 ${min}～${max}，当前数值超出范围。`);return n;
  }
  function renderInteractive(id) {
    const renderers = {
      1: () => `<section class="lab-card"><div class="lab-title"><div><small>DATA FLOW LAB</small><h2>按顺序接通数据流</h2></div><span id="flowCount">0/3</span></div><div class="flow-lab"><button data-flow="input"><b>01</b><strong>温度传感器</strong><small>读取外界 28℃</small></button><i>→</i><button data-flow="process"><b>02</b><strong>中央控制器</strong><small>处理温度数据</small></button><i>→</i><button data-flow="output"><b>03</b><strong>显示屏</strong><small>显示处理结果</small></button></div><div class="lab-feedback" id="labFeedback">从数据最先出现的地方开始点击。</div></section>`,
      2: () => `<section class="lab-card console-lab"><div><p class="code-label">main.cpp</p><pre><code><span>int</span> age;
<b>cin</b> &gt;&gt; age;
<b>cout</b> &lt;&lt; age;</code></pre></div><div class="console-panel"><label>年龄（0～150 的整数）<input id="ioInput" type="text" inputmode="numeric" value="12"></label><button class="btn btn-primary" id="ioRun" type="button">运行程序</button><div class="data-hop"><span>输入</span><strong id="ioVariable">—</strong><span>变量 age</span><strong id="ioOutput">—</strong><span>输出</span></div><div id="labFeedback" class="lab-feedback" aria-live="polite">输入整数后运行。本实验校验整个输入，不模拟 cin 对小数文本的部分读取。</div></div></section>`,
      3: () => `<section class="lab-card variable-lab"><div class="code-lines" id="variableCode"><button data-line="0">int score = 60;</button><button data-line="1">score = 80;</button><button data-line="2">score = score + 5;</button><button data-line="3">cout &lt;&lt; score;</button></div><div class="variable-box"><small>变量名称</small><b>score</b><strong id="variableValue">?</strong><span id="variableNote">点击“执行下一行”开始追踪</span></div><button class="btn btn-primary" id="variableNext" type="button">执行下一行</button><button class="btn btn-ghost" id="variableReset" type="button">重新开始</button></section>`,
      4: () => `<section class="lab-card"><div class="lab-title"><div><small>TYPE SORTER</small><h2>先选数据，再点击它的类型房间</h2></div><span id="sortCount">0/6</span></div><div class="data-cards">${[['12','int'],['3.5','double'],["'A'",'char'],['true','bool'],['0','int'],["'2'",'char']].map(([v,t],i)=>`<button type="button" data-card="${i}" data-type="${t}">${v}</button>`).join('')}</div><div class="type-bins">${[['int','整数'],['double','小数'],['char','单个字符'],['bool','真假']].map(([t,n])=>`<button type="button" data-bin="${t}"><strong>${t}</strong><small>${n}</small></button>`).join('')}</div><div class="lab-feedback" id="labFeedback">选择一张数据卡开始分类。</div></section>`,
      5: () => `<section class="lab-card operator-lab"><div class="operator-inputs"><label>第一个整数（-10000～10000）<input id="opA" type="text" inputmode="numeric" value="13"></label><select id="operator" aria-label="选择运算符"><option>+</option><option>-</option><option>*</option><option selected>/</option><option>%</option><option>&gt;</option><option>&lt;</option><option>==</option><option>!=</option></select><label>第二个整数（-10000～10000）<input id="opB" type="text" inputmode="numeric" value="5"></label><button class="btn btn-primary" id="opRun" type="button">计算</button></div><div class="operator-result"><small>表达式结果</small><strong id="opExpression">13 / 5</strong><b id="opResult">2</b><p id="opExplain">两个整数相除，只保留整数部分。</p></div></section>`,
      6: () => `<section class="lab-card conversion-lab"><div class="conversion-tabs"><button class="active" data-convert="mixed">整数 + 小数</button><button data-convert="cast">int(3.8)</button><button data-convert="order">转换顺序</button></div><div id="conversionStage"><div class="conversion-flow"><span>int 3</span><i>自动转换</i><span>double 3.0</span><i>+ 3.5</i><strong>6.5</strong></div><p>整数和小数一起运算时，整数会参与浮点运算。</p></div></section>`,
      7: () => `<section class="lab-card ascii-lab"><div class="identity-compare"><div><small>整数</small><strong>5</strong><span>数值就是 5</span></div><div><small>字符</small><strong>'5'</strong><span>ASCII 编码是 53</span></div></div><label class="ascii-slider">拖动查看连续字符<input id="asciiRange" type="range" min="32" max="126" value="65"></label><div class="ascii-readout"><span id="asciiChar">'A'</span><i>对应编码</i><strong id="asciiCode">65</strong></div><div class="ascii-anchors"><button data-ascii="32">空格 32</button><button data-ascii="48">'0' 48</button><button data-ascii="65">'A' 65</button><button data-ascii="97">'a' 97</button></div></section>`,
      8: () => `<section class="lab-card logic-lab"><div class="logic-rule"><small>中文规则</small><strong>温度低于 30，而且水箱中有水</strong></div><div class="logic-controls"><label>温度（-50～100 整数）<input id="logicTemp" type="text" inputmode="numeric" value="28"></label><label>中文连接词<select id="logicOp"><option value="">请选择</option><option value="&&">而且（&&）</option><option value="||">或者（||）</option></select></label><label>水量（0～10000 整数）<input id="logicWater" type="text" inputmode="numeric" value="10"></label><button class="btn btn-primary" id="logicRun" type="button">检查规则</button></div><div class="truth-grid"><div><small>左条件</small><strong id="truthLeft">28 &lt; 30 → TRUE</strong></div><div><small>右条件</small><strong id="truthRight">10 &gt; 0 → TRUE</strong></div><div><small>规则翻译</small><strong id="ruleCorrect">等待选择</strong></div><div><small>当前结果</small><strong id="truthFinal">—</strong></div></div><div class="lab-feedback" id="labFeedback">先选择与“而且”对应的逻辑运算符。</div></section>`,
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
          if (flowStep === 3) { markLab(); refreshLabReady(); }
        } else app.querySelector('#labFeedback').textContent = '再看箭头：数据应该从哪里开始流动？';
      }));
    }
    if (id === 2) {
      app.querySelector('#ioRun').addEventListener('click', () => {
        clearTimeout(ioTimer);
        try {
          const value=readInteger('#ioInput',0,150,'年龄');
          const output=app.querySelector('#ioOutput');
          app.querySelector('#ioVariable').textContent=value;output.textContent='传递中…';
          app.querySelector('#labFeedback').textContent='输入校验通过，数据进入 int age。';
          ioTimer=setTimeout(()=>{if(!output.isConnected)return;output.textContent=value;markLab();refreshLabReady();},260);
        } catch(error) {app.querySelector('#ioVariable').textContent='—';app.querySelector('#ioOutput').textContent='—';app.querySelector('#labFeedback').textContent=error.message;refreshLabReady(false);}
      });
      app.querySelector('#ioInput').addEventListener('input',()=>{clearTimeout(ioTimer);app.querySelector('#ioVariable').textContent='—';app.querySelector('#ioOutput').textContent='—';app.querySelector('#labFeedback').textContent='输入已更改，请重新运行。';refreshLabReady(false);});
    }
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
        if (variableStep === values.length) { app.querySelector('#variableNext').textContent = '执行完成'; markLab(); refreshLabReady(); }
      };
      app.querySelector('#variableNext').addEventListener('click', run);
      app.querySelector('#variableReset').addEventListener('click', () => renderLesson(currentLessonId, 'learn'));
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
          if (count === 6) markLab();
          refreshLabReady();
        } else app.querySelector('#labFeedback').textContent = '类型不匹配。注意单引号、是否有小数点，以及真假状态。';
      }));
    }
    if (id === 5) {
      const calculate = () => {
        try {
          const a=readInteger('#opA',-10000,10000,'第一个数'),b=readInteger('#opB',-10000,10000,'第二个数'),op=app.querySelector('#operator').value;
          if ((op==='/'||op==='%')&&b===0)throw new Error('除数不能为 0：整数除法和取余均不能使用零除数。');
          const values={'+':()=>a+b,'-':()=>a-b,'*':()=>a*b,'/':()=>Math.trunc(a/b),'%':()=>a%b,'>':()=>a>b,'<':()=>a<b,'==':()=>a===b,'!=':()=>a!==b};
          app.querySelector('#opExpression').textContent=`${a} ${op} ${b}`;
          app.querySelector('#opResult').textContent=String(values[op]());
          app.querySelector('#opExplain').textContent=op==='/'?'整数除法向 0 截断，不是四舍五入。':op==='%'?'余数满足 a = (a/b 的整数商) × b + 余数。':'关系运算显示逻辑值 true/false；默认 cout 会输出 1/0。算术运算显示数值。';markLab();refreshLabReady();
        }catch(error){app.querySelector('#opExpression').textContent='输入未通过校验';app.querySelector('#opResult').textContent='—';app.querySelector('#opExplain').textContent=error.message;refreshLabReady(false);}
      };
      app.querySelector('#opRun').addEventListener('click',calculate);
      app.querySelector('#operator').addEventListener('change',calculate);
      ['#opA','#opB'].forEach(sel=>app.querySelector(sel).addEventListener('input',()=>{app.querySelector('#opResult').textContent='—';app.querySelector('#opExplain').textContent='输入已修改，请重新计算。';refreshLabReady(false);}));
    }
    if (id === 6) app.querySelectorAll('[data-convert]').forEach((button) => button.addEventListener('click', () => {
      app.querySelectorAll('[data-convert]').forEach((item) => item.classList.toggle('active', item === button));
      const stages = {
        mixed: '<div class="conversion-flow"><span>int 3</span><i>自动转换</i><span>double 3.0</span><i>+ 3.5</i><strong>6.5</strong></div><p>整数和小数一起运算时，整数会参与浮点运算。</p>',
        cast: '<div class="conversion-flow"><span>double 3.8</span><i>int()</i><strong>int 3</strong></div><p>强制转换为 int 会直接去掉小数部分，不是四舍五入。</p>',
        order: '<div class="compare-result"><div><code>int(3.9)+int(3.9)</code><strong>6</strong></div><div><code>int(3.9+3.9)</code><strong>7</strong></div></div><p>先转换还是先计算，结果可能不同。</p>',
      };
      app.querySelector('#conversionStage').innerHTML = stages[button.dataset.convert]; markLab(button.dataset.convert); refreshLabReady();
    }));
    if (id === 7) {
      const update = (code) => { app.querySelector('#asciiRange').value = code; app.querySelector('#asciiChar').textContent = code === 32 ? '空格' : `'${String.fromCharCode(code)}'`; app.querySelector('#asciiCode').textContent = code; markLab(); refreshLabReady(); };
      app.querySelector('#asciiRange').addEventListener('input', (event) => update(Number(event.target.value)));
      app.querySelectorAll('[data-ascii]').forEach((button) => button.addEventListener('click', () => update(Number(button.dataset.ascii))));
    }
    if (id === 8) {
      const updateTruth=()=>{
        try {
          const temp=readInteger('#logicTemp',-50,100,'温度'),water=readInteger('#logicWater',0,10000,'水量'),op=app.querySelector('#logicOp').value;
          const left=temp<30,right=water>0;
          app.querySelector('#truthLeft').textContent=`${temp} < 30 → ${left?'TRUE':'FALSE'}`;
          app.querySelector('#truthRight').textContent=`${water} > 0 → ${right?'TRUE':'FALSE'}`;
          app.querySelector('#ruleCorrect').textContent=op==='&&'?'✓ 规则翻译正确':op?'✗ “而且”应使用 &&':'等待选择';
          app.querySelector('#truthFinal').textContent=op?((op==='&&'?left&&right:left||right)?'TRUE':'FALSE'):'—';
          app.querySelector('#labFeedback').textContent=op==='&&'?'规则翻译正确；当前结果为 FALSE 也可能完全正确。':op?'|| 表示至少一个成立，不能翻译“而且”。':'请选择连接词。';
          if(op==='&&') markLab();
          refreshLabReady(op==='&&');
        }catch(error){['#truthLeft','#truthRight','#ruleCorrect','#truthFinal'].forEach(sel=>app.querySelector(sel).textContent='—');app.querySelector('#labFeedback').textContent=error.message;refreshLabReady(false);}
      };
      app.querySelector('#logicRun').addEventListener('click',updateTruth);
      ['#logicTemp','#logicWater'].forEach(sel=>app.querySelector(sel).addEventListener('input',updateTruth));
      app.querySelector('#logicOp').addEventListener('change',updateTruth);
    }
  }

  function branchCode(l) {
    const kind=l.lab.kind;
    if(kind==='order')return `int score;\ncin >> score;\n${selected('branchVariant','good')==='good'?'if (score >= 90) cout << "A";\nelse if (score >= 60) cout << "B";':'if (score >= 60) cout << "B";\nelse if (score >= 90) cout << "A";'}\nelse cout << "C";`;
    if(kind==='switch')return `int choice;\ncin >> choice;\nswitch (choice) {\ncase 1: cout << "A"; ${selected('branchVariant','break')==='break'?'break;':'// 此处省略 break'}\ncase 2: cout << "B"; break;\ndefault: cout << "X";\n}`;
    return l.lab.code;
  }
  function renderBranchLab(l) {
    const k=l.lab.kind;
    return `<section class="lab-card branch-lab"><div class="lab-title"><div><small>路径实验 · 前端模拟</small><h2>${l.mission}</h2></div></div><div id="branchCode">${codeBlock(l.lab.code||'选择下方设置，查看对应代码。')}</div><div class="branch-controls"><label>${l.lab.label}<input id="branchInput" type="text" inputmode="numeric" value="${l.lab.value}"></label>${k==='order'?'<label>判断顺序<select id="branchVariant"><option value="good">先 >=90（正确分类）</option><option value="bad">先 >=60（观察遮挡）</option></select></label>':k==='nested'?'<label>prepared<select id="branchVariant"><option value="yes">true（1，已准备）</option><option value="no">false（0，未准备）</option></select></label>':k==='switch'?'<label>case 1 后<select id="branchVariant"><option value="break">保留 break</option><option value="fall">省略 break</option></select></label>':''}${k==='boundary'?'<label>先预测输出<select id="branchPrediction"><option value="">请选择</option><option>A</option><option>B</option><option>C</option><option>INVALID</option></select></label>':''}<button class="btn btn-primary" id="branchRun">运行并追踪路径</button></div><div id="branchResult" class="lab-feedback" aria-live="polite">修改输入后，点击运行观察执行与跳过。</div>${k==='switch'?`<article class="ternary-lab"><h3>三目：选择较大值</h3>${codeBlock('cout << (a > b ? a : b);')}<div class="branch-controls"><label>a（-100～100 整数）<input id="ternaryA" value="4" type="text" inputmode="numeric"></label><label>b（-100～100 整数）<input id="ternaryB" value="7" type="text" inputmode="numeric"></label><button class="btn btn-secondary" id="ternaryRun">比较两个值</button></div><div id="ternaryResult" class="lab-feedback" aria-live="polite">先填值，再比较。</div></article>`:''}<details class="experiment-history"><summary>已记录的实验路径</summary><div id="branchHistory"></div></details><p class="plain-note">仅模拟本页展示的固定程序，不是完整 C++ 编译器。</p></section>`;
  }
  function classifyScore(n) {return n<0||n>100?'INVALID':n>=90?'A':n>=60?'B':'C';}
  function bindBranchLab(l) {
    const k=l.lab.kind, result=app.querySelector('#branchResult');
    const drawCode=()=>app.querySelector('#branchCode').innerHTML=codeBlock(branchCode(l));drawCode();
    const history=()=>{const keys=Object.keys(evidence().lab);app.querySelector('#branchHistory').textContent=keys.length?keys.map(key=>({true:'条件成立路径',false:'条件不成立路径','95-good':'95 / 先 >=90','95-bad':'95 / 先 >=60','59-good':'59 / 正确顺序','60-good':'60 / 正确顺序','90-good':'90 / 正确顺序','1-break':'输入 1，保留 break','1-fall':'输入 1，省略 break',default:'default 路径',ternary:'三目比较',normal:'正常内部值'}[key]||key)).join('；'):'尚未运行。';};history();
    app.querySelectorAll('.branch-lab input,.branch-lab select').forEach(el=>el.addEventListener('input',()=>{drawCode();result.textContent='设置已改变，旧结果已失效，请重新运行。';const tr=app.querySelector('#ternaryResult');if(tr)tr.textContent='设置已改变，请重新比较。';refreshLabReady(false);}));
    app.querySelector('#branchRun').onclick=()=>{
      try{
        const n=readInteger('#branchInput',l.lab.min,l.lab.max,'实验输入'),variant=selected('branchVariant',''),trace=[];let output,key;
        if(k==='if'){const yes=n>=30;output=yes?'HOT DONE':'DONE';key=String(yes);trace.push(`${n} >= 30 → ${yes}`,yes?'执行 if 块：输出 HOT':'跳过 if 块：不输出 HOT','继续执行块外语句：输出 DONE');}
        if(k==='else'){const yes=n>=60;output=yes?'PASS':'RETRY';key=output;trace.push(`${n} >= 60 → ${yes}`,yes?'执行 if；跳过 else':'跳过 if；执行 else');}
        if(k==='order'){
          const first=variant==='good'?90:60,second=variant==='good'?60:90;
          if(n>=first){output=variant==='good'?'A':'B';trace.push(`${n} >= ${first} → true；进入首分支`,`跳过后续 >=${second} 与 else`);}else if(n>=second){output=variant==='good'?'B':'A';trace.push(`${n} >= ${first} → false`,`${n} >= ${second} → true；进入第二分支`);}else{output='C';trace.push('两个条件均为 false；进入 else');}
          key=`${n}-${variant}`;trace.push(`题意预期：${classifyScore(n)}；${output===classifyScore(n)?'本次结果符合题意':'此顺序遮住了更高分段，请比较正确顺序'}`);
        }
        if(k==='nested'){if(n<12){output='TOO_YOUNG';trace.push('外层 false → 跳过整个内层 → 外层 else');}else{output=variant==='yes'?'ENTER':'PREPARE';trace.push('外层 true → 进入内层',`prepared → ${variant==='yes'}；${variant==='yes'?'执行内层 if，跳过内层 else':'执行内层 else'}`);}key=output;}
        if(k==='switch'){if(n===1){output=variant==='break'?'A':'AB';trace.push('从 case 1 进入，输出 A',variant==='break'?'遇到 break，退出 switch':'无 break，继续输出 case 2 的 B，再遇 break 退出');key=variant==='break'?'1-break':'1-fall';}else if(n===2){output='B';key='2';trace.push('匹配 case 2 → 输出 B → break 退出');}else{output='X';key='default';trace.push('无匹配 case → default → 输出 X');}}
        if(k==='boundary'){
          output=classifyScore(n);const prediction=selected('branchPrediction','');if(!prediction)throw new Error('先预测输出，再运行测试。');
          trace.push(n<0||n>100?'范围检查为 true → INVALID':n>=90?'范围检查 false → >=90 true → A':n>=60?'范围检查 false → >=90 false → >=60 true → B':'范围检查 false → >=90 false → >=60 false → else C');
          if(prediction!==output){result.textContent=`预测 ${prediction}，模拟输出 ${output}。错因：${trace.join('；')}。请根据路径修正预测，此次不计入正确测试记录。`;refreshLabReady(false);return;}
          key=String(n);if((n>0&&n<59)||(n>60&&n<89)||(n>90&&n<100))markLab('normal');
        }
        markLab(key);result.innerHTML=`<strong>模拟输出</strong><pre>${escapeHtml(output)}</pre><ol>${trace.map(t=>`<li>${escapeHtml(t)}</li>`).join('')}</ol>`;history();refreshLabReady();
      }catch(error){result.textContent=error.message;refreshLabReady(false);}
    };
    const ternary=app.querySelector('#ternaryRun');if(ternary)ternary.onclick=()=>{try{const a=readInteger('#ternaryA',-100,100,'a'),b=readInteger('#ternaryB',-100,100,'b');app.querySelector('#ternaryResult').textContent=`${a} > ${b} → ${a>b}；选择${a>b?'问号后 a':'冒号后 b'}，输出 ${a>b?a:b}。`;markLab('ternary');history();refreshLabReady();}catch(error){app.querySelector('#ternaryResult').textContent=error.message;refreshLabReady(false);}};
  }
  function renderChapterQuiz(chapter,resume=false) {
    currentUnitId=chapter.split('-')[0];
    const saved=progress().quiz;
    quizSession=resume&&saved?.chapter===chapter?saved:{chapter,index:0,answers:[]};
    progress().quiz=quizSession;renderQuizQuestion(questionBank.chapters[chapter]);
  }
  function renderQuizQuestion(questions) {
    remember({type:'quiz',chapter:quizSession.chapter});setActiveNav('unit');
    const q=questions[quizSession.index],answer=quizSession.answers[quizSession.index];
    const score=quizSession.answers.filter(a=>a.right).length;
    app.innerHTML=`<section class="quiz-page page"><button class="back-link" data-back-unit>← 返回单元 ${unit().number}</button><div class="quiz-header"><div><p class="eyebrow">章节专项练习</p><h1>第 ${quizSession.index+1} 题 / ${questions.length}</h1></div><strong>当前答对 ${score} 题</strong></div><p class="question-description">每题计第一次选择；中途离开后可恢复。本轮完成后可重做。</p><div class="quiz-progress"><i style="width:${(quizSession.index+1)/questions.length*100}%"></i></div><article class="question-card wide">${questionBody(q)}<div class="answer-list">${q.options.map((o,i)=>`<button data-quiz-answer="${i}" ${answer?'disabled':''} class="${answer?(i===q.answer?'correct':i===answer.selected?'wrong':''):''}"><span>${String.fromCharCode(65+i)}</span><code>${escapeHtml(o)}</code></button>`).join('')}</div><div class="answer-feedback" id="quizFeedback" aria-live="polite">${answer?escapeHtml(`${answer.right?'回答正确':q.wrong[answer.selected]} ${q.explain}`):'选择后查看具体错因与解析。'}</div></article><div class="lesson-actions"><button class="btn btn-primary" id="quizNext" ${answer?'':'disabled'}>${quizSession.index===questions.length-1?'查看练习结果':'下一题 →'}</button></div></section>`;
    app.querySelector('[data-back-unit]').onclick=renderUnit;
    app.querySelectorAll('[data-quiz-answer]').forEach(b=>b.onclick=()=>{if(quizSession.answers[quizSession.index])return;const selected=Number(b.dataset.quizAnswer);quizSession.answers[quizSession.index]={question:q.id,lesson:q.lesson,selected,right:selected===q.answer,at:Date.now()};saveState();renderQuizQuestion(questions);});
    app.querySelector('#quizNext').onclick=()=>{
      if(!quizSession.answers[quizSession.index])return;
      if(quizSession.index<questions.length-1){quizSession.index++;renderQuizQuestion(questions);}
      else{const prior=progress().chapters[quizSession.chapter];const run={score:quizSession.answers.filter(a=>a.right).length,answers:[...quizSession.answers],at:Date.now()};progress().chapters[quizSession.chapter]={...run,runs:[...(prior?.runs||[]),run],legacyScore:prior?.legacy?prior.score:prior?.legacyScore};progress().quiz=null;saveState();renderQuizResult();}
    };goTop();
  }
  function afterChapter(chapter) {const index=unit().chapters.findIndex(c=>c.id===chapter),c=unit().chapters[index+1];return c?{type:'lesson',unit:currentUnitId,id:lessons.find(l=>l.chapter===c.id).id,step:'learn',label:'进入下一章 →'}:{type:'challenge',unit:currentUnitId,label:'进入单元综合挑战 →'};}
  function wrongReview(answers=[]) {return answers.filter(a=>!a.right).map(a=>{const q=Object.values(questionBank.chapters).flat().find(q=>q.id===a.question);return `<article class="review-item"><strong>${escapeHtml(q.prompt)}</strong><p>你的选择：${escapeHtml(q.options[a.selected])}。${escapeHtml(q.wrong[a.selected])}</p><button class="text-button" data-review="${a.lesson}">复习：${lessonById(a.lesson).title} →</button></article>`;}).join('');}
  function bindReviews(){app.querySelectorAll('[data-review]').forEach(b=>b.onclick=()=>renderLesson(b.dataset.review,'learn'));}
  function renderQuizResult() {
    const c=quizSession.chapter,r=progress().chapters[c],total=questionBank.chapters[c].length,next=afterChapter(c);
    remember({type:'report'});
    app.innerHTML=`<section class="page result-center"><div class="summary-check">✓</div><p class="eyebrow">章节练习完成</p><h1>答对 ${r.score} / ${total}</h1><p class="lead">${r.score===total?'本轮各题均答对，可按路线继续；这不等同于全面掌握。':'下面列出本轮错题及对应知识点，建议先复习再重做。'}</p><div class="wrong-review">${wrongReview(r.answers)}</div><div class="lesson-actions center"><button class="btn btn-primary" data-next>${next.label}</button><button class="btn btn-secondary" data-back-unit>返回单元路线</button><button class="btn btn-ghost" data-retry>重新练习</button></div></section>`;
    app.querySelector('[data-next]').onclick=()=>openPosition(next);app.querySelector('[data-back-unit]').onclick=renderUnit;app.querySelector('[data-retry]').onclick=()=>renderChapterQuiz(c);bindReviews();goTop();
  }
  function renderGreenhouse() {
    setActiveNav('unit');
    app.innerHTML = `<section class="page challenge-page"><button class="back-link" type="button" data-back-unit>← 返回单元 01</button><div class="stage-heading"><div><p class="eyebrow">Unit Challenge</p><h1>完成智能温室启动程序</h1><p class="lead">本任务要求：温度用 double（可有小数）、水量用 int（整数）、模式用 char。温度低于 30、水量大于 0、运行模式为字符 'A'，三个条件同时满足时输出 START。</p></div><div class="goal-card"><small>完成标准</small><strong>补全类型与规则，通过 4 项要求检查</strong></div></div><p class="completion-note">前端模拟：只检查类型与规则选项，不编译运行完整 C++。这里的四项是要求检查，不是四组输入测试。</p><div class="challenge-layout"><article class="challenge-form"><h2>检查点 1 · 选择数据类型</h2>${typeSelect('temperature','temperature','double')}${typeSelect('water','water','int')}${typeSelect('mode','mode','char')}<h2>检查点 2 · 构造启动规则</h2><label class="field-row"><span>温度条件</span><select id="tempRule"><option value="">请选择</option><option value="lt">temperature &lt; 30</option><option value="le">temperature &lt;= 30</option></select></label><label class="field-row"><span>条件连接</span><select id="joinRule"><option value="">请选择</option><option value="and">三个条件使用 &amp;&amp;</option><option value="or">三个条件使用 ||</option></select></label><label class="field-row"><span>模式条件</span><select id="modeRule"><option value="">请选择</option><option value="char">mode == 'A'</option><option value="name">mode == A</option><option value="assign">mode = 'A'</option></select></label><button class="btn btn-primary full-button" type="button" id="submitChallenge">检查 4 项要求</button></article><article class="code-preview"><div class="code-label">greenhouse.cpp</div><pre id="challengeCode"></pre><div class="test-results" id="testResults" aria-live="polite"><p>完成左侧检查点后提交检查。</p></div></article></div></section>`;
    const controls = app.querySelectorAll('select'); controls.forEach((control) => control.addEventListener('change', () => {saveChallengeDraft(); updateChallengeCode();invalidateChallenge();}));
    app.querySelector('[data-back-unit]').addEventListener('click', renderUnit); app.querySelector('#submitChallenge').addEventListener('click', runChallenge); restoreChallengeDraft(); updateChallengeCode(); showSavedChallenge(); goTop();
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
    recordChallenge(passed, checks);
    const testNames = ['数据类型', '温度边界', '同时成立', '字符比较'];
    app.querySelector('#testResults').innerHTML = testNames.map((name, i) => `<div class="test-row"><span>CHECK ${String(i + 1).padStart(2, '0')}</span><em>${name}</em><strong class="${checks[i] ? 'pass' : 'fail'}">${checks[i] ? '✓ PASSED' : '✗ FAILED'}</strong></div>`).join('') + `<div class="challenge-feedback ${passed === 4 ? 'ok' : 'bad'}">${challengeFeedback(typesRight, tempRight, joinRight, modeRight)}</div>` + '<button class="btn btn-light full-button" type="button" data-report>查看单元学习报告 →</button>';
    const report = app.querySelector('[data-report]'); if (report) report.addEventListener('click', renderReport);
  }

  function challengeFeedback(typesRight, tempRight, joinRight, modeRight) {
    if (!typesRight) return '先检查数据身份：温度有小数、水量是整数、模式是单个字符。';
    if (!tempRight) return '题目说“低于 30”，不包含 30，应使用 < 而不是 <=。';
    if (!joinRight) return '三个条件必须同时成立，应使用 && 连接。';
    if (!modeRight) return "判断是否相等要用 ==，字符 A 还需要单引号。";
    return '4 项要求检查全部通过；这说明本页选项符合题意，不代表通过真实在线评测。';
  }

  function renderChallenge() {remember({type:'challenge'});if(currentUnitId==='u1')renderGreenhouse();else renderDecisionChallenge();}
  function recordChallenge(passed,checks) {
    const c=progress().challenge;
    c.best=Math.max(c.best,passed);c.latest={passed,checks,valid:true,at:Date.now()};
    (c.runs||(c.runs=[])).push({...c.latest,draft:{...c.draft}});saveState();
  }
  function saveChallengeDraft() {app.querySelectorAll('.challenge-page select,.challenge-page textarea').forEach(el=>progress().challenge.draft[el.id]=el.value);saveState();}
  function restoreChallengeDraft() {const d=progress().challenge.draft;app.querySelectorAll('.challenge-page select,.challenge-page textarea').forEach(el=>{if(d[el.id]!==undefined)el.value=d[el.id];});}
  function invalidateChallenge() {const c=progress().challenge;if(c.latest)c.latest.valid=false;app.querySelector('#testResults').innerHTML='<p>选项或测试已修改，上次检查结果已失效。请重新提交；历史最佳记录保留。</p>';saveState();}
  function showSavedChallenge() {const c=progress().challenge;app.querySelector('#testResults').innerHTML=`<p>历史最佳：${c.best}/4。${c.latest?(c.latest.valid?`上次提交 ${c.latest.passed}/4；点击检查查看各项详情。`:'上次结果已失效，请重新提交。'):'尚未提交本次检查。'}</p>`;}
  function renderDecisionChallenge() {
    setActiveNav('unit');
    app.innerHTML=`<section class="page challenge-page"><button class="back-link" data-back-unit>← 返回单元 02</button><div class="stage-heading"><div><p class="eyebrow">综合挑战 · 原创教学练习</p><h1>成绩分类器与测试设计</h1><p class="lead">0～100 的整数：90 分起 A，60 分起 B，其余 C；范围外 INVALID。选择分类规则，再自己填写输入与预期输出。</p></div><div class="goal-card"><small>完成标准 · 四项要求</small><strong>规则正确；三个等级各有内部正常值；覆盖八个边界值；预期和模拟均符合题意。</strong></div></div><p class="completion-note">前端只模拟下方固定模板与选项，不是完整 C++ 编译器或在线判题。每条测试都会显示你的预期、题意输出与模拟输出。</p><div class="challenge-layout"><article class="challenge-form"><h2>1 · 选择规则</h2><label class="field-row">范围检查<select id="decisionGuard"><option value="">请选择</option><option value="yes">先判断 score &lt; 0 || score &gt; 100</option><option value="no">不检查范围</option></select></label><label class="field-row">判断顺序<select id="decisionOrder"><option value="">请选择</option><option value="high">先 90 后 60</option><option value="low">先 60 后 90</option></select></label><label class="field-row">门槛运算符<select id="decisionOperator"><option value="">请选择</option><option value="ge">&gt;=（包含门槛）</option><option value="gt">&gt;（不含门槛）</option></select></label><h2>2 · 设计测试</h2><label>每行一个 输入:预期输出（最多 30 行）<textarea id="decisionCases" rows="10" placeholder="例如 50:C&#10;75:B&#10;95:A"></textarea></label><p class="plain-note">覆盖 -1、0、59、60、89、90、100、101；另选 C、B、A 各一个内部正常值。可用逗号或换行分隔。</p><button class="btn btn-primary full-button" id="submitDecision">检查规则与样例</button></article><article class="code-preview"><div class="code-label">classification.cpp · main 内片段</div><pre id="decisionCode"></pre><div id="testResults" class="test-results" aria-live="polite"></div></article></div><div class="unit-footer-actions"><button class="btn btn-secondary" data-report>查看单元二报告</button></div></section>`;
    restoreChallengeDraft();updateDecisionCode();showSavedChallenge();
    app.querySelectorAll('select,textarea').forEach(el=>el.addEventListener('input',()=>{saveChallengeDraft();updateDecisionCode();invalidateChallenge();}));
    app.querySelector('#submitDecision').onclick=runDecisionChallenge;app.querySelector('[data-back-unit]').onclick=renderUnit;app.querySelector('[data-report]').onclick=renderReport;goTop();
  }
  function updateDecisionCode() {
    const high=selected('decisionOrder','')==='high',ge=selected('decisionOperator','')==='ge',guard=selected('decisionGuard','');
    const op=selected('decisionOperator','')?(ge?'>=':'>'):'___';
    const head=guard==='yes'?'if (score < 0 || score > 100) cout << "INVALID";\nelse ':guard==='no'?'':'// 请选择范围检查\n';
    app.querySelector('#decisionCode').textContent=`int score;\ncin >> score;\n${head}if (score ${op} ${high?90:60}) cout << "${high?'A':'B'}";\nelse if (score ${op} ${high?60:90}) cout << "${high?'B':'A'}";\nelse cout << "C";`;
  }
  function runDecisionChallenge() {
    saveChallengeDraft();const target=app.querySelector('#testResults');
    try{
      const guard=selected('decisionGuard',''),order=selected('decisionOrder',''),op=selected('decisionOperator','');
      if(!guard||!order||!op)throw new Error('请先选择全部三项规则。');
      const raw=app.querySelector('#decisionCases').value.trim();if(!raw)throw new Error('测试列表不能为空，请先设计输入与预期输出。');
      const lines=raw.split(/[,，\n]+/).map(s=>s.trim()).filter(Boolean);if(lines.length>30)throw new Error('本次最多输入 30 行测试。');
      const rows=lines.map((line,i)=>{const m=line.match(/^([+-]?\d+)\s*[:：]\s*(A|B|C|INVALID)$/i);if(!m)throw new Error(`第 ${i+1} 条格式不正确，请使用“整数:输出”，如 60:B。`);const n=Number(m[1]);if(!Number.isSafeInteger(n)||n< -10000||n>10000)throw new Error(`第 ${i+1} 条输入超出本模拟范围 -10000～10000。`);const cmp=t=>op==='ge'?n>=t:n>t;const actual=guard==='yes'&&(n<0||n>100)?'INVALID':order==='high'?(cmp(90)?'A':cmp(60)?'B':'C'):(cmp(60)?'B':cmp(90)?'A':'C');return {n,expected:m[2].toUpperCase(),target:classifyScore(n),actual};});
      const required=[-1,0,59,60,89,90,100,101],missing=required.filter(n=>!rows.some(r=>r.n===n));
      const normals=[[1,58],[61,88],[91,99]].every(([a,b])=>rows.some(r=>r.n>=a&&r.n<=b));
      const checks=[guard==='yes'&&order==='high'&&op==='ge',normals,!missing.length,rows.every(r=>r.expected===r.target&&r.actual===r.target)];
      recordChallenge(checks.filter(Boolean).length,checks);
      const labels=['范围、顺序与门槛规则','三个等级的正常内部值','八个边界值','预期及模拟结果符合题意'];
      target.innerHTML=labels.map((name,i)=>`<div class="test-row"><span>要求 ${i+1}</span><em>${name}</em><strong class="${checks[i]?'pass':'fail'}">${checks[i]?'通过':'未通过'}</strong></div>`).join('')+`<div class="challenge-feedback ${checks.every(Boolean)?'ok':'bad'}">${checks[0]?'规则正确。':'检查范围判断、先高后低及 >=。'} ${normals?'正常值已覆盖。':'请补充 C、B、A 的内部正常值，例如 50、75、95。'} ${missing.length?`还缺边界：${missing.join('、')}。`:'边界值已覆盖。'} ${checks[3]?'所有填写的预期与模拟输出一致且符合题意。':'请逐行比较下表；预期不符或模拟不符都要修正。'}</div><div class="table-scroll"><table><caption>本次样例模拟</caption><thead><tr><th>输入</th><th>你的预期</th><th>题意输出</th><th>模拟输出</th><th>路径</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.n}</td><td>${r.expected}</td><td>${r.target}</td><td class="${r.expected===r.target&&r.actual===r.target?'pass':'fail'}">${r.actual}</td><td>${r.actual==='INVALID'?'范围外':r.actual==='A'?'进入 A 分支':r.actual==='B'?'进入 B 分支':'进入 else'}</td></tr>`).join('')}</tbody></table></div>`;
    }catch(error){if(progress().challenge.latest)progress().challenge.latest.valid=false;saveState();target.textContent=error.message;}
  }
  function renderReport() {
    setActiveNav('unit');remember({type:'report'});
    const p=progress(),ls=unitLessons(),records=Object.values(p.questions),done=ls.filter(l=>p.completed.includes(l.id));
    const first=records.filter(r=>r.solved&&r.firstSolved.attempt===1&&!r.firstSolved.hint&&!r.firstSolved.solution).length;
    const retry=records.filter(r=>r.solved&&r.firstSolved.attempt>1&&!r.firstSolved.hint&&!r.firstSolved.solution).length;
    const hinted=records.filter(r=>r.solved&&r.firstSolved.hint&&!r.firstSolved.solution).length;
    const explained=records.filter(r=>r.solved&&r.firstSolved.solution).length;
    const c=p.challenge;
    app.innerHTML=`<section class="page report-page"><button class="back-link" data-back-unit>← 返回单元 ${unit().number}</button><div class="report-hero"><div><p class="eyebrow">真实学习记录</p><h1>单元 ${unit().number} 学习报告</h1><p class="lead">只展示本机的实验、答题和小结记录。首次答对与未查看提示都是行为记录，不代表全面掌握。</p></div><div class="report-count"><strong>${done.length}/${ls.length}</strong><span>知识点完成（含历史记录）</span></div></div><div class="report-stats"><div><strong>${first}</strong><span>课内题首次答对</span></div><div><strong>${retry}</strong><span>课内题重试后答对</span></div><div><strong>${hinted}</strong><span>课内题提示后答对</span></div><div><strong>${explained}</strong><span>课内题解析后答对</span></div><div><strong>${records.filter(r=>r.hint).length}</strong><span>查看过提示的课内题</span></div></div>${p.legacy?'<p class="completion-note">旧版记录缺少每题和每步骤证据：历史完成、总尝试及提示次数仅原样展示，不归入上方新记录统计。</p>':''}<section class="surface report-list"><div class="report-list-head"><h2>知识点状态</h2><span>记录依据</span></div>${ls.map(l=>{const e=p.evidence[l.id],qs=questionBank.lessons[l.id];const legacy=p.legacy?.completed.includes(l.id);return `<div><span class="mini-index">${String(l.order).padStart(2,'0')}</span><strong>${l.title}</strong><em class="${p.completed.includes(l.id)?'mastered':'pending'}">${statusForLesson(l.id)[0]}</em><small>${legacy?`历史完成；旧版作答 ${Number(p.legacy.attempts[l.legacyId])||0} 次、提示 ${Number(p.legacy.hints[l.legacyId])||0} 次。<br>`:''}实验：${labDone(l.id)?'已达标':legacy?'暂无新版记录（历史步骤未知）':'未达标'}；小结：${e?.steps.summary?'已确认':legacy?'暂无新版确认（历史步骤未知）':'未确认'}<br>${qs.map((q,i)=>`${i?'挑战':'自己试'}：${!p.questions[q.id]&&legacy?'无历史逐题证据':answerEvidence(p.questions[q.id])}`).join('<br>')}</small><button data-review="${l.id}">复习</button></div>`;}).join('')}</section><section class="chapter-reports">${unit().chapters.map(ch=>{const r=p.chapters[ch.id];return `<article class="surface report-section"><h2>${ch.title} · 专项练习</h2><p>${r?`${r.legacy?'历史':'最近一轮'}答对 ${r.score}/${questionBank.chapters[ch.id].length}。${r.legacy?'旧记录没有逐题答案，无法还原错题。':`已记录 ${r.runs.length} 轮；本轮错题如下。`}`:'尚未完成整轮练习。'}</p>${r&&!r.legacy?wrongReview(r.answers):''}${r?.runs?.length>1?`<details><summary>各轮真实成绩</summary><ul>${r.runs.map((run,i)=>`<li>第 ${i+1} 轮：${run.score}/${questionBank.chapters[ch.id].length}；错题 ${run.answers.filter(a=>!a.right).map(a=>a.question).join('、')||'无'}</li>`).join('')}</ul></details>`:''}<button class="text-button" data-quiz="${ch.id}">${p.quiz?.chapter===ch.id?'继续未完成的一轮':'再做一轮专项练习'} →</button></article>`;}).join('')}</section><section class="surface report-section"><h2>${unit().challenge}</h2><p>历史最佳 ${c.best}/4 项要求${c.legacy?'（包含旧版记录）':''}。历史完成：${c.best===4?'已完成':'未完成'}。</p><p>${c.latest?`最近一次提交 ${c.latest.passed}/4；${c.latest.valid?'与当前选项一致':'选项已修改，该结果已失效'}。`:'暂无新版提交记录。'}</p><button class="text-button" data-challenge>进入综合挑战 →</button></section><div class="report-advice"><h2>下一步建议</h2><p>${reportAdvice()}</p></div><div class="unit-footer-actions"><button class="btn btn-secondary" data-back-unit>返回单元路线</button>${currentUnitId==='u1'?'<button class="btn btn-primary" data-unit-two>进入单元二 →</button>':'<button class="btn btn-primary" data-home>返回完整学习路线 →</button>'}<button class="btn btn-ghost" data-reset-unit>重置本单元记录</button><button class="btn btn-ghost" data-reset-all>重置全部本机记录</button></div></section>`;
    app.querySelectorAll('[data-back-unit]').forEach(b=>b.onclick=renderUnit);bindReviews();
    app.querySelectorAll('[data-quiz]').forEach(b=>b.onclick=()=>renderChapterQuiz(b.dataset.quiz,true));app.querySelector('[data-challenge]').onclick=renderChallenge;
    const u2=app.querySelector('[data-unit-two]');if(u2)u2.onclick=()=>{currentUnitId='u2';renderUnit();};const home=app.querySelector('[data-home]');if(home)home.onclick=renderHome;
    app.querySelector('[data-reset-unit]').onclick=()=>{
      if(!window.confirm(`清除本机单元 ${unit().number} 的记录？其他单元保持不变。`))return;
      state.units[currentUnitId]=blankUnit();if(currentUnitId==='u1')clearLegacyFields();if(state.lastPosition?.unit===currentUnitId)state.lastPosition=null;saveState();renderHome();showToast('本单元记录已重置');
    };
    app.querySelector('[data-reset-all]').onclick=()=>{if(!window.confirm('清除全部本机学习记录（单元一和单元二）？'))return;state={schemaVersion:3,units:{u1:blankUnit(),u2:blankUnit()},lastPosition:null};currentUnitId='u1';saveState();renderHome();showToast('全部本机记录已重置');};goTop();
  }
  function clearLegacyFields(){['completed','attempts','hints','chapterScores','challengePassed','lastLesson'].forEach(k=>delete state[k]);}
  function reportAdvice() {
    const p=progress();const wrong=unit().chapters.flatMap(c=>p.chapters[c.id]?.answers||[]).filter(a=>!a.right);
    if(wrong.length)return `最近章节练习仍有 ${wrong.length} 道错题，先用上面的“复习”入口检查对应知识点，再重做。`;
    const pending=unitLessons().find(l=>!p.completed.includes(l.id));if(pending)return `继续 ${pending.title}：${pending.goal}`;
    if(unit().chapters.some(c=>!p.chapters[c.id]))return '知识点已完成，请补齐尚未完成的章节练习。';
    if(p.challenge.best<4)return '知识点与章节练习已有记录，下一步完成本单元综合挑战。';
    return currentUnitId==='u1'?'本单元所有环节已有完成记录。可进入单元二，或复习曾重试、查看提示的题目。':'全部开放环节已有完成记录。可复习错题与边界测试；后续单元仍为规划中。';
  }
  document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>b.dataset.nav==='unit'?renderUnit():renderHome()));
  saveState();renderHome();
})();
