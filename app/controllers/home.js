var express = require('express'),
    _app,
    router = express.Router(),
    async = require("async"),
    mongoose = require('mongoose'),
    mailer = require('../lib/mailer'),
    User = mongoose.model('User'),
    Trick = mongoose.model('Trick');

module.exports = function (app) {
    _app = app;
    app.use('/', router);
};

router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'TO DO TRICKS'
    });
});

router.post('/c', function (req, res, next) {
    var tricks = [];
    async.each(req.body.tricks, function(trick_name, callback) { 
        
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
        
        var user = new User(req.body);
        user.tricks = tricks;
        user.save(function(err) {
            if (err) {
                console.log(_err)
                return res.send(err);
            }
            
            var body = req.body;
            body.url = _app.locals.root_url+"/r/"+user._id;

            var o = {
                email: req.body.email,
                subject: "YOUR TO DO TRICKS",
                body: body,
            }
            console.log(o)
            sendEmail(res, 'tdt', o, function(__err, success){
                if(__err){
                    console.log(__err)
                    throw new Error('Problem sending email to: ' + o.body.email);
                }

                return res.json({
                    status: "success",
                    user: user._id
                });
            });
        });
    });
});

router.post('/u/:id', function (req, res, next) {
    var tricks = [];
    async.each(req.body.tricks, function(trick, callback) { 
        console.log(trick)
        Trick
            .findOneAndUpdate(
                {_id: trick.id },
                {status: trick.status[0], name: trick.name[0] },
                {upsert: false, 'new': true}
            )
            .exec(function(err, _trick) {
                if (err) return next(err);

                console.log(_trick.status)
                tricks.push(_trick._id);

                callback();
            });
        

    }, function(err) {

    
        User
            .findOneAndUpdate(
                {_id: req.params.id },
                {tricks: tricks}
                //{upsert: false, 'new': true}
            )
            .exec(function(err, user) {
                if (err) return next(err);

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

router.get('/api/all', function (req, res, next) {
    User
        .find()
        .populate({path: 'tricks'})
        .exec(function(err, users) {
            if (err) return next(err);

            return res.json(users);
    });
});

router.get('/api/add-row', function (req, res, next) {
    return res.render('inc/input-repeat', {
        
    });
});

router.get('/api/add-row-update', function (req, res, next) {
    var trick = new Trick();
    trick.save(function(err) {
        if (err) {
            console.log(_err)
            return res.send(err);
        }

        return res.render('inc/input-repeat-update', {
            trick: trick
        });
    });
    
});

router.post('/api/validate-row', function (req, res, next) {
    console.log(req.body)
    Trick
        .findOneAndUpdate(
            {_id: req.body.id },
            {status: req.body.status},
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

router.get('/email/:id', function (req, res, next) {
    User
        .findOne({_id: req.params.id })
        .populate({path: 'tricks'})
        .exec(function(err, user) {
            if (err) return next(err);
            user.url = "Your TODOTRICKS is here"
            return res.render('emails/tdt', {
                title: 'MY TO DO TRICKS',
                body: user
            });
    });
});

function sendEmail(res, template, o, cb){
    res.render('emails/'+template, {
        body:o.body,
        fb_url: o.fb_url,
    }, function(err, html) {
        if (err) {
            console.log(err)
        }

        mailer.sendMail(o.email, o.subject, html, function(err, success){
            if(err){
                throw new Error('Problem sending email to: ' + o.to);
            }

            cb(err,success)
        });

    });
}