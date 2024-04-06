let localStream;
const localVideo = document.querySelector("video");
let isMicMute = false;
let isVideoOn = false;

navigator.mediaDevices
  .getUserMedia({ video: isVideoOn, audio: isMicMute })
  .then(getVideo)
  .catch("Media Error");

function getVideo(mediaStream) {
  localStream = mediaStream;
  localVideo.srcObject = mediaStream;
}

function turnOffMic() {
  isMicMute = isMicMute ? false : true;
  navigator.mediaDevices
    .getUserMedia({ video: isVideoOn, audio: isMicMute })
    .then(getVideo)
    .catch("Media Error");
}

function turnOffVideo() {
  isVideoOn = !isVideoOn;
  if (isVideoOn) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: isMicMute })
      .then(getVideo)
      .catch(function (error) {
        console.error("Error starting video stream: ", error);
      });
  } else {
    if (localStream && localStream.getVideoTracks().length > 0) {
      localStream.getVideoTracks()[0].stop();
      console.log("Video turned off");
    } else {
      console.error("No video tracks found in the stream.");
    }
  }
}
