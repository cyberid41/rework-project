var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reworks');

var Category = mongoose.model('categories', {
    title: String,
    link: String,
    web: String
});


var baseUrl = 'https://weworkremotely.com';

request(baseUrl, function (error, response, html) {
    if (!error) {
        var $ = cheerio.load(html);

        var category = {
            title: '', link: '', web: baseUrl
        };

        // #category-7 > article > h2 > a:nth-child(1)
        $('.jobs-container > section > article > h2 > a:nth-child(1)').filter(function () {
            category.link = baseUrl + $(this).attr('href').replaceAll('#intro', '');
            category.title = $(this).text();

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

});


String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
