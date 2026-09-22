/* Run with Node + Playwright. Uses an isolated browser context; never touches real learner data. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const {pathToFileURL} = require('node:url');
const {chromium} = require('playwright');
const root = path.resolve(__dirname, '../GESP_Unit1_Interactive_Demo');
const artifacts = process.env.CSP_TEST_ARTIFACTS || path.join(os.tmpdir(), 'csp-learning-tests');
fs.mkdirSync(artifacts, {recursive:true});
const key='gesp-unit1-demo-v2';
let browser, server, assertions=0;
const check=(condition,message)=>{assert.ok(condition,message);assertions++;};
(async()=>{
  const executablePath=process.env.CHROME_PATH || (process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined);
  browser=await chromium.launch({headless:true,executablePath});
  const errors=[],requests=[];
  async function fresh(seed, mobile=false, url=pathToFileURL(path.join(root,'index.html')).href){
    const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000}});
    const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
    await page.goto(url);
    if(seed){await page.evaluate(({key,seed})=>localStorage.setItem(key,JSON.stringify(seed)),{key,seed});await page.reload();}
    return page;
  }
  async function saved(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);}
  async function unit(page,id='u1'){await page.locator('[data-nav="home"]').first().click();await page.locator(`[data-unit="${id}"]`).click();}
  async function lesson(page,id,step='learn'){await unit(page,id.split('-')[0]);await page.locator(`[data-lesson="${id}"]`).click();if(step!=='learn')await page.locator(`[data-step="${step}"]`).click();}
  async function text(page,sel){return page.locator(sel).innerText();}
  async function noOverflow(page,name){check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${name}: no page overflow`);}
  async function clickAnswer(page,id,index){const q=await page.evaluate(({id,index})=>window.GESP_QUESTIONS.lessons[id][index],{id,index});await page.locator(`[data-answer="${q.answer}"]`).click();}
  if(process.argv.includes('--focused')){
    const focused=await fresh({completed:[1],attempts:{1:3},hints:{},chapterScores:{},challengePassed:0,lastLesson:1});
    await unit(focused);await focused.locator('[data-open-report]').click();
    check((await text(focused,'.report-list')).includes('历史步骤未知'),'legacy step evidence explicitly unknown');
    check((await text(focused,'.report-list')).includes('无历史逐题证据'),'legacy question evidence explicitly unknown');
    await lesson(focused,'u1-l1','practice');await clickAnswer(focused,'u1-l1',0);await focused.locator('[data-solution]').click();
    check(!(await text(focused,'#answerFeedback')).includes('请仍选择'),'solved explanation does not request disabled answer');
    await lesson(focused,'u2-l3');await noOverflow(focused,'desktop lesson');await focused.screenshot({path:path.join(artifacts,'lesson-desktop.png'),fullPage:true});
    await focused.setViewportSize({width:390,height:844});await lesson(focused,'u1-l2','exam');await noOverflow(focused,'final mobile question');
    check((await text(focused,'.code-caption')).includes('左右滚动'),'code scrolling cue');await focused.screenshot({path:path.join(artifacts,'question-mobile.png'),fullPage:true});
    check(errors.length===0,'focused regression has no browser errors');console.log(`PASS: ${assertions} focused assertions and final desktop/mobile screenshots.`);return;
  }
  const page=await fresh();
  check(await page.title()==='CSP-J 互动学习','CSP-J title');
  check(await page.locator('.roadmap-grid .current').count()===2,'only two open units');
  check(await page.locator('.roadmap-grid .planned').count()===13,'planned roadmap modules');
  const data=await page.evaluate(()=>({lessons:window.GESP_LESSONS,bank:window.GESP_QUESTIONS}));
  const allQs=[...Object.values(data.bank.lessons).flat(),...Object.values(data.bank.chapters).flat()];
  check(new Set(allQs.map(q=>q.id)).size===allQs.length,'unique question identities');
  check(allQs.length===50,'28 lesson questions + 22 chapter questions');
  allQs.forEach(q=>{check(q.options.length===4&&q.answer>=0&&q.answer<4,`${q.id} shape`);q.wrong.forEach((w,i)=>{if(i!==q.answer)check(!!w,`${q.id} wrong explanation ${i}`);});check(!!q.hint&&q.hint!==q.explain,`${q.id} hint distinct from solution`);});
  await page.screenshot({path:path.join(artifacts,'home-desktop.png'),fullPage:true});

  // Reproduced defects and evidence gating.
  await lesson(page,'u1-l2','exam');
  check((await text(page,'.reading-code')).includes('cin >> age >> grade;'),'I/O full code');
  check((await text(page,'.reading-code')).includes("cout << grade << ' ' << age;"),'I/O separator');
  await clickAnswer(page,'u1-l2',1);await page.locator('#questionContinue').click();
  check(!(await saved(page)).units.u1.completed.includes('u1-l2'),'jumping to challenge cannot complete lesson');
  check(await page.locator('.step-list .visited').count()===1,'visited steps follow actual evidence');
  await lesson(page,'u1-l2');
  for(const value of ['', '12.5','NaN','Infinity','1e3','151','-1']){await page.locator('#ioInput').fill(value);await page.locator('#ioRun').click();check(await text(page,'#ioOutput')==='—',`age rejects ${value}`);}
  await page.locator('#ioInput').fill('12');await page.locator('#ioRun').click();await page.waitForTimeout(320);check(await text(page,'#ioOutput')==='12','valid integer output');
  await page.locator('#ioRun').click();await page.locator('[data-nav="home"]').first().click();await page.waitForTimeout(320);check(errors.length===0,'rapid navigation cancels I/O callback');
  await lesson(page,'u1-l5');
  for(const value of ['13.5','','Infinity','10001']){await page.locator('#opA').fill(value);await page.locator('#operator').selectOption('%');await page.locator('#opRun').click();check(await text(page,'#opResult')==='—',`integer operator rejects ${value}`);}
  await page.locator('#opA').fill('13');await page.locator('#opB').fill('0');
  for(const op of ['/','%']){await page.locator('#operator').selectOption(op);check((await text(page,'#opExplain')).includes('不能为 0'),'zero divisor explained');}
  await page.locator('#opA').fill('-13');await page.locator('#opB').fill('5');await page.locator('#operator').selectOption('/');check(await text(page,'#opResult')==='-2','integer divide truncates toward zero');
  await page.locator('#operator').selectOption('%');check(await text(page,'#opResult')==='-3','C++ signed remainder');
  await lesson(page,'u1-l7');await page.locator('[data-ascii="32"]').click();check(await page.locator('#asciiRange').inputValue()==='32','space slider synchronized');check(await text(page,'#asciiChar')==='空格','space display synchronized');
  await lesson(page,'u1-l8');await page.locator('#logicOp').selectOption('&&');check((await text(page,'#ruleCorrect')).includes('正确'),'AND rule correct');
  await page.locator('#logicTemp').fill('30');check(await text(page,'#truthFinal')==='FALSE','correct rule can produce false');
  await page.locator('#logicOp').selectOption('||');check(!(await page.locator('[data-next-step]').getAttribute('class')).includes('ready'),'OR removes ready');check((await text(page,'#ruleCorrect')).includes('应使用'),'OR diagnosis updated');
  await page.locator('#logicTemp').fill('');check(await text(page,'#truthFinal')==='—','logic empty input clears results');

  // Wrong options, hints, refresh and storage identity.
  await lesson(page,'u1-l1','practice');
  const q1=data.bank.lessons['u1-l1'][0];await page.locator('[data-answer="0"]').click();check((await text(page,'#answerFeedback')).includes(q1.wrong[0]),'specific wrong feedback');
  await page.locator('[data-hint]').click();check(await page.locator('[data-hint]').isDisabled(),'repeated hint cannot inflate count');
  await clickAnswer(page,'u1-l1',0);await page.reload();await page.locator('[data-continue]').click();check(await page.locator('[data-step="practice"]').getAttribute('aria-current')==='step','resume exact step');
  check((await text(page,'#answerFeedback')).includes('提示后答对'),'hint evidence restored');
  const legacy=await fresh({completed:[1,4],attempts:{1:3},hints:{1:1},chapterScores:{1:4},challengePassed:4,lastLesson:7});
  check((await saved(legacy)).units.u1.completed.includes('u1-l4'),'legacy completed migrated');
  await legacy.locator('[data-continue]').click();check((await text(legacy,'.lesson-sidebar h2'))==='字符与 ASCII','legacy lastLesson retained');
  await unit(legacy);await legacy.locator('[data-open-report]').click();check((await text(legacy,'.report-page')).includes('旧记录没有逐题答案'),'legacy report has no invented per-question evidence');
  check((await text(legacy,'.report-list')).includes('历史步骤未知'),'legacy missing step evidence is unknown');
  check((await saved(legacy)).units.u2.completed.length===0,'legacy not mixed into unit2');

  await lesson(page,'u1-l3','practice');await page.locator('[data-solution]').click();await clickAnswer(page,'u1-l3',0);
  check((await saved(page)).units.u1.questions['u1-l3-q1'].firstSolved.solution,'solution-assisted answer recorded');
  await lesson(page,'u2-l6');await page.locator('#branchPrediction').selectOption('A');await page.locator('#branchRun').click();
  check(!(await saved(page)).units.u2.evidence['u2-l6'].lab['60'],'wrong prediction does not earn experiment evidence');
  await page.locator('#branchInput').fill('Infinity');await page.locator('#branchRun').click();check((await text(page,'#branchResult')).includes('有限整数'),'branch rejects nonfinite input');
  // Greenhouse stale result, monotonic best and persisted draft.
  await unit(page);await page.locator('[data-open-challenge]').click();
  for(const [id,value] of Object.entries({temperatureType:'double',waterType:'int',modeType:'char',tempRule:'lt',joinRule:'and',modeRule:'char'}))await page.locator('#'+id).selectOption(value);
  await page.locator('#submitChallenge').click();check(await page.locator('.pass').count()===4,'four greenhouse requirement checks pass');
  const before=(await saved(page)).units.u1.challenge.best;
  await page.locator('#joinRule').selectOption('or');check(await page.locator('.pass').count()===0,'changing greenhouse invalidates all results');
  await page.locator('#submitChallenge').click();check((await saved(page)).units.u1.challenge.best===before,'failed retry preserves best');
  check((await saved(page)).units.u1.challenge.latest.passed===3,'latest result separate');
  await page.reload();await page.locator('[data-continue]').click();check(await page.locator('#joinRule').inputValue()==='or','challenge draft survives refresh');

  // Complete every lab through the UI; completion only after summary acknowledgement.
  async function runBranch(p,n,variant,prediction){await p.locator('#branchInput').fill(String(n));if(variant!==undefined)await p.locator('#branchVariant').selectOption(variant);if(prediction!==undefined)await p.locator('#branchPrediction').selectOption(prediction);await p.locator('#branchRun').click();}
  const learn=await fresh();
  for(const l of data.lessons){
    await lesson(learn,l.id);
    if(l.labId===1)for(const f of ['input','process','output'])await learn.locator(`[data-flow="${f}"]`).click();
    if(l.labId===2){await learn.locator('#ioRun').click();await learn.waitForTimeout(320);}
    if(l.labId===3)for(let i=0;i<4;i++)await learn.locator('#variableNext').click();
    if(l.labId===4)for(const [i,t] of ['int','double','char','bool','int','char'].entries()){await learn.locator(`[data-card="${i}"]`).click();await learn.locator(`[data-bin="${t}"]`).click();}
    if(l.labId===5)await learn.locator('#opRun').click();
    if(l.labId===6)for(const k of ['mixed','cast','order'])await learn.locator(`[data-convert="${k}"]`).click();
    if(l.labId===7)await learn.locator('[data-ascii="48"]').click();
    if(l.labId===8)await learn.locator('#logicOp').selectOption('&&');
    if(l.lab?.kind==='if'){await runBranch(learn,29);await runBranch(learn,30);}
    if(l.lab?.kind==='else'){await runBranch(learn,59);await runBranch(learn,60);}
    if(l.lab?.kind==='order'){await runBranch(learn,95,'bad');check((await text(learn,'#branchResult')).includes('B'),'wrong order simulated');await runBranch(learn,95,'good');for(const n of [59,60,90])await runBranch(learn,n,'good');}
    if(l.lab?.kind==='nested'){await runBranch(learn,10,'yes');await runBranch(learn,12,'no');await runBranch(learn,12,'yes');}
    if(l.lab?.kind==='switch'){await runBranch(learn,1,'break');await runBranch(learn,1,'fall');check((await text(learn,'#branchResult')).includes('AB'),'fallthrough output');await runBranch(learn,0,'break');await learn.locator('#ternaryRun').click();}
    if(l.lab?.kind==='boundary')for(const [n,pred] of [[-1,'INVALID'],[0,'C'],[59,'C'],[60,'B'],[89,'B'],[90,'A'],[100,'A'],[101,'INVALID'],[75,'B']])await runBranch(learn,n,undefined,pred);
    check(await learn.locator('[data-next-step]').isEnabled(),`${l.id} lab requirements completed`);
    await learn.locator('[data-next-step]').click();await clickAnswer(learn,l.id,0);await learn.locator('#questionContinue').click();await clickAnswer(learn,l.id,1);await learn.locator('#questionContinue').click();
    check(!(await saved(learn)).units[l.unit].completed.includes(l.id),`${l.id} summary confirmation required`);
    await learn.locator('[data-confirm-summary]').click();check((await saved(learn)).units[l.unit].completed.includes(l.id),`${l.id} full completion stored`);
    if(l.id==='u1-l4'||l.id==='u1-l8'||l.id==='u2-l3'||l.id==='u2-l6'){await learn.locator('[data-next-lesson]').click();check(await learn.locator('.quiz-page').count()===1,`${l.id} leads to chapter quiz`);}
  }
  // Chapters: partial response restores, wrong question links exist, all paths return.
  for(const [chapter,qs] of Object.entries(data.bank.chapters)){
    await unit(learn,chapter.split('-')[0]);await learn.locator(`[data-quiz="${chapter}"]`).click();
    for(let i=0;i<qs.length;i++){
      const answer=i===0?(qs[i].answer+1)%4:qs[i].answer;
      await learn.locator(`[data-quiz-answer="${answer}"]`).click();
      if(i===0){await learn.reload();await learn.locator('[data-continue]').click();check(await learn.locator('[data-quiz-answer]').first().isDisabled(),'answered quiz survives refresh');}
      await learn.locator('#quizNext').click();
    }
    check(await learn.locator('[data-review]').count()===1,`${chapter} actual wrong lesson link`);
    check((await saved(learn)).units[chapter.split('-')[0]].chapters[chapter].score===qs.length-1,`${chapter} score`);
    await learn.locator('[data-next]').click();check(await learn.locator(chapter.endsWith('c1')?'.lesson-shell':'.challenge-page').count()===1,`${chapter} sequential next`);
  }
  check(Object.values((await saved(learn)).units.u2.questions).every(r=>r.firstSolved.attempt===1&&!r.firstSolved.hint&&!r.firstSolved.solution),'first-attempt evidence precise');
  // Unit 2 challenge: failure, valid samples, stale invalidation and monotonic progress.
  await unit(learn,'u2');await learn.locator('[data-open-challenge]').click();
  for(const [id,v] of Object.entries({decisionGuard:'yes',decisionOrder:'high',decisionOperator:'ge'}))await learn.locator('#'+id).selectOption(v);
  await learn.locator('#decisionCases').fill('50:C\n75:B\n95:A');await learn.locator('#submitDecision').click();check((await saved(learn)).units.u2.challenge.latest.passed===3,'normal inputs alone miss boundary criterion');
  const cases='-1:INVALID\n0:C\n59:C\n60:B\n89:B\n90:A\n100:A\n101:INVALID\n50:C\n75:B\n95:A';
  await learn.locator('#decisionCases').fill(cases);await learn.locator('#submitDecision').click();check((await saved(learn)).units.u2.challenge.best===4,'unit2 challenge complete');check(await learn.locator('tbody tr').count()===11,'sample input expected actual table');
  await learn.locator('#decisionOperator').selectOption('gt');check(await learn.locator('tbody tr').count()===0,'modified challenge clears sample outputs');await learn.locator('#submitDecision').click();check((await saved(learn)).units.u2.challenge.best===4,'unit2 completion monotonic');check(await learn.locator('td.fail').count()>0,'boundary mutation detected');
  await learn.locator('#decisionCases').fill('<img src=x>');await learn.locator('#submitDecision').click();check((await text(learn,'#testResults')).includes('格式不正确'),'invalid test syntax rejected');check(await learn.locator('#testResults img').count()===0,'test input safely rendered');
  await learn.locator('[data-report]').click();check((await text(learn,'.report-page')).includes('最近一次提交'),'report latest result shown');
  await learn.screenshot({path:path.join(artifacts,'report-desktop.png'),fullPage:true});
  // Complete the remaining greenhouse through real controls, then verify the finished-course entry.
  await unit(learn,'u1');await learn.locator('[data-open-challenge]').click();
  for(const [id,value] of Object.entries({temperatureType:'double',waterType:'int',modeType:'char',tempRule:'lt',joinRule:'and',modeRule:'char'}))await learn.locator('#'+id).selectOption(value);
  await learn.locator('#submitChallenge').click();await learn.locator('[data-nav="home"]').first().click();
  check((await text(learn,'.recommendation')).includes('已完成全部开放内容'),'all-complete recommendation');
  await learn.locator('[data-recommend]').click();check(await learn.locator('.report-page').count()===1,'all-complete entry leads to report');
  // Real user-selected option diagnostics across every question, not just answer indices.
  const wrongPage=await fresh();
  for(const [id,qs] of Object.entries(data.bank.lessons))for(let i=0;i<qs.length;i++){
    await lesson(wrongPage,id,i?'exam':'practice');const q=qs[i];
    for(let j=0;j<q.options.length;j++)if(j!==q.answer){await wrongPage.locator(`[data-answer="${j}"]`).click();check((await text(wrongPage,'#answerFeedback')).includes(q.wrong[j]),`${q.id}: displayed feedback ${j}`);}
  }
  // Mobile navigation/layout, including narrow 320 px and long code/questions.
  const mobile=await fresh(undefined,true);
  for(const width of [390,320]){
    await mobile.setViewportSize({width,height:844});await noOverflow(mobile,'home '+width);
    await lesson(mobile,'u1-l2','exam');await noOverflow(mobile,'I/O question '+width);
    check(await mobile.locator('[data-step]').count()===4,'all mobile steps present');
    for(const el of await mobile.locator('[data-step]').all()){const box=await el.boundingBox();check(box.x>=0&&box.x+box.width<=width,'step labels fit screen');}
    if(width===390)await mobile.screenshot({path:path.join(artifacts,'question-mobile.png'),fullPage:true});
    for(const id of data.lessons.map(l=>l.id)){await lesson(mobile,id);await noOverflow(mobile,id+' '+width);}
    await unit(mobile,'u2');await mobile.locator('[data-open-challenge]').click();await noOverflow(mobile,'unit2 challenge '+width);
    if(width===390)await mobile.screenshot({path:path.join(artifacts,'challenge-mobile.png'),fullPage:true});
    await mobile.locator('[data-report]').click();await noOverflow(mobile,'report '+width);await mobile.locator('[data-nav="home"]').first().click();
  }
  // Reset only the selected unit, preserve the other. Cancel never clears.
  await unit(learn,'u2');await learn.locator('[data-open-report]').click();
  let beforeReset=await saved(learn);learn.once('dialog',d=>d.dismiss());await learn.locator('[data-reset-unit]').click();check((await saved(learn)).units.u2.completed.length===6,'cancel reset preserved records');
  learn.once('dialog',d=>d.accept());await learn.locator('[data-reset-unit]').click();let afterReset=await saved(learn);check(afterReset.units.u2.completed.length===0,'unit2 reset');check(JSON.stringify(afterReset.units.u1)===JSON.stringify(beforeReset.units.u1),'unit1 completely isolated from reset');
  await learn.reload();check((await saved(learn)).units.u2.completed.length===0,'reset persisted');
  await unit(learn,'u1');await learn.locator('[data-open-report]').click();learn.once('dialog',d=>d.accept());await learn.locator('[data-reset-all]').click();afterReset=await saved(learn);check(afterReset.units.u1.completed.length+afterReset.units.u2.completed.length===0,'all reset');check(afterReset.lastPosition===null,'reset removes continuation');
  check(requests.every(url=>url.startsWith('file:')),'file:// website needs no network resources');
  // Same five files served over HTTP, matching Pages artifact layout.
  server=http.createServer((req,res)=>{const rel=decodeURIComponent(req.url.split('?')[0]).replace(/^\//,'')||'index.html';if(!['index.html','styles.css','app.js','data/lessons.js','data/questions.js'].includes(rel)){res.writeHead(404);return res.end();}res.setHeader('Content-Type',rel.endsWith('.js')?'text/javascript':rel.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(path.join(root,rel)));});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const online=await fresh(undefined,false,`http://127.0.0.1:${server.address().port}/`);await lesson(online,'u2-l1');check(await online.locator('#branchRun').count()===1,'HTTP artifact layout works');
  check(errors.length===0,`no browser errors: ${errors.join('; ')}`);
  console.log(`PASS: ${assertions} assertions; 14 labs, 50 questions, 4 chapter quizzes, 2 challenges; file + HTTP; desktop + 390/320 px. Screenshots: ${artifacts}`);
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{if(server)await new Promise(resolve=>server.close(resolve));if(browser)await browser.close();});
