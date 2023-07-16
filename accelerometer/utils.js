import {setup3D,render3D,render3Dendgame} from "./graphics.js"
import {setupEntities, updateEntities} from "./entities.js"
import {setPercentuale, setTimer} from "./displays.js"

import{
  STATE,
  DIM,
  CAN,CTX,
  FILL_COLORS,BLANK_COLOR,BORDER_COLOR,DRAWING_COLOR,
} from "./variables.js"


const JOYSTICK=document.getElementById("joystick")
const JOYSTICK_KNOB=document.getElementById("joystick-knob")
const joystickCoords=[0,0]
const JOYSTICK_DIM=100
const scale=2
let matrice
const imgDat=new ImageData(...DIM)


//GAME
const directions=[false,false,false,false]//N,E,S,W
const startingPos=[Math.floor(DIM[0]/2),0]
const oldCoords=[...startingPos]
export const coords=[...startingPos]
const newCoords=[...startingPos]
let oldTime=0
const STEP_T=20
let stepTimer=STEP_T
const REWIND_T=20
let rewindTimer=REWIND_T

const PLAYTIME_MAX=1000*60*5
let PLAYTIME_ACT=PLAYTIME_MAX

const PUNTEGGIO_VITTORIA=80
const PUNTEGGIO_MAX=DIM[0]*DIM[1]-2*DIM[0]-2*DIM[1]+4
let punteggio=0

export let statoDisegno=false
let statoRewind=false
let codaDisegno=[]


//SETUP
export function initCore(){
  CAN.width=DIM[0]
  CAN.height=DIM[1]
  CAN.style.cssText=`
  background-color:black;
  margin:auto;
  image-rendering: pixelated;
  transform:scale(${scale},${scale});
  position:relative;
  display:none;
  `

  JOYSTICK.style.cssText=`
  position:absolute;
  bottom:10px;
  right:10px;
  box-sizing:border-box;
  border:1px solid black;
  width:${JOYSTICK_DIM}px;
  height:${JOYSTICK_DIM}px;
  border-radius:${JOYSTICK_DIM/2}px;
  `
  JOYSTICK_KNOB.style.cssText=`
  position:absolute;
  left:${JOYSTICK_DIM*3/8}px;
  top:${JOYSTICK_DIM*3/8}px;
  box-sizing:border-box;
  border:1px solid white;
  background-color:black;
  width:${JOYSTICK_DIM/4}px;
  height:${JOYSTICK_DIM/4}px;
  border-radius:${JOYSTICK_DIM/8}px;
  pointer-events:none;
  display:none;
  `
  setupEntities()
  setTimer("05:00")
  setPercentuale(0)
  setInterval(setPlaytime,1000)
  firstDraw()
  listener()
  
  setup3D(DIM,imgDat.data)
  
  requestAnimationFrame(loop)
}

function loop(time){
  let delta=time-oldTime
  oldTime=time
  if(!STATE.menu){
    PLAYTIME_ACT-=delta
    //player
    if(statoRewind) rewind(delta)
    else computeStep(delta)
    //entities
    updateEntities(delta)
  }
  if(!STATE.final) render3D(delta)
  else render3Dendgame(delta)
  requestAnimationFrame(loop)
}

function listener(){
  window.addEventListener("keydown",(e)=>{
    if(!statoRewind){
      if(e.key=="w") directions[0]=true
      if(e.key=="d") directions[1]=true
      if(e.key=="s") directions[2]=true
      if(e.key=="a") directions[3]=true
      //DEBUG
      if(e.key=="p") STATE.menu=!STATE.menu
      if(e.key=="x") STATE.final=true
    }else{
      directions[0]=false
      directions[1]=false
      directions[2]=false
      directions[3]=false
    }
  })
  window.addEventListener("keyup",(e)=>{
    if(!statoRewind){
      if(e.key=="w") directions[0]=false
      if(e.key=="d") directions[1]=false
      if(e.key=="s") directions[2]=false
      if(e.key=="a") directions[3]=false
    }else{
      directions[0]=false
      directions[1]=false
      directions[2]=false
      directions[3]=false
    }
  })
  JOYSTICK.addEventListener("touchmove",(e)=>{
    e.preventDefault()
    if(!statoRewind){
      let rect=e.target.getBoundingClientRect()
      joystickCoords[0]=e.touches[0].clientX-rect.left
      joystickCoords[1]=e.touches[0].clientY-rect.top
      if(joystickCoords[1]<=JOYSTICK_DIM/4) directions[0]=true
      else directions[0]=false
      if(joystickCoords[0]>JOYSTICK_DIM*3/4) directions[1]=true
      else directions[1]=false
      if(joystickCoords[1]>JOYSTICK_DIM*3/4) directions[2]=true
      else directions[2]=false
      if(joystickCoords[0]<=JOYSTICK_DIM/4) directions[3]=true
      else directions[3]=false
      JOYSTICK_KNOB.style.left=`${joystickCoords[0]-JOYSTICK_DIM/8}px`
      JOYSTICK_KNOB.style.top=`${joystickCoords[1]-JOYSTICK_DIM/8}px`
      JOYSTICK_KNOB.style.display="block"
    }else{
      directions[0]=false
      directions[1]=false
      directions[2]=false
      directions[3]=false
      JOYSTICK_KNOB.style.left=`${joystickCoords[0]-JOYSTICK_DIM/8}px`
      JOYSTICK_KNOB.style.top=`${joystickCoords[1]-JOYSTICK_DIM/8}px`
      JOYSTICK_KNOB.style.display="none"
    }
  })
  JOYSTICK.addEventListener("touchend",(e)=>{
    e.preventDefault()
    joystickCoords[0]=0
    joystickCoords[1]=0
    directions[0]=false
    directions[1]=false
    directions[2]=false
    directions[3]=false
    JOYSTICK_KNOB.style.left=`${joystickCoords[0]-JOYSTICK_DIM/8}px`
    JOYSTICK_KNOB.style.top=`${joystickCoords[1]-JOYSTICK_DIM/8}px`
    JOYSTICK_KNOB.style.display="none"
  })
  JOYSTICK.addEventListener("touchcancel",(e)=>{
    e.preventDefault()
    joystickCoords[0]=0
    joystickCoords[1]=0
    directions[0]=false
    directions[1]=false
    directions[2]=false
    directions[3]=false
    JOYSTICK_KNOB.style.display="none"
  })
  // JOYSTICK.addEventListener("mousedown",()=>{
  //   console.log("CLICK")
  // })
}

function firstDraw(){
  matrice=imgDat.data
  for(let i=0;i<matrice.length;i=i+4){
    matrice.set(BLANK_COLOR,i)
  }
  for(let x=0;x<DIM[0];x++){
    matrice.set(BORDER_COLOR,getIndex(x,0))
    matrice.set(BORDER_COLOR,getIndex(x,DIM[1]-1))
  }
  for(let y=0;y<DIM[1];y++){
    matrice.set(BORDER_COLOR,getIndex(0,y))
    matrice.set(BORDER_COLOR,getIndex(DIM[0]-1,y))
  }
  
  let index=getIndex(...coords)
  matrice.set(DRAWING_COLOR,index)
  CTX.putImageData(imgDat,0,0)
}

export function resetCore(){
  directions[0]=false
  directions[1]=false
  directions[2]=false
  directions[3]=false
  startingPos[0]=Math.floor(DIM[0]/2)
  startingPos[1]=0
  oldCoords[0]=startingPos[0]
  oldCoords[1]=startingPos[1]
  coords[0]=startingPos[0]
  coords[1]=startingPos[1]
  newCoords[0]=startingPos[0]
  newCoords[1]=startingPos[1]
  
  oldTime=0
  stepTimer=STEP_T
  rewindTimer=REWIND_T
  
  statoDisegno=false
  statoRewind=false
  codaDisegno=[]
  // setupEntities()
  setTimer("05:00")
  setPercentuale(0)
  firstDraw()
  console.log("reset")
  loop(0)
  PLAYTIME_ACT=PLAYTIME_MAX
}

//MOVEMENTS
function computeStep(d){
  stepTimer=stepTimer-d
  if(stepTimer<=0){
    stepTimer=STEP_T
    let x=0
    let y=0
    if(directions[0]) y-=1
    if(directions[1]) x+=1
    if(directions[2]) y+=1
    if(directions[3]) x-=1
    if(x!=0) y=0
    if(x+y!=0) step(x,y)
  }
}

function step(x,y){
  newCoords[0]=coords[0]+x
  newCoords[1]=coords[1]+y
  if(checkBounds(...newCoords)) checkStep(...newCoords)
}

function checkStep(x,y){
  let c=getColor(x,y)
  if(compareColors(c,BLANK_COLOR)){
    if(!statoDisegno){
      statoDisegno=true
      // console.log("Inizio disegno")
      codaDisegno=[[...oldCoords]]
    }
    codaDisegno.push([x,y])

    disegnaStep(x,y)
  }else if(compareColors(c,BORDER_COLOR)){
    if(statoDisegno){
      if(checkCoda(x,y)){
        statoDisegno=false
        statoRewind=true
        // console.log("Rewind")
      }else{
        statoDisegno=false
        // console.log("Fine disegno")
        codaDisegno=[]
        disegnaStep(x,y)
  
        findComponents()
      }
    }else{
      disegnaStep(x,y)
    }
  }
}

function disegnaStep(x,y){
  oldCoords[0]=coords[0]
  oldCoords[1]=coords[1]
  coords[0]=x
  coords[1]=y

  let index=getIndex(...oldCoords)
  matrice.set(BORDER_COLOR,index)
  index=getIndex(...coords)
  matrice.set(DRAWING_COLOR,index)
  CTX.putImageData(imgDat,0,0)
}

function rewind(d){
  rewindTimer-=d
  if(rewindTimer<=0){
    if(codaDisegno.length>1){
      rewindTimer=REWIND_T
      let prev=codaDisegno[codaDisegno.length-2]
      codaDisegno.pop()

      oldCoords[0]=coords[0]
      oldCoords[1]=coords[1]
      coords[0]=prev[0]
      coords[1]=prev[1]

      let index=getIndex(...oldCoords)
      matrice.set(BLANK_COLOR,index)
      index=getIndex(...coords)
      matrice.set(DRAWING_COLOR,index)
      CTX.putImageData(imgDat,0,0)
    }else{
      rewindTimer=REWIND_T
      let prev=codaDisegno[0]
      codaDisegno.pop()

      oldCoords[0]=coords[0]
      oldCoords[1]=coords[1]
      coords[0]=prev[0]
      coords[1]=prev[1]

      let index=getIndex(...oldCoords)
      matrice.set(BLANK_COLOR,index)
      index=getIndex(...coords)
      matrice.set(DRAWING_COLOR,index)
      CTX.putImageData(imgDat,0,0)
      
      statoRewind=false
    }
  }
}




//UTILS
function findComponents(){
  let sawColor=[]
  let components=[]
  for(let i=0;i<matrice.length;i+=4){
    let [x,y]=ungetIndex(i)
    let c=getColor(x,y)
    if(compareColors(c,BLANK_COLOR)&&!checkColorArray(c,sawColor)){
      sawColor.push(c)
      components.push(floodFillSave(x,y,pickOne(FILL_COLORS)))
    }
  }
  if(components.length==2){
    let iMin=0
    let iMax=1
    if(components[0].length>components[1].length){
      iMin=1
      iMax=0
    }
    punteggio+=components[iMin].length
    floodFill(...components[iMax][0],BLANK_COLOR)
    checkPunteggio()
  }else if(components.length==1){
    floodFill(...components[0][0],BLANK_COLOR)
    fillCoda(BLANK_COLOR)
  }else{
    for(let comp of components) floodFill(...comp[0],BLANK_COLOR)
    fillCoda(BLANK_COLOR)
  }
}

function floodFillSave(startX,startY,fill){
  let queue=[[startX,startY]]
  let target=BLANK_COLOR
  let component=[]
  while(queue.length>0){//verso destra
    let [x,y]=queue.pop()
    let c=getColor(x,y)
    if(checkBounds(x,y)&&compareColors(c,target)){
      component.push([x,y])
      setColor(x,y,fill)
      queue.push([x+1,y],[x-1,y],[x,y+1],[x,y-1])
    }
  }
  return component
}

function floodFill(startX,startY,fill){
  let queue=[[startX,startY]]
  let target=getColor(startX,startY).slice()//colore del pixel come target
  while(queue.length>0){//verso destra
    let [x,y]=queue.pop()
    let c=getColor(x,y)
    if(checkBounds(x,y)&&compareColors(c,target)){
      setColor(x,y,fill)
      queue.push([x+1,y],[x-1,y],[x,y+1],[x,y-1])
    }
  }
  CTX.putImageData(imgDat,0,0)
}

function fillCoda(fill=BORDER_COLOR){
  for(let [i,c] of codaDisegno.entries()){
    if(i!=0) matrice.set(fill,getIndex(...c))
  }
  let index=getIndex(...oldCoords)
  matrice.set(fill,index)
  CTX.putImageData(imgDat,0,0)
}


//PUNTEGGIO e TIMER
function checkPunteggio(){
  if(!STATE.final){
    let punti=Math.floor(punteggio/PUNTEGGIO_MAX*100)
    setPercentuale(punti)
    if(punti>=PUNTEGGIO_VITTORIA) endGame()
  }
}
function setPlaytime(){
  if(!STATE.final&&!STATE.menu){
    let sec=Math.floor(PLAYTIME_ACT/1000)
    let min=Math.floor(sec/60)
    sec-=min*60
    setTimer(`${min}:${sec}`)
  }
}


function endGame(){
  console.log("VITTORIA")
  STATE.final=true
}


function checkBounds(x,y){
  if(x<0||x>DIM[0]-1||y<0||y>DIM[1]-1) return false
  else return true
}
export function checkCoda(x,y){
  for(let el of codaDisegno){
    if(el[0]==x&&el[1]==y){
      return true
    }
  }
  return false
}
function checkColorArray(c,array){
  let check=false
  for(let col of array){
    if(compareColors(c,col)){
      check=true
      break
    }
  }
  return check
}
function compareColors(c1,c2){
  let check=true
  for(let i=0;i<c1.length;i++){
    if(c1[i]!=c2[i]) return false
  }
  return check
}
export function getColor(x,y){
  let index=getIndex(x,y,DIM[0])
  return matrice.subarray(index,index+4)
}
function setColor(x,y,c){
  let index=getIndex(x,y,DIM[0])
  matrice.set(c,index)
  return matrice.subarray(index,index+4)
}
export function getIndex(x,y) {
  var red=y*(DIM[0]*4)+x*4
  return red
}
function ungetIndex(i){
  const x=i%(DIM[0]*4)/4
  const y=(i-x*4)/(DIM[0]*4)
  return [x,y]
}


//UTILS TECNICHE
function pickOne(arr){
  return arr[Math.floor(Math.random()*arr.length)]
}
export function setRewindState(b){
  if(b) statoDisegno=false
  statoRewind=b
}