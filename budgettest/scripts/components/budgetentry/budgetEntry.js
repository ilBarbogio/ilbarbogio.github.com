import { dayDateFormat } from "../../utils.js"
import { CURRENCY_SYMBOL, UPDATE_ENTRY_REQUEST_EVENT } from "../../variables.js"

const template=`
  <style>@import url("./scripts/components/budgetentry/budgetEntry.css")</style>
  <div class="container">
    <div class="date"></div>
    <div class="value"></div>
    <div class="cause"></div>
    <div class="actions">
    <icon-button class="button delete" sides="2em" icon="trash"></icon-button>
    <icon-button class="button modify" sides="2em" icon="edit"></icon-button>
    </div>
  </div>
`
class budgetEntry extends HTMLElement{
  // static observedAttributes=["id","value","cause"]
  set data(data){
    this._id=data.id
    this._value=data.value
    this._cause=data.cause
    this._date=data.date
    this.renderData()
  }

  set id(identity){
    this._id=identity
    this.setAttribute("id",`entry-${this._id}`)
  }
  get id(){return this._id}

  set value(val){
    this._value=val
    this.renderData()
  }
  set cause(cau){
    this._cause=cau
    this.renderData()
  }

  set date(dat){
    this._date=dat
    this.renderData()
  }
  get date(){ return this._date}

  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template

    this.container=this.shadow.querySelector(".container")
    this.valueDisplay=this.container.querySelector(".value")
    this.causeDisplay=this.container.querySelector(".cause")
    this.dateDisplay=this.container.querySelector(".date")
    this.actions=this.container.querySelector(".actions")
    this.deleteButton=this.container.querySelector(".button.delete")
    this.modifyButton=this.container.querySelector(".button.modify")

    this.mounted=true
    this.setupListeners()
    this.renderData()
  }

  setupListeners(){
    this.deleteButton.clickHandler=(ev)=>{
      if(confirm("Vuoi cancellare questa voce?")){
        const month=this._date.split("-")[1]
        let event=new CustomEvent("delete-entry",{
          detail:{
            id:this._id,
            value:this._value,
            cause:this._cause,
            month
          }
        })
        window.dispatchEvent(event)
      }
    }
    this.modifyButton.clickHandler=(ev)=>{
      console.log(ev)
      // const month=this._date.split("-")[1]
      let event=new CustomEvent(UPDATE_ENTRY_REQUEST_EVENT,{
        detail:{
          id:this._id,
          value:this._value,
          cause:this._cause,
          date:this._date
        }
      })
      window.dispatchEvent(event)
    }
  }

  // attributeChangedCallback(name, oldValue, newValue){
  //   switch(name){
  //     case "value":
  //       this._value=newValue
  //       this.renderData()
  //       break
  //     case "cause":
  //       this._cause=newValue
  //       this.renderData()
  //       break
  //     default: break
  //   }
  // }

  renderData(){
    this.setAttribute("id",`entry-${this._id}`)
    if(this.valueDisplay) this.valueDisplay.innerHTML=`${this._value} ${CURRENCY_SYMBOL}`
    if(this.causeDisplay) this.causeDisplay.innerHTML=this._cause
    if(this.dateDisplay){
      const {day,date}=dayDateFormat(this._date)
      this.dateDisplay.innerHTML=`<span>${day}</span><span>${date}</span>`
    }
  }

  disconnectedCallback(){

  }
}

customElements.define("budget-entry",budgetEntry)