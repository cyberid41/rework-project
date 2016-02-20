var express = require('express');

var app = express();

app.get('/', function (req, res) {

    var ar = [
        ['apple', 'orange', 'pear'],
        ['carrots', 'beans', 'peas'],
        ['cookies', 'cake', 'muffins', 'pie']
    ];

    var json = {company: '', title: ''};

    company = [company = 'clevertech1', company = 'clevertech2'];

    title = [title = 'FullStack1', title = 'FullStack2'];

    for (var i in json) {
        console.log(json);
    }

    //// outer loop applies to outer array
    //for (var i = 0, len = ar.length; i < len; i++) {
    //    // inner loop applies to sub-arrays
    //    for (var j = 0, len2 = ar[i].length; j < len2; j++) {
    //        // accesses each element of each sub-array in turn
    //        console.log(ar[i][j]);
    //    }
    //}

});

app.listen('8080');
console.log('Magic happens on port 8080');
exports = module.exports = app;