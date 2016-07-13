var express = require('express'),
    router = express.Router(),
    async = require("async"),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Trick = mongoose.model('Trick');

module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'MY TO DO TRICKS'
    });
});

router.post('/c', function (req, res, next) {
    //var user = new User(req.body);
    console.log(req.body.tricks)
    var tricks = [];
    async.each(req.body.tricks, function(trick_name, callback) { 
        console.log(trick_name)
        var trick = new Trick();
            trick.name = trick_name;
        trick.save(function(err) {
            if (err) {
                console.log(_err)
                return res.send(err);
            }

            tricks.push(trick._id);
            callback();
        });

    }, function(err) {
        
        console.log(tricks)
        var user = new User(req.body);
        user.tricks = tricks;
        user.save(function(err) {
            if (err) {
                console.log(_err)
                return res.send(err);
            }
            return res.json({
                status: "success",
                user: user._id
            });
        });
    });
});

router.get('/r/:id', function (req, res, next) {
    User
        .findOne({_id: req.params.id })
        .populate({path: 'tricks'})
        .exec(function(err, user) {
            if (err) return next(err);

            return res.render('user', {
                title: 'MY TO DO TRICKS',
                user: user
            });
    });
});

router.get('/api/add-row', function (req, res, next) {
    return res.render('inc/input-repeat', {
        
    });
});

router.post('/api/validate-row', function (req, res, next) {
    Trick
        .findOneAndUpdate(
            {_id: req.body.id },
            {status: true},
            {upsert: false, 'new': true}
        )
        .exec(function(err, trick) {
            if (err) return next(err);

            return res.json({
                status: "success",
                trick: trick
            });
        });
});