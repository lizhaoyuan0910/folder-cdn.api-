const fs = require("fs");
const path = require("path");

function func(dir, key = 1) {
  const result = [];

  // 获取目录下的所有文件和子目录
  const files = fs.readdirSync(dir);

  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      // 如果是文件，则将文件路径存入结果数组中，并加上顺序id
      result.push({
        key: key++,
        path: filePath,
        filename: path.basename(filePath),
      });
    } else if (stat.isDirectory()) {
      // 如果是目录，则递归调用该函数，并将子目录的结果合并到结果数组中
      const subResult = wrap(filePath, key++);
      result.push(...subResult);
    }
  });

  return result;
}

module.exports = func;
