import { ENTITIES } from "../index.js"

const applyBaseStyles=(element,pos)=>{
  element.style=`width:0;height:0;position:absolute;left:${pos[0]}px;top:${pos[1]}px;overflow:"visible";`
  // element.style=`border:2px solid blue;width:0;height:0;position:absolute;left:${pos[0]}px;top:${pos[1]}px;overflow:"visible";`
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
    this.spriteOffset=sOffset//preservers initial sprite position
    
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
    
    this.sprite.pos=this.spriteOffset
    // this.sprite.style.border="1px solid green"
    this.sprite.positionSprite()
  }

  destroy(){
    this.sprite.remove()
    this.anchor.remove()
  }


}
