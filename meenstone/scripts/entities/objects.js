import { STATE } from "../systems/variables.js"
import { Entity } from "./entity.js"

export class StaticObject extends Entity{
  constructor(id,x,y){
    super(id,x,y)
    this.setupSprite(STATE.spritesheets.destructibles,[64,64],[
      {name:"idle",pos:[0,64],length:3},
      {name:"destroy",pos:[64*3,64],length:4,destroy:true},
    ],"idle",3,[-36,-52])
    this.sprite.scale=1.5
  }

  update(d){
    this.sprite.update(d)
  }
}