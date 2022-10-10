import { snap } from "./canvas.js"
import { startDevice, stopCurrentStream } from "./devices.js"

export let video
export let deviceButtonContainer
export let actionButtonContainer
let stopButton, snapButton
export let noPermissionContainer

export function setup(){
	video=document.querySelector("video")
	deviceButtonContainer=document.querySelector(".device-button-container")
	actionButtonContainer=document.querySelector(".action-button-container")
	noPermissionContainer=document.querySelector(".no-permission-container")
	
	createActionButtons()
}
function createActionButtons(){
	snapButton=document.createElement("button")
	snapButton.innerHTML="snap"
		
	snapButton.addEventListener("click",()=>{
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
	
}

export function toggle(element){
	switch(element){
		case "device-button-container":
			if(deviceButtonContainer) deviceButtonContainer.classList.toggle("hide")
			break
		case "action-button-container":
			if(actionButtonContainer) actionButtonContainer.classList.toggle("hide")
			break
		case "no-permission-container":
			if(noPermissionContainer) noPermissionContainer.classList.toggle("hide")
			break
		default: console.log("unknown element")
	}
}

export function createDeviceButton(device){
	console.log("creating",device)
	
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

