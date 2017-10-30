const client = require('./client.js');
const item = require('./item.js');
const database = require('./database.js');
const diningURL = require('./diningURL.js');

refreshItems();

function refreshItems() {
  var index = 0;
  var items = [];

  requstItems(items, index);
}

function requstItems(items, i) {
  if (i === diningURL.urls.length) {
    database.saveItems(items);
    return;
  }
  client.getRequest(diningURL.urls[i], function(response){
    let json = JSON.parse(response);
    for (var mealIndex in json.Meals) {
      let meal = json.Meals[mealIndex];
      for (var stationIndex in meal.Stations) {
        let station = meal.Stations[stationIndex];
        for (var itemIndex in station.Items) {
          let itemJSON  = station.Items[itemIndex];
          let itemObject = item.toObject(itemJSON);
          items.push(itemObject);
        }
      }
    }
    requstItems(items, ++i);
  });
}
