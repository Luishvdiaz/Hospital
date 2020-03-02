const express = require('express');
const router = express.Router();
const alert = ('alert-node');
const pool = require('../database');
const {isloggedIn} = require('../lib/auth');
const helpers = require('../lib/helpers');

router.get('/',isloggedIn, async (req, res)=>{
    const links = await pool.query('SELECT * FROM usuarios;');
    res.render('users/list', {links});
});

router.get('/add',isloggedIn, async (req, res) =>{
    const tipo=req.user.tipo;
    if(tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
            const links = await pool.query('SELECT * FROM usuarios;');
            req.flash('message', 'Usted no cuenta con permisos para hacer esto');
            res.render('users/list', {links});
            req.flash('message', 'Usted no cuenta con permisos para hacer esto');
    }else{
        const doctores=await pool.query('SELECT a.id_doctor, a.nombre FROM doctores a, usuarios b WHERE b.doctor!=a.id_doctor;');
        res.render('users/add', {doctores});
    }
});


router.get('/delete/:id',isloggedIn, async (req, res) => {
    const { id } = req.params;
    const tipo=req.user.tipo;

    console.log("tipo del usaurio: ", tipo)

    const dele = await pool.query('SELECT tipo FROM usuarios WHERE id = ?;', [id]);
    // console.log(dele)
    const max_s=JSON.stringify(dele);

    const le=max_s.length ;
    // var cant = 0;
    // console.log(max_s,le)
    if(le==25){
        var cant=12;
    }
    if(le==20){
        var cant=7;
    }
    if(le==19){
        var cant=6;
    }
    // const ide=user.id;
    const vari= max_s.substr(10, cant);
    // console.log(vari, 'ID= ', ide)
    if(vari=="Gerente"){
        req.flash('message', 'Este usuario no se puede eliminar');
    }else{
        if(tipo!="Gerente"){
            req.flash('message', 'Usted no cuenta con permisos para hacer eso');
        }else{
            await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
            req.flash('message', 'Usuario eliminado correctamente');
            res.redirect('/users');
        }
            
    }
    res.redirect('/users');
});


router.post('/add', isloggedIn, async (req, res) => {
    // const {fullname}=req.body;
    // const {username}=req.body;
    const tipo = req.body.tipo;
    const doctor = req.body.doctor;

    const {fullname, username, password}=req.body;

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

    if(doctor==0){
        const result = await pool.query('INSERT INTO usuarios SET ?', newUser);
        await pool.query('UPDATE usuarios SET doctor=NULL WHERE tipo="Gerente" OR tipo="Farmacéutico";');
        // newUser.id = result.insertId;
        // return done(null, newUser);
    }
    if(doctor!=0){
        const result = await pool.query('INSERT INTO usuarios SET ?', newUser2);
        await pool.query('UPDATE usuarios SET doctor=NULL WHERE tipo="Gerente" OR tipo="Farmacéutico";');
        // newUser2.id = result.insertId;
        // return done(null, newUser2);
    }
    req.flash('message', 'Usuario guardado correctamente');
    res.redirect('/users');
});


module.exports = router;