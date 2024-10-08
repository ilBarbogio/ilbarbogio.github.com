export class SpriteElement extends HTMLElement{
  static observedAttributes=["transform"]

  set tileDims(v){
    this._tileDims=[...v]
    this.style.width=`${this._tileDims[0]}px`
    this.style.height=`${this._tileDims[1]}px`
  }
  get tileDims(){return [...this._tileDims]}

  set imgUrl(v){
    if(v!="") this.style.backgroundImage=`url("${v}")`
    else this.style.background="none"
  }

  set fps(v){
    this.timeStep=1000/v
  }
  set direction(v){ this._direction=v}

  set currentAnimation(name){
    if(name!=this._currentAnimation?.name){
      this._currentAnimation=this.animations.find(el=>el.name==name)
      if(this._currentAnimation) this.animationCursor=0
    }
  }
  set animationCursor(v){
    this.cursor=0
    this.cumulatedTime=0
    this.positionSprite()
  }
  get currentAnimation(){ return this._currentAnimation?.name}

  get nextAnimation(){ return this._queue.length>0?this._queue[0]:undefined}
  
  //animation progress
  get animationProgress(){
    return this.cursor/this._currentAnimation.length
  }
  get animationEnd(){
    return this.cursor==this._currentAnimation.length-1
  }
  get animationStart(){
    return this.cursor==0
  }
  get currentAction(){
    if(this._currentAnimation.action && this.cursor>=this._currentAnimation.action.frames[0] && this.cursor<=this._currentAnimation.action.frames[1]){
      return this._currentAnimation.action
    }else return undefined
  }

  set flip(v){
    this._flip=v
  }
  set pos(v){
    this.style.left=`${v[0]}px`
    this.style.top=`${v[1]}px`
  }
  get pos(){
    return [
      parseFloat(this.style.left),
      parseFloat(this.style.top)
    ]
  }
  get scale(){ return this._scale }
  set scale(v){ this._scale=v }

  get rotation(){ return this._rotation }
  set rotation(v){ this._rotation=v }
  
  set alpha(v){this.style.opacity=v}

  set parentNode(v){this._parentNode=v}

  constructor(){
    super()
    this.cumulatedTime=0//cumulated time
    this.timeStep=50//time step

    this._direction="hor"

    this._scale=1
    this._rotation=0
    this._flip=false
    
    this.cursor=0
    this.animations=[]//animations [Name,Pos,Length,Flip,Destroy,Stay,SEgue]
    this._queue=[]

    this.shadow=this.attachShadow({mode:"open"})
  }

  connectedCallback(){
    this.style="display:block;position:absolute;position:absolute;left:0;top:0;background-repeat:no-repeat;background-position: 0 0;image-rendering:pixelated"
    // this.style="display:block;position:absolute;border:1px solid rgba(255,0,0,.5);position:absolute;left:0;top:0;background-repeat:no-repeat;background-position: 0 0;image-rendering:pixelated"
  }

  attributeChangedCallback(name,oldValue,newValue){
    if(name=="transform"){
      let split=newValue.split(",")
      let flip=this._currentAnimation?.flip?-1:1
      this._scale=split[0]
      this._rotation=split[1]
      this.style.transform=`scale(${flip*split[0]},${split[0]}) rotate(${split[1]}deg)`
    }
  }

  update=(delta)=>{
    this.cumulatedTime+=delta
    if(this.cumulatedTime>=this.timeStep){
      this.cumulatedTime-=this.timeStep
      this.cursor++
      
      if(this.cursor==this._currentAnimation.length){
        if(this._currentAnimation.stay) this.cursor=this._currentAnimation.length-1
        else if(this._currentAnimation.segue) this.currentAnimation=this._currentAnimation.segue
        else if(this._currentAnimation.destroy){
          this._parentNode.destroy()
        }else this.cursor%=this._currentAnimation.length
      }
      this.positionSprite()
    }
  }

  positionSprite=()=>{//position sprite
    if(this._currentAnimation && this._tileDims){
      let flip=this._flip||this._currentAnimation.flip?-1:1
      let x=-(this._currentAnimation.pos[0] +(this._direction=="hor"?this.cursor*this._tileDims[0]:0))
      let y=-(this._currentAnimation.pos[1] +(this._direction=="ver"?this.cursor*this._tileDims[1]:0))
      this.style.transform=`scale(${flip*this._scale},${this._scale}) rotate(${this._rotation}deg)`
      this.style.backgroundPosition=`${x}px ${y}px`
    }
  }
}