const doc = `

Extract Data from Wikipedia Dump file

node ./bin/extract-data.js full > ./data/sample.jsonl

Usage:
  extract-data.js full
  extract-data.js -h | --help | --version

`;

const fs = require("fs");
var XmlStream = require("xml-stream");
const { docopt } = require("docopt");

var arguments = docopt(doc, {
  version: "1.0.0",
});

const main = () => {
  if (arguments.full) {
    loadXml();
    return;
  }
  console.log(arguments);
};

const loadXml = () => {
  var stream = fs.createReadStream("./data/enwiki-latest-abstract1.xml");
  var xml = new XmlStream(stream);
  xml.on("endElement: doc", function (item) {
    let retval =  { title: item["title"].replace("Wikipedia: ", ''), abstract : item["abstract"] };
    console.log(JSON.stringify(retval))
  });
  xml.on("end", function () {
    console.log(out)
  });
};

main();
