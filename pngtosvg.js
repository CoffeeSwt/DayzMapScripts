const fs = require("fs");
const PNG = require("pngjs").PNG;
const { createCanvas } = require("canvas");
const SVG = require("@svgdotjs/svg.js");

// 创建一个画布
const canvas = createCanvas(15360, 15360);

// 读取 PNG 文件
fs.createReadStream("chernarusplus.png")
  .pipe(new PNG())
  .on("parsed", function () {
    // 创建 SVG 画布
    const svgCanvas = SVG(canvas);

    // 创建 SVG 图像
    const image = svgCanvas.image(
      "data:image/png;base64," + this.toString("base64")
    );

    // 将 SVG 写入文件
    fs.writeFile("output.svg", svgCanvas.svg(), function (err) {
      if (err) throw err;
      console.log("SVG saved!");
    });
  });
