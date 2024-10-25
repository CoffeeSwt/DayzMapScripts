import fs from "fs/promises";
import fetch from "node-fetch";
import path from "path";

const downloadImage = async (x, y) => {
  try {
    const imageUrl = `https://maps.izurvive.com/maps/Sakhal-Sat/1.0.0/tiles/7/${x}/${y}.jpg`; // 替换为你要下载的图片链接
    const localPath = path.join("map", `${x}-${y}.png`); // 本地保存的文件名
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`网络响应不ok，状态码: ${response.status}`);
    }
    const buffer = await response.buffer();
    await fs.writeFile(localPath, buffer);
    console.log(x, y, "下载完成");
  } catch (err) {
    console.error(x, y, "下载出错:", err.message);
  }
};
// downloadImage(127,127)
const main = async () => {
  for (let x = 47; x < 128; x++) {
    for (let y = 0; y < 128; y++) {
      await downloadImage(x, y);
    }
  }
};
main();
