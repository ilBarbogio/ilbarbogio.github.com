import { video } from "./interface.js"

let snapCan,snapCtx
let bwCan,bwCtx
let imageData,arrayData
let width,height

export function setup(){
	snapCan=document.querySelector("#snap-canvas")
	snapCtx=snapCan.getContext("2d")
	
	bwCan=document.querySelector("#bw-canvas")
	bwCtx=snapCan.getContext("2d")
}

export function resizeCanvas(widthIn,heightIn){
	width=widthIn
	height=heightIn

	snapCan.width=width
	snapCan.height=height

	bwCan.width=width
	bwCan.height=height
}

export function snap(){
	snapCtx.drawImage(video,0,0,width,height)
	imageData=snapCtx.getImageData(0,0,width,height)
	arrayData=new Uint8ClampedArray(imageData.data)

	// grayscale()
	threshold(.75)
}

function grayscale(){
	for(let i=0;i<arrayData.length;i+=4){
		let [r,g,b]=arrayData.slice(i,i+3)
		let mean=Math.abs(0.299*r + 0.587*g + 0.114*b)
		arrayData.set([mean,mean,mean],i)
	}
	let imgData=new ImageData(arrayData,width,height)
	bwCtx.putImageData(imgData,0,0)
}

function threshold(threshold){
	for(let i=0;i<arrayData.length;i+=4){
		let [r,g,b]=arrayData.slice(i,i+3)
		let mean=Math.abs(0.299*r + 0.587*g + 0.114*b)
		if(mean>threshold) arrayData.set([255,255,255],i)
		else  arrayData.set([0,0,0],i)
	}
	let imgData=new ImageData(arrayData,width,height)
	bwCtx.putImageData(imgData,0,0)
}