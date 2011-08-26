// Dependencies
crypto = require("crypto");

// Normalize a word
exports.normalize = function normalize(word) {
    return word.toLowerCase().replace(/[^\w]/g, "");
};

exports.tokenize = function tokenize(doc) {
    return doc.split(/[\s_():-]+/);
};

// Text frequency
exports.tf = function tf(term, words, stopWords) {
    var t = exports.normalize(term);
    // If the normalized term is empty
    if(!t ||
      // Or a stop word
      (stopWords && ~stopWords.map(exports.normalize).indexOf(t)))
        // Don't count it
        return 0;

    var
        length = words.length,
        count = 0;

    for(var i = 0; i < length; i++) {
        // Increase count for every match
        if(t === exports.normalize(words[i])) count++;
    }

    // Term count / total word count ratio
    return count / length;
};

// Inverse document frequency
exports.idf = function idf(D, dted) {
    return Math.log(D / (1 + dted)) / Math.log(10);
};

// Main entry point, load the corpus and return an object
// which can calculate the tfidf for a certain doc
exports.analyze = function analyze(corpus, stopWords) {
    var
        // Total number of (unique) documents
        D = 0,
        // Number of documents containing the term
        dted = {},
        // Keep our calculated text frequencies
        docs = {};

    // Key the corpus on their md5 hash
    function hash(doc) {
        return crypto.createHash("md5").update(doc).digest("base64");
    }

    function add(doc, term, words) {
        // Make sure we have dted for the term
        if(!(term in dted)) dted[term] = 0;
        // Calculate and store the text frequency
        var tf = doc[term] = exports.tf(term, words, stopWords);
        // One more matching document?
        if(tf) dted[term]++;
    }

    if(!(corpus instanceof Array)) {
        // They are loading a previously analyzed corpus
        var data = corpus instanceof Object ? corpus : JSON.parse(corpus);
        D = data.D;
        dted = data.dted;
        docs = data.docs;
    } else {
        // They are loading a term and a corpus
        for(var i = 0, l = corpus.length; i < l; i++) {
            var doc = corpus[i],
                h = hash(doc);

            // Add the document if it's new to us
            if(!(h in docs)) {
                var words = exports.tokenize(doc);
                // One more document
                D++;
                docs[h] = {};
                
                if(i % 100 === 0) console.log("indexed %d documents", i)
                // Add words
                for(var j = 0, wl = words.length; j < wl; j++) {
                    add(docs[h], words[j], words);
                }
            }
        }
    }

    // Return a function which calculates the tfidf for this document
    return {
        tfidf: function(t, doc) {
            var h = hash(doc),
                term = exports.normalize(t);

            // If it's a new document, add it
            if(!(h in docs)) {
                // One more document
                D++;
                docs[h] = {};
                add(docs[h], term, exports.tokenize(doc));
            }
            
            // Return the tfidf
            return docs[h][term] * exports.idf(D, dted[term]);
        },
        asJSON: function() {
            return JSON.stringify({
                version: 1,
                D: D,
                dted: dted,
                docs: docs
            });
        }
    };
};
