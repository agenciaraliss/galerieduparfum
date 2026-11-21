/* CAMADA PAINEL: faz o que estava fixo no código seguir o que está no painel */
(function(){
if(window.__gdpPainel)return;window.__gdpPainel=1;
var KEY='gdpLinkChk3',TTL=6*3600*1000,SKIP=/^\/(account|cart|checkout|search|busca|produtos\/.+|galerie-cfg)/;

function cget(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function cset(o){try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}}
function path(a){var h=a.getAttribute('href')||'';if(!/^\//.test(h)||/^\/\//.test(h))return null;h=h.split('#')[0].split('?')[0];return h&&h!=='/'?h:null}
function scope(){return document.querySelectorAll('#g-hdr a,#gft a,#gdp-drawer a,.g-drawer a')}

/* 1. (desligado) nenhum link é escondido; funções abaixo ficam sem uso */
function hide(a){if(a.getAttribute('data-gdp-dead'))return;a.setAttribute('data-gdp-dead','1');a.style.display='none';
var li=a.closest('li');if(li&&!li.querySelector('a:not([data-gdp-dead])'))li.style.display='none'}
function show(a){if(!a.getAttribute('data-gdp-dead'))return;a.removeAttribute('data-gdp-dead');a.style.display='';var li=a.closest('li');if(li)li.style.display=''}
function apply(c){var as=scope(),i,p;for(i=0;i<as.length;i++){p=path(as[i]);if(!p||SKIP.test(p))continue;if(c[p]&&c[p].d)hide(as[i]);else if(c[p])show(as[i])}}
function check(p){return fetch(p,{credentials:'same-origin'}).then(function(r){if(r.status===404)return 1;return r.text().then(function(t){var d=new DOMParser().parseFromString(t,'text/html'),n=0,cs=d.querySelectorAll('.js-item-product'),i,x;
for(i=0;i<cs.length;i++){x=cs[i].querySelector('.js-item-name');if(x&&x.textContent.trim())n++}
return(n===0&&/^Comprar\s/i.test(d.title||'')&&!d.querySelector('.js-product-table'))?1:0})}).then(function(v){return v},function(){return null})}
function guard(){var c=cget(),as=scope(),seen={},todo=[],i,p;apply(c);
for(i=0;i<as.length;i++){p=path(as[i]);if(!p||SKIP.test(p)||seen[p])continue;seen[p]=1;if(!c[p]||Date.now()-c[p].t>TTL)todo.push(p)}
(function next(){var q=todo.shift();if(!q){cset(c);apply(c);return}
check(q).then(function(v){if(v!==null)c[q]={d:v,t:Date.now()};next()})})()}

/* 2. MENU: item novo criado no painel entra no topo (nada é escondido) */
function menu(){var tops=document.querySelectorAll('ul.js-nav-desktop-list>li'),all=document.querySelectorAll('ul.js-nav-desktop-list a');if(all.length<3)return;
var np={},nt={},i,p,lis=document.querySelectorAll('#g-hdr li.g-ni'),first=lis[0],mine={};
for(i=0;i<all.length;i++){p=all[i].pathname;if(p)np[p]=1}
for(i=0;i<tops.length;i++){var ta=tops[i].querySelector('a');if(ta&&ta.pathname)nt[ta.pathname]=ta}
for(i=0;i<lis.length;i++){var a=lis[i].querySelector(':scope>a');if(!a)continue;p=path(a);if(!p)continue;mine[p]=1;
}
if(!first)return;var last=lis[lis.length-1];
for(p in nt){if(mine[p]||SKIP.test(p)||document.querySelector('#g-hdr li[data-gdp-new="'+p+'"]'))continue;
var cl=first.cloneNode(true),ca=cl.querySelector('a');if(!ca)continue;[].slice.call(cl.querySelectorAll('ul,div')).forEach(function(e){e.remove()});
cl.style.display='';cl.removeAttribute('data-gdp-menu-off');cl.setAttribute('data-gdp-new',p);ca.setAttribute('href',p);ca.textContent=nt[p].textContent.replace(/\s+/g,' ').trim();ca.removeAttribute('data-gdp-dead');ca.style.display='';
last.parentNode.insertBefore(cl,last.nextSibling);last=cl}}

/* 3. BUSCA: a loja usa /search/, nunca /busca/ */
function busca(){var as=document.querySelectorAll('a[href*="/busca/"]'),i;for(i=0;i<as.length;i++)as[i].setAttribute('href',as[i].getAttribute('href').replace('/busca/','/search/'))}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href*="/busca/"]');if(a){e.preventDefault();location.href=a.getAttribute('href').replace('/busca/','/search/')}},true);

/* 4. LOGO: usa a logo que está no painel (só troca se for outro arquivo) */
function key(u){var m=(u||'').match(/(\d{10})(?:-\d+-\d+)?\.(?:png|webp|jpe?g|svg)/);return m?m[1]:null}
function logo(){var n=document.querySelector('img.logo-img');if(!n)return;var s=n.currentSrc||n.src,k=key(s);if(!s||!k)return;
var ls=document.querySelectorAll('#g-hdr img[src*="themes/common/logo"],#gft img[src*="themes/common/logo"]'),i;
for(i=0;i<ls.length;i++){if(key(ls[i].src)!==k){ls[i].removeAttribute('srcset');ls[i].src=s}}}

/* 5. ANO DO RODAPÉ */
function ano(){var f=document.querySelector('#gft');if(!f)return;var y=String(new Date().getFullYear()),w=document.createTreeWalker(f,NodeFilter.SHOW_TEXT),n,v;
while(n=w.nextNode()){if(/(Copyright|©)[^0-9]{0,60}20\d\d/i.test(n.nodeValue)){v=n.nodeValue.replace(/((?:Copyright|©)[^0-9]{0,60})20\d\d/i,'$1'+y);if(v!==n.nodeValue)n.nodeValue=v}}}

/* 6. BARRA: se existir a página interna /galerie-cfg-barra/, o texto dela vira a barra. Use *palavra* para destacar o cupom */
function barra(){var mq=document.querySelector('#gdp-marquee-wrap .gdp-mq');if(!mq)return;
fetch('/galerie-cfg-barra/',{credentials:'same-origin'}).then(function(r){if(r.status!==200)return null;return r.text()}).then(function(t){if(!t)return;
var d=new DOMParser().parseFromString(t,'text/html'),el=d.querySelector('.user-content,[data-store="page-content"],.page-content,main'),x=el?el.textContent.replace(/\s+/g,' ').trim():'';
if(!x||x.length>200)return;
var h=x.replace(/[<>&]/g,'').replace(/\*([^*]+)\*/g,'<span class="gdp-code">$1</span>'),sep='&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;',out='',k;
for(k=0;k<6;k++)out+=h+sep;if(mq.getAttribute('data-gdp-bar')!==out){mq.innerHTML=out;mq.setAttribute('data-gdp-bar',out)}}).catch(function(){})}

function all(){try{busca()}catch(e){}try{logo()}catch(e){}try{ano()}catch(e){}try{menu()}catch(e){}}
function init(){all();try{barra()}catch(e){}
var tm;try{new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(function(){try{all();apply(cget())}catch(e){}},150)}).observe(document.body,{childList:true,subtree:true})}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,600)});else setTimeout(init,600);
})();
