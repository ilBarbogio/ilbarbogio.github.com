(()=>{"use strict";let e,t,n;async function i(e){return function(e){let t=document.createElement("div");t.innerHTML=e;let n={viewBox:void 0,style:void 0,defs:void 0,steps:[],uid:"",title:"",author:"",sheet:""},i=t.querySelector("svg").getAttribute("viewBox");n.viewBox=i,n.style=t.querySelector("style")?.innerHTML,n.defs=t.querySelector("defs")?.innerHTML;let s=t.querySelector("[id=cover-image]");n.coverImage=s,n.title=s.getAttribute("title"),n.author=s.getAttribute("author"),n.sheet=s.getAttribute("sheet"),n.uid=s.getAttribute("uid");let o=[];o=[...t.querySelectorAll("[id^=step-]")];for(let e of o){let t=e.id.split("-"),i=t[1]-1,s=2==t.length?0:t[2]-1;if(e.id=`step-${i}-${s}`,1==i)for(let t of e.children)t.hasAttribute("class")&&t.removeAttribute("style");n.steps.hasOwnProperty(i)||(n.steps[i]=[]),n.steps[i][s]=e}return n}(await fetch(`./data/${e}.svg`).then((e=>e.blob())).then((e=>e.text())).catch((()=>null)))}const s={0:null,1:null},o={start:null,current:null};function l(e,t){for(let n of e.changedTouches)if(s.hasOwnProperty(n.identifier)){if(null==s[n.identifier]&&(s[n.identifier]={start:[],current:[],end:[],deltas:[0,0]}),s[n.identifier].current.length>0){let e=n.pageX-s[n.identifier].current[0],t=n.pageY-s[n.identifier].current[1];s[n.identifier].deltas=[e,t]}s[n.identifier][t]=[n.pageX,n.pageY]}if(null!=s[0]&&null!=s[1]);else{let e=null!=s[0]?s[0]:s[1],[t,n]=e.deltas;const i=new CustomEvent("move-event",{detail:{overTol:[Math.abs(t)>3,Math.abs(n)>3],type:"touch",raw:[t,n]},bubbles:!0,composed:!0});dispatchEvent(i)}}function d(){for(let e of Object.keys(s))s[e]=null}function r(e,t){switch(t){case"start":o.start=[e.clientX,e.clientY],o.current=[e.clientX,e.clientY];break;case"current":if(null!=o.start){let t=e.clientX-o.current[0],n=e.clientY-o.current[1];const i=new CustomEvent("move-event",{detail:{overTol:[Math.abs(t)>3,Math.abs(n)>3],type:"mouse",raw:[t,n]},bubbles:!0,composed:!0});dispatchEvent(i)}o.current=[e.clientX,e.clientY]}}function a(){o.start=null,o.current=null,o.end=null}let u;!function(){n=window.innerWidth/100,t=window.innerHeight/100;let i=document.createElement("div");i.style="width:100em",document.body.append(i);let s=i.getBoundingClientRect().width;i.remove(),e=s/100,window.charPerUnitLength=function(){let e="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tincidunt luctus augue, ac luctus libero venenatis non. Nam scelerisque lectus eget tincidunt tristique. Nullam in gravida diam, eget ultricies ligula. Curabitur finibus est non quam iaculis posuere.",t=document.createElement("div");t.style.position="absolute",t.style.top="100px",t.style.padding=0,t.style.margin=0,t.style.width="200px",t.style.wordBreak="break-all",t.style.fontSize="12px",t.style.lineHeight="12px",t.innerHTML=e,document.body.append(t);let n=parseFloat(getComputedStyle(t).getPropertyValue("height"))/12,i=e.length/n/200*12;return t.remove(),i}()}();const c=document.getElementsByTagName("main-toolbar")[0],p=document.getElementById("step-deck"),w=document.getElementById("wallet-deck");function b(){p.toggleDeck(),w.toggleDeck()}function m(e){p.swipe(e),w.swipe(e)}function v(e){u[e.slot]&&(p.setup(u[e.slot]),b())}!function(){let e=function(){const e=navigator.userAgent;return/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(e)?"tablet":/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(e)?"mobile":"desktop"}();if(window.addEventListener("touchstart",(e=>{l(e,"start")})),window.addEventListener("touchmove",(e=>{l(e,"current")})),window.addEventListener("touchend",(e=>{l(e,"end"),function(){if(null!=s[0]){let e=s[0].start,t=s[0].end,[n,i]=e,[o,l]=t,d=o-n,r=l-i,a={overTol:Math.hypot(d,r)>200,type:"touch",raw:[d,r]};Math.abs(d)>Math.abs(r)?a.gesture=d<0?"swipe-left":"swipe-right":a.gesture=r>0?"swipe-down":"swipe-up";const u=new CustomEvent("swipe-event",{detail:a,bubbles:!0,composed:!0});dispatchEvent(u)}}(),d()})),window.addEventListener("touchcancel",(e=>{d()})),window.addEventListener("mousedown",(e=>{0==e.button&&r(e,"start")})),window.addEventListener("mousemove",(e=>{r(e,"current")})),window.addEventListener("mouseup",(e=>{if(0==e.button)a();else if(1==e.button){let e=new CustomEvent("confirm-event",{detail:{type:"key",raw:[0,0],gesture:"confirm"},bubbles:!0,composed:!0});dispatchEvent(e)}})),window.addEventListener("mouseleave",(e=>{a()})),window.addEventListener("wheel",(e=>{if(0!=e.deltaY){const t=new CustomEvent("zoom-event",{detail:{type:"mouse",raw:e.deltaY},bubbles:!0,composed:!0});dispatchEvent(t)}else if(0!=e.deltaX){const t=e.deltaX>0?1:-1,n=e.deltaX<0?"swipe-right":"swipe-left";let i=new CustomEvent("swipe-event",{detail:{type:"key",raw:[t,0],gesture:n},bubbles:!0,composed:!0});dispatchEvent(i)}})),window.addEventListener("keydown",(e=>{let t;switch(e.key){case"ArrowLeft":case"a":t=new CustomEvent("swipe-event",{detail:{type:"key",raw:[-1,0],gesture:"swipe-right"},bubbles:!0,composed:!0}),dispatchEvent(t);break;case"ArrowRight":case"d":t=new CustomEvent("swipe-event",{detail:{type:"key",raw:[1,0],gesture:"swipe-left"},bubbles:!0,composed:!0}),dispatchEvent(t);break;case"ArrowUp":case"w":t=new CustomEvent("swipe-event",{detail:{type:"key",raw:[0,1],gesture:"swipe-up"},bubbles:!0,composed:!0}),dispatchEvent(t);break;case"ArrowDown":case"s":t=new CustomEvent("swipe-event",{detail:{type:"key",raw:[0,-1],gesture:"swipe-down"},bubbles:!0,composed:!0}),dispatchEvent(t);break;case" ":case"Enter":let e=new CustomEvent("confirm-event",{detail:{type:"key",raw:[0,0],gesture:"confirm"},bubbles:!0,composed:!0});dispatchEvent(e)}})),"desktop"==e){let e=document.createElement("side-button");e.setAttribute("side","left"),document.body.append(e);let t=document.createElement("side-button");t.setAttribute("side","right"),document.body.append(t)}for(let e of document.querySelectorAll("side-button"))e.addEventListener("click",(()=>{m(e.getAttribute("side"))}));c.setButtonClickCallback((()=>{b()})),window.addEventListener("swipe-event",(e=>{("block"!=document.getElementById("zoomed-slide").style.display&&e.detail.overTol||"key"==e.detail.type)&&function(e){switch(e){case"swipe-left":m("right");break;case"swipe-right":m("left");break;case"swipe-up":m("down");break;case"swipe-down":m("up")}}(e.detail.gesture)})),window.addEventListener("move-event",(e=>{var t;"block"!=document.getElementById("zoomed-slide").style.display&&e.detail.overTol[0]&&(t=e.detail.raw[0],p.slide(t),w.slide(t))})),window.addEventListener("fold-it-click",(e=>{v(e.detail)})),window.addEventListener("confirm-event",(()=>{w.deck.deckOnView?v({slot:w.slides[w.deck.roundIndex()].getAttribute("slot")}):b()})),window.addEventListener("set-bookmark",(e=>{console.log("Bookmark al passo "+e.detail.step)}))}(),async function(){u=await async function(){let e={slotA:void 0,slotB:void 0,slotC:void 0};return e.slotA=await i("CignoApp"),e.slotB=await i("RosaApp"),e}(),w.setup(u),b()}()})();