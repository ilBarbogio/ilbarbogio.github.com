export let inputToKeysArr=[,"w","s","sw","e",,"se",,"n","nw",,,"ne"]

export const STATE={
  inputs:[false,false,false,false,false],
  input:0,

  controls:undefined,
  
  clock:0,
  cumulatedTime:0,
  
  player:undefined,

  backgroundSize:[500,300],

  matrix:undefined,

  spritesheets:{
    player:undefined
  },
}

export function extractImages(files,callback){
  let cursor=0

  let can=document.createElement("canvas")
  let ctx=can.getContext("2d")

  let img=new Image()
  img.addEventListener("load",(ev)=>{
    can.width=img.width
    can.height=img.height
    ctx.drawImage(img,0,0)

    can.toBlob((blob)=>{
      STATE.spritesheets[files[cursor].id]=URL.createObjectURL(blob)
      if(cursor<files.length-1){
        cursor++
        img.src=`./assets/${files[cursor].filename}`
      }else callback()
    })
  })

  img.src=`./assets/${files[cursor].filename}`
}


export function handleInput(){
  STATE.input=0
  for(let [i,n] of [8,4,2,1].entries()) if(STATE.inputs[i]) STATE.input+=n
}


//utils
export const dist=(A,B)=>Math.hypot(A[0]-B[0],A[1]-B[1])
export const sum=(A,B)=>[A[0]+B[0],A[1]+B[1]]
