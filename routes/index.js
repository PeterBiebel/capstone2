const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();
const Comment = require('../models/comments');
const Room = require('../models/room');

router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

router.get('/profile', isLoggedIn, (req, res) => {
    Comment.find({owner:req.user.id}).exec().then(comments => {
        Room.find({owner:req.user.id}).exec().then(rooms => {
            res.render('profile', { user : req.user, rooms : rooms, comments : comments });
        }).catch(err => { throw err })
    }).catch(err => { throw err })

});

router.get('/room/:id', (req, res) => {
    console.log(req.params)
     Comment.find({roomId:req.params.id}).exec().then(comments => {
        Room.findById(req.params.id).exec().then(room => {
            res.render('room', { user : req.user, room : room, comments : comments });
        }).catch(err => { throw err })
    }).catch(err => { throw err })
})

router.post('/room/:id', (req, res) => { 
    let comment = new Comment(req.body)
    comment.owner = req.user._id
    comment.date = new Date()
    comment.roomId = req.params.id
    comment.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('back');
    });

})

router.post('/room', isLoggedIn, (req, res) => {
    console.log(req.body)
    let room = new Room(req.body)
    room.owner = req.user._id
    room.date = new Date()
    room.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/profile');
    });

})

router.get('/register', (req, res) => {
    res.render('register', { });
});

router.delete('/delete-comment', (req, res) => {
    console.log('delete', req.body)
    Comment.remove({_id:req.body.id}, function(err){
       res.send('deleted')
 })
})

router.put('/like-comment', (req, res) => {
    console.log('like', req.body)
    Comment.findOneAndUpdate({_id:req.body.id}, {$inc: {likes:1}}, {new: true}, function(err, doc){
        console.log(err, doc)
        res.json(doc)
    }) 
})

router.put('/dislike-comment', (req, res) => {
    console.log('dislike', req.body)
    Comment.findOneAndUpdate({_id:req.body.id}, {$inc: {dislikes:1}}, {new: true}, function(err, doc){
        console.log(err, doc)
        res.json(doc)
    }) 
     
})

router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/profile');
            });
        });
    });
});


router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/profile');
    });
});

router.post('/comment', isLoggedIn, (req, res) => {
    console.log(req.body)
    let comment = new Comment(req.body)
    comment.owner = req.user._id
    comment.date = new Date()
    comment.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/profile');
    });

    
})

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/login');
}
module.exports = router;
