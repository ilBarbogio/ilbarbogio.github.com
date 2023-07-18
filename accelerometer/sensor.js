export let sensorActive=false
export let currentVector=[0,0,0]
let tolerance=1
export let resultingVector=[0,0]
window.addEventListener("devicemotion",ev=>{
  
  let x=-(ev.accelerationIncludingGravity.x-ev.acceleration.x)
  let y=(ev.accelerationIncludingGravity.y-ev.acceleration.y)
  let z=ev.accelerationIncludingGravity.z-ev.acceleration.z
  
  updatecurrentVector(x,y,z)
  updateResultingVector()
})

function cut(n){
  return Math.floor(n*100)/100
}

let factor=.5
function lerp(a, b, t){
  return a +t*(b-a)
}
function updatecurrentVector(x,y,z){
  if(!x.isNaN) currentVector[0]=cut(lerp(currentVector[0],x,factor))
  if(!y.isNaN) currentVector[1]=cut(lerp(currentVector[1],y,factor))
  if(!z.isNaN) currentVector[2]=cut(lerp(currentVector[2],z,factor))
}

function updateResultingVector(){
  if(Math.abs(currentVector[0])>Math.abs(currentVector[1])){
    if(currentVector[0]>tolerance) resultingVector[0]=1
    else if(currentVector[0]<-tolerance) resultingVector[0]=-1
    else resultingVector[0]=0
    resultingVector[1]=0
  }else{
    if(currentVector[1]>tolerance) resultingVector[1]=1
    else if(currentVector[1]<-tolerance) resultingVector[1]=-1
    else resultingVector[1]=0
    resultingVector[0]=0
  }
  // if(currentVector[0]>tolerance) resultingVector[0]=1
  // else if(currentVector[0]<-tolerance) resultingVector[0]=-1
  // else resultingVector[0]=0

  // if(currentVector[1]>tolerance) resultingVector[1]=1
  // else if(currentVector[1]<-tolerance) resultingVector[1]=-1
  // else resultingVector[1]=0
}

const sensorOptions={
  frequency:1,
  referenceFrame:"device"
}

const sensor=new RelativeOrientationSensor(sensorOptions)
function askForPerms(){
  Promise.all([
    navigator.permissions.query({name:"accelerometer"}),
    navigator.permissions.query({name:"gyroscope"}),
  ])
  .then(results=>{
    if(results.every(res=>res.state=="granted")){
      console.log("%cSensor is good to go :)","color:green")
      sensorActive=true
      sensor.start()
    }else console.log("%cSensor permission denied :(","color:red")
  })
}

askForPerms()