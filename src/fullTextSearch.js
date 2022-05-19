const stopwords = require("./stopwords.js");
const porterStemmer = require("./porterStemmer.js");

/********************************************************************
 * FullTextSearch
 ********************************************************************/
class FullTextSearch {
  constructor(docs) {
    this.store = new Store(docs);
    this.indexer = new Indexer(this.store);
  }

  stats() {
    this.store.stats();
  }

  reindex() {
    this.indexer.addBulk(this.store.documentRepository);
  }

  search(q) {
    let x = Search.query(this.store.indexRepository, q);
    console.log(x);
  }
}

class Store {
  constructor(docs = null, index = null) {
    this.documentRepository = docs || [];
    this.indexRepository = index || [];
  }

  stats() {
    console.log(
      `#Indexed Documents: ${Object.keys(this.documentRepository).length}`
    );
    console.log(`#Corpus: ${Object.keys(this.indexRepository).length}`);
  }
}

/********************************************************************
 * Indexer
 ********************************************************************/
class Indexer {
  constructor(store) {
    this.store = store;
  }

  /**
   * index all lines in the file
   * @param {*} fileName
   */
  add(docId, jsonDocument) {
    this.store.documentRepository[docId] = jsonDocument;
    const tokens = Analyser.analyse(jsonDocument);
    tokens.forEach((t) => {
      try {
        if (t in this.store.indexRepository) {
          this.store.indexRepository[t].push(docId);
        } else {
          this.store.indexRepository[t] = [];
          this.store.indexRepository[t].push(docId);
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
    lines.forEach((jsonDocument, docId) => {
      this.add(docId, jsonDocument);
    });
  }
}

/********************************************************************
 * Analyser
 ********************************************************************/
class Analyser {
  static analyse(rawText) {
    let tokens = this.tokenize(rawText);
    return tokens.map((token) => {
      token = this.filterToLower(token);
      token = this.filterStopWords(token);
      token = this.filterStemmer(token);
      return token;
    });
  }

  static tokenize(rawText) {
    let tokens = rawText.replace(/\W/g, " ").split(" ");
    return tokens.filter(Boolean);
  }

  static filterToLower(token) {
    return token.toLowerCase();
  }

  static filterStopWords(token) {
    if (stopwords.stopwords.includes(token)) {
      token = "";
    }
    return token.toLowerCase();
  }

  static filterStemmer(token) {
    return porterStemmer.stemmer(token);
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
      results[t] = { docIds: index[t] };
    });
    return results;
  }
}

module.exports = {
  FullTextSearch,
  Store
};
