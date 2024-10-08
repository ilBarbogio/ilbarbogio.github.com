export class ControlsElement extends HTMLElement{
  static observedAttributes=["enabled"]

  totalTo8dir=[,"w","s","sw","e",,"se",,"n","nw",,,"ne"]

  constructor(){
    super()
    
    this.downListener=undefined
    this.upListener=undefined
    this.enabled=true
    this.type=this.hasAttribute("type")
    this.doubleTapInterval=12
  }

  connectedCallback(){
    this.style.display="none"
    this.actions=[]
    this.pressed=[]
    this.justPressed=[]
    this.justDoubleTap=[]
    this.doubleTapTimer=[]
    this.keys=[]
    for(let c of this.children){
      this.actions.push(c.innerHTML)
      this.pressed.push(false)
      this.justPressed.push(false)
      this.justDoubleTap.push(false)
      this.doubleTapTimer.push(-1)
      this.keys.push(`Key${c.dataset.key.toUpperCase()}`)
    }
    if(this.enabled) this.setupListeners()
  }

  setupListeners(){
    this.upListener=window.addEventListener("keydown",ev=>{
      let i=this.keys.findIndex(el=>el==ev.code)
      if(i!=-1 && !this.pressed[i]){
        this.pressed[i]=true
        this.justPressed[i]=true
        if(this.doubleTapTimer[i]<0) this.doubleTapTimer[i]=this.doubleTapInterval
        else{
          this.justDoubleTap[i]=true
          this.doubleTapTimer[i]=-1
        }
      }
    })
    this.downListener=window.addEventListener("keyup",ev=>{
      let i=this.keys.findIndex(el=>el==ev.code)
      if(i!=-1){
        this.pressed[i]=false
      }
    })
  }

  tick(){
    for(let i=0;i<this.keys.length;i++){
      if(this.doubleTapTimer[i]>=0) this.doubleTapTimer[i]--
      else this.justDoubleTap[i]=false
      
      // this.lastJustPressed[i]=this.justPressed[i]
      this.justPressed[i]=false
    }
  }

  attributeChangedCallback(name,oldValue,newValue){
    switch(name){
      case "enabled":
        this.enabled=newValue==true?true:false
        if(!this.enabled && (this.upListener || this.downListener)){
          window.removeEventListener(this.upListener)
          window.removeEventListener(this.downListener)
        }else this.setupListeners()
        break
      default: break
    }
  }

  isActionPressed(action){
    return this.pressed[this.actions.findIndex(el=>el==action)]
  }
  isActionJustPressed(action){
    return this.justPressed[this.actions.findIndex(el=>el==action)]
  }
  isActionJustDoubleTap(action){
    return this.justDoubleTap[this.actions.findIndex(el=>el==action)]
  }

  //specialized
  get8dir(){//requires four keys to be up,right,down,left
    let total=0
    for(let [i,n] of [8,4,2,1].entries()) if(this.pressed[i]) total+=n
    return this.totalTo8dir[total]
  }

}

