let dinings = ['Earhart', 'Ford', 'Hillenbrand', 'Wiley', 'Windsor'];
let baseURL = 'https://api.hfs.purdue.edu/menus/v2/locations/';
let nextDayToQuery = 12;

var urls = [];

for (var j = 0; j < nextDayToQuery; j++) {
  for (var i = 0; i < dinings.length; i++) {
    let today = new Date();
    today.setDate(today.getDate() + j)
    let dateStr = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let url = baseURL + dinings[i] + '/' + dateStr;
    urls.push(url);
  }
}
module.exports.urls = urls;
