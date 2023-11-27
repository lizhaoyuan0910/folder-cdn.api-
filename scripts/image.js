const fs = require("fs");
const path = require("path");
const size = require("lodash.size");

function other(dir, key = 1) {
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
        type: dir,
        path: filePath,
        filename: path.basename(filePath),
      });
    } else if (stat.isDirectory()) {
      // 如果是目录，则递归调用该函数，并将子目录的结果合并到结果数组中
      const sub = other(filePath, key);
      key += size(sub); // 更新 key 值
      result.push(...sub);
    }
  });

  return result;
}

function bing(dir, key = 1) {
  const result = [];
  // 获取目录下的所有文件和子目录
  const files = fs.readdirSync(dir);

  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const found = result.find((item) => {
        return item.time === path.basename(dir);
      });

      if (found) {
        if (path.extname(filePath) === ".txt") {
          const data = JSON.parse(fs.readFileSync(filePath).toString());
          Object.assign(found, data);
        }
        if (path.extname(filePath) === ".jpg") {
          found.url[path.basename(filePath, path.extname(filePath))] =
            path.join(dir, file);
        }
      } else {
        if (path.extname(filePath) === ".txt") {
          const data = JSON.parse(fs.readFileSync(filePath).toString());
          result.push({
            key: key++,
            time: path.basename(dir),
            url: {},
            title: data.time,
            color: data.color,
            base64: data.base64,
          });
        }
        if (path.extname(filePath) === ".jpg") {
          result.push({
            key: key++,
            time: path.basename(dir),
            url: {
              [path.basename(filePath, path.extname(filePath))]: path.join(
                dir,
                file
              ),
            },
            title: "",
            color: {},
            base64: "",
          });
        }
      }
    } else if (stat.isDirectory()) {
      // 如果是目录，则递归调用该函数，并将子目录的结果合并到结果数组中
      const sub = bing(filePath, key);
      key += size(sub); // 更新 key 值
      result.push(...sub);
    }
  });

  return result;
}

const func = (dir) => {
  const data = {};
  const files = fs.readdirSync(dir);
  files.forEach((file, index) => {
    if (file === "bing") {
      data[file] = bing(path.join(dir, file));
    } else {
      data[file] = other(path.join(dir, file));
    }
  });
  return data;
};
module.exports = func;
