var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/reworks');

var Job = mongoose.model('jobs', {
    title: String,
    link: String,
    company: String,
    date: String,
    source: {web: String},
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
                        category: {title: entry.category.title, link: entry.category.link}
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
