/* PIX v3: o % vem da busca da loja (sem cache), que reflete o painel na hora */
(function(){
if(window.__gdpPixDyn)return;window.__gdpPixDyn=1;
var K='gdpPixPct',TTL=300000,P=null;
function ler(root){var cs=root.querySelectorAll('.js-info-payment-method-container'),i,t,m;if(!cs.length)return null;for(i=0;i<cs.length;i++){t=(cs[i].textContent||'').replace(/\s+/g,' ');m=t.match(/(\d+(?:[.,]\d+)?)\s*%\s*de\s*desconto\s*pagando\s*com\s*pix/i);if(m)return parseFloat(m[1].replace(',','.'))}return 0}
function cache(){try{var o=JSON.parse(sessionStorage.getItem(K));if(o&&Date.now()-o.t<TTL)return o.p}catch(e){}return null}
function salva(p){try{sessionStorage.setItem(K,JSON.stringify({p:p,t:Date.now()}))}catch(e){}}
function links(){var u=[],o=[],as=document.querySelectorAll('a[href*="/produtos/"]'),i,h,n;for(i=0;i<as.length;i++){h=as[i].pathname;if(/^\/produtos\/[^\/]+/.test(h)&&u.indexOf(h)<0)u.push(h)}
n=u.length;if(n<=5)return u;[0,Math.floor(n/4),Math.floor(n/2),Math.floor(3*n/4),n-1].forEach(function(k){if(o.indexOf(u[k])<0)o.push(u[k])});return o}
function votar(a){var c={},b=null,i,k;for(i=0;i<a.length;i++){k=String(a[i]);c[k]=(c[k]||0)+1}for(k in c){if(b===null||c[k]>c[b]||(c[k]===c[b]&&parseFloat(k)<parseFloat(b)))b=k}return b===null?null:parseFloat(b)}
function daBusca(){return fetch('/search/?q=a&gdp='+Date.now(),{credentials:'same-origin',cache:'no-store'}).then(function(r){return r.text()}).then(function(h){var d=new DOMParser().parseFromString(h,'text/html'),es=d.querySelectorAll('[data-variants]'),vs=[],i,v,pr,pd,k;
for(i=0;i<es.length;i++){try{v=JSON.parse(es[i].getAttribute('data-variants'))[0];pr=v.price_number_raw/100;pd=parseFloat(String(v.price_with_payment_discount_short).replace(/[^\d,]/g,'').replace(',','.'));if(pr>0&&pd>0&&pd<=pr){k=Math.round((1-pd/pr)*1000)/10;if(Math.abs(k-Math.round(k))<0.15)k=Math.round(k);vs.push(k)}}catch(e){}}
return vs.length>=3?votar(vs):null}).catch(function(){return null})}
function dosProdutos(ls,cb){if(!ls.length)return;Promise.all(ls.map(function(u){return fetch(u,{credentials:'same-origin',cache:'no-store'}).then(function(r){return r.text()}).then(function(h){return ler(new DOMParser().parseFromString(h,'text/html'))}).catch(function(){return null})})).then(function(vs){vs=vs.filter(function(v){return v!==null});var p=votar(vs);if(p!==null){salva(p);cb(p)}})}
function buscar(ls,cb){daBusca().then(function(p){if(p!==null){salva(p);cb(p)}else dosProdutos(ls,cb)})}
var LF=0;
function obter(cb,force){var c=cache(),d=c===null?ler(document):null;if(c!==null)cb(c);else if(d!==null)cb(d);if(!force&&Date.now()-LF<15000)return;LF=Date.now();buscar(links(),cb)}
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
function brl(c){return 'R$'+(Math.round(c)/100).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}
function nativo(p){var cs=document.querySelectorAll('.js-info-payment-method-container'),i,c,st,pw,pe,n,t;
for(i=0;i<cs.length;i++){c=cs[i];if(!/pix/i.test(c.textContent))continue;
st=c.querySelector('.js-payment-method-discount strong');if(st){t=String(p).replace('.',',')+'% de desconto';if(st.textContent.trim()!==t)st.textContent=t}
pw=c.querySelector('.js-price-with-discount');pe=document.querySelector('#price_display[data-product-price],.js-price-display[data-product-price]');
if(pw){pw.setAttribute('data-payment-discount',String(p));if(pe){n=parseFloat(pe.getAttribute('data-product-price'));if(isFinite(n)&&n>0){t=brl(n*(100-p)/100);if(pw.textContent.trim()!==t)pw.textContent=t}}}}}
function extras(p){var t=String(p).replace('.',','),i,e,x;
var a=document.querySelectorAll('.js-product-discount-container');for(i=0;i<a.length;i++){if(!/pix/i.test(a[i].textContent))continue;e=a[i].querySelector('.text-accent');if(e){x=t+'% de desconto';if(e.textContent.trim()!==x)e.textContent=x}}
var b=document.querySelectorAll('.js-modal-tab-discount strong');for(i=0;i<b.length;i++){if(/^\s*\d+(?:[.,]\d+)?\s*%\s*OFF\s*$/i.test(b[i].textContent)){x=t+'% OFF';if(b[i].textContent.trim()!==x)b[i].textContent=x}}}
function tudo(p){aplica(p);try{nativo(p)}catch(e){}try{extras(p)}catch(e){}}
function run(force){try{obter(function(p){P=p;tudo(p)},force)}catch(e){}}
var tm;try{new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(function(){try{if(P!==null)tudo(P);else run()}catch(e){}},80)}).observe(document.body,{childList:true,subtree:true,characterData:true})}catch(e){}
document.addEventListener('visibilitychange',function(){if(!document.hidden)run(true)});
window.addEventListener('focus',function(){run(true)});
document.addEventListener('change',function(){setTimeout(run,300)},true);
document.addEventListener('click',function(){setTimeout(run,400)},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
