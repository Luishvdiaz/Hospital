const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('./helpers');


const express = require('express');
const router = express.Router();


passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done)=>{

const rows1=await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
  if(rows1.length > 0){
    const user = rows1[0];
    const validpassword = await helpers.matchPassword(password, user.password);
    if(validpassword){
      done(null, user, req.flash('message','Bienvenido ', user.username));
    }else{
      done(null, false, req.flash('message','Contraseña incorrecta'));
    }
  }else{
    return done(null, false, req.flash('message','El usuario no existe'));
  }
}));

// router.get('/signup', async (req, res) =>{
//   const doctores = await pool.query('SELECT id_doctor, nombre FROM doctores;');
//   console.log('ENTRA')
//   res.render('/signup', {doctores});
// });


passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, username, password, done) => {
  const {fullname}=req.body;
  const tipo = req.body.tipo;
  const doctor = req.body.doctor;


  let newUser={
    username, 
    password,
    fullname,
    tipo
  }

  let newUser2={ 
    username, 
    password,
    fullname,
    tipo,
    doctor
  }

  
  newUser.password = await helpers.encryptPassword(password);
  newUser2.password = await helpers.encryptPassword(password);
  console.log('Doctor= ',doctor)
  if(doctor==0){
    const result = await pool.query('INSERT INTO usuarios SET ?', newUser);
    await pool.query('UPDATE usuarios SET doctor=NULL WHERE tipo="Gerente" OR tipo="Farmacéutico";');
    newUser.id = result.insertId;
    return done(null, newUser);
  }
  if(doctor!=0){
    const result = await pool.query('INSERT INTO usuarios SET ?', newUser2);
    await pool.query('UPDATE usuarios SET doctor=NULL WHERE tipo="Gerente" OR tipo="Farmacéutico";');
    newUser2.id = result.insertId;
    return done(null, newUser2);
  }

  
}));


passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done) =>{
  const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
  
  try{
  done(null, rows[0]);
  }catch(e){
    console.log('Error: ', e);
  }
});
