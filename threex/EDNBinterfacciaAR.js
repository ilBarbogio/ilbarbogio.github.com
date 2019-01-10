(function(window){
	function EDNBinterfacciaAR(){
    //DEPENDENCIES: JQUERY
    let _libreria={};
    let uniqueId=0;

    //LAVAGNA3D
    _libreria.Lavagna3D=function(larghezza, altezza, dove, opzioni){
      

      {//FASE DI SETUP
        let contenitore,canvas3D;
        {//STRUTTURA HTML
        contenitore=document.getElementById(dove);
        contenitore.className="contenitore-lavagna3D-EDNB";
        contenitore.style.width=larghezza+"px";
        contenitore.style.height=altezza+"px";

        canvas3D=document.createElement("div");
        canvas3D.id="lavagna3D";
        canvas3D.className="canvas-lavagna3D-EDNB";
        contenitore.appendChild(canvas3D);

				//contenitore tastiera opzioni
				let tastiera=document.createElement("div");
				tastiera.id="opzioniLavagna3D";
				tastiera.className="contenitore-tastiera-lavagna3D-EDNB contenitore-tastiera-lavagna3D-EDNB-chiusa";
				//bottone toggle
				let apriChiudi=document.createElement("button");
				apriChiudi.className="apri-chiudi-lavagna3D-EDNB";
				apriChiudi.innerHTML="&#9776";
				apriChiudi.onclick=function(){
					if(tastiera.getAttribute("aperta")){//chiudo
						let figli=tastiera.children;
						for(let i=1;i<figli.length;i++) figli[i].classList.toggle("nascosto-lavagna3D-EDNB");
						tastiera.classList.toggle("contenitore-tastiera-lavagna3D-EDNB-chiusa");
					}else{//apro
						let figli=tastiera.children;
						for(let i=1;i<figli.length;i++) figli[i].classList.toggle("nascosto-lavagna3D-EDNB");
						tastiera.classList.toggle("contenitore-tastiera-lavagna3D-EDNB-chiusa");
					}
					tastiera.toggleAttribute("aperta");
				};
				tastiera.appendChild(apriChiudi);
				let tooltipApriChiudi=document.createElement("span");
				tooltipApriChiudi.className="tooltip";
        tooltipApriChiudi.innerHTML="Opzioni";
        apriChiudi.appendChild(tooltipApriChiudi);
        //toggles
        //griglie
        let rigaGriglie=document.createElement("div");
        rigaGriglie.className="riga-tastiera-lavagna3D-EDNB";

          let etichettaGriglie=document.createElement("p");
          etichettaGriglie.innerHTML="Griglie: ";
          rigaGriglie.appendChild(etichettaGriglie);
          let etichettaGriglieXY=document.createElement("p");
          etichettaGriglieXY.innerHTML="XY ";
          rigaGriglie.appendChild(etichettaGriglieXY);
          let XYToggle=document.createElement("input");
          XYToggle.type="checkbox";
          XYToggle.toggleAttribute("checked");
          XYToggle.id="toggleGrigliaXY";
          rigaGriglie.appendChild(XYToggle);

          let etichettaGriglieXZ=document.createElement("p");
          etichettaGriglieXZ.innerHTML="XZ ";
          rigaGriglie.appendChild(etichettaGriglieXZ);
          let XZToggle=document.createElement("input");
          XZToggle.type="checkbox";
          XZToggle.id="toggleGrigliaXZ";
          rigaGriglie.appendChild(XZToggle);

          let etichettaGriglieYZ=document.createElement("p");
          etichettaGriglieYZ.innerHTML="YZ ";
          rigaGriglie.appendChild(etichettaGriglieYZ);
          let YZToggle=document.createElement("input");
          YZToggle.type="checkbox";
          YZToggle.id="toggleGrigliaYZ";
          rigaGriglie.appendChild(YZToggle);
        
        //appendo alla tastiera
        tastiera.appendChild(rigaGriglie);

        let rigaPiani=document.createElement("div");
        rigaPiani.className="riga-tastiera-lavagna3D-EDNB";

          let etichettaPiani=document.createElement("p");
          etichettaPiani.innerHTML="Piani: ";
          rigaPiani.appendChild(etichettaPiani);
          let etichettaPianiXY=document.createElement("p");
          etichettaPianiXY.innerHTML="XY ";
          rigaPiani.appendChild(etichettaPianiXY);
          let pianoXYToggle=document.createElement("input");
          pianoXYToggle.type="checkbox";
          pianoXYToggle.id="togglePianoXY";
          pianoXYToggle.toggleAttribute("checked");
          rigaPiani.appendChild(pianoXYToggle);

          let etichettaPianiXZ=document.createElement("p");
          etichettaPianiXZ.innerHTML="XZ ";
          rigaPiani.appendChild(etichettaPianiXZ);
          let pianoXZToggle=document.createElement("input");
          pianoXZToggle.type="checkbox";
          pianoXZToggle.id="togglePianoXZ";
          rigaPiani.appendChild(pianoXZToggle);

          let etichettaPianiYZ=document.createElement("p");
          etichettaPianiYZ.innerHTML="YZ ";
          rigaPiani.appendChild(etichettaPianiYZ);
          let pianoYZToggle=document.createElement("input");
          pianoYZToggle.type="checkbox";
          pianoYZToggle.id="togglePianoYZ";
          rigaPiani.appendChild(pianoYZToggle);

        //appendo alla tastiera
        tastiera.appendChild(rigaPiani);
        
        //camera
        let rigaCamera=document.createElement("div");
        rigaCamera.className="riga-tastiera-lavagna3D-EDNB";

          let etichettaCamera=document.createElement("p");
          etichettaCamera.innerHTML="Prospettiva ";
          rigaCamera.appendChild(etichettaCamera);
          let cameraToggle=document.createElement("input");
          cameraToggle.type="checkbox";
          cameraToggle.toggleAttribute("checked");
          cameraToggle.addEventListener("change",function(){
            if(this.checked==false){//setta la camera ortografica
              var posizione=camera.position.clone();
              camera=new THREE.OrthographicCamera(-larghezza/200,larghezza/200,altezza/200,-altezza/200,0.1,1000);
              camera.position.x=posizione.x;
              camera.position.y=posizione.y;
              camera.position.z=posizione.z;
              camera.lookAt(new THREE.Vector3(0,0,0));
              // this.perspective="Orthographic";
              controls=new THREE.OrbitControls(camera,renderer.domElement);
            }else {//setta la camera prospettica
              var posizione=camera.position.clone();
              camera=new THREE.PerspectiveCamera(25,larghezza/altezza,0.1,2000);
              camera.position.x=posizione.x;
              camera.position.y=posizione.y;
              camera.position.z=posizione.z;
              camera.lookAt(new THREE.Vector3(0,0,0));
              // this.perspective="Perspective";
              controls=new THREE.OrbitControls(camera,renderer.domElement);
            }
          })
          rigaCamera.appendChild(cameraToggle);

        //appendo alla tastiera
        tastiera.appendChild(rigaCamera);
        
        
				let figli=tastiera.children;
        for(let i=1;i<figli.length;i++) figli[i].classList.toggle("nascosto-lavagna3D-EDNB");
        
				if(globalOpt.opzioni) contenitore.appendChild(tastiera);
        }//fine STRUTTURA HTML

        //controlla se c'è webgl sul browser
        if(Detector.webgl){
          renderer=new THREE.WebGLRenderer({antialias:true});
        }else{renderer=new THREE.CanvasRenderer();}
        //crea la scena: sfondo, dimensioni, la div da usare
        scena=new THREE.Scene();
        scena.background=new THREE.Color(globalOpt.coloreSfondo);
        //disattiva il comportamento di default del drag del mouse
        canvas3D.addEventListener("mousedown",function(e){
          e.preventDefault();
        },false);
        //setta luci e atmosfera
        //luci

        //dimensioni
        renderer.setSize(larghezza,altezza);
        //attacc il treddì al render di pagina
        canvas3D.appendChild(renderer.domElement);
        renderer.domElement.id="context";
        //gira asse z in su
        THREE.Object3D.DefaultUp.set(0.0,0.0,1.0);

        //setta la camera
        camera=new THREE.PerspectiveCamera(25,larghezza/altezza,0.1,2000);
        camera.position.set(...globalOpt.posizioneTelecamera);
        scena.add(camera);

        //controlli e raycaster
        controlli=new THREE.OrbitControls(camera,renderer.domElement);
        if(!globalOpt.controlloTelecamera) controlli.enabled=false;
        raycaster=new THREE.Raycaster();

        mouse=new THREE.Vector2(); //vettore del mouse (bidimensionale)

        rayfire=false;

        //avvia le funzioni di render
        function animate(){
          requestAnimationFrame(animate);
          controlli.update();
          if(rayfire){//raycast
            raycaster.setFromCamera(mouse,camera);
            var intersects=raycaster.intersectObjects(scena.children);
            if(globalOpt.raycastCallback!=null) globalOpt.raycastCallback(intersects); 
            //spengo raycasting
            rayfire=false;
          }
          renderer.render(scena,camera);
        }
        if(globalOpt.riferimento){
          this.inizializzaAssi(riferimentoDef.rangeMassimo);
          this.inizializzaPiani(riferimentoDef.rangeMassimo);
        }
        animate();

        
        {//LISTENERS
          //mouse
          let oldMouse=[0,0];
          function localizzaMouse(e){
            rayfire=true;
            let rect=canvas3D.getBoundingClientRect();
            mouse.x=(event.clientX - rect.left)/larghezza*2-1;
            mouse.y=-(event.clientY - rect.top)/altezza*2+1;//invertire y
          }
          canvas3D.addEventListener("mousedown",function(e){
            let rect=canvas3D.getBoundingClientRect();
            oldMouse[0]=(event.clientX - rect.left)/larghezza*2-1;
            oldMouse[1]=-(event.clientY - rect.top)/altezza*2+1;//invertire y
          },false)
          canvas3D.addEventListener("mouseup",function(e){
            let tolleranza=0.01;
            let rect=canvas3D.getBoundingClientRect();
            let newMouse=[
              (event.clientX - rect.left)/larghezza*2-1,
              -(event.clientY - rect.top)/altezza*2+1
            ];
            if(Math.hypot(oldMouse[0]-newMouse[0],oldMouse[1]-newMouse[1])<tolleranza){
              localizzaMouse(e);
            }
          },false)
        }//fine LISTENERS
      }//fine SETUP

    

    }
    //FINE LAVAGNA

    //ELEMENTI AERRE
    var scenaAR, camera, renderer, clock, deltaTime, totalTime;
    var arToolkitSource, arToolkitContext;
    var scena; //è il marker, mentre la scene di three è scenaAR
    let raycaster,rayfire,mouse,canvas3D;

    let globalOpt={
      coloreSfondo:0xcccccc,
      coloreLuci:0xcccccc,
      opzioni:true,
      riferimento:true,
      posizioneTelecamera:[16,16,16],
      controlloTelecamera:true,
      materialeBase:new THREE.MeshLambertMaterial({color:0x000000,side:THREE.FrontSide,transparent:false}),
      materialeBaseBilatero:new THREE.MeshLambertMaterial({color:0x000000,side:THREE.DoubleSide,transparent:false}),
      materialeNonLuminoso:new THREE.MeshBasicMaterial({color:0x000000,transparent:false}),
      raycastCallback:null
    }

    let oggetti={
      fissi:[],
      cancellabili:[]
    };
    

    {//TRASFORMAZIONI
      let trasformazioneDefault={
        scala:0.25,
        traslazione:new THREE.Vector3(0,1,0),
        rotazione:new THREE.Euler(-Math.PI/2,0,0,"XYZ")
      }
      function trasformaDefaultMisure(misura){
        return misura*trasformazioneDefault.scala;
      }
      function trasformaDefaultPunti(vettore){
        let temp=vettore.clone();
        temp.multiplyScalar(trasformazioneDefault.scala);
        temp.applyEuler(trasformazioneDefault.rotazione);
        temp.add(trasformazioneDefault.traslazione);
        return temp;
      }
      function trasformaDefaultDirezioni(vettore){
        let temp=vettore.clone();
        temp.multiplyScalar(trasformazioneDefault.scala);
        temp.applyEuler(trasformazioneDefault.rotazione);
        return temp;
      }
      _libreria.trasla=function(id,vettore){
        let vettoreIn=trasformaDefaultDirezioni(vettore);
        let listaOggetti=scena.children;
        listaOggetti.forEach(oggetto=>{
          if(id!=null){
            if(oggetto.name==id||oggetto.name=="corpoVettore"+id||oggetto.name=="puntaVettore"+id){
              oggetto.position.x+=vettoreIn.x;
              oggetto.position.y+=vettoreIn.y;
              oggetto.position.z+=vettoreIn.z;
            }
          }else{
            oggetto.position.x+=vettoreIn.x;
            oggetto.position.y+=vettoreIn.y;
            oggetto.position.z+=vettoreIn.z;
          }
        })
      }
      _libreria.ruota=function(id,asse,angolo){
        let asseIn=trasformaDefaultDirezioni(asse);
        let listaOggetti=scena.children;
        listaOggetti.forEach(oggetto=>{
          if(id!=null){
            if(oggetto.name==id||oggetto.name=="corpoVettore"+id||oggetto.name=="puntaVettore"+id){
              let quater=new THREE.Quaternion().setFromAxisAngle(asseIn.normalize(),angolo);
              oggetto.quaternion.multiply(quater);
            }
          }else{
            let quater=new THREE.Quaternion().setFromAxisAngle(asseIn.normalize(),angolo);
            oggetto.quaternion.multiply(quater);
          }
        })
      }
      _libreria.ruotaAffine=function(id,applicazione,asse,angolo){
        let applicazioneIn=trasformaDefaultPunti(applicazione);
        let asseIn=trasformaDefaultDirezioni(asse);
        let listaOggetti=scena.children;
        listaOggetti.forEach(oggetto=>{
          if(id!=null){
            if(oggetto.name==id||oggetto.name=="corpoVettore"+id||oggetto.name=="puntaVettore"+id){
              let quater=new THREE.Quaternion().setFromAxisAngle(asseIn.normalize(),angolo);
              oggetto.quaternion.multiply(quater);
              oggetto.position.sub(applicazioneIn);
              oggetto.position.applyQuaternion(quater);
              oggetto.position.add(applicazioneIn);
            }
          }else{
            let quater=new THREE.Quaternion().setFromAxisAngle(asseIn.normalize(),angolo);
            oggetto.quaternion.multiply(quater);
            oggetto.position.sub(applicazioneIn);
            oggetto.position.applyQuaternion(quater);
            oggetto.position.add(applicazioneIn);
          }
        })
      }
    }//fine TRASFORMAZIONI

    let animazioni=[];
    {//ANIMAZIONI
    let animaOpt={
      passo:0.01
    }
    function eseguiAnimazioni(opzioni){
      let opt=Object.assign({},animaOpt);
      if(opzioni!=null) Object.keys(opzioni).forEach(chiave=>opt[chiave]=opzioni[chiave]);
      animazioni.forEach(animazione=>{
        switch(animazione.tipo){
          case "traslazione":
          if(animazione.tempo>0){
            _libreria.trasla(animazione.id,animazione.vettore);
            animazione.tempo--;
          }
          break;
          case "rotazione":
          if(animazione.tempo>0){
            _libreria.ruota(animazione.id,animazione.asse,animazione.angolo);
            animazione.tempo--;
          }
          break;
          case "rotazioneAffine":
          if(animazione.tempo>0){
            _libreria.ruotaAffine(animazione.id,animazione.applicazione,animazione.asse,animazione.angolo);
            animazione.tempo--;
          }
          break;
        }
      })
      //PULIZIA ANIMAZIONI ESAURITE
    }
    _libreria.animaTraslazione=function(id,vettore,tempo){
      animazioni.push({
        tipo:"traslazione",
        id:id,
        vettore:vettore.clone().multiplyScalar(1/tempo),
        tempo:tempo
      })
    }
    _libreria.animaRotazione=function(id,asse,angolo,tempo){
      animazioni.push({
        tipo:"rotazione",
        id:id,
        asse:asse,
        angolo:angolo/tempo,
        tempo:tempo
      })
    }
    _libreria.animaRotazioneAffine=function(id,applicazione,asse,angolo,tempo){
      animazioni.push({
        tipo:"rotazioneAffine",
        id:id,
        applicazione:applicazione,
        asse:asse,
        angolo:angolo/tempo,
        tempo:tempo
      })
    }
    }//fine ANIMAZIONI

    {//FUNZIONI DISEGNO
      let oggettiDef={
        colore:"black",
        trasparenza:0,
        cancellabile:true,
        materiale:globalOpt.materialeBase,
      }
      let sferaDef={
        colore:"green",
        smoothness:16,
      }
      _libreria.sfera=function(id,centro,raggio,opzioni){
        //rotazione preliminare
        let centroIn=trasformaDefaultPunti(centro);
        let raggioIn=trasformaDefaultMisure(raggio);
        let opt=Object.assign({},oggettiDef);
        Object.keys(sferaDef).forEach(function(key){
          opt[key]=sferaDef[key];
        })
        if(opzioni!=null){
          Object.keys(opzioni).forEach(function(key){
            opt[key]=opzioni[key];
          })
        }
        //rimuovo eventuale oggetto preesistente
        if(opt.cancellabile){
          this.cancellaOggetto(id);
          oggetti.cancellabili.push(id);
        }else{
          if(oggetti.fissi.indexOf(id)==-1) oggetti.fissi.push(id);
        }
  
        //materiale, prima semplice poi eventuale trasparenza
        let materiale=opt.materiale.clone();
        materiale.color.set(opt.colore);
        if(opt.trasparenza!=0){
          materiale.transparent=true;
          materiale.opacity=1-opt.trasparenza;
        }
        //geometria
        let geometria=new THREE.SphereGeometry(raggioIn,opt.smoothness,opt.smoothness);
        let sfera=new THREE.Mesh(geometria,materiale);
        //trasla nel centro
        sfera.position.add(centroIn);
        //attiva ombre
        //corpoRetta.castShadow=true;
        //metti in scena
        sfera.name=id;
        scena.add(sfera);
      }
  
      let puntoDef={
        spessore:0.05,
        smoothness:16,
      }
      _libreria.punto=function(id,pos,opzioni){
        let opt=Object.assign({},oggettiDef);
        Object.keys(puntoDef).forEach(function(key){
          opt[key]=puntoDef[key];
        })
        if(opzioni!=null){
          Object.keys(opzioni).forEach(function(key){
            opt[key]=opzioni[key];
          })
        }
        this.sfera(id,pos,opt.spessore,opzioni);
      }
  
      let segmentoDef={
        spessore:0.01,
        smoothness:16,
      }
      _libreria.segmento=function(id,coda,testa,opzioni){
        //rotazione preliminare
        let codaIn=trasformaDefaultPunti(coda);
        let testaIn=trasformaDefaultPunti(testa);
        let opt=Object.assign({},oggettiDef);
        Object.keys(segmentoDef).forEach(function(key){
          opt[key]=segmentoDef[key];
        })
        if(opzioni!=null){
          Object.keys(opzioni).forEach(function(key){
            opt[key]=opzioni[key];
          })
        }
        //rimuovo eventuale oggetto preesistente
        if(opt.cancellabile){
          this.cancellaOggetto(id);
          oggetti.cancellabili.push(id);
        }else{
          if(oggetti.fissi.indexOf(id)==-1) oggetti.fissi.push(id);
        }
  
        //materiale, prima semplice poi eventuale trasparenza
        let materiale=opt.materiale.clone();
        materiale.color.set(opt.colore);
        if(opt.trasparenza!=0){
          materiale.transparent=true;
          materiale.opacity=1-opt.trasparenza;
        }
  
        let azimut= Math.atan2(testaIn.y-codaIn.y,testaIn.x-codaIn.x);//azimut
        let zenit= Math.PI*0.5-Math.atan2(testaIn.z-codaIn.z,Math.sqrt(Math.pow(testaIn.x-codaIn.x,2)+Math.pow(testaIn.y-codaIn.y,2)));//distanza zenitale
        
        let delta=new THREE.Vector3(testaIn.x-codaIn.x,testaIn.y-codaIn.y,testaIn.z-codaIn.z);
        let lunghezza=delta.length();
  
        //corpo cilindrico: comincia sviluppandosi lungo y, in altezza
        let geometria=new THREE.CylinderGeometry(opt.spessore,opt.spessore,lunghezza,opt.smoothness);
        let segmento=new THREE.Mesh(geometria,materiale);
        //ruota
        segmento.rotation.order="XZY";
        segmento.rotateZ(azimut-Math.PI/2); //aggiustamento dovuto alla direzione iniziale del cilindro
        segmento.rotateX(Math.PI/2-zenit);
        //trasla
        let t=testaIn.clone().addScaledVector(codaIn,-1).multiplyScalar(0.5);
        segmento.position.add(codaIn);
        segmento.position.add(t);
        //metti in scena
        segmento.name=id;
        scena.add(segmento);
      }
  
      let vettoreDef={
        colore:"blue",
        spessore:0.02,
        proporzionePunta:0.1,
        smoothness:16,
      }
      _libreria.vettore=function(id,testa,opzioni){
        //rotazione preliminare
        let vecchiaTesta=testa.clone();
        let testaIn=trasformaDefaultPunti(testa);
        let opt=Object.assign({},oggettiDef);
        Object.keys(vettoreDef).forEach(function(key){
          opt[key]=vettoreDef[key];
        })
        if(opzioni!=null){
          Object.keys(opzioni).forEach(function(key){
            opt[key]=opzioni[key];
          })
        }
  
        let lunghezzaPunta=testaIn.length()*opt.proporzionePunta;
        // controllo se la punta supera una certo rapporto con lo spessore
        if(lunghezzaPunta>12*opt.spessore){
          lunghezzaPunta=12*opt.spessore;
          opt.proporzionePunta=lunghezzaPunta/testaIn.length();
        }else if(lunghezzaPunta<4*opt.spessore){
          lunghezzaPunta=4*opt.spessore;
          opt.proporzionePunta=lunghezzaPunta/testaIn.length();
        }
        let nuovaTesta=vecchiaTesta.multiplyScalar(1-opt.proporzionePunta);
        
        //CORPO
        this.segmento("corpoVettore"+id,new THREE.Vector3(0,0,0),nuovaTesta,opt);
  
        //PUNTA
        //rimuovo eventuale oggetto preesistente
        if(opt.cancellabile){
          this.cancellaOggetto("puntaVettore"+id);
          oggetti.cancellabili.push("puntaVettore"+id);
        }else{
          if(oggetti.fissi.indexOf(id)==-1) oggetti.fissi.push("puntaVettore"+id);
        }
  
        let azimut= Math.atan2(testaIn.y,testaIn.x);//azimut
        let zenit= Math.PI*0.5-Math.atan2(testaIn.z,Math.sqrt(Math.pow(testaIn.x,2)+Math.pow(testaIn.y,2)));//distanza zenitale
        //materiale, prima semplice poi eventuale trasparenza
        let materiale=opt.materiale.clone();
        materiale.color.set(opt.colore);
        if(opt.trasparenza!=0){
          materiale.transparent=true;
          materiale.opacity=1-opt.trasparenza;
        }
        //punta conica
        let geometria=new THREE.ConeGeometry(3*opt.spessore,lunghezzaPunta,opt.smoothness);
        let punta=new THREE.Mesh(geometria,materiale);
        //ruota
        punta.rotateZ(azimut-Math.PI*0.5); //aggiustamento dovuto alla direzione iniziale del cilindro
        punta.rotateX(Math.PI/2-zenit);
        //trasla
        let distanzaTesta=testaIn.length()-lunghezzaPunta/2;
        let posizionePunta=testaIn.clone().normalize().multiplyScalar(distanzaTesta);
        punta.position.add(posizionePunta);
        //metti in scena
        punta.name="puntaVettore"+id;
        scena.add(punta);
      }

      let rettaDef={
        colore:"red",
        spessore:0.01,
        lunghezza:50,
        smoothness:16,
      }
      //inizializza-aggiorna la grafica di una retta
      _libreria.retta=function(id,punto,direzione,opzioni){
        let opt=Object.assign({},oggettiDef);
        Object.keys(rettaDef).forEach(function(key){
          opt[key]=rettaDef[key];
        })
        if(opzioni!=null){
          Object.keys(opzioni).forEach(function(key){
            opt[key]=opzioni[key];
          })
        }
  
        direzione.normalize().multiplyScalar(-opt.lunghezza);
        let coda=punto.clone().add(direzione);
        direzione.multiplyScalar(-1);
        let testa=punto.clone().add(direzione);
        this.segmento(id,coda,testa,opt);
      }
  
      let pianoDef={
        colore:"gray",
        trasparenza:0.5,
        lato:100,
        materiale:globalOpt.materialeBaseBilatero,
        bordo:false,
        coloreBordo:"black",
        spessoreBordo:2,
        trasparenzaBordo:0,
      }
      _libreria.piano=function(id,punto,d1,d2,opzioni){
        //rotazione preliminare
        let puntoIn=trasformaDefaultPunti(punto);
        let d1In=trasformaDefaultDirezioni(d1);
        let d2In=trasformaDefaultDirezioni(d2);
        let opt=Object.assign({},oggettiDef);
        Object.keys(pianoDef).forEach(function(key){
          opt[key]=pianoDef[key];
        })
        if(opzioni!=null){
          Object.keys(opzioni).forEach(function(key){
            opt[key]=opzioni[key];
          })
        }
        //rimuovo eventuale oggetto preesistente
        if(opt.cancellabile){
          this.cancellaOggetto(id);
          oggetti.cancellabili.push(id);
        }else{
          if(oggetti.fissi.indexOf(id)==-1) oggetti.fissi.push(id);
        }
  
        //materiale, prima semplice poi eventuale trasparenza
        let materiale=opt.materiale.clone();
        materiale.color.set(opt.colore);
        if(opt.trasparenza!=0){
          materiale.transparent=true;
          materiale.opacity=1-opt.trasparenza;
        }
  
        let geometria=new THREE.PlaneGeometry(opt.lato,opt.lato);
        let piano=new THREE.Mesh(geometria,materiale);
  
        let normale=d1In.clone().cross(d2In);
        piano.lookAt(normale);
        piano.position.add(puntoIn);
  
        if(opt.bordo){
          var materialeBordo=new THREE.LineBasicMaterial({color:opt.coloreBordo,linewidth:opt.spessoreBordo});          
          if(opt.trasparenzaBordo!=0){
            materialeBordo.transparent=true;
            materialeBordo.opacity=1-opt.trasparenzaBordo;
          }
          let bordo=new THREE.GridHelper(opt.lato,1);
          bordo.material=materialeBordo;
          bordo.rotateX(Math.PI/2);
          piano.add(bordo);
        }
        //metti in scena
        piano.name=id;
        scena.add(piano);
      }

      let poliedroDef={
        coloreFacce:"red",
        colorazioneFacce:"",
        interno:false,
        spigoli:true,
        coloreSpigoli:0x000000,
        spessoreSpigoli:2,
      }
      _libreria.poliedro=function(id,vertici,facce,opzioni){
        let opt=Object.assign({},oggettiDef);
        Object.keys(poliedroDef).forEach(function(key){
          opt[key]=poliedroDef[key];
        })
        if(opzioni!=null){
          Object.keys(opzioni).forEach(function(key){
            opt[key]=opzioni[key];
          })
        }
        //rimuovo eventuale oggetto preesistente
        if(opt.cancellabile){
          this.cancellaOggetto(id);
          oggetti.cancellabili.push(id);
        }else{
          if(oggetti.fissi.indexOf(id)==-1) oggetti.fissi.push(id);
        }

        let poliedro=new THREE.Object3D();

        //geometria nuova
        let geometria=new THREE.Geometry();
        geometria.colorsNeedUpdate=true
        //VERTICI
        //converto vertici in vettori three, se non sono già (check per primo elemento tipo non array)
        let listaVertici;
        if(!Array.isArray(vertici[0])) listaVertici=vertici.slice();
        else{
          listaVertici = []
          for (var i = 0; i < vertici.length; i++)
            listaVertici.push( trasformaDefaultPunti(new THREE.Vector3( vertici[i][0], vertici[i][1], vertici[i][2]) ));
        }
        //inserisco i vertici nella geometria nuova
        geometria.vertices = listaVertici;

        //FACCE
        //converto le facce in una geometria
        let materialeFacce;
        if(opt.colorazioneFacce==""){
          materialeFacce=opt.materiale.clone();
          materialeFacce.color.set(opt.coloreFacce);
        }else{
          materialeFacce=new THREE.MeshLambertMaterial({color:0xffffff,vertexColors:THREE.FaceColors});
        }
        if(opt.trasparenza!=0){
          materialeFacce.transparent=true;
          materialeFacce.opacity=1-opt.trasparenza;
        }
        let coloriFacce={
            3: new THREE.Color( 0xcc0000 ),
            4: new THREE.Color( 0x00cc00 ),
            5: new THREE.Color( 0x0000cc ),
            6: new THREE.Color( 0xcccc00 ),
            7: new THREE.Color( 0x999999 ),
            8: new THREE.Color( 0x990099 ),
            9: new THREE.Color( 0xff6600 ),
            10: new THREE.Color( 0x6666ff )
        };
        let faceIndex=0;
        let indiceColore=0;
        for (var f=0; f<facce.length;f++){
          for (var i=0;i<facce[f].length-2;i++){
            geometria.faces[faceIndex]=new THREE.Face3(facce[f][0],facce[f][i+1],facce[f][i+2]);
            if(opt.colorazioneFacce=="valenza"){
              geometria.faces[faceIndex].color = coloriFacce[facce[f].length];
            }else if(opt.colorazioneFacce=="sequenza"){
              geometria.faces[faceIndex].color = coloriFacce[indiceColore+3];
            }
            faceIndex++;
          }
          indiceColore++;
          indiceColore=indiceColore%7;
        }

        geometria.computeFaceNormals();
        geometria.computeVertexNormals();

        let listaFacce = new THREE.Mesh(geometria, materialeFacce);
        poliedro.add(listaFacce);

        //mostra gli spigoli
        if(opt.spigoli){
          var geometriaSpigoli=new THREE.EdgesGeometry(listaFacce.geometry);
          var materialeSpigoli=new THREE.LineBasicMaterial({color:opt.coloreSpigoli,linewidth:opt.spessoreSpigoli});
          var spigoli=new THREE.LineSegments(geometriaSpigoli,materialeSpigoli);
          listaFacce.add(spigoli);
        }
        //facce interne, più scure
        if(opt.interno){
          var materialeInterno=new THREE.MeshBasicMaterial( { color: 0x555555, vertexColors: THREE.FaceColors, side: THREE.BackSide, wireframe: false } );
          var facceInterne=new THREE.Mesh(geometria, materialeInterno);
          poliedro.add(facceInterne);
        }

        poliedro.name=id;
        scena.add(poliedro);
      }
      _libreria.poliedro.cambiaColore=function(id,coloreFacce,coloreSpigoli){
        let oggetto;
        scena.children.forEach(item=>{
          if(item.name==id) oggetto=item;
        });
        oggetto.children[0].material.color.set(coloreFacce)
        oggetto.children[0].children[0].material.color.set(coloreSpigoli)
      }

      let cuboDef={
        coloreFacce:"white",
        colorazioneFacce:"",
        interno:false,
        spigoli:true,
        coloreSpigoli:0x000000,
        spessoreSpigoli:1,
      }
      _libreria.cubo=function(id,posizione,lati,opzioni){
        let opt=Object.assign({},oggettiDef);
        Object.keys(cuboDef).forEach(function(key){
          opt[key]=cuboDef[key];
        })
        if(opzioni!=null){
          Object.keys(opzioni).forEach(function(key){
            opt[key]=opzioni[key];
          })
        }
        //rimuovo eventuale oggetto preesistente
        if(opt.cancellabile){
          this.cancellaOggetto(id);
          oggetti.cancellabili.push(id);
        }else{
          if(oggetti.fissi.indexOf(id)==-1) oggetti.fissi.push(id);
        }

        if(typeof(lati)=="number") lati=[lati,lati,lati];
        let verticiCubo=[
          [0.5*lati[0],0.5*lati[1],-0.5*lati[2]],
          [0.5*lati[0],-0.5*lati[1],-0.5*lati[2]],
          [-0.5*lati[0],-0.5*lati[1],-0.5*lati[2]],
          [-0.5*lati[0],0.5*lati[1],-0.5*lati[2]],
          [0.5*lati[0],0.5*lati[1],0.5*lati[2]],
          [0.5*lati[0],-0.5*lati[1],0.5*lati[2]],
          [-0.5*lati[0],-0.5*lati[1],0.5*lati[2]],
          [-0.5*lati[0],0.5*lati[1],0.5*lati[2]]
        ]
        //traslazione
        let traslazione;
        if(!Array.isArray(posizione)) traslazione=[posizione.x,posizione.y,posizione.z];
        else traslazione=posizione.slice();
        verticiCubo.forEach(el=>{
          el.forEach((p,ind)=>{
            el[ind]+=traslazione[ind];
          })
        })
        let facceCubo=[
          [0,1,2,3],
          [7,6,5,4],
          [4,5,1,0],
          [6,7,3,2],
          [5,6,2,1],
          [7,4,0,3]
        ]

        this.poliedro(id,verticiCubo,facceCubo,opt);
      }

      //HELPERS
      let proiezioniDef={
        colore:"gray",
        pieni:0.15,
        vuoti:0.1,
        larghezzaLinea:30,
      }
      _libreria.proiezione=function(id,punto,opzioni){
        //trasformazione preliminare
        trasformaDefaultPunti(punto);
        let opt=Object.assign({},oggettiDef);
        Object.keys(proiezioniDef).forEach(function(key){
          opt[key]=proiezioniDef[key];
        })
        if(opzioni!=null){
          Object.keys(opzioni).forEach(function(key){
            opt[key]=opzioni[key];
          })
        }
        //rimuovo eventuale oggetto preesistente
        if(opt.cancellabile){
          this.cancellaOggetto(id+"ToXY");
          oggetti.cancellabili.push(id+"ToXY");
          this.cancellaOggetto(id+"OnXY");
          oggetti.cancellabili.push(id+"OnXY");
        }else{
          if(oggetti.fissi.indexOf(id+"ToXY")==-1) oggetti.fissi.push(id+"ToXY");
          if(oggetti.fissi.indexOf(id+"OnXY")==-1) oggetti.fissi.push(id+"OnXY");
        }
        
        //materiale tratteggioso
        let lineMaterial=new THREE.LineDashedMaterial({color:opt.colore,dashSize:opt.pieni,gapSize:opt.vuoti,linewidth:opt.larghezzaLinea});
        
        //proiezione verso xy
        let lineGeometry1=new THREE.Geometry();
        lineGeometry1.vertices.push(new THREE.Vector3(punto.x,punto.y,punto.z),new THREE.Vector3(punto.x,punto.y,0));
        let line1=new THREE.Line(lineGeometry1,lineMaterial);
        line1.computeLineDistances();
        line1.name=id+"ToXY";
        scena.add(line1);
  
        //proiezione su xy
        let lineGeometry2=new THREE.Geometry();
        lineGeometry2.vertices.push(new THREE.Vector3(0,0,0),new THREE.Vector3(punto.x,punto.y,0));
        let line2=new THREE.Line(lineGeometry2,lineMaterial);
        line2.computeLineDistances();
        line2.name=id+"OnXY";
        scena.add(line2);
      }

      let grigliaDef={
        colore:"blue",
        lato:10,
        casella:1
      }
      _libreria.griglia=function(id,punto,d1,d2,opzioni){
        //rotazione preliminare
        trasformaDefaultPunti(punto);
        trasformaDefaultDirezioni(d1);
        trasformaDefaultDirezioni(d2);
        let opt=Object.assign({},oggettiDef);
        Object.keys(grigliaDef).forEach(function(key){
          opt[key]=proiezioniDef[key];
        })
        if(opzioni!=null){
          Object.keys(opzioni).forEach(function(key){
            opt[key]=opzioni[key];
          })
        }
        //rimuovo eventuale oggetto preesistente
        if(opt.cancellabile){
          this.cancellaOggetto(id);
          oggetti.cancellabili.push(id+"helpGriglia");
        }else{
          if(oggetti.fissi.indexOf(id)==-1) oggetti.fissi.push(id);
        }
        
        var griglia=new THREE.GridHelper(opt.lato,Math.floor(opt.lato/opt.casella),colorCenterLine=new THREE.Color(opt.colore),colorGrid=new THREE.Color(opt.colore));
        
        griglia.name=id;
        //posiziono e rotaziono TODO


        scena.add(griglia);
      }
    }//fine FUNZIONI DISEGNO

    {//RIFERIMENTO
      //inizializza la grafica degli assi
      var riferimentoDef={
        spessoreAssi:0.05,
        trasparenzaPiani:0.3,
        rangeMassimo:5,
      }
      _libreria.inizializzaAssi=function(massimo){
        //assi
        this.vettore("assex",new THREE.Vector3(massimo+12*riferimentoDef.spessoreAssi,0,0),{cancellabile:false,colore:0xff0000,spessore:riferimentoDef.spessoreAssi});
        this.vettore("assey",new THREE.Vector3(0,massimo+12*riferimentoDef.spessoreAssi,0),{cancellabile:false,colore:0x00ff00,spessore:riferimentoDef.spessoreAssi});
        this.vettore("assez",new THREE.Vector3(0,0,massimo+12*riferimentoDef.spessoreAssi),{cancellabile:false,colore:0x0000ff,spessore:riferimentoDef.spessoreAssi});
      }
      //inizializza-aggiorna(click sui tasti nella pagina) la grafica dei piani
      _libreria.inizializzaPiani=function(massimo){
        let centro=new THREE.Vector3(0,0,0);
        let ics=new THREE.Vector3(1,0,0);
        let ipsilon=new THREE.Vector3(0,1,0);
        let zeta=new THREE.Vector3(0,0,1);
        //griglie
        var size=2*massimo;
        var divisions=2*massimo;
        var trasparenza=riferimentoDef.trasparenzaPiani;

        var gridHelper1=new THREE.GridHelper(size,divisions);
        gridHelper1.name="helperXY";
        var gridHelper2=new THREE.GridHelper(size,divisions);
        gridHelper2.name="helperXZ";
        var gridHelper3=new THREE.GridHelper(size,divisions);
        gridHelper3.name="helperYZ";
        
        gridHelper3.rotateZ(Math.PI/2);

        //piani colorati
        this.piano("pianoXY",centro,ics,ipsilon,{cancellabile:false,colore:0xffff00,lato:2*riferimentoDef.rangeMassimo,trasparenza:trasparenza})
        // this.griglia("helperXY",centro,ics,ipsilon,{lato:2*riferimentoDef.rangeMassimo,casella:1})
        scena.add(gridHelper1);

        // this.piano("pianoXZ",centro,ics,zeta,{cancellabile:false,colore:0xff00ff,lato:2*riferimentoDef.rangeMassimo,trasparenza:trasparenza})

        // var geometry3=new THREE.PlaneGeometry(10,10,32,32);
        // var material3=new THREE.MeshLambertMaterial({color:0x00ffff,side:THREE.DoubleSide,transparent:true,opacity:trasparenza});
        // var plane3=new THREE.Mesh(geometry3,material3);
        // plane3.name="pianoYZ";
        // plane3.rotateY(Math.PI/2);
        // this.piano("pianoYZ",centro,zeta,ipsilon,{cancellabile:false,colore:0x00ffff,lato:2*riferimentoDef.rangeMassimo,trasparenza:trasparenza})

        let self=this;
        // far apparire o sparire i piani
        document.getElementById("togglePianoXY").addEventListener("change",function(){
          if(this.checked==false){
            self.cancellaOggetto("pianoXY");
          }else{
            self.piano("pianoXY",centro,ics,ipsilon,{cancellabile:false,colore:0xffff00,lato:2*riferimentoDef.rangeMassimo,trasparenza:trasparenza});
          }
        });
        // document.getElementById("togglePianoXZ").addEventListener("change",function(){
        //   if(this.checked==false){scena.remove(plane2);
        //   }else {scena.add(plane2);}
        // });
        // document.getElementById("togglePianoYZ").addEventListener("change",function(){
        //   if(this.checked==false){scena.remove(plane3);
        //   }else {scena.add(plane3);}
        // });
        // ///far apparire o sparire le griglie
        // document.getElementById("toggleGrigliaXY").addEventListener("change",function(){
        //   if(this.checked==false){scena.remove(gridHelper1);
        //   }else {scena.add(gridHelper1);}
        // });
        // document.getElementById("toggleGrigliaXZ").addEventListener("change",function(){
        //   if(this.checked==false){scena.remove(gridHelper2);
        //   }else {scena.add(gridHelper2);}
        // });
        // document.getElementById("toggleGrigliaYZ").addEventListener("change",function(){
        //   if(this.checked==false){scena.remove(gridHelper3);
        //   }else {scena.add(gridHelper3);}
        // });
      }
    }//fine RIFERIMENTO

    {//FUNZIONI VARIE
      _libreria.cancellaOggetto=function(id){
        if(oggetti.cancellabili.indexOf(id!=-1)){
          if(scena.getObjectByName(id)!=null) scena.remove(scena.getObjectByName(id));
          oggetti.cancellabili=oggetti.cancellabili.filter(function(el){return el!=id;})
        }
        
      }
      _libreria.getOggetti=function(){
        return oggetti;
      }
      _libreria.cancellaLavagna=function(){
        oggetti.cancellabili.forEach(el=>{
          this.cancellaOggetto(el);
        });
      }
      _libreria.getOpzioniGlobali=function(){
        return globalOpt;
      }
    }//fine FUNZIONI VARIE

    {//FUNZIONI SETUP
      _libreria.setup=function(dove,opzioni){
        let markerOpt={
          detectionMode:"mono",
          marker:"hiro",
          tipoMarker:"pattern"
        }
        if(opzioni!=null){
          Object.keys(opzioni).forEach(chiave=>{
            if(globalOpt[chiave]!=null) globalOpt[chiave]=opzioni[chiave];
            if(markerOpt[chiave]!=null) markerOpt[chiave]=opzioni[chiave];
          });
        }
  
        //ELENCO PASSI
        //1-creo la scena ed il render
        //2-setuppo artoolkit e gestisco onresizes
        //3-setuppo i marker(s) e l'artoolkit context

        ////////////////////////////////////////////////////////////
        // setup scena
        ////////////////////////////////////////////////////////////
        {
        //scena di threejs
        scenaAR = new THREE.Scene();
        //setta luci e atmosfera
        //luci
        let luceAmbiente=new THREE.AmbientLight(globalOpt.coloreLuci,0.6);
        scenaAR.add(luceAmbiente);
        let luceDirezionale = new THREE.DirectionalLight(globalOpt.coloreLuci,1);
        luceDirezionale.position.set(5,5,5);
        scenaAR.add(luceDirezionale);
        //nebbia
        scenaAR.fog=new THREE.Fog(globalOpt.coloreSfondo,40,80);
        
        camera = new THREE.PerspectiveCamera(25,document.body.getBoundingClientRect().width/document.body.getBoundingClientRect().height,0.1,2000);//new THREE.Camera();
        renderer = new THREE.WebGLRenderer({
          antialias : true,
          alpha: true
        });
        scenaAR.add(camera);
        
        renderer.setClearColor(new THREE.Color('lightgrey'), 0)
        renderer.setSize(640,480);
        canvas3D=renderer.domElement;
        canvas3D.style.position = 'absolute'
        canvas3D.style.top = '0px'
        canvas3D.style.left = '0px'
        document.getElementById(dove).appendChild(canvas3D);

        //disattiva il comportamento di default del drag del mouse
        canvas3D.addEventListener("mousedown",function(e){
          e.preventDefault();
        },false);

        clock = new THREE.Clock();
        deltaTime = 0;
        totalTime = 0;
        }
        ////////////////////////////////////////////////////////////
        // setup arToolkitSource
        ////////////////////////////////////////////////////////////
        {
        arToolkitSource = new THREEx.ArToolkitSource({
          sourceType : 'webcam',
        });
        //resizamenti vari
        function onResize(){
          arToolkitSource.onResize()	
          arToolkitSource.copySizeTo(renderer.domElement)	
          if(arToolkitContext.arController!==null){
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)	
          }	
        }
        arToolkitSource.init(function onReady(){
          onResize()
        });
        //resize event
        window.addEventListener('resize', function(){
          onResize()
        });
        }
        ////////////////////////////////////////////////////////////
        // setup arToolkitContext
        ////////////////////////////////////////////////////////////
        {
        // create atToolkitContext
        arToolkitContext = new THREEx.ArToolkitContext({
          cameraParametersUrl: 'data/camera_para.dat',
          detectionMode: markerOpt.detectionMode,
          imageSmoothingEnabled : true,
        });
        
        // copy projection matrix to camera when initialization complete
        arToolkitContext.init(function onCompleted(){
          camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
        });
        }
        ////////////////////////////////////////////////////////////
        // setup markerRoots SCELTA MARKERS
        ////////////////////////////////////////////////////////////
        // build markerControls
        scena=new THREE.Group();

        scenaAR.add(scena);
        
        let markerControls1;
        if(markerOpt.tipoMarker=="pattern"){
          markerControls1=new THREEx.ArMarkerControls(arToolkitContext, scena, {
            size:1,
            type: markerOpt.tipoMarker,
            patternUrl: "data/"+markerOpt.marker+".patt",
          })
        }else if(markerOpt.tipoMarker=="barcode"){
          markerControls1=new THREEx.ArMarkerControls(arToolkitContext, scena, {
            size:1,
            type: markerOpt.tipoMarker,
            barcodeValue: markerOpt.marker,
          })
        }

        ////////////////////////////////////////////////////////////
        // ALTRO di meno tecnico
        ////////////////////////////////////////////////////////////
        let contenitore=document.getElementById(dove);
        let togglo=document.createElement("input");
        togglo.type="checkbox";
        togglo.checked=true;
        togglo.id="togglePianoXY";
        togglo.style.zIndex=99;
        togglo.style.position="absolute";
        
        contenitore.appendChild(togglo);
  
        if(globalOpt.riferimento){
          this.inizializzaAssi(riferimentoDef.rangeMassimo);
          this.inizializzaPiani(riferimentoDef.rangeMassimo);
        }
        
        this.attivaListeners();

        animate();
      }

      function update(){
        // update artoolkit on every frame
        if(arToolkitSource.ready!==false)
          arToolkitContext.update(arToolkitSource.domElement);
      }
      function render(){
        renderer.render(scenaAR,camera);
      }
      function animate(){
        requestAnimationFrame(animate);
        deltaTime=clock.getDelta();
        totalTime+=deltaTime;
        update();

        if(rayfire){//raycast
          raycaster.setFromCamera(mouse,camera);
          var intersects=raycaster.intersectObjects(scena.children);
          if(globalOpt.raycastCallback!=null) globalOpt.raycastCallback(intersects); 
          //spengo raycasting
          rayfire=false;
        }

        //animazioni
        eseguiAnimazioni();

        render();
      }
      
    }//fine SETUP

    {//LISTENERS
      //mouse
      let oldMouse=[0,0];
      mouse={x:0,y:0};
      function localizzaMouse(e){
        rayfire=true;
        let rect=canvas3D.getBoundingClientRect();
        mouse.x=(e.clientX - rect.x)/rect.width*2-1;
        mouse.y=-(e.clientY - rect.y)/rect.height*2+1;//invertire y
      }
      _libreria.attivaListeners=function(){
        rayfire=false;
        raycaster=new THREE.Raycaster();
        canvas3D.addEventListener("mousedown",function(e){
          let rect=canvas3D.getBoundingClientRect();
          oldMouse[0]=(e.clientX - rect.x)/rect.width*2-1;
          oldMouse[1]=-(e.clientY - rect.y)/rect.height*2+1;//invertire y
        },false)
        canvas3D.addEventListener("mouseup",function(e){
          let tolleranza=0.01;
          let rect=canvas3D.getBoundingClientRect();
          let newMouse=[
            (e.clientX - rect.x)/rect.width*2-1,
            -(e.clientY - rect.y)/rect.height*2+1
          ];
          if(Math.hypot(oldMouse[0]-newMouse[0],oldMouse[1]-newMouse[1])<tolleranza){
            localizzaMouse(e);
          }
        },false)
      }
    }//fine LISTENERS

    
    


    

    return _libreria;
  }

  if(typeof(window.AR3D)==="undefined"){
    window.AR3D=EDNBinterfacciaAR();
  }

})(window);