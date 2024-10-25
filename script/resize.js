const sharp = require("sharp");

sharp("./Sakhal.png", {
  limitInputPixels: false,
})
  .resize(16384)
  .toFile("./Sakhal-16384.png", (err) => {
    console.log(err);
  });
