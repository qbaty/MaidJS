var https   = require("https"),
    http    = require("http"),
    fs      = require("fs"),
    sys     = require("sys"),
    url     = require("url"),
    path    = require("path"),
    conf    = require('./conf'),
    mines   = require('./mineTypes'),
    rewrite = conf.rewrite;

var readConfig = function(path){
  var json = require(path);
  var rules = {};
  for(var i in json){
      if(json[i]['files']){
          var obj = json[i]['files']
          for(var j in obj){
              rules[j] = obj[j];
          }
      }
  }
  return rules;
};
//format Config
var packRule = {
  js : readConfig(conf.package_js),
  css : readConfig(conf.package_css)
};

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

      fs.writeFile(fileRoot + fileName, content, {encoding : 'binary'});
      console.log('Renew :' + fileRoot + fileName);
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
          fileName = pathname.replace(/^\/.*(?:\/)/,'');
          rewriteFlag = true;
          break;
      }
  }
 
   
  if(!rewriteFlag){
    fileRoot = conf.root + pathname.replace(/[^\/]?[\w\.]*[^\/]$/g,'');
    fileName = pathname.replace(/\/([\w-]+\/)*/,'');
  }
  console.log('fileRoot : ====' + fileRoot);

  //default visit
  fileName = fileName ? fileName : 'index.html';
  var ext = path.extname(fileName);
  ext = ext ? ext.slice(1) : 'unknown';

  console.log( "==You redirectTo : " + fileRoot + fileName );

  if(fileRoot.indexOf('http') != 0){
    console.log(ext, mines[ext]);
    if(mines[ext]){
      res.writeHead(200, {'Content-Type': (mines[ext] || "text/plain")});  
    }

    fileRoot = fileRoot || 'index.html';
    res.write(getFile(fileName, fileRoot, ext), 'binary');
    res.end('');
  }else{
    getHTTPRequest(fileRoot + fileName, function(data){console.log(ext, mines[ext]);
      if(mines[ext]){
        res.writeHead(200, {'Content-Type': (mines[ext] || "text/plain")});  
      }
      res.write(data.body, 'binary');
      res.end();
    });
  }

  console.log('>>>>>Pathname : ' + pathname + ' == End<<<<<<< \n');
}

//server listening
http.createServer(responseFunction).listen(80);
console.log('Server start & listening to port :80/' + '\n');

if(conf.srckey){
  //server listening
  https.createServer({
    key : conf.srckey.key,
    cert : conf.srckey.cert
  }, responseFunction).listen(443);
  console.log('Server start & listening to port :443/');
}
