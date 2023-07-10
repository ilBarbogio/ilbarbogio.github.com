const dataDiv=document.getElementById("data")

function setup(){
	navigator.permissions.query({ name: 'accelerometer' })
	//navigator.permissions.query({ name: 'gyroscope' })
	.then(result => {
	  if (result.state === 'denied') {
	    console.log('Permission to use accelerometer sensor is denied.');
	    return;
	  }
	  console.log("accepted")
		//connectToAcc()
		//connectToGyro()
		connectToOrientation()
	});
}
function connectToOrientation(){
	const sensorOptions={
      frequency:30,
      referenceFrame:"device"
    }
    const sensor=new AbsoluteOrientationSensor(sensorOptions)

    sensor.addEventListener("reading",ev=>{
      console.log(ev)
    })

    function askForPerms(){
      Promise.all([
        navigator.permissions.query({name:"accelerometer"}),
        navigator.permissions.query({name:"magnetometer"}),
        navigator.permissions.query({name:"gyroscope"}),
      ])
      .then(results=>{
        if(results.every(res=>res.state=="granted")){
          console.log("%cSensor is good to go :)","color:green")
          sensor.start()
        }else console.log("%cSensor permission denied :(","color:red")
      })
    }

    askForPerms()
}

function connectToAcc(){
	let accelerometer = null;
	try {
	  accelerometer = new Accelerometer({ referenceFrame: 'device' })//new Accelerometer({ frequency: 10 });
	  accelerometer.onerror = (event) => {
	    // Handle runtime errors.
	    if (event.error.name === 'NotAllowedError') {
	      console.log('Permission to access sensor was denied.');
	    } else if (event.error.name === 'NotReadableError') {
	      console.log('Cannot connect to the sensor.');
	    }
	  };
	  accelerometer.onreading = (e) => {
	    if(e.target=="Accelerometer"){
		    console.log(e.target.x+","+e.target.y+","+e.target.z);
	    };
	  };
	  accelerometer.start();
	} catch (error) {
	  // Handle construction errors.
	  if (error.name === 'SecurityError') {
	    console.log('Sensor construction was blocked by the Permissions Policy.');
	  } else if (error.name === 'ReferenceError') {
	    console.log('Sensor is not supported by the User Agent.');
	  } else {
	    throw error;
	  }
	}
}

function connectToGyro(){
	let gyro = null;
	console.log(typeof Gyroscope)
	try {
	  gyro = new Gyroscope({ frequency: 10 });
	  gyro.onerror = (event) => {
	    // Handle runtime errors.
	    if (event.error.name === 'NotAllowedError') {
	      console.log('Permission to access sensor was denied.');
	    } else if (event.error.name === 'NotReadableError') {
	      console.log('Cannot connect to the sensor.');
	    }
	  };
	  gyro.onreading = (e) => {
	    console.log(e);
	  };
	  gyro.start();
	} catch (error) {
	  // Handle construction errors.
	  if (error.name === 'SecurityError') {
	    console.log('Sensor construction was blocked by the Permissions Policy.');
	  } else if (error.name === 'ReferenceError') {
	    console.log('Sensor is not supported by the User Agent.');
	  } else {
	    throw error;
	  }
	}
}

//console.log(typeof Gyroscope === "function")
//if(window.DeviceMotionEvent){
//	addEventListener("devicemotion",(ev)=>{
//		console.log(ev)
//	})
//}

//setup()


connectToOrientation()

