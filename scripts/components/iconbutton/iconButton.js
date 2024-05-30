import { add, check, edit, subtract, trash, close, menu } from "./iconVariables.js"

const template=
`
  <style>@import url("./scripts/components/iconbutton/iconButton.css")</style>
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewbox="0 0 0 0" stroke="currentColor" fill="currentColor"></svg>
`
class iconButton extends HTMLElement{
  static observedAttributes=["icon","color","sides"]

  set icon(ico){
    this.setAttribute("icon",ico)
  }

  set color(col){
    this.setAttribute("color",col)
  }

  set clickHandler(handler){
    this._clickHandler=handler
    this.addEventListener("click",(ev)=>{
      ev.stopPropagation()
      this._clickHandler(ev)
    })
  }

  constructor(){
    super()
  }

  connectedCallback(){
    this.shadow=this.attachShadow({mode:"open"})
    this.shadow.innerHTML=template
    
    this.svg=this.shadow.querySelector("svg")    

    if(this.getAttribute("customStyle")) this.style=this.getAttribute("customStyle")

    this.mounted=true
    // this.setupListeners()
    this.applyColor(this.getAttribute("color"))
    this.composeSvg(this.getAttribute("icon"))
  }

  setupListeners(){
    this.addEventListener("click",(ev)=>{
      if(this._clickHandler) this._clickHandler(ev)
    })
  }

  attributeChangedCallback(name, oldValue, newValue){
    switch(name){
      case "sides":
        this.applySides(newValue)
        break
      case "icon":
        this.composeSvg(newValue)
        break
      case "color":
        if(this.svg) this.applyColor(newValue)
        break
      // case "customStyle":
      //   console.log(name,oldValue,newValue)
      //   this.style=newValue
      //   break
      default: break
    }
  }

  composeSvg(icon){
    let svgContent
    switch(icon){
      case "trash":
        svgContent=trash
        break
      case "edit":
        svgContent=edit
        break
      case "check":
        svgContent=check
        break
      case "add":
        svgContent=add
        break
      case "subtract":
        svgContent=subtract
        break
      case "close":
        svgContent=close
        break
      case "menu":
        svgContent=menu
        break
      default:
        svgContent=""
        break
    }
    if(this.svg){
      if(svgContent) this.svg.setAttribute("viewBox","0 -960 960 960")
      else this.svg.setAttribute("viewBox","0 0 0 0")
      this.svg.innerHTML=svgContent
    }
  }
  applyColor(color){
    if(color && this.svg){
      this.svg.style.color=color
      this.svg.style.borderColor=color
    }
  }
  applySides(sides){
    if(sides.includes(" ")) sides=sides.split(" ")
    else sides=[sides,sides]
    this.style.width=sides[0]
    this.style.height=sides[1]
  }

  disconnectedCallback(){
    // this.observer.disconnect()
  }
}

customElements.define("icon-button",iconButton)