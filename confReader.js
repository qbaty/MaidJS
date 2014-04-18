var confPath = './conf/conf';
var fs       = require('fs'),
    config   = require(confPath);

var read = function(pathName){
  var packInfo = require(pathName);
  var rules = {};
  for(var i in packInfo){
      if(packInfo[i]['files']){
          var obj = packInfo[i]['files']
          for(var j in obj){
              rules[j] = obj[j];
          }
      }
  }
  return rules;
};

var scan = function(){
  var obj, root, jspack, csspack, key, cert;
  var conf = {};

  for(var proj in config){
    conf[proj] = {};
    conf[proj]['pack'] = {};
    conf[proj]['srckey'] = {};

    obj = config[proj];
    for(k in obj){
      if(k != 'srckey' || k != 'pack' || k != 'rewrite'){
        conf[proj][k] == obj[k];  
      }else
    }

    root = obj.root || '';
    conf[proj]['pack'].js = read(root + obj.package_js);
    conf[proj]['pack'].css = read(root + obj.package_css);
    conf[proj]['srckey'].key = fs.readFileSync(root + obj.srckey['key']);
    conf[proj]['srckey'].cert = fs.readFileSync(root + obj.srckey['cert']);
  }
  return 
};


module.exports = (function(){
  return {
    scan : scan
  };
})();