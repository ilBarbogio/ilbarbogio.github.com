import { resizeCanvas } from "./canvas.js"

let devices=[]
let usefulDevices=[]
let currentStream

export async function checkPermission(){
	let permissionGranted
	await navigator.mediaDevices.getUserMedia({video:true})
	.then(stream=>{
		console.log("Permission granted")
		permissionGranted=true
	})
	.catch(err=>{
		permissionGranted=false
		console.log("Permission not granted")
		console.log(err)
	})
	return permissionGranted
}


export async function findDevices(){
	devices=[]
	usefulDevices=[]
	
	await navigator.mediaDevices.enumerateDevices()
	.then(devs=>{
		for(let d of devs){
			let caps=d.getCapabilities()
			devices.push({device:d,capabilities:caps})
		}
	})
	.catch(err=>{
		// console.log("not a useful device")
		// console.log(err)
		devices.push({})
	})
	.finally(()=>{
		analyseDevices()
	})

	return usefulDevices
}

function analyseDevices(){	
	//filter for video and empties
	devices=devices.filter(el=>{return el.device!=undefined && el.device.kind!="audioinput" && el.capabilities.facingMode!=undefined && el.capabilities.facingMode?.length!=0})
	
	for(let d of devices){
		let info={
			deviceId:d.device.deviceId,
			groupId:d.device.groupId,
			label:d.device.label,
			width:d.capabilities.width,
			height:d.capabilities.height,
			facingMode:d.capabilities.facingMode
		}
		usefulDevices.push(info)
	}
}


export function startDevice(device){
	// console.log("device selezionata: ")
	// console.log(device)
	navigator.mediaDevices.getUserMedia({
		video:{
			deviceId:device.deviceId,
			facingMode:{exact:device.facingMode}
		}
	})
	.then((stream)=>{
		currentStream=stream

		let video=document.querySelector("video")
		video.addEventListener("canplay",()=>{
			resizeCanvas(video.videoWidth,video.videoHeight)
		})

		video.srcObject=stream
		video.play()
		
	})
}

export function stopCurrentStream(){
	if(currentStream!=undefined){
		currentStream.getTracks().forEach(track=>{track.stop()})
	}
}
