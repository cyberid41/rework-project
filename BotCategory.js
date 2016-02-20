var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodescrap');
var app = express();

var Category = mongoose.model('categories', {
    title: String,
    link: String,
    source: {web: String, link: String}
});

app.get('/bot-category', function (req, res) {

    var baseUrl = 'https://weworkremotely.com';

    request(baseUrl, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var category = {
                title: '', link: '', source: {web: 'We Work Remotly', link: baseUrl}
            };

            // #category-7 > article > h2 > a:nth-child(1)
            $('.jobs-container > section > article > h2 > a:nth-child(1)').filter(function () {
                category.link = baseUrl + $(this).attr('href').replaceAll('#intro', '');
                category.title = $(this).text();
                console.log(category);
                var bot = new Category(category);
                bot.save(function (error) {
                    if (!error) {
                        console.log('DB Saved!')
                    } else {
                        console.log('Something wrong! with message '.error)
                    }
                });
            });
        }

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send('Check your console!')
    });

});

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

app.listen('8080');
console.log('Magic happens on port 8080');
exports = module.exports = app;