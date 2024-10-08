import { STATE, inputToKeysArr, dist } from "../systems/variables.js"
import { getPixelAtCoords } from "../canvas.js"
import { ENTITIES } from "../index.js"

let abs=Math.abs
let flr=Math.floor
let rn=v=>Math.random()*v
let rc=(c,s)=>c+(Math.random()-0.5)*s

const applyBaseStyles=(element,pos)=>{
  element.style=`border:2px solid blue;width:0;height:0;position:absolute;left:${pos[0]}px;top:${pos[1]}px;overflow:"visible";`
  document.getElementById("container").append(element)
}

export class Entity{
  set zIndex(v){this.anchor.style.zIndex=v}

  set position(v){
    this._position=[...v]
    this.anchor.style.left=`${this._position[0]}px`
    this.anchor.style.top=`${this._position[1]}px`
  }
  get position(){ return this._position}

  set spriteTransform(v){
    if(this.sprite) this.sprite.setAttribute("transform",v)
  }

  constructor(id,x,y){
    this.id=id
    this._position=[x,y]
    
    this.anchor=document.createElement("div")
    applyBaseStyles(this.anchor,this._position)

    ENTITIES.push(this)
    
  }
  

  setupSprite(sheet,tileDims,animations,current,fps,sOffset){
    this.spriteOffset=sOffset
    
    this.sprite=document.createElement("img-sprite")
    this.anchor.append(this.sprite)
    this.sprite.id="sprite-"+this.id
    this.sprite.className="sprite"
    this.sprite.animations=animations
    this.sprite.fps=fps
    this.sprite.currentAnimation=current

    this.sprite.parentNode=this
    
    this.sprite.imgUrl=sheet
    this.sprite.tileDims=tileDims
    
    this.sprite.pos=this.spriteOffset??[-.5*tileDims[0],-tileDims[1]]
    this.sprite.style.border="1px solid green"
    this.sprite.positionSprite()
  }

  destroy(){
    this.sprite.remove()
  }

  onAnimationEnd(name){}

}

export class Player extends Entity{
  constructor(id,x,y){
    super(id,x,y)
    
    this.cumulatedTimeAction=0
    this.actionThresh=300

    this.velocity=30
    this.state={
      active:true,
      action:"idle",
      lastDir:"e",
    }
    let w=100
    let h=100
    this.setupSprite(STATE.spritesheets.player,[w,h],[
      // {name:"n-idle",pos:[0,8*h],length:1},
      {name:"ne-idle",pos:[0,0*h],length:6},
      {name:"e-idle",pos:[0,0*h],length:6},
      {name:"se-idle",pos:[0,0*h],length:6},
      // {name:"s-idle",pos:[0,10*h],length:6},
      {name:"sw-idle",pos:[0,0*h],length:6, flip:true},
      {name:"w-idle",pos:[0,0*h],length:6, flip:true},
      {name:"nw-idle",pos:[0,0*h],length:6, flip:true},

      {name:"n-walk",pos:[0*w,8*h],length:6},
      {name:"ne-walk",pos:[0*w,1*h],length:6},
      {name:"e-walk",pos:[0*w,1*h],length:6},
      {name:"se-walk",pos:[0*w,1*h],length:6},
      {name:"s-walk",pos:[0*w,10*h],length:6},
      {name:"sw-walk",pos:[0*w,1*h],length:6, flip:true},
      {name:"w-walk",pos:[0*w,1*h],length:6, flip:true},
      {name:"nw-walk",pos:[0*w,1*h],length:6, flip:true},

      //atck
      {name:"ne-atk-1",pos:[0*w,3*h],length:6},
      {name:"e-atk-1",pos:[0*w,3*h],length:6, segue:"e-atk-2"},
      {name:"se-atk-1",pos:[0*w,3*h],length:6},
      {name:"sw-atk-1",pos:[0*w,3*h],length:6, flip:true},
      {name:"w-atk-1",pos:[0*w,3*h],length:6, flip:true},
      {name:"nw-atk-1",pos:[0*w,3*h],length:6, flip:true},

      {name:"ne-atk-2",pos:[0*w,2*h],length:6},
      {name:"e-atk-2",pos:[0*w,2*h],length:6},
      {name:"se-atk-2",pos:[0*w,2*h],length:6},
      {name:"sw-atk-2",pos:[0*w,2*h],length:6, flip:true},
      {name:"w-atk-2",pos:[0*w,2*h],length:6, flip:true},
      {name:"nw-atk-2",pos:[0*w,2*h],length:6, flip:true},

    ],"e-idle",8)
    this.sprite.scale=2
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
      //movement
      let name,currentAction
      let currentDir=STATE.controls.get8dir()
      if(!this.state.action.startsWith("atk")){
        if(STATE.controls.isActionJustPressed("fire1")){
          // if(currentDir && (currentDir=="n" || currentDir=="s")) currentAction="atk-2"
          // else currentAction="atk-1"
          currentAction="atk-1"
          currentDir=currentDir??this.state.lastDir
        }else{
          if(currentDir==undefined){
            currentAction="idle"
            currentDir=this.state.lastDir
          }else{
            currentAction="walk"
            //use current dir for movement
            let vel=this.velocity*delta*.001
            let [x,y]=this.position
            let tol=2
            if(currentDir.includes("n") && getPixelAtCoords(x,y-tol)>0) y-=vel*.75
            else if(currentDir.includes("s") && getPixelAtCoords(x,y+tol)>0) y+=vel*.75
            if(currentDir.includes("e") && getPixelAtCoords(x+tol,y)>0) x+=vel
            else if(currentDir.includes("w") && getPixelAtCoords(x-tol,y)>0) x-=vel
            if(getPixelAtCoords(x,y-1)>0) this.position=[x,y]
          }
        }
        //correct current dir for missing animations
        if(currentDir=="n" || currentDir=="s") currentDir=this.state.lastDir
        name=`${currentDir}-${currentAction}`
        this.state.lastDir=currentDir
        this.state.action=currentAction
        this.sprite.currentAnimation=name
      }else if(STATE.controls.isActionJustPressed("fire1")){
        console.log(this.sprite.animationProgress)
        currentAction="atk-2"
        currentDir=currentDir??this.state.lastDir
        this.sprite.addToAnimationQueue(`${currentDir}-${currentAction}`)
      }
      this.sprite.update(delta)
    }
  }
  
  onAnimationEnd(name,next){
    if(next && next.includes("atk")) this.state.action="atk"
    else if(name.includes("atk")) this.state.action="idle"
  }
}



// export class Door extends Entity{
//   constructor(id,x,y){ 
//     super(id,x,y)

//     this.setupSprite(STATE.spritesheets.b,[16,16],
//       [
//         {n:"closed",p:[0,0],l:1,s:true},
//         {n:"opening",p:[0,16],l:2,se:"open"},
//         {n:"open",p:[0,h],l:1,s:true},
//       ],
//       "closed",8,[-8,-16])
//   }

//   update(delta){
//     let player=STATE.player
//     let name=""
//     this.playerFound=false
//     if(dist(player.position,this.position)<30){
//       if(this.sprite.currentAnimation=="closed" && player.position[1]>=this.position[1]){
//         name="opening"
//         this.playerFound
//       }
//     }else if(this.sprite.currentAnimation=="open") name="closed"

//     if(name!="") this.sprite.currentAnimation=name
//     this.sprite.update(delta)

//   }
// }






// export let createBurst=(x,y,N,sp,s,r)=>{
//   for(let i=0;i<N;i++){
//     new Particle(rc(x,sp),rc(y,sp*.5),6,rc(1,s),rn(r))
//   }
// }



//BACKUP
//"Sara"
/**
let w=64
    let h=64
    this.setupSprite(STATE.spritesheets.player,[w,h],[
      {name:"n-idle",pos:[0,8*h],length:1},
      {name:"ne-idle",pos:[0,11*h],length:1},
      {name:"e-idle",pos:[0,11*h],length:1},
      {name:"se-idle",pos:[0,11*h],length:1},
      {name:"s-idle",pos:[0,10*h],length:1},
      {name:"sw-idle",pos:[0,9*h],length:1},
      {name:"w-idle",pos:[0,9*h],length:1},
      {name:"nw-idle",pos:[0,9*h],length:1},

      {name:"n-walk",pos:[2*w,8*h],length:7},
      {name:"ne-walk",pos:[2*w,11*h],length:7},
      {name:"e-walk",pos:[2*w,11*h],length:7},
      {name:"se-walk",pos:[2*w,11*h],length:7},
      {name:"s-walk",pos:[2*w,10*h],length:7},
      {name:"sw-walk",pos:[2*w,9*h],length:7},
      {name:"w-walk",pos:[2*w,9*h],length:7},
      {name:"nw-walk",pos:[2*w,9*h],length:7},

    ],"e-i",8)
  }

 */

  //Tiny Swords Knight
  /*
  let w=192
    let h=192
    this.setupSprite(STATE.spritesheets.player,[w,h],[
      {name:"n-idle",pos:[0,8*h],length:1},
      {name:"ne-idle",pos:[0,0*h],length:6},
      {name:"e-idle",pos:[0,0*h],length:6},
      {name:"se-idle",pos:[0,0*h],length:6},
      {name:"s-idle",pos:[0,10*h],length:6},
      {name:"sw-idle",pos:[0,0*h],length:6, flip:true},
      {name:"w-idle",pos:[0,0*h],length:6, flip:true},
      {name:"nw-idle",pos:[0,0*h],length:6, flip:true},

      {name:"n-walk",pos:[0*w,8*h],length:6},
      {name:"ne-walk",pos:[0*w,1*h],length:6},
      {name:"e-walk",pos:[0*w,1*h],length:6},
      {name:"se-walk",pos:[0*w,1*h],length:6},
      {name:"s-walk",pos:[0*w,10*h],length:6},
      {name:"sw-walk",pos:[0*w,1*h],length:6, flip:true},
      {name:"w-walk",pos:[0*w,1*h],length:6, flip:true},
      {name:"nw-walk",pos:[0*w,1*h],length:6, flip:true},

      //atck
      {name:"ne-atk-1",pos:[0*w,3*h],length:6},
      {name:"e-atk-1",pos:[0*w,3*h],length:6},
      {name:"se-atk-1",pos:[0*w,3*h],length:6},
      {name:"sw-atk-1",pos:[0*w,3*h],length:6, flip:true},
      {name:"w-atk-1",pos:[0*w,3*h],length:6, flip:true},
      {name:"nw-atk-1",pos:[0*w,3*h],length:6, flip:true},

      {name:"ne-atk-2",pos:[0*w,2*h],length:6},
      {name:"e-atk-2",pos:[0*w,2*h],length:6},
      {name:"se-atk-2",pos:[0*w,2*h],length:6},
      {name:"sw-atk-2",pos:[0*w,2*h],length:6, flip:true},
      {name:"w-atk-2",pos:[0*w,2*h],length:6, flip:true},
      {name:"nw-atk-2",pos:[0*w,2*h],length:6, flip:true},
   */