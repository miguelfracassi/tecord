(function(){
var $=function(i){return document.getElementById(i)},U=null,api=tkApi,root=document.documentElement;
function mark(){document.querySelectorAll("#th button").forEach(function(b){b.classList.toggle("on",b.dataset.v===root.dataset.theme)})}
$("th").onclick=function(e){var b=e.target.closest("button");if(!b)return;tkTheme(b.dataset.v);if(U)api("/api/auth?a=prefs",{method:"POST",body:JSON.stringify({theme:b.dataset.v})})};
document.addEventListener("tktheme",mark);mark();
$("lo").onclick=tkLogout;
tkMe.then(function(d){U=d.user;if(!U)return;
 $("sg").classList.add("li");$("gu").hidden=true;["pc","pw","dz"].forEach(function(i){$(i).hidden=false});
 $("av").textContent=U.name.charAt(0).toUpperCase();$("nm").textContent=U.name;$("em").textContent=U.email;$("ph").textContent=U.phone||""});
function msg(el,ok,t){el.className="msg "+(ok?"k":"e");el.textContent=t}
$("pf").onsubmit=function(e){e.preventDefault();var m=$("pm");api("/api/auth?a=password",{method:"POST",body:JSON.stringify({current:$("pcur").value,next:$("pnew").value})}).then(function(d){if(d.ok){msg(m,1,"Senha alterada com sucesso.");$("pf").reset()}else msg(m,0,d.error||"Erro.")})};
$("df").onsubmit=function(e){e.preventDefault();if(!confirm("Tem certeza? Sua conta e seu histórico serão apagados para sempre."))return;api("/api/auth?a=delete",{method:"POST",body:JSON.stringify({password:$("dp").value})}).then(function(d){if(d.ok){try{localStorage.removeItem("tk_u")}catch(x){}location.href="index.html"}else msg($("dm"),0,d.error||"Erro.")})};
})();
