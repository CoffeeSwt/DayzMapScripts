const Jimp = require("jimp");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const coprImgsExce = () => {
  const inputDir = "sourcemapcol";
  const outputDir = "out";
  fs.readdirSync(inputDir).forEach((pathName) => {
    fs.readdirSync(path.join(inputDir, pathName)).forEach((imgName) => {
      const inputPath = path.join(inputDir, pathName, imgName);
      const outPath = path.join(outputDir, pathName, imgName);
      console.log(inputPath, outPath);
      coprImgs(inputPath, outPath);
    });
  });
};

const coprImgs = (imgPath, outPath) => {
  Jimp.read(imgPath, (err, image) => {
    if (err) throw err;
    // 裁剪
    image.crop(0, 0, 512, 480);
    image.write(outPath, (err) => {
      if (err) throw err;
      console.log("Image saved.");
    });
  });
};
const merge = async () => {
  const inputRootDir = "../source";
  const imgPaths = [];
  fs.readdirSync(inputRootDir).forEach((dir) => {
    const dirName = path.join(inputRootDir, dir);
    fs.readdirSync(dirName).forEach((imgName) => {
      const imgInputPath = path.join(dirName, imgName);
      imgPaths.push(imgInputPath);
    });
  });
  function reverseCombine(arr, size) {
    const result = [];
    const length = arr.length;
    for (let i = 0; i < length; i += size) {
      const chunk = arr.slice(i, i + size);
      result.unshift(chunk);
    }
    return result;
  }

  const size = 128;
  const reversedCombinedArray = reverseCombine(imgPaths, size);
  // console.log(reversedCombinedArray);
  reversedCombinedArray.forEach((col) => {
    const firstFile = col[0];
    const match = firstFile.match(/\d+/);
    const imgName = `col-${match[0]}.png`;
    const outPath = path.join("./cols", imgName);
    // console.log(col);
    mergeCol(col, outPath);
  });
};

const mergeCol = async (col, outPath) => {
  try {
    const imgBuffers = [];
    for (let i = 0; i < col.length; i++) {
      imgBuffers.push({
        buffer: await sharp(col[i]).toBuffer(),
        index: Number.parseInt(col[i].match(/\d+/g)[1]),
      });
    }

    const meteDatas = [];
    for (let i = 0; i < col.length; i++) {
      meteDatas.push(await sharp(imgBuffers[i].buffer).metadata());
    }

    const totalHeight = meteDatas.reduce((pre, cur) => {
      return pre + cur.height;
    }, 0);
    // 创建一个新的图片容器
    const mergedImageCol = sharp({
      create: {
        width: 256,
        height: totalHeight,
        channels: 4, // RGBA
        background: { r: 255, g: 255, b: 255, alpha: 0 }, // 背景设为透明
      },
    });

    const mergedArr = imgBuffers.map((buffer, index) => {
      return {
        input: buffer.buffer,
        top: 256 * buffer.index,
        left: 0,
      };
    });
    mergedImageCol.composite(mergedArr);
    mergedImageCol.toFile(outPath, (err, info) => {
      if (err) throw err;
      console.log("Merged image saved successfully");
    });
  } catch (err) {
    console.error("Error merging images:", err);
  }
};

// merge();

const coprImgsCol = (imgPath, outPath) => {
  Jimp.read(imgPath, (err, image) => {
    if (err) throw err;
    // 裁剪
    image.crop(0, 0, 480, 10560);
    image.write(outPath, (err) => {
      if (err) throw err;
      console.log("Image saved.");
    });
  });
};

const coprImgsExceCol = () => {
  const rootPath = "cols";
  const outRootPath = "colsoutCopr";
  const files = fs.readdirSync(rootPath);
  files.forEach((fileName) => {
    const inputPath = path.join(rootPath, fileName);
    const outPath = path.join(outRootPath, fileName);
    console.log(inputPath, outPath);
    coprImgsCol(inputPath, outPath);
  });
};

const mergeRes = async () => {
  try {
    const rootPath = "./cols";
    const files = fs.readdirSync(rootPath);
    const imgBuffers = [];
    for (let i = 0; i < files.length; i++) {
      imgBuffers.push({
        buffer: await sharp(path.join(rootPath, files[i])).toBuffer(),
        index: Number.parseInt(files[i].match(/\d+/)[0]),
      });
    }

    // 创建一个新的图片容器
    const mergedImageCol = sharp({
      create: {
        width: 32768,
        height: 32768,
        channels: 4, // RGBA
        background: { r: 255, g: 255, b: 255, alpha: 0 }, // 背景设为透明
      },
      limitInputPixels: false,
    });

    const mergedArr = imgBuffers.map((val) => {
      return {
        input: val.buffer,
        top: 0,
        left: 256 * val.index,
      };
    });
    mergedImageCol.composite(mergedArr);
    mergedImageCol.toFile("Sakhal.png", (err, info) => {
      if (err) throw err;
      console.log("Merged image saved successfully");
    });
  } catch (err) {
    console.error("Error merging images:", err);
  }
};
mergeRes();
