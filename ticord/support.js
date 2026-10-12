(function(){
var $=function(i){return document.getElementById(i)},U=null,busy=false,api=tkApi;
var CH=["O que é o Grupo Ticord?","Como mudo minha senha?","Como falo com o Comercial?","O que é a Bup?"];
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function md(s){return esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/`([^`]+)`/g,"<code>$1</code>").replace(/(https?:\/\/[^\s<]*[^\s<.,;:!?)])/g,'<a href="$1" target="_blank" rel="noopener">$1</a>').replace(/\n/g,"<br>")}
$("chips").innerHTML=CH.map(function(c){return "<button>"+esc(c)+"</button>"}).join("");
$("chips").onclick=function(e){if(e.target.tagName==="BUTTON")ask(e.target.textContent)};
function toLogin(){location.href="login.html"}
function acts(){var a=$("acts");if(U){a.innerHTML="<span>Olá, "+esc(U.name.split(" ")[0])+"</span><button id='a1'>Abrir chat</button><a href='settings.html'>Configurações</a>";$("a1").onclick=openChat}else a.innerHTML='<a href="login.html">Entrar ou criar conta</a>'}
function openChat(){$("land").style.display="none";$("chat").style.display="flex";return hist()}
function hist(){$("msgs").innerHTML="";return api("/api/chat").then(function(d){if(d._s===401){U=null;return toLogin()}var m=d.messages||[];if(!m.length)bubble("a","Olá"+(U?", "+U.name.split(" ")[0]:"")+"! Sou o assistente de suporte do Grupo Ticord. Como posso te ajudar?");m.forEach(function(x){bubble(x.role==="user"?"u":"a",x.content)});scroll()})}
function scroll(){var m=$("msgs");m.scrollTop=m.scrollHeight}
function bubble(r,t){var d=document.createElement("div");d.className="m "+r;d.innerHTML=r==="a"?md(t):esc(t);$("msgs").appendChild(d);scroll();return d}
function send(t){if(busy||!t)return;busy=true;bubble("u",t);var w=bubble("a","Digitando...");w.classList.add("dots");
 api("/api/chat",{method:"POST",body:JSON.stringify({message:t})}).then(function(d){w.remove();busy=false;if(d._s===401){U=null;return toLogin()}bubble("a",d.reply||d.error||"Algo deu errado. Tente novamente.")})}
function ask(t){t=(t||"").trim();if(!t)return;if(!U){try{sessionStorage.setItem("tk_pend",t)}catch(e){}return toLogin()}openChat().then(function(){send(t)})}
$("lf").onsubmit=function(e){e.preventDefault();var t=$("li").value;$("li").value="";ask(t)};
$("cf").onsubmit=function(e){e.preventDefault();var t=$("ci").value.trim();$("ci").value="";send(t)};
$("nw").onclick=function(){if(confirm("Apagar o histórico e começar uma nova conversa?"))api("/api/chat",{method:"DELETE"}).then(hist)};
/* se a pessoa veio do login com uma pergunta pendente, envia agora */
tkMe.then(function(d){U=d.user||null;acts();var p=null;try{p=sessionStorage.getItem("tk_pend");sessionStorage.removeItem("tk_pend")}catch(e){}if(U&&p)ask(p)});
acts();
})();
