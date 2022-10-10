import { checkPermission, findDevices } from "./scripts/devices.js"
import { setup as setupInterface, toggle as toggleUiElement, createDeviceButton } from "./scripts/interface.js"
import { setup as setupCanvas } from "./scripts/canvas.js"

async function setup(){
	setupInterface()
	setupCanvas()
	
	let check=await checkPermission()
	if(!check){
		toggleUiElement("no-permission-container")
	}else{
		let devices=await findDevices()
		toggleUiElement("device-button-container")
		for(let d of devices){
			createDeviceButton(d)
		}
	}
}

setup()