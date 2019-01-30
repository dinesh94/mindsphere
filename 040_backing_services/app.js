var express = require('express');
var app = express();
var mongoUtils = require('./mongoUtilities');
var cfenv = require("cfenv");
var appEnv = cfenv.getAppEnv();

app.use(express.static(__dirname));

var pretty = require('express-prettify');
app.use(pretty({ query: 'pretty' }));

var port = appEnv.port || 6016;

// call <url>/write?data=foo&assetId=foo
app.get("/write", function(req, res, next) {
    var queryData = undefined;
    var queryAssetId = undefined;
    if(req.query.data){
        // replace %20 with space
        queryData = req.query.data.replace(/%20/g, ' ');
    }
    if(req.query.assetId){
        // replace %20 with space
        queryAssetId = req.query.assetId.replace(/%20/g, ' ');
    }
        
    var db = mongoUtils.getDatabaseHandle();
    var data = {
        // if no data parameter is passed use "No Data"
        assetId: queryAssetId || 'No Data',
        data: queryData || 'No Data',
        time: new Date()
    };
    db.mycollection.insert(data);
    res.json(data);
});

// call <url>/get/<asset ID>
app.get("/get/:assetId", function(req, res, next) {    
    var paramAssetId = undefined;
    if(req.params.assetId){
        // replace %20 with space
        paramAssetId = req.params.assetId.replace(/%20/g, ' ');
    }

    var db = mongoUtils.getDatabaseHandle();
   
    db.mycollection.find({assetId : paramAssetId}, function(err, docs) {
        res.json(docs);
        db.close();
    });
});

app.get("/get", function(req, res, next) {
    var db = mongoUtils.getDatabaseHandle();
    db.mycollection.find({}, function(err, docs) {
        res.json(docs);
        db.close();
    });
});

app.get("/clear", function(req, res, next) {
    var db = mongoUtils.getDatabaseHandle();
    db.mycollection.remove();
    res.end();
});


app.listen(port, function() {   
    console.log('server starting on ' + port);
});