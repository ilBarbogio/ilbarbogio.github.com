import { Entity } from "./entity.js"
import { STATE } from "../systems/variables.js"
import { bloodStain } from "../canvas.js"

export class Particle extends Entity{
  constructor(x,y,s=1,r=0){
    super("",x,y)
    this.setupSprite(
      STATE.spritesheets.particles,
      [8,8],
      [{name:"default",pos:[0,0],length:6,destroy:true}]
      ,"default",10,[-4,-4])
    this.spriteTransform=`${s+Math.random()},${r+Math.floor(Math.random()*360)}`

    this.state={
      actionMovement:{
        progress:0,
        end:1000,
        speedCorrection:[2.75,1],
        curve:t=>[(1-t)*3*(Math.random()-.5),-30*t]
      }
    }
  }

  update(delta){
    this.sprite.update(delta)
    let curve=this.state.actionMovement.curve(this.state.actionMovement.progress/this.state.actionMovement.end)
    this.sprite.pos=[
      this.spriteOffset[0]+curve[0],
      this.spriteOffset[1]+curve[1]
    ]

    this.state.actionMovement.progress+=delta
  }
}

export class Limb extends Entity{
  constructor(x,y,flip=false,scale=1,rotation=0,kind=""){
    super("",x,y)
    this.flip=flip
    this.rotation=rotation
    this.scale=scale

    this.horVelocity=60
    this.rotVelocity=(flip?-1:1)*.5
    this.jumpHeight=80
    this.nJump=3
    
    this.jumpCurve=t=>[
      this.horVelocity*t,
      (4*t**2-4*t)*this.jumpHeight]
    this.setupSprite(
      STATE.spritesheets.orc,
      [12,8],
      [{name:"default",pos:[645,50],length:1}]
      ,"default",10,[-5,-6])
    this.sprite.flip=this.flip
    this.sprite.scale=this.scale
    this.sprite.rotation=this.rotation
    // this.spriteTransform=`${this.scale},${this.rotation}`
    this.sprite.positionSprite()

    this.state={
      active:true,
      actionThreshold:350,
      cumulatedActionTime:350,
      actionMovement:{
        progress:0,
        end:600,
        speedCorrection:[2.75,1],
        curve:this.jumpCurve
      }
    }
  }

  update(delta){
    if(this.state.active && this.nJump>0){
      if(this.state.actionMovement.progress>this.state.actionMovement.end){
        this.horVelocity*=.75
        this.rotVelocity*=1.5
        this.jumpHeight*=.5
        this.state.actionMovement.progress=0
        this.state.actionMovement.end*=.75
        this.position=[
          this.position[0]+this.sprite.pos[0]-this.spriteOffset[0],
          this.position[1]
        ]
        this.sprite.pos=[...this.spriteOffset]
        this.sprite.update(delta)
        this.nJump--
        if(this.nJump==0) this.sprite.rotation=0
        // this.position[1]=this.sprite.pos[0]+this.spriteOffset[0]
        bloodStain(
          this.position[0],
          this.position[1]-this.spriteOffset[1]+this.sprite.pos[1],
          Math.floor(Math.random()*2+1)
        )
      }else{
        this.sprite.rotation=this.sprite.rotation+delta*this.rotVelocity
        this.state.cumulatedActionTime+=delta
        this.sprite.update(delta)
        let curve=this.state.actionMovement.curve(this.state.actionMovement.progress/this.state.actionMovement.end)
        this.sprite.pos=[
          this.spriteOffset[0]+(this.flip?1:-1)*curve[0],
          this.spriteOffset[1]+curve[1]
        ]
        if(Math.abs(curve[1])<2 && this.state.cumulatedActionTime>this.state.actionThreshold){
          this.state.cumulatedActionTime=0
          // bloodStain(
          //   this.position[0]-this.spriteOffset[0]+this.sprite.pos[0],
          //   this.position[1]-this.spriteOffset[1]+this.sprite.pos[1],
          //   Math.floor(Math.random()*2+1)
          // )
        }

        this.state.actionMovement.progress+=delta
      }
    }else this.state.active=false
  }
}