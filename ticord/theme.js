(function(){var r=document.documentElement,K="tk_theme";
function sys(){return matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}
window.tkTheme=function(t){if(t!=="dark"&&t!=="light")t=sys();r.dataset.theme=t;try{localStorage.setItem(K,t)}catch(e){}document.dispatchEvent(new Event("tktheme"))};
var s;try{s=localStorage.getItem(K)}catch(e){}
r.dataset.theme=s==="dark"||s==="light"?s:sys();
var l=document.createElement("link");l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";document.head.appendChild(l);
})();
