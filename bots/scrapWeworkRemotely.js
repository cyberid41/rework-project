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

var Job = mongoose.model('jobs', {
    title: String,
    link: String,
    company: String,
    date: String,
    new: String,
    web: String,
    category: {title: String, link: String}
});

var JobDetail = mongoose.model('job_detail', {
    title: String,
    link: String,
    location: String,
    body: String,
    company: String,
    date: String,
    new: String,
    apply: String,
    web: String,
    category: {title: String, link: String}
});

var baseUrl = 'https://weworkremotely.com';

request(baseUrl, function (error, response, html) {
    if (!error) {
        var $ = cheerio.load(html);

        var category = {
            title: '', link: '', web: baseUrl
        };

        $('.jobs-container > section > article > h2 > a:nth-child(1)').filter(function () {
            category.link = baseUrl + $(this).attr('href').replaceAll('#intro', '');
            category.title = $(this).text();

            var bot = new Category(category);
            bot.save(function (error) {
                if (!error) {

                } else {
                    console.log('Something wrong! with message '.error)
                }
            });

        });

        console.log('Category Saved!')

        // run get jobs
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

                                } else {
                                    console.log('Something wrong! with message '.error)
                                }
                            });
                        });
                    }

                });
            });

            console.log('Jobs Saved!')
        });

        // run get Detail
        Job.find({}, function (err, docs) {
            docs.forEach(function (entry) {
                request(entry.link, function (error, response, html) {
                    if (!error) {
                        var $ = cheerio.load(html);

                        var detail = {
                            title: entry.title,
                            link: entry.link,
                            location: '',
                            body: '',
                            company: '',
                            new: entry.new,
                            date: entry.date,
                            apply: '',
                            web: entry.web,
                            category: {
                                title: entry.category.title,
                                link: entry.category.link
                            }
                        };

                        // body > div.container > div.content > div.listing-header > div.listing-header-container > h2 > span.location
                        $('div.listing-header-container > h2').filter(function () {

                            // body > div.container > div.content > div.listing-header > div.listing-header-container > h2 > span.company
                            detail.company = $('div.listing-header-container > h2 > span.company').text();
                            // body > div.container > div.content > div.listing-header > div.listing-header-container > h2 > span.location
                            detail.location = $('div.listing-header-container > h2 > span.location').text();
                            // body > div.container > div.content > div.listing-header > div.listing-header-container > h2 > a
                            detail.web = $('div.listing-header-container > h2 > a').attr('href');
                            // body > div.container > div.content > section > div.listing-container
                            detail.body = $('div.listing-container').text();
                            // body > div.container > div.content > div.apply > p
                            detail.apply = $('div.apply > p').text();

                            var bot = new JobDetail(detail);
                            bot.save(function (error) {
                                if (!error) {

                                } else {
                                    console.log('Something wrong! with message '.error)
                                }
                            });
                        });
                    }

                });
            });

            console.log('Job Details Saved!')
        });
    }
});


String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
