let textContainer
let sillyPhrases=[
	"ciao bischero",
	"hello bischer",
	"bonjour bisquer"
]

let text

let hype=0
let hypeDelta=10
let hypeGoal=200
let egg,eggInterval

let ball 
let lastVector
let vectorHype=0
let vectorHypeDelta=10
let vectorHypeGoal=200

function setup(){
  let side=Math.floor(Math.random()*6+2)+"em"
  ball=createBall(side,"red")
	//if(ScreenOrientation.lock){
		//ScreenOrientation.lock()
		//.then((v)=>{
			setupMobile()
		//})
	//}else setupUnmobile()
}

//devicemotion available
function setupMobile(){
	// egg=document.createElement("div")
	// egg.id="tap-egg"
	// document.body.append(egg)


	window.addEventListener("devicemotion",calibrateMotion)
}

function calibrateMotion(ev){
	window.removeEventListener("devicemotion",calibrateMotion)
  vectorHype=0
	lastVector=undefined
  window.addEventListener("devicemotion",registerMotion)
	eggInterval=setInterval(subtractHype,ev.interval*5)
}
function registerMotion(ev){
	if(!lastVector) lastVector=ev.acceleration
	else{
		let intensity=Math.hypot(ev.acceleration.x-lastVector.x,ev.acceleration.y-lastVector.y,ev.acceleration.z-lastVector.z)
    if(intensity>vectorHypeDelta) addHype()
    lastVector=ev.acceleration
	}
}


//no devicemotion
function setupUnmobile(){
	egg=document.createElement("div")
	egg.id="tap-egg"
	document.body.append(egg)

  hype=0

	egg.addEventListener("click",addHype)
	eggInterval=setInterval(subtractHype,350)
}



function addHype(){
	hype+=hypeDelta
  if(hype<hypeGoal*.2){
    ball.classList.remove("shake-small", "shake-med", "shake-big")
  }else if(hype<hypeGoal*.4){
    ball.classList.remove("shake-small", "shake-med", "shake-big")
    ball.classList.add("shake-small")
  }else if(hype<hypeGoal*.6){
    ball.classList.remove("shake-small", "shake-med", "shake-big")
    ball.classList.add("shake-med")
  }else if(hype<hypeGoal*.8){
    ball.classList.remove("shake-small", "shake-med", "shake-big")
    ball.classList.add("shake-big")
  }else if(hype>=hypeGoal){
		if(egg){
      egg.removeEventListener("click",addHype)
      egg.removeEventListener("click",subtractHype)
      egg.remove()
    }
		window.removeEventListener("devicemotion",registerMotion)
		clearInterval(eggInterval)

		appearText()
	}
}
function subtractHype(){
	hype-=hypeDelta
	if(hype<0) hype=0
  if(hype<hypeGoal*.2){
    ball.classList.remove("shake-small", "shake-med", "shake-big")
  }else if(hype<hypeGoal*.4){
    ball.classList.remove("shake-small", "shake-med", "shake-big")
    ball.classList.add("shake-small")
  }else if(hype<hypeGoal*.6){
    ball.classList.remove("shake-small", "shake-med", "shake-big")
    ball.classList.add("shake-med")
  }else if(hype<hypeGoal*.8){
    ball.classList.remove("shake-small", "shake-med", "shake-big")
    ball.classList.add("shake-big")
  }
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
function appearText(){
	let index=Math.floor(Math.random()*sillyPhrases.length)
	text=document.createElement("p")
	text.classList.add("fire")
	text.innerHTML=sillyPhrases[index]
	document.body.append(text)
}


window.addEventListener("load",setup)
