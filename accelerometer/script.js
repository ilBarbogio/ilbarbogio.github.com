import { initCore } from "./utils.js"

function setupImage(){
  let image=document.getElementById("image")
  image.style.width="400px"
  image.style.height="400px"
  image.addEventListener("load",()=>{
    image.style.opacity=1
  })
  image.src="./image.png"
}

initCore()

setupImage()