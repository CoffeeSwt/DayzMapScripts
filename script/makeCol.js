const fs = require("fs");
const path = require("path");

const readMapDir = () => {
  const inputPath = "./map";
  const rootDir = "./sourcemapcol";
  fs.readdirSync(inputPath).forEach((fileName) => {
    const colsReg = /S_(\d\d\d)_\d\d\d_lco.png/;
    const match = colsReg.exec(fileName);
    const childDirName = match[1];
    const outDir = path.join(rootDir, childDirName);
    accessDir(outDir);
    mvFile(fileName, inputPath, outDir);
  });
};

const accessDir = (dir) => {
  try {
    if (!fs.accessSync(dir)) {
      return;
    }
  } catch (err) {
    //目录不存在，创建该目录
    fs.mkdirSync(dir);
  }
};

const mvFile = (fileName, sourceDir, targetDir) => {
  const oldPath = path.join(sourceDir, fileName);
  const newPath = path.join(targetDir, fileName);
  console.log(oldPath, newPath);
  fs.renameSync(oldPath, newPath);
};
readMapDir();
