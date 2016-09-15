
class WordTree {

  constructor() {
    this.word = null;
    this.children = new Map();
  }

  // insert a word into the tree, if and branch off as we need to
  insert(word) {
    let node = this; // eslint-disable-line consistent-this

    for (let i = 0; i < word.length; i++) {

      if (!node.children.has(word[i])) {
        node.children.set(word[i], new WordTree());
      }

      node = node.children.get(word[i]);
    }

    node.word = word;

    return this;
  }

  // get the number of words in this tree all the way down to the roots
  get wordCount() {
    let count = 0;

    if (this.word) {
      count += 1;
    }

    if (this.children.size) {
      this.children.forEach((val) => {
        count += val.wordCount;
      });
    }

    return count;
  }

  // get the number of nodes in this tree all the way down to the roots
  get nodeCount() {
    let count = 1;

    if (this.children.size) {
      this.children.forEach((val) => {
        count += val.nodeCount;
      });
    }

    return count;
  }
}

module.exports = WordTree;
