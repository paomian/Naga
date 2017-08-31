'use strict';
var router = require('express').Router();
var AV = require('leanengine');

var Words = AV.Object.extend('Words');

// 查看个人资料
router.get('/profile', function(req, res) {
  // 判断用户是否已经登录
  if (req.currentUser) {
    // 如果已经登录，发送当前登录用户信息。
    res.send(req.currentUser);
  } else {
    // 没有登录，跳转到登录页面。
    res.redirect('/login');
  }
});

// 登出账号
router.get('/logout', function(req, res) {
  req.currentUser.logOut();
  res.clearCurrentUser(); // 从 Cookie 中删除用户
  res.redirect('/profile');
});

router.get('/', function(req, res) {
  res.render('register', {
    title: 'register'
  });
});

router.post('/register', function(req, res) {
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;

  var user = new AV.User();
  user.setUsername(username);
  user.setPassword(password);
  user.setEmail(email);
  user.signUp().then(function (loginedUser) {
    console.log('xxxxxxxxxxxxx');
    //console.log(loginedUser);
    res.render('login', {
      title: 'Login'
    });
  }, function (error) {
    console.log(error.message);
    res.render('register', {
      title: 'register'
    });
  }).catch(function (error) {
    console.log(error);
  });
});

router.get('/login', function(req, res) {
  res.render('login', {
    title: 'login'
  });
});

router.post('/login', function(req, res) {
  AV.User.logIn(req.body.username, req.body.password).then(function(user) {
    res.saveCurrentUser(user); // 保存当前用户到 Cookie
    res.redirect('/profile'); // 跳转到个人资料页面
  }, function(error) {
    //登录失败，跳转到登录页面
    res.redirect('/login');
  });
});

router.get('/words', function (req, res) {
  res.render('add_wrod',{
    
  });
});

router.post('/words', function (req, res) {
  if (req.currentUser) {
    console.log(req.currentUser);
  } else {
    console.log("hello");
  }
});

// 新增 Todo 项目
router.post('/', function(req, res, next) {
  var content = req.body.content;
  var todo = new Todo();
  todo.set('content', content);
  todo.save().then(function(todo) {
    res.redirect('/todos');
  }).catch(next);
});

module.exports = router;
