const fs = require("fs");
const path = require("path");

// 递归遍历目录并生成 JSON 对象
function func(directory, key = 1) {
  const files = fs.readdirSync(directory);

  const musicList = [];

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const subMusicList = func(filePath, key++);
      musicList.push(...subMusicList);
    } else {
      const extension = path.extname(file);

      const found = musicList.find(
        (item) => (item.title = path.basename(directory))
      );
      if (found) {
        found[path.basename(filePath, extension)] = path.join(directory, file);
      } else {
        const musicObj = {
          key,
          author: directory
            .replace("music/", "")
            .replace(`/${path.basename(directory)}`, ""),
          title: path.basename(directory),
        };
        musicObj[path.basename(filePath, extension)] = path.join(
          directory,
          file
        );

        musicList.push(musicObj);
      }
    }
  });

  return musicList;
}

module.exports = func;
