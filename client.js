const https = require('https');

let dinings = ['Earhart', 'Ford', 'Hillenbrand', 'Wiley', 'Windsor'];
let foodKeywords = ['beef', 'steak'];

let baseURL = 'https://api.hfs.purdue.edu/menus/v2/locations/';

for (var j = 0; j < 6; j++) {
  for (var i = 0; i < dinings.length; i++) {

    let today = new Date();
    today.setDate(today.getDate() + j)
    findKeywordBy(dinings[i], today);
  }
}

function findKeywordBy(diningName, date) {
  let dateStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
  let URL = baseURL + diningName + '/' + dateStr;

  getRequest(URL, function (body) {
    for (var index in foodKeywords) {
      let keyword = foodKeywords[index];
      if(body.toLowerCase().indexOf(keyword) > -1) {
        console.log(URL);
      }
    }
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
