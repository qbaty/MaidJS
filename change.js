var fs = require('fs');
var pathname = './conf/conf';
var data;
fs.watch(pathname, function (event, filename) {
  console.log('event is: ' + event);
  if (filename) {
    console.log('filename provided: ' + filename);
    data = require(pathname);
  } else {
    console.log('filename not provided');
  }
});

module.exports = data;