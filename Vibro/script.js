const can=document.querySelector("#canvas")
const ctx=can.getContext("2d")
const dim=[100,100]
let duration=1000
let stripes=[
  [1],
  [.5,.5],
  [.33,.34,.33],
  [.25,.25,.25,.25],
  [.2,.2,.2,.2,.2]
]
let selected=null
let currentInterval

let lastTime=0

function setup(){
  resize()
  draw()
}

function resize(){
  dim[0]=window.innerWidth
  dim[1]=window.innerHeight
  can.width=dim[0]
  can.height=dim[1]
}

function draw(){
  const dh=dim[1]/stripes.length
  for(let [i,s] of stripes.entries()){
    let ry=i/stripes.length
    let cursor=0
    for(let [j,p] of s.entries()){
      let dw=dim[0]*p
      let alpha=j%2==0?1:.5
      ctx.fillStyle=`rgba(${Math.floor(ry*255)},50,120,${alpha})`
      ctx.fillRect(cursor,i*dh,dw,dh)
      cursor+=dw
    }
  }
}

function setVibration(){
  //console.log("vib")
  let t=performance.now()
  console.log(t-lastTime)
  lastTime=t
  navigator.vibrate(stripes[selected].map(el=>el*duration))
}

addEventListener("resize",()=>{
  resize()
  draw()
})

addEventListener("click",(ev)=>{
  const [x,y]=[ev.clientX/dim[0],ev.clientY/dim[1]]
  selected=Math.floor(y*stripes.length)
  console.log("stop",selected)
  navigator.vibrate(0)
  if(currentInterval) clearInterval(currentInterval)
  lastTime=performance.now()
  currentInterval=setInterval(setVibration,duration)
})

setup()