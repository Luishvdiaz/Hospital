const express = require('express');
const router = express.Router();
const pool = require('../database');

const passport = require('passport');
const {isloggedIn, isNotLoggedIn}=require('../lib/auth');


router.get('/signup', isNotLoggedIn, async (req, res) =>{
  const doctores=await pool.query('SELECT a.id_doctor, a.nombre FROM doctores a, usuarios b WHERE b.doctor!=a.id_doctor;');
  res.render('auth/signup', {doctores});
})

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res)=>{
  res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next)=>{
  passport.authenticate('local.signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

router.get('/profile', isloggedIn, (req, res)=>{
  res.render('profile');
  
;})


router.get('/logout', isloggedIn, (req, res)=>{
  req.logOut();
  res.redirect('/signin');
})
module.exports = router;