var files = [];
var endPoint = "ws" + (self.location.protocol == "https:" ? "s" : "") + "://"
		+ "127.0.0.1"
		+  ":" + "8000"
		+ "";
		//+ "/ws/files/upload";

var socket;

var channelCount = 2;

var opened = 0;

var cSockets = new Array(channelCount);

var nextSlice = false;

var sliceFnc = null;
var blob = null;

var BYTES_PER_CHUNK = 1024 * 100; // optimal for websockets	

var start = 0;
var end = BYTES_PER_CHUNK;
var SIZE = 0;

var chunk = null;

var nextSlice = true;

var sent = 0;

var frameSize = 1;


function sendFrame(){

	
	//for(i = 0; i < frameSize; i++){
		sliceFnc(blob.size, -1);
	//}
	//sliceFnc(blob.size, -1);
	//sliceFnc(blob.size, -1);
	
	sliceFnc(blob.size, -1);



				
	
}

function sendChannelFrame(n){
	
	sliceFnc(blob.size, n);
	
}

var sliceFnc = function(size, socketNumber){
		

		var i = socketNumber;

		var sock = (i>-1)?cSockets[i]:socket;

		console.log("buffered amount in socket  " + sock.bufferedAmount);
		if(sock.readyState != 1 || sock.bufferedAmount > 0){
			console.log("halt !!!!!! : " + i);
			

			//sock.send(JSON.stringify({
			//		"cmd" : -1,
			//		"data" : "halt"
			//	}));



			return false;
		}
		   
		    //while (start < SIZE) {
		    if(start < size) {

			
			

			if ('mozSlice' in blob) {
				chunk = blob.mozSlice(start, end);
				sock.send(chunk);
			} else if ('slice' in blob) {
				chunk = blob.slice(start, end);
				sock.send(chunk);
			} else {
				chunk = blob.webkitSlice(start, end);
				sock.send(chunk);

			}	

			console.log("tb: " + start + ", in buffer: " + sock.bufferedAmount + ", sent from " + i + ": " + sent); // transferred bytes
										

			start = end;
			end = start + BYTES_PER_CHUNK;
			
			sent = sent +  BYTES_PER_CHUNK;
			
			//if(sock.bufferedAmount == 0){
				

				if(sent  == BYTES_PER_CHUNK * frameSize){			
				
					console.log("sent : " + sent);

					sent = 0;

					//sock.send(JSON.stringify({
					//		"cmd" : 0,
					//		"data" : "ping from " + i
					//	}));


					return false;
					
				
				}	


			//}
			
			
								
			
			return true;

			
		    }else if(nextSlice){

			nextSlice = false;

		
			socket.send(JSON.stringify({
				"cmd" : 2,
				"data" : blob.name
			}));

			console.log("done: " + start); // transferred bytes

			//for(x = 0; x < channelCount; x++){
				//console.log("ch-" + x + " : " + cSockets[x].bufferedAmount + " state: " + cSockets[x].readyState);
			//}

			//self.postMessage(blob.name + " Uploaded Succesfully");


			
			return false;

		    }
		
		};
		
		

function openSocket() {
	socket = new WebSocket(endPoint, "example-protocol");
	
	socket.onmessage = function(event) {
		if(event.data == "more"){
			

		}else if(event.data == "pong"){
			
			console.log("just a pong");
			
			sendFrame();
			
					
		}
		//self.postMessage(JSON.parse(event.data));

		console.log(event.data);
		

	};

	socket.onopen = function() {
		process();
		

	};
}

function openChannels(count){

	
	for(i = 0; i < count; i++){
	 (function(i) {
		
		cSockets[i] = new WebSocket(endPoint, "example-protocol" );
		//new WebSocket( "ws://" + document.domain + ':' + location.port, "example-protocol" );
	
	
		cSockets[i].onmessage = function(event) {					
				
			if(event.data == "more"){

			
			}else if(event.data == "pong"){
				console.log("just a pong for channel : " + i);
			
				var b = (i==0)?1:0;
				//sendChannelFrame(b);
								
			}
		
			//self.postMessage(JSON.parse(event.data));
 
			console.log("event data for =" + i + ":" + event.data);
		

		};

		cSockets[i].onopen = function() {
						
			console.log("Channel Open :" + i);
			opened++;
			
		
		};
	 })(i);
	}

}

function ready() {
	return socket !== undefined
			&& socket.readyState !== WebSocket.CLOSED
}


function readBlob(newblob){
  return new Promise((resolve, reject) => {
    var fr = new FileReader();  
    fr.onload = () => {
      resolve(fr.result );
    };
    fr.readAsDataURL(newblob);
  });
}
  


async function process() {

	while (files.length > 0) {
		blob = files.shift();
		
		//const
		//BYTES_PER_CHUNK = 1024 * 1024 * 2;
		// 2MB chunk sizes.
		
	
		SIZE = blob.size;

		//cSockets[0] = socket;

		socket.send(JSON.stringify({
			"cmd" : 1,
			"data" : blob.name
		}));

		
		
		nextSlice = true;	

		var even = 0;
		var odd = 1;

		
		var iideven = 0;
		var iidodd = 0;
		

		var sendFrames = function(evenPair){	

			
			if(opened != channelCount){
				return;
			}	

			if(!nextSlice){
				console.log("next slice already false");
				
			}
			
			var x = (evenPair) ? even : odd;

 			
			if(cSockets[x].bufferedAmount != 0 && nextSlice){		
				
				
				if(cSockets[x].readyState == 1){
					cSockets[x].send(JSON.stringify({
							"cmd" : -1,
							"data" : "stall " + x
						}));
			
				}


			}else if(nextSlice){
				console.log("nextSlice: " + nextSlice + ", buffered 0: " + cSockets[x].bufferedAmount);

				sendChannelFrame(x);
				
			}

			even = even + 2;
			odd = odd + 2;
			
			even = even % channelCount;
			odd = odd % channelCount;

			
			if(!nextSlice){
				clearInterval(iideven);
				clearInterval(iidodd);

			}

		}			
				
		iideven = setInterval(function(){
			console.log("next: " + nextSlice);
				if(!nextSlice){
					console.log("clearing interval");
					clearInterval(iideven);
				}else{
					sendFrame(); 
				}
				 
			}, 10);

		


		//setTimeout(function(){

			//iidodd = setInterval(function(){sendFrames(false);}, 20);
		//}, 10);

		
	}
}

self.onmessage = function(e) {
	for (var j = 0; j < e.data.files.length; j++)
		files.push(e.data.files[j]);

	//self.postMessage("Job size: "+files.length);
			
	if (ready()) {
		process();
	} else{
		//openChannels(channelCount);
		openSocket();
		

	}
}
