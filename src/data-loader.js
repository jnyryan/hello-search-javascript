fs = require("fs");
var XmlStream = require("xml-stream");

const loadXml = () => {
  var stream = fs.createReadStream("./data/enwiki-latest-abstract1.xml");
  var xml = new XmlStream(stream);
  xml.on("endElement: doc", function (item) {
    console.log(item['title']);
    console.log(item['abstract']);
  });
};

module.exports = {
  loadXml
};
