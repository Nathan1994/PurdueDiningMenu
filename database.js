const mysql  = require('mysql');

// function saveItem(item) {
//
//   var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'password',
//     database : 'PurdueDining'
//   });
//
//
//   connection.connect();
//   var udid = '';
//   var name = '';
//   let querySQL = 'INSERT INTO item (id,name) VALUES ("' + item.ID +'","' +  item.Name +
//   '") ON DUPLICATE KEY UPDATE name=VALUES(name);';
//
//   connection.query(querySQL, function (error, results, fields) {
//     console.log(querySQL);
//     if (error) throw error;
//     // console.log('The solution is: ', error);
//   });
//
//   connection.end();
// }

function saveItems(items) {
  var querySQLs = [];
  for (var i = 0; i < items.length; i++) {
    let querySQL = 'INSERT INTO item (id,name) VALUES ("' + items[i].ID +'","' +  items[i].Name +
    '") ON DUPLICATE KEY UPDATE name=VALUES(name);';
    querySQLs.push(querySQL);
  }
  connect(function(connection){
    for (var i = 0; i < querySQLs.length; i++) {
      console.log(querySQLs[i]);
      connection.query(querySQLs[i], function (error, results, fields) {
        if (error) throw error;
        // console.log('The solution is: ', error);
      });
    }
  });
}

function queryFavouriteItemsByUser(userId, complete) {
  let querySQL = 'SELECT item_id FROM person_item WHERE person_id =' + userId + ';'
  connect(function(connection){
    connection.query(querySQL, function (error, results, fields) {
      if (error) throw error;
      var itemIds = [];
      for (var i = 0; i < results.length; i++) {
        itemIds.push(results[i].item_id);
      }
      complete(itemIds)
    });
  });
}

function connect(query) {
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'password',
    database : 'PurdueDining'
  });

  connection.connect();

  query(connection);

  connection.end();
}

module.exports.saveItems = saveItems;
module.exports.queryFavouriteItemsByUser = queryFavouriteItemsByUser;
