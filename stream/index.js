const split = require('split2');
const through = require('through2');

const WordTree = require('../lib/WordTree.js');
const WordSearch = require('../lib/WordSearch.js');

const DISTANCE = 1;

// loop through the words we care about and find words
// with X distance using the levenshtein algorithm
function findFriends() {
  const network = new Map();
  const tree = new WordTree();
  let networkUndefined = true;

  return through.obj(
    (chunk, enc, next) => {

      if (chunk === 'END OF INPUT') {
        networkUndefined = false;
      } else if (networkUndefined) {
        network.set(chunk, []);
      } else {
        tree.insert(chunk);
      }

      next();
    },
    function Flush(next) {
      const wordSearch = new WordSearch(tree);

      network.forEach((val, key) => {
        network.set(key, wordSearch.search(key, DISTANCE).filter((result) => {
          return result.distance === DISTANCE;
        }));
      });

      this.push(network);

      next();
    }
  );
}

// return the number of friends since that's all the output we need
function writeResults() {

  return through.obj(function Transform(chunk, enc, next) {
    chunk.forEach((result) => {
      this.push(`${result.length}\n`);
    });

    next();
  });
}

function run(inStream) {

  return inStream
    .pipe(split())
    .pipe(findFriends())
    .pipe(writeResults());
}

module.exports = run;
