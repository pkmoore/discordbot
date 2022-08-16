const espeak = require('espeak');
const fs = require('fs');
const path = require('node:path');

function speakToFile(msg) {
  msg = msg.replace(/[^a-zA-Z0-9]/, "");
  outPath = path.parse('./tmp.wav');
  espeak.speak(msg, (err, wav ) => {
    if(err) {
      throw err;
    } else {
      const data = wav.buffer;
      fs.writeFile(path.format(outPath), data, (err) => {
        if(err) {
          throw err;
        } else {
          console.log(`Wrote tts audio to ${path.format(outPath)}`);
        }
      });
    }
  });
  return outPath;
}

module.exports.speakToFile = speakToFile;