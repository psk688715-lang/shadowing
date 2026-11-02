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
fs.writeFileSync(path.join(__dirname,'notes.json'),JSON.stringify({notes},null,1));
console.log(Object.keys(notes).join('\n'));
