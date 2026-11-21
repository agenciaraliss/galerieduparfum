(function(){try{if(location.pathname.indexOf('/produtos/')<0)return;
var URL_CFG='/galerie-cfg-borrifadas-x7k2',DEF={2:28,5:70,10:140,15:214},POR_ML=14;
function mlOf(v){return parseFloat((v.textContent||'').replace(',','.').replace(/[^\d.]/g,''))||0}
function lerCfg(){return fetch(URL_CFG,{credentials:'same-origin'}).then(function(r){return r.ok?r.text():''}).then(function(h){var cfg={};if(!h)return cfg;var d=new DOMParser().parseFromString(h,'text/html'),c=d.querySelector('.user-content');if(!c)return cfg;var t=(c.innerText||c.textContent||'');var re=/(\d+(?:[.,]\d+)?)\s*ml\s*[:=\-]?\s*(\d+)/gi,m;while((m=re.exec(t))){cfg[parseFloat(m[1].replace(',','.'))]=parseInt(m[2],10)}return cfg}).catch(function(){return {}})}
function esperaBloco(){return new Promise(function(ok){var i=0,x=setInterval(function(){var b=document.querySelector('.js-product-detail .rls-borr');if(b||++i>40){clearInterval(x);ok(b)}},200)})}
function montar(box,cfg){try{var d=document.querySelector('.js-product-detail');if(!box||!d||box.dataset.gdpBorr)return;
var seen={},lista=[];[].slice.call(d.querySelectorAll('.js-insta-variant')).forEach(function(v){var m=mlOf(v);if(m>0&&!seen[m]){seen[m]=1;lista.push(m)}});if(!lista.length)return;lista.sort(function(a,b){return a-b});
function n(m){return cfg[m]||DEF[m]||Math.round(m*POR_ML)}
var max=Math.max.apply(null,lista.map(n)),h='';
lista.forEach(function(m){var t=m<=2?1:m<=5?2:3;h+='<div class="rls-borr-col" data-t="'+t+'" data-ml="'+m+'"><div class="rls-borr-vidro"><span class="rls-spray"></span></div><span class="rls-borr-ml">'+m+' ml</span><span class="rls-borr-n">'+n(m)+'</span><span class="rls-borr-t">borrifadas aprox.</span><span class="rls-borr-bar"><i data-w="'+Math.round(n(m)/max*100)+'"></i></span></div>'});
box.dataset.gdpBorr='1';box.innerHTML=h;box.style.gridTemplateColumns='repeat('+lista.length+',1fr)';
var cols=[].slice.call(box.querySelectorAll('.rls-borr-col'));
function sync(){var s=d.querySelector('.js-insta-variant.selected'),r=s?mlOf(s):0;cols.forEach(function(c){c.classList.toggle('is-sel',+c.dataset.ml===r)})}
cols.forEach(function(c){var t=+c.dataset.t,q=1===t?5:2===t?7:9,sp=c.querySelector('.rls-spray');for(var s=0;s<q;s++){var i=document.createElement('i');i.style.animationName='rlsjt'+(s%5+1);i.style.animationDelay=(.035*s).toFixed(3)+'s';sp.appendChild(i)}
c.addEventListener('click',function(){var vs=[].slice.call(d.querySelectorAll('.js-insta-variant'));for(var a=0;a<vs.length;a++){if(mlOf(vs[a])===+c.dataset.ml){vs[a].click();break}}setTimeout(sync,90)})});
setTimeout(function(){box.querySelectorAll('.rls-borr-bar i').forEach(function(e){e.style.width=e.getAttribute('data-w')+'%'})},160);
document.addEventListener('click',function(e){if(e.target.closest&&e.target.closest('.js-insta-variant'))setTimeout(sync,120)});sync()}catch(e){}}
Promise.all([lerCfg(),esperaBloco()]).then(function(r){montar(r[1],r[0])})}catch(e){}})();
