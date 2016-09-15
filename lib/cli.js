#!/usr/bin/env node
/* eslint-disable no-sync */

const path = require('path');
const fs = require('fs');

const main = require('../');

const outputStream = process.stdout;
let inputStream = process.stdin;
let inFilePath, isFile, method;

// An input file was provided
if (process.argv[2]) {
  inFilePath = path.resolve(process.argv[2]);

  try {
    isFile = fs.statSync(inFilePath).isFile();
  } catch (ex) {
    isFile = false;
  }

  if (isFile) {
    inputStream = fs.createReadStream(inFilePath);
  }
}

if (process.argv.indexOf('--rx') > -1) {
  method = main.rx;
} else {
  method = main.stream;
}

// Call the main function and pass results where we need to
method(inputStream).pipe(outputStream);
