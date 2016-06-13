var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reworks');

var Category = mongoose.model('categories', {
    title: String,
    link: String,
    web: String
});

var Job = mongoose.model('jobs', {
    title: String,
    link: String,
    company: String,
    date: String,
    new: String,
    web: String,
    category: {title: String, link: String}
});



    var baseUrl = 'https://weworkremotely.com';

    Category.find({web: baseUrl}, function (err, docs) {
        docs.forEach(function (entry) {

            request(entry.link, function (error, response, html) {
                if (!error) {
                    var $ = cheerio.load(html);

                    var job = {
                        title: '',
                        link: '',
                        company: '',
                        date: '',
                        new: '',
                        category: {
                            title: entry.title,
                            link: entry.link
                        },
                        web: entry.web
                    };

                    //#category-5 > article > ul > li.feature > a
                    $('.jobs-container > section > article > ul > li > a').filter(function () {
                        job.link = baseUrl + $(this).attr('href');

                        var today = new Date();
                        var year = today.getFullYear();

                        // #category-6 > article > ul > li:nth-child(1) > a > span.company
                        job.company = $('ul > li:nth-child(1) > a > span.company').text();
                        job.title = $('ul > li:nth-child(1) > a > span.title').text();
                        job.date = year + ' ' + $('ul > li:nth-child(1) > a > span.date').text();
                        // #category-6 > article > ul > li:nth-child(3) > span
                        job.new = $('article > ul > li:nth-child(3) > span').text();

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

            });
        });
    });

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
