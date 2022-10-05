let canvas
let dim, n, divisions
let squares=[]
let capture
let captureReady=false
let reference


function setup(){
    getDevicesInfo()
    dim=[window.innerWidth,window.innerHeight]
    n=floor(random(4,8))
    divisions=[n,n]
    canvas=createCanvas(...dim)
    canvas.hide()

    rectMode(CORNERS)
    colorMode(HSB,100)
    noFill()

    background(0)


    capture=createCapture(VIDEO,()=>{
       captureReady=true
    })
}

function getDevicesInfo(){
    let constraints={
        video:{
            width:{ideal:640}
        },
        facingMode:"user"//"environment"
    }
    navigator.mediaDevices.enumerateDevices()
    .then((devs)=>{
        console.log(devs)
    })
}


window.addEventListener("click",startThing)

function startThing(){
    if(captureReady){
        toggleLoading()
        
        capture.hide()
        setTimeout(()=>{
            cap()
        },50)
    }
}
function shareThing(){
    let imageData=endImage.imageData
    let can=document.createElement("canvas")
    can.width=imageData.width
    can.height=imageData.height
    let ctx=can.getContext("2d")
    ctx.putImageData(imageData,0,0)
    let blob=can.toBlob(()=>{
        const filesArray = [
            new File(
              [blob],
              'meme.jpg',
              {
                type: "image/jpeg",
                lastModified: new Date().getTime()
              }
           )
          ]
          const shareData = {
            files: filesArray,
          }
    
        navigator.share(shareData)
        .then(()=>{
            window.removeEventListener("click",shareThing)
            window.addEventListener("click",startThing)
    
        })
    })
    
    
    
    
}

/**
 * async function shareImage() {
  const response = await fetch('nacho.jpg');
  const blob = await response.blob();
  const filesArray = [
    new File(
      [blob],
      'meme.jpg',
      {
        type: "image/jpeg",
        lastModified: new Date().getTime()
      }
   )
  ];
  const shareData = {
    files: filesArray,
  };
  navigator.share(shareData);
}
 */

let endImage

function cap(){
    canvas.show()
    reference=bwhiteize()
    reference.resize(...dim)
    image(reference,0,0)

    setTimeout(()=>{
        generate({geom:[0,0,...dim],pxls:reference.get(0,0,...dim)})
        background(0)
        for(let q of squares) drawSquare(q,8)

        toggleLoading()
        let img=get()
        img.loadPixels()
        endImage=img
        window.removeEventListener("click",startThing)
        window.addEventListener("click",shareThing)
    },500)
    


}

function bwhiteize(){
    let img=capture.get(0,0,capture.width,capture.height)
    // img.filter(GRAY)
    img.filter(THRESHOLD,.01)
    return img
}

function generate(square){
    const n=6//divisions[0]
    const m=6//divisions[1]
    
    squares=squarize(square,m,n)
    subsquarize(.5,5)
    subsquarize(.3,5)
    subsquarize(.45,5)
    subsquarize(.6,2)
}

function squarize(square,nx,ny){
    const [x1,y1,x2,y2]=[...square.geom]
    const deltas=[Math.floor((x2-x1)/nx),Math.floor((y2-y1)/ny)]
    const results=[]
    for(let i=0;i<nx;i++){
        for(let j=0;j<ny;j++){
            const sq=[x1+i*deltas[0],y1+j*deltas[1],x1+(i+1)*deltas[0],y1+(j+1)*deltas[1]]
            const ps=reference.get(x1+i*deltas[0],y1+j*deltas[1],deltas[0],deltas[1])
            ps.loadPixels()
            let c1=ps.get(0,0)
            let c2=ps.get(sq[2]-sq[0]-1,0)
            let c3=ps.get(0,sq[3]-sq[1]-1)
            let c4=ps.get(sq[2]-sq[0]-1,sq[3]-sq[1]-1)
            let equalCorners=c1[0]==c2[0]&&c2[0]==c3[0]&&c3[0]==c4[0]
            let mean=getMeanBrightness(ps.pixels)
            /*
            console.log("square")
            console.log(...sq)
            console.log(ps,x1+i*deltas[0],y1+j*deltas[1])
            console.log(0,0,c1)
            console.log(0,sq[2]-sq[0]-1,c2)
            console.log(0,sq[3]-sq[1]-1,c3)
            console.log(sq[2]-sq[0]-1,sq[3]-sq[1]-1,c4)
            console.log(equalCorners)
            */
           results.push({geom:sq,pxls:ps.pixels,equalCorners,mean})
        }
    }
    return results
}

function subsquarize(threshold,minSides){
    let newSquares=[]
    for(let q of squares){
        let sides=[q.geom[2]-q.geom[0],q.geom[3]-q.geom[1]]
        let dist=Math.abs(q.pxls[0]-q.mean)
        //console.log(dist)
        let check=q.equalCorners && dist/255<threshold
        if(check || sides[0]<minSides || sides[1]<minSides){
            newSquares.push(q)
        }else{
            newSquares.push(...squarize(q,2,2))
        }
    }
    
    squares=newSquares
}

function drawSquare(square,I=3){
    let tx=.5*(square.geom[2]+square.geom[0])
    let ty=.5*(square.geom[3]+square.geom[1])
    
    push()
    let alfa=PI/326
    for(let i=0;i<I;i++){
        let randomAngle=random(-alfa,alfa)
        rotate(randomAngle)
        alpha(.1)
        strokeWeight(.1)
        stroke(noise(tx,ty)*100,100,75)
        if(square.check) fill("rgba(255,0,0,.1)")
        else noFill()
        rect(...square.geom)
    }
    pop()
}

function getMeanBrightness(pixels){
    let b=0
    for(let i=0;i<pixels.length;i+=4){
        let rp=pixels[i]
        let gp=pixels[i+1]
        let bp=pixels[i+2]

        b+=(rp+gp+bp)/3
    }
    b/=pixels.length/4
    return b
}
//3264x2448
const loading=document.querySelector("#loading")
function toggleLoading(){
    loading.classList.toggle("hide")
}
