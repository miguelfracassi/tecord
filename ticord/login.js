(function(){
var $=function(i){return document.getElementById(i)},mode="login",busy=false;
function api(p,o){o=o||{};o.headers={"Content-Type":"application/json"};o.credentials="same-origin";return fetch(p,o).then(function(r){return r.json().catch(function(){return{}}).then(function(d){d._s=r.status;return d})}).catch(function(){return{error:"Sem conexão. Tente novamente.",_s:0}})}
function setMode(m){mode=m;var r=m==="register";
 $("tl").classList.toggle("on",!r);$("tr").classList.toggle("on",r);$("rf").classList.toggle("on",r);
 $("an").required=$("ap").required=r;
 $("lt").textContent=r?"Criar seu acesso":"Entrar na sua conta";
 $("ls").textContent=r?"Leva menos de um minuto.":"Acesse o suporte do Grupo Ticord.";
 $("ab").textContent=r?"Criar acesso":"Entrar";
 $("aw").autocomplete=r?"new-password":"current-password";
 $("am").textContent="";document.title=(r?"Criar acesso":"Entrar")+" · Grupo Ticord"}
$("tl").onclick=function(){setMode("login")};
$("tr").onclick=function(){setMode("register")};
$("sh").onclick=function(){var s=$("aw").type==="password";$("aw").type=s?"text":"password";$("sh").textContent=s?"Ocultar":"Mostrar"};
$("af").onsubmit=function(e){e.preventDefault();if(busy)return;
 var am=$("am"),ab=$("ab"),b={email:$("ae").value,password:$("aw").value,site:$("hp").value};
 if(mode==="register"){b.name=$("an").value;b.phone=$("ap").value}
 busy=true;ab.disabled=true;am.className="msg";am.textContent="Aguarde...";
 api("/api/auth?a="+mode,{method:"POST",body:JSON.stringify(b)}).then(function(d){
  if(d.user){location.href="support.html";return}
  busy=false;ab.disabled=false;am.className="msg e";am.textContent=d.error||"Não foi possível continuar."})};
if(location.hash==="#criar")setMode("register");
/* quem já está logado vai direto para o suporte */
api("/api/auth?a=me").then(function(d){if(d.user)location.replace("support.html")});
$("ae").focus();
})();
