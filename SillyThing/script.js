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

let lastVector
let motionSequence
let motionInterval

function setup(){
	//if(ScreenOrientation.lock){
		//ScreenOrientation.lock()
		//.then((v)=>{
			setupMobile()
		//})
	//}else setupUnmobile()
}

function setupMobile(){
	// egg=document.createElement("div")
	// egg.id="tap-egg"
	// document.body.append(egg)

	text=document.createElement("p")
	text.style="color:white;font-size:larger;"
	document.body.append(text)

	window.addEventListener("devicemotion",calibrateMotion)
}

function calibrateMotion(ev){
	window.removeListener("devicemotion",calibrateMotion)
	lastVector=undefined
	motionSequence=[]
	motionInterval=setInterval(registerMotion,ev.interval)
}
function registerMotion(ev){
	if(!lastVector) lastVector=ev.acceleration
	else{
		let distance=Math.hypot(ev.acceleration.x-lastVector.x, ev.acceleration.y-lastVector.y, ev.acceleration.z-lastVector.z)
		text.innerHTML=distance
		lastVector=ev.acceleration
	}
}



function setupUnmobile(){
	egg=document.createElement("div")
	egg.id="tap-egg"
	document.body.append(egg)

	egg.addEventListener("click",addHype)
	eggInterval=setInterval(subtractHype,350)
}
function addHype(){
	hype+=hypeDelta
	console.log(hype)
	if(hype>=hypeGoal){
		egg.removeEventListener("click",addHype)
		egg.removeEventListener("click",subtractHype)
		egg.remove()
		clearInterval(eggInterval)

		appearText()
	}
}
function subtractHype(){
	hype-=hypeDelta
	if(hype<0) hype=0
	console.log(hype)
}


function appearText(){
	let index=Math.floor(Math.random()*sillyPhrases.length)
	text=document.createElement("p")
	text.classList.add("fire")
	text.innerHTML=sillyPhrases[index]
	document.body.append(text)
}


window.addEventListener("load",setup)
