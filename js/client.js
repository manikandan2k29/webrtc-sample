let localPeerConnection;
let remotePeerConnection;
let localVideo = document.getElementById("localVideo");
let remoteVideo = document.getElementById("remoteVideo");
let localStream;
let remoteStream;


navigator.mediaDevices
  .getUserMedia({
    audio: false,
    video: true,
  })
  .then((stream) => {
    localVideo.srcObject = stream;
    localStream = stream;
  });


function generateSession() {
  localPeerConnection = new RTCPeerConnection();
  localPeerConnection.onicecandidate = (e) => {
    console.log("New Candidate");
    document.getElementById("offer").innerText = JSON.stringify(localPeerConnection.localDescription);
    console.log(JSON.stringify(localPeerConnection.localDescription));
  };
 
  localStream.getTracks().forEach(track => {
    localPeerConnection.addTrack(track, localStream);
});

  
  const sendChannel = localPeerConnection.createDataChannel("sendChannel");

  sendChannel.onmessage = (e) => console.log("messsage :  " + e.data);
  sendChannel.onopen = (e) => console.log("open");
  sendChannel.onclose = (e) => console.log("close");
  localPeerConnection.channel = sendChannel;
  // localPeerConnection.addStream(localStream);
  localPeerConnection
    .createOffer()
    .then((o) => localPeerConnection.setLocalDescription(o));
}

function setRemote() {
  const answer = document.getElementById("connectionStringLocal").value;
  localPeerConnection
    .setRemoteDescription(JSON.parse(answer))
    .then((a) => console.log("set remote desc"));
}

function answer() {
  const offer = document.getElementById("connectionString").value;
  console.log(offer);
  remotePeerConnection = new RTCPeerConnection();
  remotePeerConnection.onicecandidate = (e) => {
    console.log("New Candidate");
    document.getElementById("answer").innerText = JSON.stringify(remotePeerConnection.localDescription);
    console.log(JSON.stringify(remotePeerConnection.localDescription));
  };

  remotePeerConnection.ondatachannel = (e) => {
    const receiveChannel = e.channel;
    receiveChannel.onmessage = (e) => console.log("client :  " + e.data);
    receiveChannel.onopen = (e) => console.log("open");
    receiveChannel.onclose = (e) => console.log("close");
    remotePeerConnection.channel = receiveChannel;
  };
  // remotePeerConnection.track = (e)=>{
  //   console.log(e);
  //   remoteStream = e;
  //   remoteVideo.srcObject = e;
  //   console.log("added remote video");
  // }
  remotePeerConnection.addEventListener('track', async (event) => {
    const [remoteStream] = event.streams;
    remoteVideo.srcObject = remoteStream;
    console.log("added remote video");

});

  remotePeerConnection
    .setRemoteDescription(JSON.parse(offer))
    .then((a) => console.log("set remote desc"));

  remotePeerConnection
    .createAnswer()
    .then((o) => remotePeerConnection.setLocalDescription(o))
    .then((o) =>
      console.log(JSON.stringify(remotePeerConnection.localDescription))
    );
  console.log(remotePeerConnection);
}

function send() {
  const messageToSend = document.getElementById("message").value;
  if (localPeerConnection == undefined) {
    remotePeerConnection.channel.send(messageToSend);
  } else {
    localPeerConnection.channel.send(messageToSend);
  }
  console.log("you :  " + messageToSend);
}
