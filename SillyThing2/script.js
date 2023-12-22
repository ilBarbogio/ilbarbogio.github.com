import { sillyPhrases } from "./phrases.js"

let shuffledPhrases
let text, restartText, shakeText, redirectText

let hype=0
let hypeDelta=20
let hypeGoal=200
let egg,eggInterval

let ball, backdrop
let lastVector
let vectorHype=0
let vectorHypeDelta=10
let vectorHypeSensitivity=10

let colors=["red","orange","yellow","purple","pink","lime","cyan"]

function setup(){
  redirectText=document.createElement("a")
  redirectText.classList.add("header-text")
  redirectText.innerHTML="go to dynamic version"
  redirectText.href="https://ilbarbogio.github.io/SillyThing/"
  document.body.append(redirectText)

	document.body.style.width=window.innerWidth+"px"
	document.body.style.height=window.innerHeight+"px"
  shuffledPhrases=shuffle()
	//if(ScreenOrientation.lock){
		//ScreenOrientation.lock()
		//.then((v)=>{
			setupUnmobile()
		//})
	//}else setupUnmobile()
}

function shuffle(){
  let temp=[...sillyPhrases]
  for(let i=0;i<100;i++){
    temp=temp.sort((a,b)=>Math.random()-.25)
  }
  return temp
}

//devicemotion available
function setupMobile(){
  let color=colors[Math.floor(Math.random()*colors.length)]
  backdrop=document.createElement("div")
  backdrop.classList.add("backdrop")
  backdrop.style.backgroundColor=color
  document.body.append(backdrop)

  let side=Math.floor(Math.random()*10+6)+"em"
  ball=createBall(side,color)

  shakeText=document.createElement("p")
  shakeText.classList.add("footer-text")
  shakeText.innerHTML="shake!"
  document.body.append(shakeText)

	window.addEventListener("devicemotion",calibrateMotion)
}

function calibrateMotion(ev){
	window.removeEventListener("devicemotion",calibrateMotion)
  hype=0
  vectorHype=0
	lastVector=undefined
  window.addEventListener("devicemotion",registerMotion)
	eggInterval=setInterval(subtractHype,ev.interval*5)
}
function registerMotion(ev){
	if(!lastVector) lastVector=ev.acceleration
	else{
		let intensity=Math.hypot(ev.acceleration.x-lastVector.x,ev.acceleration.y-lastVector.y,ev.acceleration.z-lastVector.z)
    if(intensity>vectorHypeSensitivity) addHype()
    lastVector=ev.acceleration
	}
}


//no devicemotion
function setupUnmobile(){
	let color=colors[Math.floor(Math.random()*colors.length)]
  backdrop=document.createElement("div")
  backdrop.classList.add("backdrop")
  backdrop.style.backgroundColor=color
  document.body.append(backdrop)

  let side=Math.floor(Math.random()*10+6)+"em"
  ball=createBall(side,color)

  shakeText=document.createElement("p")
  shakeText.classList.add("footer-text")
  shakeText.innerHTML="tap!"
  document.body.append(shakeText)

  hype=0

	ball.addEventListener("click",addHype)
	eggInterval=setInterval(subtractHype,450)
}



function addHype(){
	hype+=hypeDelta
  if(hype>=hypeGoal){
		showMessage()
	}else reactToHype()
}
function subtractHype(){
	hype-=hypeDelta/2
	if(hype<0) hype=0
  reactToHype()
}

function reactToHype(){
  let opacity=hype/hypeGoal
  backdrop.style.opacity=opacity
}



//graphics
function createBall(dimensions,color){
  let ball=document.createElement("div")
  ball.classList.add("ball")
  ball.style.setProperty("--ball-size",dimensions)
  ball.style.setProperty("width",dimensions)
  ball.style.setProperty("height",dimensions)
  ball.style.setProperty("background-color",color)

  let shine=document.createElement("div")
  shine.classList.add("shine")
  ball.append(shine)

  let smallShine=document.createElement("div")
  smallShine.classList.add("small-shine")
  ball.append(smallShine)

  let cap=document.createElement("div")
  cap.classList.add("cap")
  ball.append(cap)

  let ring=document.createElement("div")
  ring.classList.add("ring")
  ball.append(ring)

  document.body.append(ball)

  return ball
}


//ending
function showMessage(){
  shakeText.remove()
  if(egg){
    egg.removeEventListener("click",addHype)
    egg.removeEventListener("click",subtractHype)
    egg.remove()
  }
  window.removeEventListener("devicemotion",registerMotion)
  clearInterval(eggInterval)

  backdrop.remove()
  ball.remove()

  appearText()
}

function appearText(){
	let index=getIndex()%shuffledPhrases.length
  text=document.createElement("p")
	text.classList.add("fire")
	text.innerHTML=shuffledPhrases[index]
	document.body.append(text)

  restartText=document.createElement("p")
  restartText.classList.add("footer-text")
  restartText.innerHTML="ricomincia"
  document.body.append(restartText)
  restartText.addEventListener("click",()=>{
    text.remove()
    restartText.remove()
    setupUnmobile()
  })

}


function getIndex(){
  let stored=sessionStorage.getItem("usedPhrases")
  if(stored==null){
    sessionStorage.setItem("usedPhrases","1")
    return 0
  }else{
    let saved=parseInt(stored)
    sessionStorage.setItem("usedPhrases",saved+1)
    return saved
  }
}


window.addEventListener("load",setup)
