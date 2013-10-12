tfidf
=====

`tfidf` is a simple text frequency-inverse document frequency library for Node.js.

## Version
0.2.2

## Installation

    npm install tfidf

## Usage
    var tfidf = require("tfidf");

    // Document samples
    var doc1 = 'I code in ruby.';
    var doc2 = 'I code in C and node, but node more often.';
    var doc3 = 'This document is about TFIDF, written in node';

    // Analyze the data
    var data = tfidf.analyze([doc1, doc2, doc3], tfidf.stopWords);

    // Get tfidf for a term in a document, should be 1 * log(3 / 2)
    console.log(data.tfidf("code", doc1));

    // Get the analyzed corpus as JSON, for later use
    fs.writeFileSync("japherwockyFrequency.json", data.asJSON());

    // Load the analyzed corpus again, later
    var data = tfidf.analyze(fs.readFileSync("japherwockyFrequency.json", "utf8"));

## Credits

Linus G Thiel &lt;linus@hanssonlarsson.se&gt;

## Thank you

- [Ryan Dahl](http://github.com/ry) for the awesome Node.js
- [Caolan McMahon](http://github.com/caolan) for Nodeunit

## License 

(The MIT License)

Copyright (c) 2010 Hansson &amp; Larsson &lt;info@hanssonlarsson.se&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
