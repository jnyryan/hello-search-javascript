const stopwords = require("./stopwords.js");

/********************************************************************
 * FullTextSearch
 ********************************************************************/
class FullTextSearch {
  constructor(docs = null) {
    this.documentRepository = docs;
    this.indexer = new Indexer(docs);
  }

  stats(){
    console.log(`#Indexed Documents: ${Object.keys(this.documentRepository).length}`)
    console.log(`#Corpus: ${Object.keys(this.indexer.indexRepository).length}`)

  }
  reindex() {
    this.indexer.addBulk(this.documentRepository);
  }

  search(q) {
    let x = Search.query(this.indexer.indexRepository, q);
    console.log(x);
  }

}

/********************************************************************
 * Indexer
 ********************************************************************/
class Indexer {
  constructor(docs = null, index = null) {
    this.documentRepository = docs;
    this.indexRepository = index || {};
  }

  /**
   * index all lines in the file
   * @param {*} fileName
   */
  add(docId, documentJson, tokens) {
    this.documentRepository[docId] = documentJson;
    tokens.forEach((t) => {
      try {
        if (t in this.indexRepository) {
          this.indexRepository[t].push(docId);
        } else {
          this.indexRepository[t] = [];
          this.indexRepository[t].push(docId);
        }
      } catch (e) {
        console.log(docId, t, e);
      }
    });
  }

  /**
   * index all lines in the file
   * @param {*} fileName
   */
  addBulk(lines) {
    lines.forEach((line, docId) => {
      const tokens = Analyser.analyse(line);
      this.add(docId, line, tokens);
    });
  }
}

/********************************************************************
 * Analyser
 ********************************************************************/
class Analyser {
  static analyse(rawText) {
    let retVal = this.tokenize(rawText);
    retVal = this.filterToLower(retVal);
    retVal = this.filterStopWords(retVal);
    return retVal;
  }

  static tokenize(rawText) {
    let tokens = rawText.replace(/\W/g, " ").split(" ");
    return tokens.filter(Boolean);
  }

  static filterToLower(tokens) {
    return tokens.map((item) => {
      return item.toLowerCase();
    });
  }

  static filterStopWords(tokens) {
    tokens = tokens.map((item) => {
      if (stopwords.stopwords.includes(item)) item = "";
      return item.toLowerCase();
    });
    return tokens.filter(Boolean);
  }
}

/********************************************************************
 * Search
 ********************************************************************/
class Search {
  static query(index, rawText) {

    let results = {};
    let searchTokens = Analyser.analyse(rawText);
    searchTokens.forEach((t) => {
      results[t] = { docIds: index[t]}
    });
    return results;
  }
}

module.exports = {
  FullTextSearch,
};
