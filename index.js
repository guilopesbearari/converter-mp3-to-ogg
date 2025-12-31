const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
var ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)
const fs = require('fs');
const path = require('path');

// Define input and output directories
const inputFolder = './input_mp3s';
const outputFolder = './output_oggs';

// Ensure output directory exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// Read the files in the input directory
fs.readdir(inputFolder, (err, files) => {
  if (err) {
    console.error(`Error reading input folder: ${err}`);
    return;
  }

  const mp3Files = files.filter(file => path.extname(file).toLowerCase() === '.mp3');

  if (mp3Files.length === 0) {
    console.log('No MP3 files found in the input folder.');
    return;
  }

  mp3Files.forEach(file => {
    const inputFile = path.join(inputFolder, file);
    const outputFileName = path.parse(file).name + '.ogg';
    const outputFile = path.join(outputFolder, outputFileName);

    ffmpeg(inputFile)
      .audioCodec('libvorbis') // Specify the OGG Vorbis audio codec
      .outputOptions(['-q:a 10']) // Optional: set audio quality (0-10, higher is better)
      .save(outputFile)
      .on('end', () => {
        console.log(`✅ Converted: ${file} to ${outputFileName}`);
      })
      .on('error', (err) => {
        console.error(`❌ Error converting ${file}: ${err.message}`);
      });
  });
});