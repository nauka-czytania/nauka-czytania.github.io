"use strict";
const vowels = ["A","Ą","E","Ę","I","O","Ó","U","Y"];
const consonants = ["B","C","D","F","G","K","L","M","N","P","R","S","T","W","Z"];
const syllableWords = [
  {word:"MAMA", parts:["MA","MA"]}, {word:"LATO", parts:["LA","TO"]},
  {word:"WODA", parts:["WO","DA"]}, {word:"ROWER", parts:["RO","WER"]},
  {word:"ŻABA", parts:["ŻA","BA"]}, {word:"KOTEK", parts:["KO","TEK"]},
  {word:"SZAFA", parts:["SZA","FA"]}, {word:"CZAPKA", parts:["CZAP","KA"]}
];
const meanings = [
  {q:"Kot śpi na...", ok:"dywanie", opts:["dywanie","pije","zielony"]},
  {q:"Pijemy wodę, gdy chce nam się...", ok:"pić", opts:["spać","pić","biegać"]},
  {q:"Zimą zakładamy ciepłą...", ok:"kurtkę", opts:["kurtkę","łyżkę","lampę"]},
  {q:"Rower ma dwa...", ok:"koła", opts:["okna","koła","skrzydła"]},
  {q:"Książkę można...", ok:"czytać", opts:["czytać","wypić","założyć"]},
  {q:"Ryba pływa w...", ok:"wodzie", opts:["wodzie","szafie","piaskownicy"]}
];
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>[...a].sort(()=>Math.random()-.5);

function newVowel(){
  const answer=pick(vowels), opts=shuffle([answer,pick(consonants),pick(consonants),pick(vowels.filter(v=>v!==answer))]);
  document.getElementById('vowelPrompt').textContent=`Wskaż samogłoskę ${answer}.`;
  const box=document.getElementById('vowelOptions'); box.innerHTML='';
  document.getElementById('vowelFeedback').textContent='';
  opts.forEach(x=>{const b=document.createElement('button'); b.textContent=x; b.onclick=()=>{document.getElementById('vowelFeedback').textContent=x===answer?'Brawo! To właściwa samogłoska.':'Spróbuj jeszcze raz.';}; box.appendChild(b);});
}
function newSyllable(){
  const item=pick(syllableWords), box=document.getElementById('syllableOptions'), built=document.getElementById('syllableBuilt');
  box.innerHTML=''; built.textContent=''; document.getElementById('syllableFeedback').textContent='';
  document.getElementById('syllablePrompt').textContent=`Ułóż wyraz: ${item.word}`;
  let selected=[];
  shuffle(item.parts.map((p,i)=>({p,i}))).forEach(obj=>{const b=document.createElement('button'); b.textContent=obj.p; b.onclick=()=>{ if(b.disabled)return; b.disabled=true; selected.push(obj); built.textContent=selected.map(x=>x.p).join(' + '); if(selected.length===item.parts.length){ const got=selected.map(x=>x.p).join(''); document.getElementById('syllableFeedback').textContent=got===item.word?'Świetnie! Wyraz jest ułożony poprawnie.':'Kolejność nie pasuje. Uruchom nowe zadanie i spróbuj ponownie.'; }}; box.appendChild(b);});
}
function newMeaning(){
  const item=pick(meanings); document.getElementById('meaningPrompt').textContent=item.q; document.getElementById('meaningFeedback').textContent='';
  const box=document.getElementById('meaningOptions'); box.innerHTML='';
  shuffle(item.opts).forEach(x=>{const b=document.createElement('button'); b.textContent=x; b.onclick=()=>{document.getElementById('meaningFeedback').textContent=x===item.ok?`Tak! ${item.q.replace('...', x)}`:'To słowo nie pasuje do znaczenia zdania. Spróbuj jeszcze raz.';}; box.appendChild(b);});
}
document.getElementById('newVowel').onclick=newVowel;
document.getElementById('newSyllable').onclick=newSyllable;
document.getElementById('newMeaning').onclick=newMeaning;
newVowel(); newSyllable(); newMeaning();
