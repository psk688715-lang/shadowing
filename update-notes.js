// Rebuild notes.json from the vault's English folder. Run: node update-notes.js
// Only notes.json changes; index.html is edited by hand from here on.
const fs=require('fs'),path=require('path');
const dir='G:/내 드라이브/세컨브레인/3. Resource/영어공부/';
const notes={};
for(const f of fs.readdirSync(dir).filter(f=>/^\d{4}-\d{2}-\d{2}.*\.md$/.test(f)).sort()){
  const md=fs.readFileSync(dir+f,'utf8'),date=f.slice(0,10);
  let id='n-'+date;
  if(notes[id])id+='-'+notes[id+'#n']++;else notes[id+'#n']=2;
  notes[id]={title:((md.match(/^#\s+(.+)$/m)||[])[1]||'').replace(/\*\*|\*|`/g,'').trim(),
    label:f.replace(/\.md$/,'').replace(/^\d{4}-\d{2}-\d{2}[_ -]*/,'').replace(/_/g,' ').trim(),date,md};
}
for(const k of Object.keys(notes))if(k.endsWith('#n'))delete notes[k];
/* workbooks: undated, so they sort before the dated shadowing notes; 4판 before 5판 by id */
const books=dir+'스터디북/';
if(fs.existsSync(books))for(const f of fs.readdirSync(books).filter(f=>f.endsWith('.md')).sort()){
  const md=fs.readFileSync(books+f,'utf8'),ed=(f.match(/(\d+)판/)||[])[1];
  const id='n-book'+(ed||f.replace(/\.md$/,'').replace(/[^A-Za-z0-9]/g,'').slice(0,20));
  notes[id]={title:((md.match(/^#\s+(.+)$/m)||[])[1]||'').trim(),
    label:'스터디북 '+(ed?ed+'판':'')+(/REAL.?TALK/i.test(f)?' REAL TALK':''),date:'',md};
}
fs.writeFileSync(path.join(__dirname,'notes.json'),JSON.stringify({notes},null,1));
console.log(Object.keys(notes).join('\n'));
