const fs = require("fs");
const path = require("path");
const XmlStream = require("xml-stream");

const DATA_FILE = './data/index2.dat'

const saveIndex = (index) => {
  fs.writeFileSync(path.join(process.cwd(), DATA_FILE), index);
};

const loadIndex = () => {
  let idx = fs
    .readFileSync(path.join(process.cwd(), DATA_FILE), {
      encoding: "utf8",
      flag: "r",
    });
    return JSON.parse(idx);
};

const loadJsonl = (src) => {
  return fs
    .readFileSync(path.join(process.cwd(), src), {
      encoding: "utf8",
      flag: "r",
    })
    .split("\n")
    .filter(Boolean);
};

const transformXml = (source, dest) => {
  var stream = fs.createReadStream(source);
  let writer = fs.createWriteStream(dest);
  var xml = new XmlStream(stream);
  xml.on("endElement: doc", function (item) {
    let retval = {
      title: item["title"].replace("Wikipedia: ", ""),
      abstract: item["abstract"],
    };
    writer.write(JSON.stringify(retval));
    writer.write();
  });
  xml.on("end", function () {
    writer.end();
  });
};

module.exports = {
  saveIndex,
  loadIndex,
  loadJsonl,
  transformXml,
};
// /**
//  * index all line in the file
//  * @param {*} fileName
//  */
// const indexer = (fileName) => {
//   let theIndex = []
//   var reader = readline.createInterface({
//     input: fs.createReadStream(path.join(process.cwd(), fileName)),
//   });
//   var lineno = 0;
//   reader.on("line", function (line) {
//     lineno++;
//     // console.log("Line number " + lineno + ": " + line);
//     const tokens = analyser.analyse(line);
//     theIndex.push{ id: lineno, }
//     console.log(tokens);
//   });
// };
