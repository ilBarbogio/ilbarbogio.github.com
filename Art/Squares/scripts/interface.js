import { snap, finalize } from "./canvas.js"
import { startDevice, stopCurrentStream } from "./devices.js"

export let video
export let deviceButtonContainer
export let actionButtonContainer
export let canvasButtonContainer
let stopButton, snapButton, thrButton
export let noPermissionContainer

export function setup(){
	video=document.querySelector("video")
	deviceButtonContainer=document.querySelector(".device-button-container")
	actionButtonContainer=document.querySelector(".action-button-container")
	canvasButtonContainer=document.querySelector(".canvas-button-container")

	noPermissionContainer=document.querySelector(".no-permission-container")
	
	createActionButtons()
}
function createActionButtons(){
	snapButton=document.createElement("button")
	snapButton.innerHTML="snap"
		
	snapButton.addEventListener("click",()=>{
		toggle("action-button-container")
		toggle("canvas-button-container")
		snap()
	})

	actionButtonContainer.append(snapButton)


	stopButton=document.createElement("button")
	stopButton.innerHTML="stop"
		
	stopButton.addEventListener("click",()=>{
		stopCurrentStream()
		toggle("action-button-container")
		toggle("device-button-container")
		let video=document.querySelector("video")
		video.srcObject=undefined
	})

	actionButtonContainer.append(stopButton)
	
	thrButton=document.createElement("button")
	thrButton.innerHTML="generate"
		
	thrButton.addEventListener("click",()=>{
		toggle("canvas-button-container")
		finalize()
	})

	canvasButtonContainer.append(thrButton)
}

export function toggle(element){
	switch(element){
		case "device-button-container":
			if(deviceButtonContainer) deviceButtonContainer.classList.toggle("hide")
			break
		case "action-button-container":
			if(actionButtonContainer) actionButtonContainer.classList.toggle("hide")
			break
		case "canvas-button-container":
			if(canvasButtonContainer) canvasButtonContainer.classList.toggle("hide")
			break
		case "no-permission-container":
			if(noPermissionContainer) noPermissionContainer.classList.toggle("hide")
			break
		default: console.log("unknown element")
	}
}

export function createDeviceButton(device){	
	let button=document.createElement("button")
	button.innerHTML=device.facingMode

	button.addEventListener("click",()=>{
		// console.log(device)
		toggle("action-button-container")
		toggle("device-button-container")
		startDevice(device)
	})
	deviceButtonContainer.append(button)
}
