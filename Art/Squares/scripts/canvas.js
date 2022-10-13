import { video } from "./interface.js"

let snapCan,snapCtx
let bwCan,bwCtx
let thrCan,thrCtx
let resCan,resCtx
let imageData,arrayData,bwArrayData,thrArrayData,resArrayData
let width,height

export function setup(){
	snapCan=document.querySelector("#snap-canvas")
	snapCtx=snapCan.getContext("2d",{willReadFrequently:true})
	
	bwCan=document.querySelector("#bw-canvas")
	bwCtx=bwCan.getContext("2d",{willReadFrequently:true})

	thrCan=document.querySelector("#thr-canvas")
	thrCtx=thrCan.getContext("2d",{willReadFrequently:true})

	resCan=document.querySelector("#res-canvas")
	resCtx=resCan.getContext("2d",{willReadFrequently:true})
}

export function resizeCanvas(widthIn,heightIn){
	width=widthIn
	height=heightIn

	snapCan.width=width
	snapCan.height=height

	bwCan.width=width
	bwCan.height=height

	thrCan.width=width
	thrCan.height=height
	thrCan.style.left=(.5*(innerWidth-width))+"px"
	thrCan.style.top=(.5*(innerHeight-height))+"px"

	resCan.width=width
	resCan.height=height
	resCan.style.left=(.5*(innerWidth-width))+"px"
	resCan.style.top=(.5*(innerHeight-height))+"px"
	resCan.style.display="none"
}

export function snap(){
	snapCtx.drawImage(video,0,0,width,height)
	imageData=snapCtx.getImageData(0,0,width,height)
	arrayData=new Uint8ClampedArray(imageData.data)
	bwArrayData=arrayData.slice()
	thrArrayData=arrayData.slice()
	resArrayData=arrayData.slice()

	grayscale(50)
	threshold(128)
	thrCan.addEventListener("click",handleThreshold)

}

function handleThreshold(ev){
	let ratio=ev.clientX/window.innerWidth
	let thr=Math.abs(ratio*255)
	threshold(thr)
}


function grayscale(offset){
	for(let i=0;i<arrayData.length;i+=4){
		let [r,g,b]=arrayData.slice(i,i+3)
		let mean=0.299*r + 0.587*g + 0.114*b+offset
		bwArrayData.set([mean,mean,mean],i)
	}
	let imgData=new ImageData(bwArrayData,width,height)
	bwCtx.putImageData(imgData,0,0)
}

function threshold(threshold){
	for(let i=0;i<arrayData.length;i+=4){
		let [r,g,b]=arrayData.slice(i,i+3)
		let mean=0.299*r + 0.587*g + 0.114*b
		if(mean>threshold) thrArrayData.set([255,255,255],i)
		else  thrArrayData.set([0,0,0],i)
	}
	let imgData=new ImageData(thrArrayData,width,height)
	thrCtx.putImageData(imgData,0,0)
}


let squares=[]

export function finalize(){
	squarize()
}

function squarize(){
	let ratio=Math.floor(window.innerHeight/window.innerWidth*10)
	let n=3
	let ratioX=Math.floor(10/n)
	let ratioY=Math.floor(ratio/n)
	console.log(ratioX,ratioY)
	firstGrid(ratioX,ratioY)

	refineGrid(10,64,.25)
	refineGrid(10,32,.25)
	refineGrid(5,32,.15)
	refineGrid(5,16,.15)
	refineGrid(4,16,.5)
	refineGrid(2,8,.5)

	resCan.style.display="block"

	drawSquares()
}

function firstGrid(n,m){
	squares=subdivide([0,0,width,height],n,m)
}
function refineGrid(side,threshold,random=.35){
	let newSquares=[]
	for(let sq of squares){
		if(checkSquare(sq,side,threshold)) newSquares.push(...subdivide(sq,2,2))
		else newSquares.push(sq)
	}
	squares=newSquares
}

function checkSquare(square,minSide,threshold,random=.35){
	if(Math.random()<random) return true
	let sides=[square[2]-square[0],square[3]-square[1]]
	if(sides[0]<minSide||sides[1]<minSide) return false

	let corners=[
		thrCtx.getImageData(square[0],square[1],1,1).data[0],
		thrCtx.getImageData(square[2],square[1],1,1).data[0],
		thrCtx.getImageData(square[2],square[3],1,1).data[0],
		thrCtx.getImageData(square[0],square[3],1,1).data[0]
	]
	if(corners[0]!=corners[1]||corners[1]!=corners[2]||corners[2]!=corners[3]||corners[3]!=corners[0]||corners[0]!=corners[2]||corners[1]!=corners[3]){
		return true
	}
	
	let data=bwCtx.getImageData(square[0],square[1],...sides).data
	let mean=0
	for(let i=0;i<data.length;i=i+4){
		mean+=data[i]+data[i+1]+data[i+2]
	}
	mean=mean/(data.length*.75)
	if(mean<threshold) return true
	
	return false
}

function subdivide(square,dx,dy){
	let sideX=(square[2]-square[0])/dx
	let sideY=(square[3]-square[1])/dy
	let newSquares=[]
	for(let j=0;j<dy;j++){
		for(let i=0;i<dx;i++){
			newSquares.push([square[0]+i*sideX,square[1]+j*sideY,square[0]+(i+1)*sideX,square[1]+(j+1)*sideY])
		}
	}
	return newSquares
}

function drawSquares(){
	resCtx.fillStyle="black"
	resCtx.fillRect(0,0,width,height)

	resCtx.globalAlpha=.1

	let alfa=Math.PI/326
	for(let sq of squares){
		let randomColor=Math.floor(Math.random()*40-20)
		for(let i=0;i<8;i++){
			let randomAngle=Math.random()*2*alfa-.5*alfa
			resCtx.rotate(randomAngle)
			resCtx.strokeStyle=`hsl(${150+randomColor},100%,50%)`
			resCtx.strokeRect(sq[0],sq[1],sq[2]-sq[0],sq[3]-sq[1])
			resCtx.rotate(-randomAngle)
		}
	}
	
}
