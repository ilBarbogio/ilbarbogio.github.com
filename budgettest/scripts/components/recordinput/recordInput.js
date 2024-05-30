import {
  ADD_ENTRY_EVENT, ADD_ENTRY_REQUEST_EVENT, ADD_ENTRY_CONFIRM_EVENT,
  UPDATE_ENTRY_EVENT, UPDATE_ENTRY_REQUEST_EVENT, UPDATE_ENTRY_CONFIRM_EVENT
} from "../../variables.js"

const template=
`
  <style>@import url("./scripts/components/recordinput/recordInput.css")</style>
  <div class="container">
    <div class="input-container">
      <icon-button class="sign button" sides="2em" icon="subtract" color="red"></icon-button>
      <input class="number-input" type="number"/>
      <input class="date-input" type="date"/>
      <textarea class="cause-input"></textarea>
      <icon-button class="save button" sides="2em" icon="check"></icon-button>
      <icon-button class="close button" sides="2em" icon="close"></icon-button>
    </div>
  </div>
`
class recordInput extends HTMLElement{
  set value(v){
    if(!isNaN(v)){
      this._valid=true
      this._value=v
      this._sign=v>=0?1:-1
      if(this.mounted){
        this.valueInput.value=Math.abs(v)
        this.setSignButton()
      }
    }else{
      this._valid=false
    }
  }
  get value(){
    return this._sign*this._value
  }

  constructor(){
    super()
    this._valid=true
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")
    this.inputContainer=this.container.querySelector(".input-container")
    this.signButton=this.inputContainer.querySelector("icon-button.sign.button")
    this.valueInput=this.inputContainer.querySelector("input[type=number]")
    this.dateInput=this.inputContainer.querySelector("input[type=date]")
    this.textArea=this.inputContainer.querySelector("textarea")
    this.saveButton=this.inputContainer.querySelector("icon-button.save.button")
    this.closeButton=this.inputContainer.querySelector("icon-button.close.button")

    this._action=undefined

    this.mounted=true
    this.setSignButton()

    this.setupListeners()
  }

  setupListeners(){
    window.addEventListener(ADD_ENTRY_REQUEST_EVENT,(ev)=>{
      this._action=ADD_ENTRY_EVENT
      this._recordId=undefined
      this.value=0
      this.container.classList.toggle("open")
    })
    window.addEventListener(UPDATE_ENTRY_REQUEST_EVENT,(ev)=>{
      this._action=UPDATE_ENTRY_EVENT
      this._recordId=ev.detail.id
      this.value=ev.detail.value
      this.dateInput.value=ev.detail.date
      this.textArea.value=ev.detail.cause
      this.container.classList.toggle("open")
    })
    window.addEventListener(ADD_ENTRY_CONFIRM_EVENT,()=>{this.close()})
    window.addEventListener(UPDATE_ENTRY_CONFIRM_EVENT,()=>{this.close()})
    this.container.addEventListener("click",(ev)=>{
      this.close()
    })
    this.inputContainer.addEventListener("click",(ev)=>{
      ev.stopPropagation()
    })

    this.signButton.addEventListener("click",(ev)=>{
      console.log(ev)
      ev.stopPropagation()
      this.toggleSign()
    })
    this.valueInput.addEventListener("input",(ev)=>{
      this.value=ev.target.value
    })
    this.saveButton.addEventListener("click",(ev)=>{
      console.log(ev)
      let detail={
        value:this.value,
        date:this.dateInput.value,
        cause:this.textArea.value
      }
      if(this._action==UPDATE_ENTRY_EVENT) detail.id=this._recordId
      let event=new CustomEvent(this._action,{detail})
      window.dispatchEvent(event)
    })
    this.closeButton.addEventListener("click",(ev)=>{
      ev.stopPropagation()
      this.close()
    })
  }


  setSignButton(){
    if(this._sign>0){
      this.signButton.setAttribute("icon","add")
      this.signButton.setAttribute("color","green")
      this.inputContainer.classList.add("positive")
      this.inputContainer.classList.remove("negative")
    }else{
      this.signButton.setAttribute("icon","subtract")
      this.signButton.setAttribute("color","red")
      this.inputContainer.classList.remove("positive")
      this.inputContainer.classList.add("negative")
    }
  }
  toggleSign(){
    console.log("CIAO")
    this._sign*=-1
    this.setSignButton()
  }

  close(){
    this._recordId=undefined
    this.valueInput.value=""
    this.dateInput.value=""
    this.textArea.value=""
    this.isPositive=false
    this.container.classList.remove("open")
  }
}

customElements.define("record-input",recordInput)
