var tfidf = require("./lib/tfidf");

// Document samples
var doc1 = 'I code in ruby.';
var doc2 = 'I code in C and node, but node more often.';
var doc3 = 'This document is about TFIDF, written in node';

// Analyze the data
var data = tfidf.analyze([doc1, doc2, doc3], tfidf.stopWords);

// Get tfidf for a term in a document
// Should be 1 * log(3 / 2) = 0.4054651081081644
console.log("TF-IDF of code in doc1 = " + data.tfidf("code", doc1));
// Should be 2 * log(3 / 2) = 0.8109302162163288
console.log("TF-IDF of code in doc2 = " + data.tfidf("node", doc2));

// Test for non-existing word
// Should be 0
console.log("TF-IDF of notexist in doc2 = " + data.tfidf("notexist", doc2));

// Use adjusted TF-IDF, i.e. IDf = (|D| + 1) / ({d, t} + 1)
tfidf.adjusted = true;
// Should be 1 * log(4 / 3) = 0.28768207245178085
console.log("Adjusted TF-IDF of code in doc1 = " + data.tfidf("code", doc1));
// Should be 1 * log(4 / 2) = 0.6931471805599453
console.log("Adjusted TF-IDF of written in doc3 = " + data.tfidf("written", doc3));

// Print raw data
console.log(data.asJSON());
