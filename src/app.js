const doc = `
Extract Data from Wikipedia Dump file


Usage:
  extract-data.js search <query>
  extract-data.js index <json>
  extract-data.js index_all <src>
  extract-data.js transform <src> <dest>
  extract-data.js -h | --help | --version
`;

const fullTextSearch = require("./fullTextSearch.js");
const dataLoader = require("./dataLoader.js");

const { docopt } = require("docopt");
var arguments = docopt(doc, {
  version: "1.0.0",
});


const main = () => {
  // console.log(arguments);
  if (arguments.search) {
    let query = arguments["<query>"];
    console.log(`Searching for ${query}`);
    const index = dataLoader.loadIndex();
    fullTextSearch.setIndex(index);
    fullTextSearch.query(query);
  }

  if (arguments.transform) {
    let src = arguments["<src>"];
    let dest = arguments["<dest>"];
    dataLoader.transformXml(src, dest);
  }

  if (arguments.index_all) {
    const src = arguments["<src>"];
    console.log(`Indexing_all for ${src}`);
    const data = dataLoader.loadJsonl(src);
    fullTextSearch.addToIndex(data);
    dataLoader.saveIndex(JSON.stringify(fullTextSearch.index));
  }
};


main();
