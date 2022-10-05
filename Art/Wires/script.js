let dim, nPoints, nWires, lWires
let points=[]
let levels=[]

function setup(){
    dim=[500,500]
    nPoints=floor(random(20,40))
    nWires=floor(random(2,6))
    lWires=floor(random(8,12))
    
    createCanvas(...dim)
    background(0)

    colorMode(HSB,100)
    noFill()

    let sublevels=10
    let lerpRatio=.15
    generate(sublevels,lerpRatio)

    // strokeWeight(1)
    // stroke(20,100,50)
    // for(let p of points) drawPoint(p)

    for(let [i,l] of levels.entries()){
        let maxWeight=2
        let ratio=(i+1)/levels.length   
        // strokeWeight((1-ratio)*maxWeight)
        strokeWeight(.2)
        for(let w of l){
            // stroke(100*random(),100,100,80*(1-ratio))
            stroke(100,0,100,100)
            drawWire(w)
        }
    }
}


// function draw(){
//     for(let q of squares) drawSquare(q,8)
// }

//functions


function generate(sublevels,lerpRatio){
    generatePoints()
    levels=[]
    generateWires()
    generateSubwires(sublevels,lerpRatio)
}

function generatePoints(){
    for(let i=0;i<nPoints;i++){
        points.push([
            random(dim[0]),
            random(dim[1])
        ])
    }
}
function generateWires(){
    let wires=[]
    let usedIndex=[]
    for(let i=0;i<nWires;i++){
        let w=[]
        for(let j=0;j<lWires;j++){
            let ind=floor(random(points.length-1))
            if(usedIndex.indexOf(ind)==-1){
                w.push(points[ind])
                usedIndex.push(ind)
            }
        }
        wires.push(w)
    }
    levels.push(wires)
}

function generateSubwires(n,r){
    for(let i=0;i<n;i++){
        let wires=levels[levels.length-1]
        let newLevel=[]
        for(let w of wires){
            newLevel.push(subwire(w,r))
            newLevel.push(subwire(w,2*r))
        }
        levels.push(newLevel)
    }
}

function subwire(wire,r){
    let sub=[]
    for(let i=0;i<wire.length-1;i++){
       sub.push(arrayLerp(wire[i],wire[i+1],r))
       //sub.push(arrayLerp(wire[i],wire[i+1],1-r)) 
    }
    return sub
}

function arrayLerp(A,B,t){
    return [A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t]
}

function drawPoint(p){
    point(...p)
}
function drawWire(wire){
    for(let i=0;i<wire.length-1;i++){
        line(...wire[i],...wire[i+1])
    }
}