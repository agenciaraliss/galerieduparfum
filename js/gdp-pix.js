(function(){
if(window.__gdpPixDyn)return;window.__gdpPixDyn=1;
var K='gdpPixPct',TTL=300000,P=null;
function ler(root){var cs=root.querySelectorAll('.js-info-payment-method-container'),i,t,m;if(!cs.length)return null;for(i=0;i<cs.length;i++){t=(cs[i].textContent||'').replace(/\s+/g,' ');m=t.match(/(\d+(?:[.,]\d+)?)\s*%\s*de\s*desconto\s*pagando\s*com\s*pix/i);if(m)return parseFloat(m[1].replace(',','.'))}return 0}
function cache(){try{var o=JSON.parse(sessionStorage.getItem(K));if(o&&Date.now()-o.t<TTL)return o.p}catch(e){}return null}
function salva(p){try{sessionStorage.setItem(K,JSON.stringify({p:p,t:Date.now()}))}catch(e){}}
function links(){var o=[],as=document.querySelectorAll('a[href*="/produtos/"]'),i,h;for(i=0;i<as.length&&o.length<3;i++){h=as[i].pathname;if(/^\/produtos\/[^\/]+/.test(h)&&o.indexOf(h)<0)o.push(h)}return o}
function buscar(ls,cb){if(!ls.length)return;fetch(ls[0],{credentials:'same-origin'}).then(function(r){return r.text()}).then(function(h){var p=ler(new DOMParser().parseFromString(h,'text/html'));if(p!==null){salva(p);cb(p)}else buscar(ls.slice(1),cb)}).catch(function(){buscar(ls.slice(1),cb)})}
function obter(cb){var d=ler(document);if(d!==null){salva(d);return cb(d)}var c=cache();if(c!==null)return cb(c);buscar(links(),cb)}
function aplica(p){var els=document.querySelectorAll('.gdp-pix'),i,px,pe,n,val,s,card,nat;
for(i=0;i<els.length;i++){px=els[i];card=px.closest('.js-item-product');
nat=card&&[].some.call(card.querySelectorAll('*'),function(e){return !e.children.length&&!px.contains(e)&&/com\s*pix/i.test(e.textContent)});
if(p<=0||nat){if(px.style.display!=='none'){px.style.display='none';px.setAttribute('data-gdp-off','1')}continue}
if(px.getAttribute('data-gdp-off')){px.style.display='';px.removeAttribute('data-gdp-off')}
pe=px.parentElement&&px.parentElement.querySelector('[data-product-price]');if(!pe)continue;
n=parseFloat(pe.getAttribute('data-product-price'));if(!isFinite(n)||n<=0)continue;
val='R$'+(Math.round(n*(100-p)/100)/100).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
s=px.querySelector('strong');
if(s){if(s.textContent.trim()!==val)s.textContent=val}else if(px.textContent.replace(/\s+/g,' ').trim()!=='PIX '+val){px.textContent='PIX '+val}}}
function run(){try{obter(function(p){P=p;aplica(p)})}catch(e){}}
var tm;try{new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(function(){try{if(P!==null)aplica(P);else run()}catch(e){}},80)}).observe(document.body,{childList:true,subtree:true,characterData:true})}catch(e){}
document.addEventListener('change',function(){setTimeout(run,300)},true);
document.addEventListener('click',function(){setTimeout(run,400)},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
