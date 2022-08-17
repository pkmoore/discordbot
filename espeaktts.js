const espeak = require('espeak');
const fsPromises = require('fs/promises');
const path = require('node:path');

async function speakToFile(msg, outPath) {
  msg = msg.replace(/[^a-zA-Z0-9]/, "");
  return new Promise((resolve, reject) => {
    espeak.speak(msg, ['-s 90'], async (err, wav) => {
      if(err) {
        reject(err);
      } else {
        const data = wav.buffer;
        await fsPromises.writeFile(path.format(outPath), data); 
        console.log(`Wrote tts audio to ${path.format(outPath)}`);
        resolve();
      }
    })
  });
}

module.exports.speakToFile = speakToFile;