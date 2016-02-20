var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodescrap');
var app = express();

var Scrap = mongoose.model('Scrap', {
    company: String,
    title: String,
    link: String,
    date: String,
    status: String
});

app.get('/bot', function (req, res) {

    var url = 'https://weworkremotely.com';

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var company, title, link, date, status;

            var json = {
                company: "", title: "", link: "", date: "", status: ""
            };

            $('.jobs-container > section > article > ul > li > a').filter(function () {
                json.link = url + $(this).attr('href');

                $('.jobs-container > section > article > ul > li > a  > span.company').filter(function () {
                    json.company = $(this).text();
                });

                $('.jobs-container > section > article > ul > li > a  > span.title').filter(function () {
                    json.title = $(this).text();
                });

                $('.jobs-container > section > article > ul > li > a  > span.new').filter(function () {
                    json.status = $(this).text();
                });

                $('.jobs-container > section > article > ul > li > a  > span.date').filter(function () {
                    json.date = $(this).text();
                });

                console.log(json);

                //var bot = new Scrap(json);
                //bot.save(function (error) {
                //    if (!error) {
                //        console.log('DB Saved!')
                //    } else {
                //        console.log('Something wrong! with message '.error)
                //    }
                //});
            });
        }

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send('Check your console!')
    });

});

app.listen('8080');
console.log('Magic happens on port 8080');
exports = module.exports = app;