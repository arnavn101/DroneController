const fs = require('fs');
const path = require('path');
const {
  cv
} = require('../utils');

module.exports = function () {
  const modelPath = path.resolve(__dirname, './');
 console.log(modelPath)
  const prototxt = path.resolve(modelPath, 'facenet.prototxt');
  const modelFile = path.resolve(modelPath, 'res10_300x300_ssd_iter_140000.caffemodel');

  if (!fs.existsSync(prototxt) || !fs.existsSync(modelFile)) {
    console.log('could not find facenet model');
    console.log('download the prototxt from: https://raw.githubusercontent.com/opencv/opencv/master/samples/dnn/face_detector/deploy.prototxt');
    console.log('download the model from: https://raw.githubusercontent.com/opencv/opencv_3rdparty/dnn_samples_face_detector_20170830/res10_300x300_ssd_iter_140000.caffemodel');
    throw new Error('exiting');
  }
  console.log("done1")
  return cv.readNetFromCaffe(prototxt, modelFile);
    console.log("done2")

};
