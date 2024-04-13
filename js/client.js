// let localStream;
// let remoteStream;

// const localVideo = document.getElementById("localVideo");
// const remoteVideo = document.getElementById("remoteVideo");

// let isMicMute = false;
// let isVideoOn = false;

let localPeerConnection;
let remotePeerConnection;

// navigator.mediaDevices
//   .getUserMedia({ video: isVideoOn, audio: isMicMute })
//   .then(getVideo)
//   .catch("Media Error");

// function getVideo(mediaStream) {
//   localStream = mediaStream;
//   localVideo.srcObject = mediaStream;
//   trace("Received local stream.");
// }

// function trace(text) {
//   text = text.trim();
//   const now = (window.performance.now() / 1000).toFixed(3);
//   console.log(now, text);
// }

// function turnOffMic() {
//   isMicMute = isMicMute ? false : true;
//   navigator.mediaDevices
//     .getUserMedia({ video: isVideoOn, audio: isMicMute })
//     .then(getVideo)
//     .catch("Media Error");
// }

// function turnOffVideo() {
//   isVideoOn = !isVideoOn;
//   if (isVideoOn) {
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: isMicMute })
//       .then(getVideo)
//       .catch(function (error) {
//         console.error("Error starting video stream: ", error);
//       });
//   } else {
//     if (localStream && localStream.getVideoTracks().length > 0) {
//       localStream.getVideoTracks()[0].stop();
//       console.log("Video turned off");
//     } else {
//       console.error("No video tracks found in the stream.");
//     }
//   }
// }

function generateSession() {
  localPeerConnection = new RTCPeerConnection();
  localPeerConnection.onicecandidate = (e) => {
    console.log("New Candidate");
    console.log(JSON.stringify(localPeerConnection.localDescription));
  };

  const sendChannel = localPeerConnection.createDataChannel("sendChannel");

  sendChannel.onmessage = (e) => console.log("messsage :  " + e.data);
  sendChannel.onopen = (e) => console.log("open");
  sendChannel.onclose = (e) => console.log("close");
  localPeerConnection.channel = sendChannel
  localPeerConnection.createOffer().then(o => localPeerConnection.setLocalDescription(o))

}

function setRemote(){
  const answer = document.getElementById("connectionStringLocal").value
  localPeerConnection.setRemoteDescription(JSON.parse(answer)).then(a=>console.log("set remote desc"))
}

function answer() {
  const offer = document.getElementById("connectionString").value
  console.log(offer);
  remotePeerConnection = new RTCPeerConnection();
  remotePeerConnection.onicecandidate = (e) => {
    console.log("New Candidate");
    console.log(remotePeerConnection.localDescription);
  };

  remotePeerConnection.ondatachannel= e =>{
    const receiveChannel = e.channel;
    receiveChannel.onmessage = (e) => console.log("client :  " + e.data);
    receiveChannel.onopen = (e) => console.log("open");
    receiveChannel.onclose = (e) => console.log("close");
    remotePeerConnection.channel = receiveChannel
  }

 
  remotePeerConnection.setRemoteDescription(JSON.parse(offer)).then(a=>console.log("set remote desc"))


  remotePeerConnection.createAnswer().then(o => remotePeerConnection.setLocalDescription(o)).then(o => console.log(JSON.stringify(remotePeerConnection.localDescription)))
  console.log(remotePeerConnection);
}

function send(){
  const messageToSend = document.getElementById("message").value;
  if(localPeerConnection == undefined){
    remotePeerConnection.channel.send(messageToSend)
  }else{
    localPeerConnection.channel.send(messageToSend)
  }
 console.log("you :  "+ messageToSend);
}
