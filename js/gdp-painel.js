/* GALERIE DU PARFUM · CAMADA PAINEL v2
   Menu, submenus, aromas, rodapé, redes sociais, WhatsApp, logo e ano seguem o painel da Nuvemshop.
   O design continua o do código; só os textos, links e itens vêm do painel. */
(function(){
if(window.__gdpPainel2)return;window.__gdpPainel2=1;
var SK='gdpPainelN',TTL=300000,N0=null,reps=0;
var KEEP=/^\/(account|cart|checkout|contato|search|busca|galerie-cfg)/;
var SOC={'instagram.com':'instagram','facebook.com':'facebook','fb.com':'facebook','tiktok.com':'tiktok','youtube.com':'youtube','youtu.be':'youtube','pinterest.com':'pinterest','twitter.com':'twitter','x.com':'twitter','linkedin.com':'linkedin','wa.me':'wa','api.whatsapp.com':'wa','whatsapp.com':'wa'};
function stem(t){return (t||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim().replace(/s$/,'')}
function clean(t){return (t||'').replace(/\s+/g,' ').trim()}
function pth(h){try{var u=new URL(h,location.origin);if(u.hostname.replace(/^www\./,'')!==location.hostname.replace(/^www\./,''))return null;return u.pathname}catch(e){return null}}
function hst(h){try{return new URL(h,location.origin).hostname.replace(/^www\./,'')}catch(e){return ''}}
function setTxt(a,t){if(a.children.length===0&&clean(a.textContent)!==t)a.textContent=t}
function setHref(a,p){if(a.getAttribute('href')!==p)a.setAttribute('href',p)}
function show(e){if(e.getAttribute('data-gdp-gone')){e.style.display='';e.removeAttribute('data-gdp-gone')}}
function gone(e){if(!e.getAttribute('data-gdp-gone')){e.style.display='none';e.setAttribute('data-gdp-gone','1')}}

/* ---------- LEITURA DO PAINEL (HTML original da loja) ---------- */
function parse(d){
var N={nav:null,foot:null,social:null,wa:null},tops=d.querySelectorAll('ul.js-nav-desktop-list>li'),i,j,a,p,ks,ka,kp;
if(tops.length>=3){N.nav=[];for(i=0;i<tops.length;i++){a=tops[i].querySelector('a');if(!a)continue;p=pth(a.getAttribute('href'));if(!p)continue;ks=[];ka=tops[i].querySelectorAll('ul a');
for(j=0;j<ka.length;j++){kp=pth(ka[j].getAttribute('href'));if(kp&&kp!==p&&!ks.some(function(x){return x.p===kp}))ks.push({p:kp,t:clean(ka[j].textContent)})}
N.nav.push({p:p,t:clean(a.textContent),k:ks})}}
var nf=d.querySelector('footer.js-footer');
if(nf){N.foot=[];var us=nf.querySelectorAll('ul'),g,as,fp;
for(i=0;i<us.length;i++){g=[];as=us[i].querySelectorAll('a');for(j=0;j<as.length;j++){fp=pth(as[j].getAttribute('href'));if(fp&&fp!=='/'&&!/ferramentas/.test(fp)&&clean(as[j].textContent))g.push({p:fp,t:clean(as[j].textContent)})}N.foot.push(g)}
N.social={};var sa=nf.querySelectorAll('a[href]'),h,k;
for(j=0;j<sa.length;j++){h=sa[j].getAttribute('href');k=SOC[hst(h)];if(k&&k!=='wa'&&!N.social[k])N.social[k]=h}}
var w=d.querySelector('a[href*="wa.me"],a[href*="api.whatsapp.com"]');if(w)N.wa=w.getAttribute('href');
return N}
function dados(cb){var c;try{c=JSON.parse(sessionStorage.getItem(SK));if(c&&Date.now()-c.t<TTL)return cb(c.N)}catch(e){}
fetch('/',{credentials:'same-origin'}).then(function(r){return r.text()}).then(function(h){var N=parse(new DOMParser().parseFromString(h,'text/html'));try{sessionStorage.setItem(SK,JSON.stringify({N:N,t:Date.now()}))}catch(e){}cb(N)}).catch(function(){})}

/* ---------- MENU: nível principal (topo e celular) ---------- */
function topos(N){var nav=N.nav;if(!nav)return;
var lis=[].slice.call(document.querySelectorAll('#g-hdr li.g-ni')),used={},base=null,last=null;
lis.forEach(function(li){var a=li.querySelector(':scope>a');if(!a)return;var p=pth(a.getAttribute('href'));if(!p)return;
var n=nav.filter(function(x){return x.p===p})[0]||nav.filter(function(x){return stem(x.t)===stem(a.textContent)})[0];
if(n){used[n.p]=1;setHref(a,n.p);setTxt(a,n.t);show(li)}else gone(li);
if(!base&&a.classList.contains('g-plain'))base=li;last=li});
if(!last)return;base=base||last;
nav.forEach(function(n){if(used[n.p]||document.querySelector('#g-hdr li[data-gdp-new="'+n.p+'"]'))return;var cl=base.cloneNode(true),ca=cl.querySelector(':scope>a');if(!ca)return;
[].slice.call(cl.children).forEach(function(c){if(c!==ca)c.remove()});cl.style.display='';cl.removeAttribute('data-gdp-gone');cl.setAttribute('data-gdp-new',n.p);setHref(ca,n.p);ca.textContent=n.t;last.parentNode.insertBefore(cl,last.nextSibling);last=cl})}
function topoCel(N){var nav=N.nav;if(!nav)return;
var lis=[].slice.call(document.querySelectorAll('#g-drw ul.g-db>li.g-di')),used={},base=null,last=null;
lis.forEach(function(li){var ds=li.querySelector(':scope>.g-ds'),b=li.querySelector(':scope>button.g-dt'),a=li.querySelector(':scope>a'),p=null,el=b||a;if(!el)return;
if(ds){var all=ds.querySelector('a.g-dsa');p=all?pth(all.getAttribute('href')):null}else if(a)p=pth(a.getAttribute('href'));
var n=(p&&nav.filter(function(x){return x.p===p})[0])||nav.filter(function(x){return stem(x.t)===stem(el.textContent)})[0];
if(n){used[n.p]=1;if(a&&!ds)setHref(a,n.p);setTxt(el,n.t);show(li)}else if(p&&!KEEP.test(p)){gone(li)}
if(!ds&&a&&!base&&pth(a.getAttribute('href'))&&!KEEP.test(pth(a.getAttribute('href'))))base=li;last=li});
if(!base)return;
nav.forEach(function(n){if(used[n.p]||document.querySelector('#g-drw li[data-gdp-new="'+n.p+'"]'))return;var cl=base.cloneNode(true),ca=cl.querySelector(':scope>a');if(!ca)return;cl.style.display='';cl.removeAttribute('data-gdp-gone');cl.setAttribute('data-gdp-new',n.p);setHref(ca,n.p);ca.textContent=n.t;base.parentNode.insertBefore(cl,base.nextSibling)})}

/* ---------- SUBMENUS (topo e celular) E AROMAS ---------- */
function filhos(root,parentPath,kids,isDrw){
var as=[].slice.call(root.querySelectorAll('a')).filter(function(a){var p=pth(a.getAttribute('href'));return p&&p!==parentPath&&!/ver todos|explorar/i.test(a.textContent)&&!a.classList.contains('g-dsa')});
var items=as.map(function(a){return{a:a,host:isDrw?a:(a.closest('li')||a),m:null}}),ku=kids.map(function(){return false}),i;
items.forEach(function(it){var s=stem(it.a.textContent);for(i=0;i<kids.length;i++){if(!ku[i]&&stem(kids[i].t)===s){ku[i]=true;it.m=kids[i];break}}});
items.forEach(function(it){if(it.m)return;var p=pth(it.a.getAttribute('href'));for(i=0;i<kids.length;i++){if(!ku[i]&&kids[i].p===p){ku[i]=true;it.m=kids[i];break}}});
items.forEach(function(it){if(it.m)return;for(i=0;i<kids.length;i++){if(!ku[i]){ku[i]=true;it.m=kids[i];break}}});
var lastEl=null;
items.forEach(function(it){if(it.m){setHref(it.a,it.m.p);setTxt(it.a,it.m.t);show(it.host)}else gone(it.host);lastEl=it.host});
if(!lastEl)return;
kids.forEach(function(k,j){if(ku[j])return;var cl=lastEl.cloneNode(true);cl.style.display='';cl.removeAttribute('data-gdp-gone');cl.setAttribute('data-gdp-new','1');var ca=cl.tagName==='A'?cl:cl.querySelector('a');if(!ca)return;setHref(ca,k.p);ca.textContent=k.t;ca.classList.remove('g-dsa');lastEl.parentNode.insertBefore(cl,lastEl.nextSibling);lastEl=cl})}
function submenus(N){var nav=N.nav;if(!nav)return;
[].slice.call(document.querySelectorAll('#g-hdr .g-panel')).forEach(function(pn){var m=(pn.id||'').match(/^g-p-(.+)$/);if(!m)return;var pp='/'+m[1]+'/',n=nav.filter(function(x){return x.p===pp})[0];if(n)filhos(pn,pp,n.k,false)});
[].slice.call(document.querySelectorAll('#g-drw .g-ds')).forEach(function(ds){var all=ds.querySelector('a.g-dsa');if(!all)return;var pp=pth(all.getAttribute('href')),n=nav.filter(function(x){return x.p===pp})[0];if(n)filhos(ds,pp,n.k,true)})}

/* ---------- RODAPÉ ---------- */
function lista(ul,items){
var anchors=[].slice.call(ul.querySelectorAll('li>a')),used={},lastLi=null;
anchors.forEach(function(a){var li=a.closest('li'),p=pth(a.getAttribute('href')),it=null,i;
if(p)for(i=0;i<items.length;i++){if(items[i].p===p){it=items[i];break}}
if(!it&&p){for(i=0;i<items.length;i++){if(stem(items[i].t)===stem(a.textContent)){it=items[i];break}}}
if(it&&!used[it.p]){used[it.p]=1;setHref(a,it.p);setTxt(a,it.t);show(li)}else if(!p||KEEP.test(p||'')){show(li)}else gone(li);
lastLi=li});
if(!lastLi)return;
items.forEach(function(it){if(used[it.p])return;used[it.p]=1;var cl=lastLi.cloneNode(true),ca=cl.querySelector('a');if(!ca)return;cl.style.display='';cl.removeAttribute('data-gdp-gone');cl.setAttribute('data-gdp-new','1');ca.removeAttribute('target');ca.removeAttribute('rel');setHref(ca,it.p);ca.textContent=it.t;lastLi.parentNode.insertBefore(cl,lastLi.nextSibling);lastLi=cl})}
function rodape(N){var f=document.querySelector('#gft');if(!f)return;
var uls=[].slice.call(f.querySelectorAll('ul')),claimed=[];
function melhor(items){var best=null,bc=0;uls.forEach(function(u,idx){if(claimed.indexOf(idx)>=0)return;var c=0;[].forEach.call(u.querySelectorAll('li>a'),function(a){var p=pth(a.getAttribute('href'));if(p&&items.some(function(x){return x.p===p}))c++});if(c>bc){bc=c;best=idx}});
if(best===null){uls.forEach(function(u,idx){if(best===null&&claimed.indexOf(idx)<0)best=idx})}return best}
if(N.nav){var items=N.nav.map(function(n){return{p:n.p,t:n.t}}),b=melhor(items);if(b!==null){claimed.push(b);lista(uls[b],items)}}
if(N.foot){N.foot.forEach(function(g){if(!g.length)return;var b=melhor(g);if(b===null)return;claimed.push(b);lista(uls[b],g)})}
var box=document.querySelector('#gft-social');if(box){var map=N.social||{},has=Object.keys(map).length>0;
[].slice.call(box.querySelectorAll('a')).forEach(function(a){var k=SOC[hst(a.getAttribute('href'))];if(!k)return;
if(k==='wa'){if(N.wa){setHref(a,N.wa);a.style.display=''}return}
if(has){if(map[k]){setHref(a,map[k]);a.style.display=''}else a.style.display='none'}})}}

/* ---------- LOGO, ANO, BUSCA ---------- */
function key(u){var m=(u||'').match(/(\d{10})(?:-\d+-\d+)?\.(?:png|webp|jpe?g|svg)/);return m?m[1]:null}
function logo(){var n=document.querySelector('img.logo-img');if(!n)return;var s=n.currentSrc||n.src,k=key(s);if(!s||!k)return;
var ls=document.querySelectorAll('#g-hdr img[src*="themes/common/logo"],#gft img[src*="themes/common/logo"]'),i;
for(i=0;i<ls.length;i++){if(key(ls[i].src)!==k){ls[i].removeAttribute('srcset');ls[i].src=s}}}
function ano(){var f=document.querySelector('#gft');if(!f)return;var y=String(new Date().getFullYear()),w=document.createTreeWalker(f,NodeFilter.SHOW_TEXT),n,v;
while(n=w.nextNode()){if(/(Copyright|©)[^0-9]{0,60}20\d\d/i.test(n.nodeValue)){v=n.nodeValue.replace(/((?:Copyright|©)[^0-9]{0,60})20\d\d/i,'$1'+y);if(v!==n.nodeValue)n.nodeValue=v}}}
function busca(){var as=document.querySelectorAll('a[href*="/busca/"]'),i;for(i=0;i<as.length;i++)as[i].setAttribute('href',as[i].getAttribute('href').replace('/busca/','/search/'))}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href*="/busca/"]');if(a){e.preventDefault();location.href=a.getAttribute('href').replace('/busca/','/search/')}},true);

/* ---------- BARRA: texto vem da página interna /galerie-cfg-barra/ (use *palavra* para destacar o cupom) ---------- */
function barra(){var mq=document.querySelector('#gdp-marquee-wrap .gdp-mq');if(!mq)return;
fetch('/galerie-cfg-barra/',{credentials:'same-origin'}).then(function(r){if(r.status!==200)return null;return r.text()}).then(function(t){if(!t)return;
var d=new DOMParser().parseFromString(t,'text/html'),el=d.querySelector('.user-content,[data-store="page-content"],.page-content,main'),x=el?clean(el.textContent):'';
if(!x||x.length>200)return;
var h=x.replace(/[<>&]/g,'').replace(/\*([^*]+)\*/g,'<span class="gdp-code">$1</span>'),sep='&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;',out='',k;
for(k=0;k<6;k++)out+=h+sep;if(mq.getAttribute('data-gdp-bar')!==out){mq.innerHTML=out;mq.setAttribute('data-gdp-bar',out)}}).catch(function(){})}

/* ---------- EXECUÇÃO ---------- */
function run(N){N0=N;window.__gdpN=N;try{busca()}catch(e){}try{logo()}catch(e){}try{ano()}catch(e){}
try{topos(N)}catch(e){}try{topoCel(N)}catch(e){}try{submenus(N)}catch(e){}try{rodape(N)}catch(e){}}
window.__gdpSync=run;
function init(){dados(function(N){run(N);barra()});
var tm;try{new MutationObserver(function(){if(!N0||reps>60)return;clearTimeout(tm);tm=setTimeout(function(){reps++;run(N0)},200)}).observe(document.body,{childList:true,subtree:true})}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,500)});else setTimeout(init,500);
})();
