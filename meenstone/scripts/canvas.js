import { STATE } from "./systems/variables.js"

let can,ctx,dims

export function setupSfondo(d){
  dims=[...d]
  can=document.getElementById("sfondo")
  can.width=dims[0]
  can.height=dims[1]
  ctx=can.getContext("2d")

  ctx.fillStyle="#fff"
  ctx.beginPath()
  ctx.rect(0,0,...dims)
  // ctx.ellipse(...dims.map(el=>el*.5),...dims.map(el=>el*.5),0, 0,Math.PI*2)
  ctx.fill()

  let data=ctx.getImageData(0,0,...dims).data
  STATE.matrix=new Uint8Array(dims[0]*dims[1])
  for(let i=0;i<STATE.matrix.length;i++){
    STATE.matrix[i]=data[i*4]
  }
  
  can.style.backgroundImage="url('./assets/background.png')"
  can.style.backgroundSize="cover"
  ctx.globalAlpha=.75
  ctx.clearRect(0,0,...dims)
  

  // let w=dims[0]/5
  // let h=w*.75
  // for(let i=0;i<Math.floor(dims[0]/w);i++){
  //   for(let j=0;j<Math.floor(dims[1]/h);j++){
  //     if((i+j)%2==0) ctx.fillStyle="#aaa"
  //     else ctx.fillStyle="#ddd"
  //     ctx.fillRect(i*w,j*h,w,h)
  //   }
  // }

  // ctx.fillStyle="#aaa"
  // ctx.beginPath()
  // ctx.rect(0,0,...dims)
  // ctx.ellipse(...dims.map(el=>el*.5),...dims.map(el=>el*.5),0, 0,Math.PI*2)
  // ctx.fill()


}

export const bloodStain=(x,y,magnitude=1)=>{
  let radius=10
  ctx.fillStyle="#f00"
  ctx.beginPath()
  ctx.ellipse(x,y,radius*magnitude,radius*magnitude*.75,0, 0,Math.PI*2)
  ctx.fill()
}

export const getPixelAtCoords=(x,y)=>{
  x=Math.round(x)
  y=Math.round(y)
  if(x>=0 && x<dims[0] && y>=0 && y<dims[1]) return STATE.matrix[x+y*dims[0]]
  else return 0
}