const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const router = express.Router();
const Comment = require('../models/comments');
const Room = require('../models/room');
const Emoji = require('../models/emoji');
var sentiment = require('sentiment');

var r1 = sentiment('Cats are crap.');
console.dir(r1);        // Score: -2, Comparative: -0.666

var r2 = sentiment('Cats are totally amazing!');
console.dir(r2);        // Score: 4, Comparative: 1

router.get('/', (req, res) => {
    res.render('index', { user : req.user });
});

router.get('/emoji/:emo', (req, res) => {
   
   console.log(req.params,'dog',  req.query)
   let obj = {
    happy: {'sentiment.score':-1},
    sad: {'sentiment.score':1},
    likes: {'likes':-1},
    dislikes: {'dislikes':-1},
   }
   let secondObj = {
    
    }
    let skip = 0; 
    let previous = `no previous results`
    let next = `the end`
    req.query.skip ?  skip = Number(req.query.skip) : skip = 0;

    //let skip = Number(req.query.skip)+1 || 0
    //let next = `<a href="?skip=${skip}" class="next">Next &raquo;</a>`
    //let previous = `<a href="#" class="previous">&laquo; Previous</a>`
    Comment.find({roomId:req.params.emo}).sort(obj[req.query.sort]).limit().skip(skip).exec().then(comments => {
  // Comment.find({roomId:req.params.emo}).sort(obj[req.query.sort]).limit(3).skip().exec().then(comments => { 
            if (skip + 1 < comments.length + skip){
                next = `<a href="?skip=${skip + 1}" class="next">Next &raquo;</a>` 
            }
            if (skip - 1 >= 0){
                previous = `<a href="?skip=${skip - 1}" class="previous">&laquo; Previous</a>`   
            }   
                
            res.render('emo', {emotion: req.params.emo, user: req.user, comments: comments, skip: skip, next: next, previous: previous});
    
    }).catch(err => {throw err })
})

 let emoObj = { 
        '-7': '<g-emoji class="g-emoji" alias="sob" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f62d.png">😭</g-emoji>',
        '-6': '<g-emoji class="g-emoji" alias="cold_sweat" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f630.png">😰</g-emoji>',
        '-5': '<g-emoji class="g-emoji" alias="fearful" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f628.png">😨</g-emoji>',
        '-4': '<g-emoji class="g-emoji" alias="rage" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f621.png">😡</g-emoji>',
        '-3': '<g-emoji class="g-emoji" alias="angry" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f620.png">😠</g-emoji>',
        '-2': '<g-emoji class="g-emoji" alias="confounded" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f616.png">😖</g-emoji>',
        '-1': '<g-emoji class="g-emoji" alias="worried" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f61f.png">😟</g-emoji>',
        '0': '<g-emoji class="g-emoji" alias="expressionless" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f611.png">😑</g-emoji>',
        '1': '<g-emoji class="g-emoji" alias="smirk" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f60f.png">😏</g-emoji>',
        '2': '<g-emoji class="g-emoji" alias="relaxed" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/263a.png">☺️</g-emoji>',
        '3': '<g-emoji class="g-emoji" alias="kissing_heart" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f618.png">😘</g-emoji>',
        '4': '<g-emoji class="g-emoji" alias="smiley" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f603.png">😃</g-emoji>',
        '5': '<g-emoji class="g-emoji" alias="laughing" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f606.png">😆</g-emoji>',
        '6': '<g-emoji class="g-emoji" alias="star" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/2b50.png">⭐️</g-emoji>',
        '7': '<g-emoji class="g-emoji" alias="raised_hands" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f64c.png">🙌</g-emoji>',
    }



router.post('/emoji/:emo', isLoggedIn, (req, res) => { 
    let comment = new Comment(req.body)
    comment.owner = req.user._id
    comment.date = new Date()
    comment.roomId = req.params.emo
    console.log(sentiment(req.body.comment))
    

    comment.sentiment = sentiment(req.body.comment)
    comment.sentiment.html = emoObj[String(comment.sentiment.score)]

    comment.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('back');
    });

})

/* 
get comments from data base to show on page 

I will need to write a mongo query inbetween lines 13 and 16 for the get emoji/:emo request. 

I will need to take the results of that query and pass it into the render on line 15.

I will have to go to emo.hbs and write an each loop to display each comment like i did on profile.hbs page.

*/



























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
        res.redirect('/');
    });
});

router.post('/comment', isLoggedIn, (req, res) => {
    console.log(req.body)
    let comment = new Comment(req.body)
    comment.owner = req.user._id
    comment.date = new Date()
    comment.name = req.body.comment
    comment.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/profile');
    });

    
})
router.post('/emoji', isLoggedIn, (req, res) => {
    console.log(req.body)
    let emoji = new Emoji(req.body)
    emoji.owner = req.user._id
    emoji.date = new Date()
    emoji.save((err) => {
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
