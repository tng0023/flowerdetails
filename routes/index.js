var express = require('express');
var router = express.Router();

router.post('/addflower', function(req,res,next){
  req.db.collection('flowers').insertOne(req.body,function(err){
    if(err){
      return next(err);
    }
    return res.redirect('/');
  });
});

router.get('/details/:flower', function(req,res){
  req.db.collection('flowers').findOne({'name': req.params.flower}, function(err,doc){
    if(err){
      return next(err); //500 error
    }
    if(!doc){
      return next(); //creates 404 error
    }
    return res.render('flower_details',{'flower' : doc});
  });
});

//GET home page
router.get('/', function(req, res, next){

  req.db.collection('flowers').distinct('color',function(err, colorDocs){
    if(err){
      return next(err)
    }

    if(req.query.color_filter){

      req.db.collection('flowers').find({'color':req.query.color_filter}).toArray(function(err,docs){
        if(err){
          return next(err);
        }
        return res.render('all_flowers', {'flowers': docs,'colors': colorDocs, 'color_filter': req.query.color_filter});
    });
} else {
    req.db.collection('flowers').find().toArray(function(err, docs){
      if (err){
        return next(err);
      }
      return res.render('all_flowers', {'flowers': docs,'colors': colorDocs});
    });
  }
  });
});

module.exports = router;
