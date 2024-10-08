import { dist, STATE, sum } from "../systems/variables.js"
import { bloodStain, getPixelAtCoords } from "../canvas.js"
import { Entity } from "./entity.js"
import { Particle, Limb } from "./particles.js"
import  { ENTITIES } from "../index.js"

export class Enemy extends Entity{
  constructor(id,x,y){
    super(id,x,y)
    
    // this.atkhreshold=300

    this.speed=35
    this.speedCorrection=[1,.75]
    this.jumpHeight=40
    this.jumpVCurve=t=>[0,(4*t**2-4*t)*this.jumpHeight]
    this.recoilCurve=t=>[5*Math.sqrt(t)]
    this.state={
      active:true,

      hp:12,
      effect:undefined,

      actionThreshold:450,
      cumulatedActionTime:450,

      atkThreshold:450,
      cumulatedAtkTime:450,

      actionMovement:undefined,//{progress,end,curve}

      action:"idle",
      dir:"e",
      queue:undefined,//{dir,action}
    }
    this.baseFps=8
    let w=100
    let h=100
    this.setupSprite(STATE.spritesheets.orc,[w,h],[
      {name:"idle",pos:[0,0*h],length:6},

      {name:"walk",pos:[0*w,1*h],length:8},

      {name:"run",pos:[0*w,1*h],length:8},

      //attacks
      {name:"atk_1",pos:[0*w,2*h],length:6,action:{
        name:"hit",
        frames:[3,5],
        offset:[40,0],
        range:20
      }},

      {name:"atk_2",pos:[0*w,3*h],length:6,action:{
        name:"hit",
        frames:[3,5],
        offset:[40,0],
        range:20
      }},

      {name:"atk_recoil",pos:[6*w,2*h],length:4,stay:true},

      {name:"hurt",pos:[0*w,4*h],length:4},

      {name:"death_1",pos:[0*w,5*h],length:4},
      {name:"death_2",pos:[4*w,5*h],length:4,action:{
        name:"spawn",
        frames:[1,1],
        offset:[15,0],
        entity:"orc_head"
      }},

      {name:"slain_1",pos:[3*w,5*h],length:1},
      {name:"slain_2",pos:[7*w,5*h],length:1},

    ],"idle",8,[-50,-66])
    this.sprite.scale=3
  }
  
  activate(value){
    if(value){
      this.state.active=true
      
    }else{
      this.state.active=false
      this.anchor.style.opacity=0
    }
  }

  update(delta){
    if(this.state.active){
      //state
      let {inputDir, inputActions}=getAIinputs(this)

      let animation={
        name:this.sprite.currentAnimation,//.split("-")[1],
        action:this.sprite.currentAction,
        progress:this.sprite.animationProgress,
        end:this.sprite.animationEnd,
        nextFromQueue:false
      }

      if(animation.name=="hurt"){
        if(animation.end){
          this.state.cumulatedActionTime=0
          if(this.state.hp<=0){
            if(this.state.effect=="decapitation") this.state.action="death_2"
            else this.state.action="death_1"
          }else this.state.action="idle"
        }
      }else if(animation.name.startsWith("death")){
        if(animation.end){
          if(animation.name=="death_2") this.state.action="slain_2"
          else this.state.action="slain_1"
        }
      }else if(animation.name.startsWith("slain")){
        //STAY DEAD
        if(animation.end && this.state.active){
          bloodStain(...this.position,3)
          bloodStain(...this.position.map(el=>el+Math.random()*30-15,1))
          bloodStain(...this.position.map(el=>el+Math.random()*30-15,2))
          // bloodStain(...this.position.map(el=>el+Math.random()*30-15,1))
          this.state.active=false
        }
      }else if(animation.name=="atk_recoil"){
        this.state.actionMovement.progress+=delta
        if(this.state.actionMovement.progress>=this.state.actionMovement.end){
          this.state.actionMovement=undefined
          this.state.action="idle"
          // for(let i=0;i<4;i++) new Particle(this.position[0]+20*(Math.random()-.5),this.position[1]+5*(Math.random()-.5))
        }
      }else if(animation.name.startsWith("atk")){//is attacking (normal)
        if(animation.end){//attack animation ended
          if(this.state.queue){
            this.state.dir=this.state.queue.dir
            this.state.action=this.state.queue.action
            this.state.queue=undefined
            animation.nextFromQueue=true
          }else if(inputDir){
            if(inputDir!="n" && inputDir!="s") this.state.dir=inputDir
            this.state.action="walk"
          }else this.state.action="idle"
        }
      }else{//idle or walk
        if(inputActions.includes("fire1") || inputActions.includes("fire2")){
          this.state.cumulatedAtkTime+=delta
          if(this.state.cumulatedAtkTime > this.state.atkThreshold){
            this.state.action=inputActions.includes("fire1")?"atk_1":"atk_2"
            this.state.cumulatedAtkTime=0
          }
        }else{
          this.state.cumulatedAtkTime+=delta
          if(inputDir){
            if(inputDir!="n" && inputDir!="s") this.state.dir=inputDir
            this.state.action="walk"
          }else this.state.action="idle"
        }
      }

      //animation
      if(animation.name=="atk_recoil"){
        this.sprite.fps=8
      }else this.sprite.fps=this.baseFps
      
      if(this.state.dir.length==2) this.state.dir=this.state.dir.substring(1)//cut out n&s
      let flip=this.state.dir=="w"
      let name=this.state.action//`${this.state.dir}-${this.state.action}`
      this.sprite.currentAnimation=name
      if(animation.nextFromQueue) this.sprite.animationCursor=0
      this.sprite.flip=flip
      this.sprite.update(delta)

      //attacks & actions
      if(animation.action){
        if(animation.action.name=="hit"){
          for(let e of ENTITIES){
            if(e.id=="player"){
              if(dist(
                sum(
                  this._position,
                  [(this.sprite._flip?-1:1)*animation.action.offset[0],animation.action.offset[1]]
                ),
                e.position
              )<animation.action.range){
                if(e.state.action=="block"){
                  this.state.action="atk_recoil"
                  this.sprite.currentAnimation="atk_recoil"
                  this.state.actionMovement={
                    progress:0,
                    end:125,
                    curve:this.recoilCurve
                  }
                }
                e.takeDamage(Math.floor(Math.random()*2+1))
                
              }
            }
          }
        }else if(animation.action.name="spawn"){
          if(animation.action.entity=="orc_head" && this.state.cumulatedActionTime==0){
            this.state.cumulatedActionTime+=delta
            new Limb(
              this.position[0]+animation.action.offset[0]*(flip?1:-1),
              this.position[1]+animation.action.offset[1],
              flip,this.sprite.scale,Math.random()*180,animation.action.entity)
          }
        }
      }

      //movement
      if(this.state.action=="walk" || this.state.action=="run"){
        let vel=this.speed*delta*.001
        let [x,y]=this.position
        let tol=2
        if(inputDir.includes("n") && getPixelAtCoords(x,y-tol)>0) y-=vel*this.speedCorrection[1]
        else if(inputDir.includes("s") && getPixelAtCoords(x,y+tol)>0) y+=vel*this.speedCorrection[1]
        if(inputDir.includes("e") && getPixelAtCoords(x+tol,y)>0) x+=vel*this.speedCorrection[0]
        else if(inputDir.includes("w") && getPixelAtCoords(x-tol,y)>0) x-=vel*this.speedCorrection[0]
        if(getPixelAtCoords(x,y-1)>0) this.position=[x,y]
      }else if(this.state.action=="atk_recoil"){
        let curve=this.state.actionMovement.curve(this.state.actionMovement.progress/this.state.actionMovement.end)
        let [x,y]=this.position
        let deltaX=(flip?1:-1)*curve[0]

        if(getPixelAtCoords(x+deltaX,y)>0) this.position=[ x+deltaX, this.position[1]]
      }
    }
  }

  takeDamage(n,special=undefined){
    if(!["hurt", "death_1", "slain_1","death_2", "slain_2"].includes(this.sprite.currentAnimation)){
      this.state.hp-=n
      if(this.state.hp<=0 && special=="decapitation"){
        this.state.action="death_2"
        this.sprite.currentAnimation="death_2"
      }else{
        this.state.action="hurt"
        this.sprite.currentAnimation="hurt"
      }
    }
  }


}



const getAIinputs=(mob)=>{
  let inputDir=""

  let tolY=4
  let deltaY=STATE.player.position[1]-mob.position[1]
  if(deltaY>tolY) inputDir+="s"
  else if(deltaY<-tolY) inputDir+="n"

  let tolX=55
  let deltaX=STATE.player.position[0]-mob.position[0]
  if(deltaX>tolX) inputDir+="e"
  else if(deltaX<-tolX) inputDir+="w"

  let inputActions=[]
  if(!inputDir && Math.abs(deltaX)<tolX){
    let rand=Math.random()
    if(rand>.75) inputActions.push("fire2")
    else if(rand>.25) inputActions.push("fire1")
  }

  return {inputDir, inputActions}
}