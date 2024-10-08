import { dist, STATE, sum } from "../systems/variables.js"
import { getPixelAtCoords } from "../canvas.js"
import { Entity } from "./entity.js"
import { Particle } from "./particles.js"
import  { ENTITIES } from "../index.js"

export class Player extends Entity{
  constructor(id,x,y){
    super(id,x,y)
    
    this.tickThreshold=150

    this.speed=45
    this.speedCorrection=[1,.75]
    this.jumpHeight=40
    this.jumpCurve=t=>[0,(4*t**2-4*t)*this.jumpHeight]
    this.recoilCurve=t=>[5*Math.sqrt(t)]
    this.state={
      active:true,
      cumulatedTime:0,

      hp:20,

      actionMovement:undefined,//{progress,end,curve}

      action:"idle",
      dir:"e",
      queue:undefined,//{dir,action}
    }
    this.baseFps=8
    let w=100
    let h=100
    this.setupSprite(STATE.spritesheets.player,[w,h],[
      {name:"idle",pos:[0,0*h],length:6},

      {name:"walk",pos:[0*w,1*h],length:6},

      {name:"run",pos:[0*w,1*h],length:6},

      {name:"jump",pos:[0*w,8*h],length:4,stay:true},

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

      {name:"atk_3",pos:[6*w,3*h],length:4,action:{
        name:"hit",
        frames:[1,2],
        offset:[40,0],
        range:15
      }},

      {name:"atk_running",pos:[6*w,3*h],length:4,action:{
        name:"hit",
        frames:[1,2],
        offset:[40,0],
        range:15
      }},

      {name:"atk_special",pos:[6*w,4*h],length:5,action:{
        name:"hit",
        frames:[1,3],
        offset:[40,0],
        range:25
      }},

      {name:"atk_special_running",pos:[8*w,4*h],length:3,action:{
        name:"hit",
        frames:[0,1],
        offset:[40,0],
        range:15
      }},

      {name:"atk_recoil",pos:[7*w,2*h],length:4},

      {name:"charge_atk",pos:[0*w,4*h],length:5},

      {name:"charge_stay",pos:[4*w,4*h],length:2},

      {name:"block",pos:[0*w,5*h],length:7},
      {name:"block_recoil",pos:[1*w,5*h],length:2},


      {name:"hurt",pos:[0*w,6*h],length:4},
      {name:"atk_recoil",pos:[0*w,6*h],length:4,stay:true},

      {name:"death",pos:[4*w,7*h],length:4},
      
      {name:"slain",pos:[3*w,7*h],length:1},

    ],"idle",8,[-50,-68])
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
      let inputDir=STATE.controls.get8dir()
      let animation={
        name:this.sprite.currentAnimation,
        action:this.sprite.currentAction,
        progress:this.sprite.animationProgress,
        end:this.sprite.animationEnd,
        nextFromQueue:false
      }

      this.state.cumulatedTime+=delta
      
      if(animation.name=="hurt"){
        if(animation.end){
          if(this.state.hp<=0){
            this.state.action="death"
          }else this.state.action="idle"
        }
      }else if(animation.name=="death"){
        if(animation.end) this.state.action="slain"
      }else if(animation.name=="slain"){
        //STAY DEAD
        // console.log("i'm slain!")
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
        }else{//attack animation ongoing
          if(STATE.controls.isActionJustPressed("fire1") && (animation.name=="atk_2" || (animation.name=="atk_1" && Math.random()>.85))){
            this.state.queue={
              dir:inputDir??this.state.dir,
              action:"atk_3"
            }
            if(this.state.queue.dir=="n"){
              this.state.queue.dir=this.state.dir
              // this.state.queue.action="atk_2"
            }else if(this.state.queue.dir=="s"){
              this.state.queue.dir=this.state.dir
              this.state.queue.action="block"
            }
          }
        }
      }else if(animation.name=="charge_atk"){
        if(animation.end){
          if(STATE.controls.isActionPressed("fire2")) this.state.action="charge_stay"
          else this.state.action="idle"
        }else if(inputDir && inputDir!="n" && inputDir!="s") this.state.dir=inputDir
      }else if(animation.name=="charge_stay"){
        if(!STATE.controls.isActionPressed("fire2")) this.state.action="atk_special"
        else if(inputDir && inputDir!="n" && inputDir!="s") this.state.dir=inputDir
      }else if(animation.name=="block"){
        if(animation.end) this.state.action="idle"
      }else if(animation.name=="block_recoil"){
        this.state.actionMovement.progress+=delta
        if(this.state.actionMovement.progress>=this.state.actionMovement.end){
          this.state.actionMovement=undefined
          this.state.action="idle"
          for(let i=0;i<4;i++) new Particle(this.position[0]+20*(Math.random()-.5),this.position[1]+5*(Math.random()-.5))
        }
      }else if(animation.name=="run"){
        if(animation.end && this.state.cumulatedTime>this.tickThreshold){
        this.state.cumulatedTime=0
          new Particle(...this._position)
        }
        if(!inputDir || (inputDir && !inputDir.includes(this.state.dir))){
          this.state.action="idle"
        }else if(STATE.controls.isActionJustPressed("fire1")){
          this.state.action="atk_running"
        }else if(STATE.controls.isActionJustPressed("fire2")){
          this.state.action="atk_special_running"
        }else if(STATE.controls.isActionJustDoubleTap("up")){
          this.state.action="jump"
          this.state.actionMovement={
            progress:0,
            end:800,
            speedCorrection:[2.75,1],
            curve:this.jumpCurve
          }
        }
        this.state.dir=inputDir && inputDir!="s" && inputDir!="n"?inputDir:this.state.dir
      }else if(animation.name=="jump"){
        this.state.actionMovement.progress+=delta
        if(this.state.actionMovement.progress>=this.state.actionMovement.end){
          this.state.actionMovement=undefined
          this.sprite.pos=[...this.spriteOffset]
          this.state.action="idle"
          for(let i=0;i<4;i++) new Particle(this.position[0]+20*(Math.random()-.5),this.position[1]+5*(Math.random()-.5))
        }
      }else if(animation.name=="hurt"){
        if(animation.end) this.state.action="idle"
      }else{//idle or walk
        if(STATE.controls.isActionJustPressed("fire2")){
          this.state.action="charge_atk"
        }else if(STATE.controls.isActionJustDoubleTap("up")){
          this.state.action="jump"
          this.state.actionMovement={
            progress:0,
            end:800,
            speedCorrection:animation.name=="walk"?[1.75,1]:[0,1],
            curve:this.jumpCurve
          }
        }else if(STATE.controls.isActionJustPressed("fire1")){
          if(inputDir=="n") this.state.action="atk_2"
          else if(inputDir=="s") this.state.action="block"
          else this.state.action="atk_1"
        }else{
          if(inputDir){
            if(inputDir!="n" && inputDir!="s") this.state.dir=inputDir
            if(STATE.controls.isActionJustDoubleTap("right") || STATE.controls.isActionJustDoubleTap("left")){
              this.state.action="run"
            }else this.state.action="walk"
          }else this.state.action="idle"
        }
      }

      //animation
      if(animation.name=="run"){
        this.speedCorrection=[2.2,.35]
        this.sprite.fps=12
      }else if(animation.name=="walk"){
        this.speedCorrection=[1,.75]
        this.sprite.fps=this.baseFps
      }else if(animation.name=="jump"){
        this.speedCorrection=this.state.actionMovement?.speedCorrection??this.speedCorrection
        this.sprite.fps=6
      }else if(animation.name=="atk_recoil"){
        this.sprite.fps=8
      }else this.sprite.fps=this.baseFps
      
      if(this.state.dir.length==2) this.state.dir=this.state.dir.substring(1)//cut out n&s
      let flip=this.state.dir=="w"
      let name=this.state.action
      this.sprite.currentAnimation=name
      if(animation.nextFromQueue) this.sprite.animationCursor=0
      this.sprite.flip=flip
      this.sprite.update(delta)

      //attacks & actions
      if(animation.action && animation.action.name=="hit"){
        for(let e of ENTITIES){
          if(e.id=="orc"){
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
              if(animation.name=="atk_special") e.takeDamage(Math.floor(Math.random()*10+8))//8 - 17
              else if(animation.name=="atk_2") e.takeDamage(Math.floor(Math.random()*10+4),"decapitation")//4 - 13
              else e.takeDamage(Math.floor(Math.random()*4+2))//2 - 5
              
            }
          }
        }
      }

      //movement
      if(inputDir && (this.state.action=="walk" || this.state.action=="run")){
        let vel=this.speed*delta*.001
        let [x,y]=this.position
        let tol=2
        if(inputDir.includes("n") && getPixelAtCoords(x,y-tol)>0) y-=vel*this.speedCorrection[1]
        else if(inputDir.includes("s") && getPixelAtCoords(x,y+tol)>0) y+=vel*this.speedCorrection[1]
        if(inputDir.includes("e") && getPixelAtCoords(x+tol,y)>0) x+=vel*this.speedCorrection[0]
        else if(inputDir.includes("w") && getPixelAtCoords(x-tol,y)>0) x-=vel*this.speedCorrection[0]
        if(getPixelAtCoords(x,y-1)>0) this.position=[x,y]
      }else if(this.state.action=="jump"){
        let curve=this.state.actionMovement.curve(this.state.actionMovement.progress/this.state.actionMovement.end)
        this.sprite.pos=[this.spriteOffset[0]+curve[0], this.spriteOffset[1]+curve[1]]

        let vel=this.speed*delta*.001
        let [x,y]=this.position
        let tol=2
        if(this.state.dir.includes("e") && getPixelAtCoords(x+tol,y)>0) x+=vel*this.speedCorrection[0]
        else if(this.state.dir.includes("w") && getPixelAtCoords(x-tol,y)>0) x-=vel*this.speedCorrection[0]
        if(getPixelAtCoords(x,y-1)>0) this.position=[x,y]
      }else if(this.state.action=="atk_running" || this.state.action=="atk_special_running"){
        let vel=this.speed*delta*.001
        let [x,y]=this.position
        let tol=2
        if(this.state.dir.includes("e") && getPixelAtCoords(x+tol,y)>0) x+=vel
        else if(this.state.dir.includes("w") && getPixelAtCoords(x-tol,y)>0) x-=vel
        if(getPixelAtCoords(x,y-1)>0) this.position=[x,y]
      }else if(this.state.action=="block_recoil" || this.state.action=="atk_recoil"){
        let curve=this.state.actionMovement.curve(this.state.actionMovement.progress/this.state.actionMovement.end)
        let [x,y]=this.position
        let deltaX=(flip?1:-1)*curve[0]

        if(getPixelAtCoords(x+deltaX,y)>0) this.position=[ x+deltaX, this.position[1]]
      }
    }
  }


  takeDamage(n){
    if(!["hurt", "death", "slain", "block", "jump"].includes(this.sprite.currentAnimation)){
      this.state.action="hurt"
      this.sprite.currentAnimation="hurt"
      this.state.hp-=n
    }else if(this.sprite.currentAnimation=="block"){
      // new Particle(this.position[0],this.position[1]+5*(Math.random()-.5))
      this.state.action="block_recoil"
      this.sprite.currentAnimation="block_recoil"
      this.state.actionMovement={
        progress:0,
        end:100,
        curve:this.recoilCurve
      }
    }
  }

}