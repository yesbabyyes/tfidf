// Dependencies
crypto = require("crypto");

// Normalize a word
exports.normalize = function normalize(word) {
    return word.toLowerCase().replace(/[^\w]/g, "");
};

// Text frequency
exports.tf = function tf(term, doc) {
    var t = exports.normalize(term);
    if(!t) return 0;

    var
        words = doc.split(/\s/),
        length = words.length,
        count = 0;

    for(var i = 0; i < length; i++) {
        if(t === exports.normalize(words[i])) count++;
    }

    return count / length;
};

// Inverse document frequency
exports.idf = function idf(D, dted) {
    return Math.log(D / (1 + dted)) / Math.log(10);
};

// Main entry point, load the corpus and return an object
// which can calculate the tfidf for a certain doc
exports.analyze = function analyze(term, corpus) {
    var
        // Total number of (unique) documents
        D = 0,
        // Number of documents containing the term
        dted = 0,
        // Keep our calculated text frequencies
        tfs = {};

    // Key the corpus on their md5 hash
    function hash(doc) {
        return crypto.createHash("md5").update(doc).digest("base64");
    }

    function add(h, doc) {
        // One more document
        D++;
        // Calculate and store the text frequency
        var tf = tfs[h] = exports.tf(term, doc);
        // One more matching document?
        if(tf) dted++;
    }

    if(!corpus) {
        // They are loading a previously analyzed corpus
        var data = term instanceof Object ? term : JSON.parse(term);
        D = data.D;
        dted = data.dted;
        tfs = data.tfs;
    } else {
        // They are loading a term and a corpus
        for(var i = 0, l = corpus.length; i < l; i++) {
            var doc = corpus[i],
                h = hash(doc);

            // Add the document if it's new to us
            if(!(h in tfs)) add(h, doc);
        }
    }

    // Return a function which calculates the tfidf for this document
    return {
        tfidf: function(doc) {
            var h = hash(doc);

            // If it's a new document, add it
            if(!(h in tfs)) add(h, doc);
            
            // Return the tfidf
            return tfs[h] * exports.idf(D, dted);
        },
        asJSON: function() {
            return JSON.stringify({
                version: 1,
                D: D,
                dted: dted,
                tfs: tfs
            });
        }
    };
};
