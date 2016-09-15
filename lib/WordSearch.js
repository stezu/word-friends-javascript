
// determine the levenshtein algorithm cost of the given letter
function getCost({
  column,
  previousRow,
  currentRow,
  searchTerm,
  letter
}) {
  const insertCost = currentRow[column - 1] + 1;
  const deleteCost = previousRow[column] + 1;
  let replaceCost;

  if (searchTerm[column - 1] === letter) {
    replaceCost = previousRow[column - 1];
  } else {
    replaceCost = previousRow[column - 1] + 1;
  }

  return Math.min(insertCost, deleteCost, replaceCost);
}

// get search results for words
function getResults({
  node,
  letter,
  previousRow,
  searchTerm,
  distance
}) {
  const columns = searchTerm.length + 1;
  const currentRow = [previousRow[0] + 1];
  let results = [];

  // build out the row for the given letter
  for (let i = 1; i < columns; i++) {
    currentRow.push(getCost({
      column: i,
      previousRow,
      currentRow,
      searchTerm,
      letter
    }));
  }

  // this word is the correct distance away, add it to the results array
  if (currentRow[currentRow.length - 1] <= distance && node.word) {
    results.push({
      word: node.word,
      distance: currentRow[currentRow.length - 1]
    });
  }

  // if any items in the row are lower than the max distance, run the code again
  if (Reflect.apply(Math.min, Math, currentRow) <= distance) {

    node.children.forEach((val, key) => {

      results = results.concat(getResults({
        node: val,
        letter: key,
        previousRow: currentRow,
        searchTerm,
        distance
      }));
    });
  }

  return results;
}

class WordSearch {

  constructor(wordTree) {
    this.wordTree = wordTree;
  }

  search(searchTerm, distance) {
    const currentRow = Array.from({
      length: searchTerm.length + 1
    }, (val, key) => {
      return key;
    });
    let results = [];

    this.wordTree.children.forEach((val, key) => {
      results = results.concat(getResults({
        node: val,
        letter: key,
        previousRow: currentRow,
        searchTerm,
        distance
      }));
    });

    return results;
  }
}

module.exports = WordSearch;
