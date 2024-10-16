import { setupSfondo } from "./canvas.js"
import { StaticObject } from "./entities/objects.js"
import { Particle } from "./entities/particles.js"
import { Player } from "./entities/player.js"
import { Enemy } from "./entities/enemy.js"
import { STATE } from "./systems/variables.js"
import { extractImages } from "./systems/variables.js"
import { Limb } from "./entities/particles.js"
import { Entity } from "./entities/entity.js"

export let ENTITIES=[]
export let HITTABLES=[]

function setup(){
  let files=[
    {id:"player",filename:"Knight_v2.png"},
    {id:"orc",filename:"Orc_v2.png"},
    {id:"destructibles",filename:"destructibles.png"},
    {id:"particles",filename:"particles.png"},
  ]

  document.addEventListener("onbeforeunload",()=>{
    if(STATE.spritesheets.player) URL.revokeObjectURL(STATE.spritesheets.player)
  })

  extractImages(files,()=>{
    setupPlayer()
    setupBarrels()
    start()
  })

  //NEW INPUTS
  STATE.controls=document.querySelector("controls-manager")
}


let clock
function setupPlayer(){
  STATE.player=new Player("player",STATE.backgroundSize[0]*.25,STATE.backgroundSize[1]*.5)
}
function setupBarrels(){
  // STATE.barrel=new StaticObject("barrel",...STATE.backgroundSize.map(el=>el*.25))

  STATE.orc=new Enemy("orc",STATE.backgroundSize[0]*.75,STATE.backgroundSize[1]*.5)

  const spawnOrc=()=>{
    let positions=[
      [...STATE.backgroundSize.map(el=>el*.15)],
      [STATE.backgroundSize[0]*.15,STATE.backgroundSize[1]*.5],
      [STATE.backgroundSize[0]*.15,STATE.backgroundSize[1]*.85],
      [...STATE.backgroundSize.map(el=>el*.85)],
      [STATE.backgroundSize[0]*.85,STATE.backgroundSize[1]*.5],
      [STATE.backgroundSize[0]*.85,STATE.backgroundSize[1]*.15],
    ]
    let pos=positions[Math.floor(Math.random()*positions.length)]
    STATE.orc=new Enemy("orc",...pos)
  }
  setInterval(()=>{
    spawnOrc()
    if(Math.random()>.75) spawnOrc()
  },10000)
}


function start(){
  clock=Date.now()
  requestAnimationFrame(loop)
}

const loop=(time)=>{
  // console.log(controls.isActionPressed("jump"),controls.isActionJustPressed("jump"))
  // controls.tick()

  let delta=Math.min(100,Math.max(time-clock,0))
  console.log(delta)
  clock=time
  
  ENTITIES=ENTITIES.filter(el=>el.sprite.isConnected)
  ENTITIES.sort((a,b)=>a.position[1]>=b.position[1]?1:-1)

  for(let [i,e] of ENTITIES.entries()){
    if(e.update) e.update(delta)
    e.zIndex=i+10
  }

  STATE.cumulatedTime+=delta
  // if(STATE.cumulatedTime>STATE.timeStep){
  //   STATE.cumulatedTime=0
  //   let i=STATE.oxy==0&&!STATE.terminal?0:STATE.goodPanels
  //   STATE.energy-=STATE.energyDetractions[i]
  // }
STATE.controls.tick()
  requestAnimationFrame(loop)
  
}

setupSfondo(STATE.backgroundSize)
setup()

