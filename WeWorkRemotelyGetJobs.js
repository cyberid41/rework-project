var express = require('express');
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

var Job = mongoose.model('jobs', {
    title: String,
    link: String,
    company: String,
    date: String,
    source: {web: String, link: String},
    category: {title: String, link: String}
});


app.get('/jobs', function (req, res) {

    var baseUrl = 'https://weworkremotely.com';

    Category.find({}, function (err, docs) {
        docs.forEach(function (entry) {

            request(entry.link, function (error, response, html) {
                if (!error) {
                    var $ = cheerio.load(html);

                    var job = {
                        title: '',
                        link: '',
                        company: '',
                        date: '',
                        category: {
                            title: entry.title,
                            link: entry.link
                        },
                        source: {
                            web: entry.source.web, link: entry.source.link
                        }
                    };

                    //#category-5 > article > ul > li.feature > a
                    $('.jobs-container > section > article > ul > li > a').filter(function () {
                        job.link = baseUrl + $(this).attr('href');

                        var today = new Date();
                        var year = today.getFullYear();

                        // #category-6 > article > ul > li:nth-child(1) > a > span.company
                        job.company = $('ul > li:nth-child(1) > a > span.company').text();
                        job.title = $('ul > li:nth-child(1) > a > span.title').text();
                        job.date = $('ul > li:nth-child(1) > a > span.date').text() + ' ' + year;

                        var bot = new Job(job);
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
                res.status(200).send()
            });
        });
    });
});

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

app.listen('8080');
console.log('Magic happens on port 8080');
exports = module.exports = app;