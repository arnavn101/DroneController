const arDrone = require('ar-drone');
const client = arDrone.createClient({imageSize:"160x90"});
client.config('video:video_channel', 0);
const sendkeys = require('sendkeys')

const {
  cv
} = require('./utils');

const { runVideoFaceDetection } = require('./commons');
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

const webcamPort = "tcp://192.168.1.1:5555";
//const webcamPort = 0;

function detectFaces(img) {
  // restrict minSize and scaleFactor for faster processing
  const options = {
    minSize: new cv.Size(100, 100),
    scaleFactor: 1.2,
    minNeighbors: 10
  };
  return classifier.detectMultiScale(img.bgrToGray(), options).objects;
}

exports.execute_faceRecognition = () => {
	runVideoFaceDetection(webcamPort, detectFaces);
}

exports.execute_faceRecognition()
