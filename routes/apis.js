require('../lib/db');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Blog = mongoose.model('Blog');
var Comment = mongoose.model('Comment');
var Admin = mongoose.model('Admin');
var qs = require('qs');

//使用者登入確認
router.post('/admin', function (req, res, next) {
    Admin.find(function (err, admins) {
        if (err) {
            res.send("Failure");
        } else {
            if(admins[0].Username === req.body.Username && admins[0].Password === req.body.Password){
                res.send("Success");
                console.log(req.body.Username);
                console.log(req.body.Password);
            }else{
                res.send("Failure");
                console.log('Failure');
            }
        }
    });
});

// 新增一組帳密
// router.get('/admin',function(req,res,next){
//     new Admin({
//         Username:'Rock',
//         Password:'1234',
//     }).save(function(err){
//         if(err){
//             console.log('Failure')
//             res.send('Failure');
//         }else{
//             console.log('Success');
//             res.send('Success');
//         }
//     });
// });

//顯示全部文章
router.get('/show', function(req, res, next) {
    res.locals.username = req.session.name;
    res.locals.authenticated = req.session.logined;
    Blog.find(function(err,blogs,count){
        if(err){
            res.send(err);
        }else{
            res.send(blogs);
        }
    });
  });

router.get('/setmessage',function(req,res,next){
    Comment.find(function(err,comments,count){
        if(err){
            res.send(err);
        }else{
            res.send(comments);
        }
    });
});

router.post('/updatebackend',function(req,res,next) {
    var blog =req.body.posts;
    var comment = req.body.comments;
    Blog.deleteMany(function(err){
        if(err){
            console.log('Fail to delete Blog');
        } else {
            console.log('delete Blog');
            Blog.insertMany(blog,(err) => {
                if(err){
                    console.log('Fail to save Blog');
                }else{
                    console.log('save Blog');
                }
            });
        }
    });
    Comment.deleteMany(function(err){
        if(err){
            console.log('Fail to delete database');
        } else {
            console.log('delete Comment');
            Comment.insertMany(comment,function(err){
                if(err){
                    console.log('Fail to save comment');
                    res.send('Failure');
                }else{
                    console.log('save comment');
                    res.send('Success');
                }
            })
        }
    });
});

/* 使用者刪除文章功能. */
router.get('/delete/:id', function (req, res, next) {
    Blog.deleteOne({ id: req.params.id }, function (err) {
        if (err) {
            console.log('Fail to delete article');
            res.send("Failure");
        } else {
            console.log('Done');
            res.send("Success");
        }
    });
    Comment.deleteMany({ MessageID: req.params.id }, function (err) {
        if (err) {
            console.log('Fail to delete message');
        } else {
            console.log('Message Delete');
        }
    });
});
/* 使用者新增文章功能. */
router.post('/add', function (req, res, next) {
    new Blog({
        Username: req.body.Name,
        Article: req.body.Content,
        CreateDate: Date.now()
    }).save(function (err) {
        if (err) {
            console.log('Fail to save to DB');
            res.send('Failure');
            return;
        }
        console.log('Save to DB');
        res.send('Success');
    });
});

/* 使用者更新文章功能. */
router.post('/update/:id', function (req, res, next) {
    if (!req.params.id) {
        res.send("Failure");
        console.log("Failure");
        return;
    }
    Blog.updateOne({ _id: req.params.id },{$set:{ Username: req.body.Title, Article: req.body.Content}}, function (err) {
        if (err) {
            console.log('Fail to update article');
            res.send("Failure");
        } else {
            console.log('Done');
            res.send("Success");
        }
    });
});

// 搜尋留言
router.get('/message/:id', function(req, res, next){
        if (!req.params.id) {
            res.send('Failure');
            return;
        }
        Comment.find({ MessageID: req.params.id }, function( err, comments, count ){
        if (err){
            res.send(err);
        }else{
            res.send(comments.reverse());
        }
      });
});

/* 文章留言功能. */
router.post('/comment/:id', function (req, res, next) {
    if (!req.params.id) {
        res.redirect('/');
        return;
    }
    new Comment({
        Vistor: req.body.Vistor,
        Comment: req.body.Comment,
        MessageID: req.params.id,
        CreateDate: Date.now()
    }).save(function (err) {
        if (err) {
            console.log('Fail to save DB');
            res.send('Failure');
            return;
        }
        console.log('Save to DB');
        res.send('Success');
    });
});

//留言刪除功能
router.get('/deleteMessage/:id', function (req, res, next) {
    if (!req.params.id) {
        console.log('Failure');
        res.send('Failure');
        return
    }
    Comment.remove({ _id: req.params.id }, function (err) {
        if (err) {
            console.log('Fail to delete comment');
            res.send('Failure');
        } else {
            console.log('Done');
            res.send('Success');
        }
    });
})

module.exports = router;

