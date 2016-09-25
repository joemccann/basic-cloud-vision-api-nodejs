'use strict';

const fs = require('fs')
    , path = require('path')
    , Canvas = require('canvas')
    , Image = Canvas.Image
    , gcloud = require('google-cloud')({
      credentials: require('./service-key.json')
    })
    , vision = gcloud.vision()
    ;

// Object holding our in/out filenames
let imgFileNames = {}

/* 
 * Use the Vision API to detect faces in the input file.
 */
function detectFaces(inputFile, cb) {

  vision.detectFaces(inputFile, function(error, faces) {
    if (error) throw error;
    else {
      cb(null,faces);
    }  
  })

}

/* 
 * Using the faces array, draw the highlight box.
 */
function drawHighlight(faces){

  let img = new Image()

  img.onerror = function (err) {
    throw err
  }

  img.onload = function () {
    let w = img.width
      , h = img.height
      , canvas = new Canvas(w, h)
      , context = canvas.getContext('2d')
      ;

    context.drawImage(img, 0, 0, w, h, 0, 0, w, h)

    // Now draw boxes around all the faces
    context.strokeStyle = 'rgba(0,255,0,0.8)'
    context.lineWidth = '5'

    faces.forEach( function(face,index) {
      context.beginPath()
      face.bounds.face.forEach(function(bounds) {
        context.lineTo(bounds.x, bounds.y)
      })
      context.lineTo(face.bounds.face[0].x, face.bounds.face[0].y)
      context.stroke()
    })

    writeHighlightedImage(canvas)

  }

  // This is not best practice...
  img.src = path.resolve(__dirname, imgFileNames.inputFile)

}

/* 
 * Write the highlighted image to disk.
 */

function writeHighlightedImage(canvas){

  /*** writing new image ***/
  let out = fs.createWriteStream(imgFileNames.outputFile)
    , stream = canvas.jpegStream()
    ;

  stream.on('data', function(chunk) {
    out.write(chunk)
  })

  stream.on('end', function() {
    console.log('saved jpeg: ' + imgFileNames.outputFile)
  })

}

function getFileNames(){ return { inputFile: process.argv[2], outputFile: process.argv[3] } }

// Who run it? http://bit.ly/2dubN95
function main(){

  // Fragile check for command line arguments...
  if (process.argv.length < 3) {
    console.log('Usage: ' + process.argv[0] + ' ' + process.argv[1] +' <image.jpg> [outputFile]')
    process.exit(1)
  }

  // Get the image names for later
  imgFileNames = getFileNames()

  // Detect the faces and write the new file
  detectFaces(imgFileNames.inputFile, function(err,foundFaces) {
    if(err) return console.error(err)
    drawHighlight(foundFaces)
  })

} // end main

main()

// For faster, local testing comment out all the google stuff
// and uncomment this below
// let f = require('./faces.json')
// drawHighlight(f)

