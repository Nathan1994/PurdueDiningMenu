const https = require('https');
const nodemailer = require('nodemailer');
const cheerio = require('cheerio');
const fs = require('fs');

const email = require('./mail');

let dinings = ['Earhart', 'Ford', 'Hillenbrand', 'Wiley', 'Windsor'];
let foodKeywords = ['beef', 'steak'];
let baseURL = 'https://api.hfs.purdue.edu/menus/v2/locations/';
let nextDayToQuery = 6;
let htmlPath = 'email.html';
let linkBaseURL = 'https://dining.purdue.edu/menus/'

var queryIndex = 0;
var targetDinings = [];
var urlPairs = [];

for (var j = 0; j < nextDayToQuery; j++) {
  for (var i = 0; i < dinings.length; i++) {
    let today = new Date();
    today.setDate(today.getDate() + j)
    urlPairs.push({date: today, dining: dinings[i]});
  }
}

searchWithPairs(function(){
  loadHTML()
});


function loadHTML() {
  fs.readFile(htmlPath, 'utf8', function (err,data) {
    const $ = cheerio.load(data);
    for (var i = 0; i < targetDinings.length; i++) {
      let year = targetDinings[i].date.getFullYear();
      let month = targetDinings[i].date.getMonth()+1;
      let date = targetDinings[i].date.getDate();
      let dateStr = year + '/' + month + '/' + date;
      let url = linkBaseURL + targetDinings[i].dining + '/' + dateStr + '/';
      let htmlLabel = '<tr><td><a href="' + url + '" target="_blank">' +
      dateStr + '\t' + targetDinings[i].dining
      '</a></td></tr>';
      $('.content-table > tbody').append(htmlLabel);
    }
    sendMail($.html());
  });
}

function sendMail(text) {

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email.email,
      pass: email.password
    }
  });

  var mailOptions = {
    from: email.email,
    to: email.email,
    subject: 'Purdue Dining Menus',
    html: text
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


function searchWithPairs(complete) {
  queryIndex++;

  if (queryIndex === (nextDayToQuery * dinings.length)) {
    complete();
    return;
  }
  findKeywordBy(urlPairs[queryIndex].dining, urlPairs[queryIndex].date, function(URL){
    if (URL !== '') {
      let result = {date: urlPairs[queryIndex].date, dining: urlPairs[queryIndex].dining, url: URL};
      targetDinings.push(result);
    }
    searchWithPairs(complete);
  });
}

function findKeywordBy(diningName, date, complete) {
  let dateStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
  let URL = baseURL + diningName + '/' + dateStr;

  getRequest(URL, function (body) {
    for (var index in foodKeywords) {
      let keyword = foodKeywords[index];
      if(body.toLowerCase().indexOf(keyword) !== -1) {
        complete(URL);
        return;
      }
    }
    complete('')
  });
}

function getRequest(url, callback) {
  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      callback('');
      return;
    }
    var body = '';
    res.on('data', function(chunk){
      body += chunk;
    });
    res.on('end', function(){
      callback(body);
    });
  });
}
