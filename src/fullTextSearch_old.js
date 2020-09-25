const stopwords = require("./stopwords.js")
let documentRepository = {};
let index = {};

const setIndex = (idx) => {
  index = idx;
}
/********************************************************************
 * query
 */
const query = (str) => {
  const searchTokens = analyse(str)
  searchTokens.forEach((t) => {
    index[t].forEach((docId) => {
      console.log(t, index[t])
      // console.log(documentRepository[docId]);
    });
  });
};

/********************************************************************
 * Indexer
 */

/**
 * index all line in the file
 * @param {*} fileName
 */

const addToIndex = (lines) => {
  lines.forEach((line, i) => {
    documentRepository[i] = line;
    const tokens = analyse(line);
    // console.log(i, tokens);
    tokens.forEach((t) => {
      try {
        if (index[t]) {
          index[t].push(i);
        } else {
          index[t] = [];
          index[t].push(i);
        }
      } catch (e) {
        console.log(i, t, e);
      }
    });
  });
};

/********************************************************************
 * Analyser
 */
const analyse = (rawText) => {
  let retVal = tokenize(rawText);
  retVal = filterToLower(retVal);
  retVal = filterStopWords(retVal);
  return retVal;
};

const tokenize = (rawText) => {
  let tokens = rawText.replace(/\W/g, " ").split(" ");
  return tokens.filter(Boolean);
};

const filterToLower = (tokens) => {
  return tokens.map((item) => {
    return item.toLowerCase();
  });
};


const filterStopWords = (tokens) => {
  tokens = tokens.map((item) => {
    if (stopwords.stopwords.includes(item)) item = "";
    return item.toLowerCase();
  });
  return tokens.filter(Boolean);
};

module.exports = {
  addToIndex,
  query,
  index,
  setIndex
};
