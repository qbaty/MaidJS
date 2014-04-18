var https   = require("https"),
    http    = require("http"),
    fs      = require("fs"),
    sys     = require("sys"),
    url     = require("url"),
    path    = require("path"),
    mines   = require('./refer/mineTypes');


var conf = require('./confReader');
var options = {};

//get local file content
var getFile = function(fileName, fileRoot, suffix){
  var content = '';
  var rules = packRule[suffix] || {};
  if(fileName in rules){
      var filelist = rules[fileName];
      for(var i = 0; i < filelist.length; i++){
          if(filelist[i] in rules){
              content += getFile(filelist[i], fileRoot, suffix);
          }else{
              console.log('==Found :' + fileRoot + filelist[i]);
              try{
                content += fs.readFileSync(fileRoot + filelist[i],'binary');
              }catch(e){
                console.log(e);
              }
          }
      }
  }else{
      if(fs.existsSync(fileRoot + fileName)){
          console.log('==Found :' + fileRoot + fileName);
          try{
            content += fs.readFileSync(fileRoot + fileName,'binary');
          }catch(e){
            console.log(e);
          }
      }else{
          content = fileRoot + fileName + " No Founded!\n";
      }
  }
  return content;
};

var getHTTPRequest = function(requestUrl, callback){
  var urlData = url.parse(requestUrl);
  var request = http.createClient(80, urlData.host).
  request('GET', urlData.pathname, {
    "host": urlData.host
  });

  request.on('response', function(response){
    var type = response.headers["content-type"],
        body = "";
    response.setEncoding('binary');
    response.on('end', function() {
      var data = {
          type: type,
          body: body
      };
      callback(data);
    });
    response.on('data', function(chunk) {
       if (response.statusCode == 200) body += chunk;
    });
  });

  request.end();
};

var responseFunction = function(req, res) {
  var pathname = url.parse(req.url).pathname;
  var fileName = "";
  var fileRoot = "";
  var fileContent = "";
  var rewriteFlag = false;

  console.log('>>>>>Pathname : ' + pathname + ' == Begin<<<<<<<');

  for(var rule in rewrite){
      if(pathname.match(new RegExp(rule))){
          fileRoot = pathname.replace(new RegExp(rule), rewrite[rule]).replace(/(.*\/).*/, '$1');
          fileName = pathname.replace(/.*\/(.*\.\w*)/,'$1');
          rewriteFlag = true;
          break;
      }
  }
  
  if(!rewriteFlag){
    fileRoot = conf.root + pathname.replace(/[^\/]?[\w-]+\.\w+|[^\/]$/,'');
    fileName = pathname.replace(/\/([\w-]+\/)*/,'');
  }

  //default visit
  fileName = fileName ? fileName : 'index.html';
  var ext = path.extname(fileName);
  ext = ext ? ext.slice(1) : 'unknown';

  console.log( "==You redirectTo : " + fileRoot + fileName );

  if(fileRoot.indexOf('http') != 0){
    if(mines[ext]){
      res.writeHead(200, {'Content-Type': (mines[ext] || "text/plain")});  
    }

    fileRoot = fileRoot || 'index.html';
    res.write(getFile(fileName, fileRoot, ext), 'binary');
    res.end('');
  }else{
    getHTTPRequest(fileRoot + fileName, function(data){
      if(mines[ext]){
        res.writeHead(200, {'Content-Type': (mines[ext] || "text/plain")});  
      }
      res.write(data.body, 'binary');
      res.end();
    });
  }

  console.log('>>>>>Pathname : ' + pathname + ' == End<<<<<<< \n');
};

var response = function(req, res) {
  console.log(req);
};

// server listening
// console.log('Server start & listening to port :443/');
// https.createServer(options, response).listen(443);

//server listening
console.log('Server start & listening to port :80/' + '\n');
http.createServer(response).listen(80);
