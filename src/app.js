const doc = `
Extract Data from Wikipedia Dump file


Usage:
  fts.js search <query>
  fts.js index <json>
  fts.js test <src>
  fts.js index_all <src>
  fts.js transform <src> <dest>
  fts.js -h | --help | --version
`;

const { FullTextSearch } = require("./fullTextSearch.js");
const prompt = require("prompt");
const dataLoader = require("./dataLoader.js");

const { docopt } = require("docopt");
var arguments = docopt(doc, {
  version: "1.0.0",
});

const main = () => {
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

  if (arguments.test) {
    console.log(`TEST`);
    const src = arguments["<src>"];
    console.log(`Indexing_all for ${src}`);
    const documentRepository = dataLoader.loadJsonl(src);
    // const indexRepository = dataLoader.loadJsonl(src);
    const fts = new FullTextSearch(documentRepository);
    fts.reindex();
    fts.stats();
    fts.search("achilles");
    fts.search("achievement");
    fts.search("International Academy");

    prompt.start();
    prompt.get("query", function (err, result) {
      if (err) {
        return onErr(err);
      }
      fts.search(result.query);
    });
  }
};

main();
