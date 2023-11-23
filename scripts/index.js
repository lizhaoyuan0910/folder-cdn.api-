const fs = require("fs");
const path = require("path");

const output_path = path.join(process.cwd(), "output.json");
let output = {};
if (fs.existsSync(output_path)) {
  const existingContent = fs.readFileSync(output_path);
  output = JSON.parse(existingContent.toString());
}

(async () => {
  const files = fs
    .readdirSync(__dirname)
    .filter((filename) => filename.endsWith(".js") && filename !== "index.js");
  for (const filename of files) {
    const fileExtension = path.extname(filename); // 获取文件后缀名
    const name = path.basename(filename, fileExtension); // 获取文件名

    const func = require(path.join(__dirname, name));
    output[name] = await func(name);
  }

  fs.writeFileSync(output_path, JSON.stringify(output, null, 2));
})();
