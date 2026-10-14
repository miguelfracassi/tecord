(function(){
var P=location.pathname.split("/").pop().replace(".html","")||"index",root=document.documentElement,U=null;
var D='<svg width="0" height="0" style="position:absolute"><defs><symbol id="art" viewBox="0 0 400 400"><ellipse cx="200" cy="372" rx="150" ry="12" style="fill:var(--b);opacity:.12"/><path d="M60 350V250a140 140 0 0 1 280 0v100H255V250a55 55 0 0 0-110 0v100z" style="fill:var(--art2)"/><circle cx="215" cy="150" r="95" style="fill:var(--b)"/><circle cx="205" cy="245" r="52" style="fill:var(--art3)"/></symbol><symbol id="i-code" viewBox="0 0 24 24"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></symbol><symbol id="i-star" viewBox="0 0 24 24"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></symbol><symbol id="i-ai" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 14.5c1.9 2 5.1 2 7 0M9 9.5h.01M15 9.5h.01"/></symbol><symbol id="i-eye" viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></symbol><symbol id="i-bolt" viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></symbol><symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></symbol><symbol id="lg" viewBox="0 0 100 100"><g style="fill:var(--b)"><path d="M12 12h18v28l8-6c10-8 22-14 32-16v26C58 50 48 58 42 72H12z"/><path d="M44 90C50 66 66 50 90 48v14c-8 1-16 5-22 11h22v17z"/></g></symbol></defs></svg>';
var L=[["index","Início"],["about","Sobre"],["projects","Projetos"],["support","Suporte"],["contact","Contato"]],PJ={cord:1,fun:1,bup:1};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function api(p,o){o=o||{};o.headers={"Content-Type":"application/json"};o.credentials="same-origin";return fetch(p,o).then(function(r){return r.json().catch(function(){return{}}).then(function(d){d._s=r.status;return d})}).catch(function(){return{error:"Sem conexão. Tente novamente.",_s:0}})}
window.tkApi=api;
var login=P==="login";
if(login){document.body.insertAdjacentHTML("afterbegin",D);return}
try{U=JSON.parse(localStorage.getItem("tk_u"))}catch(e){}
document.body.insertAdjacentHTML("afterbegin",D+'<nav id="nav"><div class="bar"><a class="logo" href="index.html"><svg><use href="#lg"/></svg>Ticord</a><div class="rt"><button class="burger" id="bg" aria-label="Menu" aria-expanded="false" aria-controls="drop"><i></i><i></i><i></i></button><a id="acc" href="login.html">Acessar</a></div></div><div class="drop" id="drop"></div></nav>');
var bg=document.getElementById("bg"),drop=document.getElementById("drop"),acc=document.getElementById("acc");
function tgLabel(){var t=document.getElementById("tg");if(t)t.textContent=root.dataset.theme==="dark"?"Ativar tema claro":"Ativar tema escuro"}
function fill(){
 acc.className="acc"+(U?" in":"");acc.href=U?"settings.html":"login.html";
 acc.innerHTML=U?"<i>"+esc(U.name.charAt(0).toUpperCase())+"</i><span>"+esc(U.name.split(" ")[0])+"</span>":"Entrar";
 var h=L.map(function(l){var on=l[0]===P||(l[0]==="projects"&&PJ[P]);return '<a href="'+l[0]+'.html"'+(on?' class="on"':'')+'>'+l[1]+'</a>'}).join("")+"<hr>";
 if(U)h+='<a href="settings.html"'+(P==="settings"?' class="on"':'')+'>Preferências</a>';
 h+='<button id="tg" type="button"></button>'+(U?'<button id="lo" type="button">Encerrar sessão</button>':'<a href="login.html#criar">Criar conta</a>');
 drop.innerHTML=h;tgLabel();
 document.getElementById("tg").onclick=function(){var t=root.dataset.theme==="dark"?"light":"dark";tkTheme(t);if(U&&U.email)api("/api/auth?a=prefs",{method:"POST",body:JSON.stringify({theme:t})})};
 var lo=document.getElementById("lo");if(lo)lo.onclick=window.tkLogout}
window.tkLogout=function(){return api("/api/auth?a=logout",{method:"POST",body:"{}"}).then(function(){U=null;try{localStorage.removeItem("tk_u")}catch(e){}if(P==="support")location.reload();else if(P==="settings")location.href="index.html";else fill()})};
document.addEventListener("tktheme",tgLabel);
function toggle(o){var v=o===undefined?!drop.classList.contains("o"):o;drop.classList.toggle("o",v);bg.setAttribute("aria-expanded",v)}
bg.onclick=function(e){e.stopPropagation();toggle()};
document.addEventListener("click",function(e){if(!drop.contains(e.target))toggle(false)});
document.addEventListener("keydown",function(e){if(e.key==="Escape")toggle(false)});
fill();
window.tkMe=api("/api/auth?a=me").then(function(d){U=d.user||null;try{U?localStorage.setItem("tk_u",JSON.stringify({name:U.name})):localStorage.removeItem("tk_u")}catch(e){}if(U&&(U.theme==="light"||U.theme==="dark")&&U.theme!==root.dataset.theme)tkTheme(U.theme);fill();return d});

var cta='<div class="cb"><div class="w cg"><div><h2>Pronto para criar<br>algo com a Ticord?</h2><p>Fale com a nossa equipe e vamos tirar sua ideia do papel.</p><a class="cta" href="contact.html">Entrar em contato</a></div><svg class="art" viewBox="0 0 400 400" style="max-width:240px"><use href="#art"/></svg></div></div>';
var foot='<footer><div class="w"><div class="fg"><div><a class="logo" href="index.html" style="color:#fff;font-size:20px"><svg style="width:32px;height:32px;background:#fff;border-radius:50%;padding:5px"><use href="#lg"/></svg>Grupo Ticord</a><p>Queremos fazer experiências para facilitar as vidas no futuro.</p></div><div><h4>Páginas</h4>'+L.concat([["login","Entrar"]]).map(function(l){return '<a href="'+l[0]+'.html">'+l[1]+'</a>'}).join("")+'</div><div><h4>Empresas</h4><a href="cord.html">Cord</a><a href="fun.html">Fun</a><a href="bup.html">Bup</a></div><div><h4>Contato</h4><a href="mailto:helpticord@aol.com">helpticord@aol.com</a><a href="mailto:comercialticord@aol.com">comercialticord@aol.com</a></div></div><div class="cp">© '+new Date().getFullYear()+' Grupo Ticord. Todos os direitos reservados.</div></div></footer>';
var m=document.querySelector("main");
if(m&&["inbox","support","settings"].indexOf(P)<0)m.insertAdjacentHTML("afterend",cta);
if(P!=="support")document.body.insertAdjacentHTML("beforeend",foot);
})();
