/* Independent C++ oracle for program-reading questions and boundary semantics. */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),vm=require('node:vm'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname,'../GESP_Unit1_Interactive_Demo/data/questions.js'),'utf8'),context);
const bank=context.window.GESP_QUESTIONS;
const questions=[...Object.values(bank.lessons).flat(),...Object.values(bank.chapters).flat()];
const expected={
  'u1-l2-q2':'6 12','u1-l3-q1':'10','u1-l4-q2':'11','u1-l5-q1':'2','u1-l5-q2':'2','u1-l6-q1':'3','u1-l6-q2':'6.5','u1-l7-q1':'65','u1-l7-q2':'57',
  'u1-c1-q4':'16','u1-c2-q1':'2','u1-c2-q2':'3','u1-c2-q3':'2','u1-c2-q4':'1','u1-c2-q5':'4','u1-c2-q6':'65',
  'u2-l1-q1':'DONE','u2-l1-q2':'B','u2-l2-q1':'PASS','u2-l2-q2':'2','u2-l3-q1':'B','u2-l4-q1':'TOO_YOUNG','u2-l4-q2':'Y','u2-l5-q1':'AB','u2-l5-q2':'7',
  'u2-c1-q1':'E','u2-c1-q2':'EVEN','u2-c1-q3':'B','u2-c2-q1':'2','u2-c2-q2':'X','u2-c2-q3':'3'
};
const prefixes={'u2-l4-q1':'int age=10; bool prepared=true;','u2-l5-q1':'int choice=1;','u2-c2-q1':'int x=5,y=-1;'};
const suffixes={'u1-l3-q1':'cout << a;','u1-c1-q4':'cout << n;','u2-c2-q3':'cout << y;'};
const missingCode={'u1-l5-q1':'cout << 13 / 5;','u1-l6-q1':'cout << int(3.8);'};
const cppString=s=>JSON.stringify(String(s));
let source='#include <iostream>\n#include <sstream>\n#include <string>\n#include <cassert>\nusing namespace std;\nint main(){\n';
for(const [id,want] of Object.entries(expected)){
  const q=questions.find(q=>q.id===id);assert(q,`missing ${id}`);assert.equal(q.options[q.answer],want,`${id}: reviewed answer agrees with independent expected output`);
  let code=q.code||missingCode[id];
  if(id==='u1-l2-q2')code=code.replace('#include <iostream>','').replace('using namespace std;','').replace('int main() {','').replace('return 0;','').replace(/}\s*$/,'');
  source+=`{ ostringstream output; istringstream input(${cppString(q.input||'')}); auto& cout=output;auto& cin=input;\n${prefixes[id]||''}\n${code}\n${suffixes[id]||''}\nif(output.str()!=${cppString(want)}){cerr<<${cppString(id)}<<": "<<output.str()<<endl;return 1;} }\n`;
}
source+=`
assert(-13/5==-2 && -13%5==-3);
assert(int(-3.8)==-3);
assert(double(3/2)==1.0 && double(3)/2==1.5);
bool counter[3]={false,false,false};
for(int x=-2;x<=12;x++)for(int y=-2;y<=12;y++){
 bool original=!(x>5 && y<=10);
 assert(original==(x<=5 || y>10));
 counter[0] |= original!=(x<=5 && y>10);
 counter[1] |= original!=(x>5 || y<=10);
 counter[2] |= original!=(!x>5 && !y<=10);
}
assert(counter[0]&&counter[1]&&counter[2]);
for(int score=0;score<=100;score++)assert(((score>=60)!=(score>60))==(score==60));
cout << "PASS: 31 program-reading questions compiled and executed; signed arithmetic, casts, logic equivalence and threshold mutation checked." << endl;
}
`;
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'csp-content-'));const file=path.join(dir,'content.cpp'),binary=path.join(dir,'content');fs.writeFileSync(file,source);
execFileSync(process.env.CXX||'clang++',['-std=c++17','-Wno-logical-not-parentheses',file,'-o',binary],{stdio:'inherit'});
execFileSync(binary,[],{stdio:'inherit'});
