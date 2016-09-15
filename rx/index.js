const Rx = require('rx');
const RxNode = require('rx-node');
const through = require('through2');

const WordTree = require('../lib/WordTree.js');
const WordSearch = require('../lib/WordSearch.js');

const DISTANCE = 1;

// our input stream can contain buffers, so we convert
// the entire input to a string to simplify our lives
function convertToString(chunk) {
  return chunk.toString();
}

// the input is line-seperated, so we split on lines
// to further simplify our lives
function splitOnLines() {
  let buffer = '';

  return {
    onNext(chunk) {
      const chunks = (buffer + chunk).split(/\r?\n/);

      buffer = chunks.pop();

      return Rx.Observable.from(chunks);
    },
    onError() {
      return Rx.Observable.empty();
    },
    onCompleted() {
      return Rx.Observable.return(buffer);
    }
  };
}

// loop through the words we care about and find words
// with X distance using the levenshtein algorithm
function findFriends() {
  const network = new Map();
  const tree = new WordTree();
  let networkUndefined = true;

  return {
    onNext(chunk) {
      if (chunk === 'END OF INPUT') {
        networkUndefined = false;
      } else if (networkUndefined) {
        network.set(chunk, []);
      } else {
        tree.insert(chunk);
      }

      return Rx.Observable.empty();
    },
    onError() {
      return Rx.Observable.empty();
    },
    onCompleted() {
      const wordSearch = new WordSearch(tree);

      network.forEach((val, key) => {
        network.set(key, wordSearch.search(key, DISTANCE).filter((result) => {
          return result.distance === DISTANCE;
        }));
      });

      return Rx.Observable.return(network);
    }
  };
}

// log the output of the observable
function writeResults(chunk) {
  return `${chunk[1].length}\n`;
}

function run(inStream) {
  const outStream = through();
  const split = splitOnLines();
  const find = findFriends();

  const result = RxNode.fromStream(inStream)
    .map(convertToString)
    .flatMapObserver(split.onNext, split.onError, split.onCompleted)
    .flatMapObserver(find.onNext, find.onError, find.onCompleted)
    .flatMap(Rx.Observable.from)
    .map(writeResults);

  RxNode.writeToStream(result, outStream);

  return outStream;
}

module.exports = run;
