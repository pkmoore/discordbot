const espeak = require('espeak');
const fs = require('fs');

function speakToFile(msg) {
  espeak.speak('hello world', (err, wav ) => {
    if(err) {
      return console.error(err);
    } else {
      const data = wav.buffer;
      fs.writeFile('./tmp.wav', data, (err) => {
        return console.error(err);
      });
    }
  });
  return 'tmp.wav';
}

module.exports = speakToFile;