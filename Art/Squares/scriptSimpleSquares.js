let canvas
let dim, n, divisions
let squares=[]

function setup(){
    dim=[500,500]
    n=floor(random(4,8))
    divisions=[n,n]
    canvas=createCanvas(...dim)

    rectMode(CORNERS)
    colorMode(HSB,100)
    noFill()

    background(0)

    generate([0,0,...dim])

    for(let q of squares) drawSquare(q,8)
}

function generate(square){
    const n=divisions[0]
    const m=divisions[1]
    squares=squarize(square,m,n)
    subsquarize(.2)
    subsquarize(.4)
    subsquarize(.8)
}

function squarize(square,nx,ny){
    const [x1,y1,x2,y2]=[...square]
    const deltas=[(x2-x1)/nx,(y2-y1)/ny]
    const results=[]
    for(let i=0;i<nx;i++){
        for(let j=0;j<ny;j++){
            const sq=[x1+i*deltas[0],y1+j*deltas[1],x1+(i+1)*deltas[0],y1+(j+1)*deltas[1]]
            
            results.push(sq)
        }
    }
    return results
}

function subsquarize(ratio){
    let indices=[]
    for(let i=0;i<floor(squares.length*ratio);i++){
        let r=floor(random(squares.length))
        if(indices.indexOf(r)==-1)indices.push(r)
    }
    let subSquares=[]
    
    for(let k of indices){
        let q=squares[k]
        
        squares[k]=undefined
        subSquares.push(...squarize(q,2,2))
        
    }
    squares=squares.filter(el=>el!=undefined)
    squares.push(...subSquares)
}

function drawSquare(square,I=3){
    let tx=.5*(square[2]+square[0])
    let ty=.5*(square[3]+square[1])
    

    push()
    let alfa=PI/3264
    for(let i=0;i<I;i++){
        let randomAngle=random(-alfa,alfa)
        rotate(randomAngle)
        alpha(.1)
        strokeWeight(.1)
        stroke(noise(tx,ty)*100,100,75)  
        rect(...square)
    }
    pop()
}