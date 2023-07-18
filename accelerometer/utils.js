import { resultingVector, sensorActive } from "./sensor.js"

let BLANK_COLOR=[0,0,0,255]
let BORDER_COLOR=[255,255,255,255]
let DEAD_BORDER_COLOR=[255,0,255,127]
let DRAWING_COLOR=[255,0,0,255]
let TRANSPARENT_COLOR=[0,0,0,0]

let can,ctx,img
const dim=[200,200]
let matrice
const imgDat=new ImageData(...dim)
const border=[]

let state={
  final:false
}
let punteggio,punteggioMax,percentualeVittoria


//GAME
const startingPos=[Math.floor(dim[0]/2),0]
const oldCoords=[...startingPos]
const coords=[...startingPos]
const newCoords=[...startingPos]

let oldTime=0
const STEP_T=20
let stepTimer=STEP_T
const REWIND_T=20
let rewindTimer=REWIND_T

let touchDown=false
let statoDisegno=false
let statoRewind=false
let codaDisegno=[]


//SETUP
export function initCore(){
  state.final=false
  punteggio=0
  punteggioMax=dim[0]*dim[1]
  percentualeVittoria=75
  
  img=document.getElementById("image")

  can=document.getElementById("field-canvas")
  can.width=dim[0]
  can.height=dim[1]
  ctx=can.getContext("2d")

  // JOYSTICK.style.cssText=`
  // position:absolute;
  // bottom:10px;
  // right:10px;
  // box-sizing:border-box;
  // border:1px solid black;
  // width:${JOYSTICK_DIM}px;
  // height:${JOYSTICK_DIM}px;
  // border-radius:${JOYSTICK_DIM/2}px;
  // `
  // JOYSTICK_KNOB.style.cssText=`
  // position:absolute;
  // left:${JOYSTICK_DIM*3/8}px;
  // top:${JOYSTICK_DIM*3/8}px;
  // box-sizing:border-box;
  // border:1px solid white;
  // background-color:black;
  // width:${JOYSTICK_DIM/4}px;
  // height:${JOYSTICK_DIM/4}px;
  // border-radius:${JOYSTICK_DIM/8}px;
  // pointer-events:none;
  // display:none;
  // `

  window.addEventListener("touchstart",ev=>{
    if(ev.touches.length>0) touchDown=true
  })
  window.addEventListener("touchend",ev=>{
    if(ev.touches.length==0) touchDown=false
  })
  window.addEventListener("touchcancel",ev=>{
    if(ev.touches.length==0) touchDown=false
  })

  firstDraw()
  // listener()
  
  requestAnimationFrame(loop)
}

function loop(time){
  let delta=time-oldTime
  oldTime=time
  if(sensorActive){
    
    if(!state.final){
      //player
      if(statoRewind) rewind(delta)
      else computeStep(delta)
    }
    //entities
    // updateEntities(delta)
  }
  
  requestAnimationFrame(loop)
}


function firstDraw(){
  matrice=imgDat.data
  for(let i=0;i<matrice.length;i=i+4){
    matrice.set(BLANK_COLOR,i)
  }
  for(let x=0;x<dim[0];x++){
    matrice.set(BORDER_COLOR,getIndex(x,0))
    matrice.set(BORDER_COLOR,getIndex(x,dim[1]-1))
    border.push(getIndex(x,0),getIndex(x,dim[1]-1))
  }
  for(let y=0;y<dim[1];y++){
    matrice.set(BORDER_COLOR,getIndex(0,y))
    matrice.set(BORDER_COLOR,getIndex(dim[0]-1,y))
    border.push(getIndex(0,y),getIndex(dim[0]-1,y))
  }
  
  let index=getIndex(...coords)
  matrice.set(DRAWING_COLOR,index)
  ctx.putImageData(imgDat,0,0)
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
  step(...resultingVector)
  
  // stepTimer=stepTimer-d
  // if(stepTimer<=0){
  //   stepTimer=STEP_T
  //   let x=0
  //   let y=0
  //   if(directions[0]) y-=1
  //   if(directions[1]) x+=1
  //   if(directions[2]) y+=1
  //   if(directions[3]) x-=1
  //   if(x!=0) y=0
  //   if(x+y!=0) step(x,y)
  // }
}

function step(x,y){
  newCoords[0]=coords[0]+x
  newCoords[1]=coords[1]+y
  if(checkBounds(...newCoords)) checkStep(...newCoords)
}

function checkStep(x,y){
  let c=getColor(x,y)
  if(compareColors(c,BLANK_COLOR)){
    if(touchDown || statoDisegno){
      if(!statoDisegno){
        statoDisegno=true
        codaDisegno=[[...oldCoords]]
      }
      codaDisegno.push([x,y])

      disegnaStep(x,y)
    }
  }else if(compareColors(c,BORDER_COLOR)){
    if(statoDisegno){
      if(checkCoda(x,y)){
        statoDisegno=false
        statoRewind=true
        // console.log("Rewind")
      }else{
        statoDisegno=false
        // console.log("Fine disegno")
        for(let c of codaDisegno){
          border.push(getIndex(...c))
        }
        codaDisegno=[]
        disegnaStep(x,y)
  
        findComponents()
        fillBorder()
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
  ctx.putImageData(imgDat,0,0)
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
      ctx.putImageData(imgDat,0,0)
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
      ctx.putImageData(imgDat,0,0)
      
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
      components.push(floodFillSave(x,y,TRANSPARENT_COLOR))// pickOne(FILL_COLORS)))
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
    if(checkBounds(x,y) && compareColors(c,target)){
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
  ctx.putImageData(imgDat,0,0)
}

function fillCoda(fill=BORDER_COLOR){
  for(let [i,c] of codaDisegno.entries()){
    if(i!=0) matrice.set(fill,getIndex(...c))
  }
  let index=getIndex(...oldCoords)
  matrice.set(fill,index)
  ctx.putImageData(imgDat,0,0)
}

function fillBorder(){
  for(let i of border){
    let [x,y]=ungetIndex(i)
    if(checkBounds(x,y) && !compareColors(getColor(x,y),DRAWING_COLOR) && !checkBorder(x,y)) setColor(x,y,DEAD_BORDER_COLOR)
  }
  ctx.putImageData(imgDat,0,0)
}

function checkBorder(x,y){
  // if(checkBounds(x+1,y) && compareColors(getColor(x+1,y),BLANK_COLOR)) return true
  // if(checkBounds(x,y+1) && compareColors(getColor(x,y+1),BLANK_COLOR)) return true
  // if(checkBounds(x-1,y) && compareColors(getColor(x-1,y),BLANK_COLOR)) return true
  // if(checkBounds(x,y-1) && compareColors(getColor(x,y-1),BLANK_COLOR)) return true

  if(checkBounds(x+1,y-1) && compareColors(getColor(x+1,y-1),BLANK_COLOR)) return true
  if(checkBounds(x+1,y+1) && compareColors(getColor(x+1,y+1),BLANK_COLOR)) return true
  if(checkBounds(x-1,y-1) && compareColors(getColor(x-1,y-1),BLANK_COLOR)) return true
  if(checkBounds(x-1,y+1) && compareColors(getColor(x-1,y+1),BLANK_COLOR)) return true

  return false
}

//PUNTEGGIO e TIMER
function checkPunteggio(){
  if(!state.final){
    let punti=Math.floor(punteggio/punteggioMax*100)
    console.log(punteggio,punti)
    // setPercentuale(punti)
    if(punti>=percentualeVittoria) endGame()
  }
}
function setPlaytime(){
  if(!state.final&&!state.menu){
    let sec=Math.floor(PLAYTIME_ACT/1000)
    let min=Math.floor(sec/60)
    sec-=min*60
    setTimer(`${min}:${sec}`)
  }
}


function endGame(){
  console.log("VITTORIA")
  img.classList.add("finish")
  can.classList.add("finish")
  state.final=true
}


function checkBounds(x,y){
  if(x<0||x>dim[0]-1||y<0||y>dim[1]-1) return false
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
  let index=getIndex(x,y,dim[0])
  return matrice.subarray(index,index+4)
}
function setColor(x,y,c){
  let index=getIndex(x,y,dim[0])
  matrice.set(c,index)
  return matrice.subarray(index,index+4)
}
export function getIndex(x,y) {
  var red=y*(dim[0]*4)+x*4
  return red
}
function ungetIndex(i){
  const x=i%(dim[0]*4)/4
  const y=(i-x*4)/(dim[0]*4)
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