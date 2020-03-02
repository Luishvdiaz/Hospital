const express = require('express');
const router = express.Router();
const alert = ('alert-node');
const pool = require('../database');
const {isloggedIn} = require('../lib/auth');

router.get('/delete/:id_cita',isloggedIn, async (req, res) => {
    const tipo=req.user.tipo;
    if(tipo!="Doctor"||tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/citas');
    }else{
        const { id_cita } = req.params;
        const tipo=req.user.tipo;
        const id = id_cita;
        const id_sub= id.substr(1,id.length);
            await pool.query('DELETE FROM citas WHERE id_cita = ?', [id_sub]);
            req.flash('message', 'Cita eliminada correctamente');
        res.redirect('/citas');
    }
    
});


router.get('/add',isloggedIn, (req, res) =>{
    const tipo=req.user.tipo;
    if(tipo!="Doctor"||tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/citas');
    }else{
        res.render('citas/add');
    }
}); 

router.get('/', isloggedIn,async (req, res)=>{
    const id=req.user.doctor;
    const ide=JSON.stringify(id);

    const citas = await pool.query('SELECT c.id_cita, a.nombre, b.nombrep, c.tratamiento, c.fecha, c.hora  FROM doctores a, pacientes b, citas c WHERE a.id_doctor=c.doctor AND b.id_paciente=c.paciente AND c.doctor = ?;', [id]);
    
    res.render('citas/list', {citas});
});


router.get('/add/:nombre', isloggedIn,async (req, res) => {
    const tipo=req.user.tipo;
    if(tipo!="Doctor"||tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/citas');
    }else{
        const doctorp=await pool.query('SELECT id_doctor, nombre FROM doctores;');
        const pacientep=await pool.query('SELECT id_paciente, nombrep FROM pacientes;');
        console.log(doctorp, pacientep)
        res.render('citas/add', {doctorp});
    }
}); 

router.post('/add', isloggedIn,async (req, res) => {
    console.log('entra em post')
    const {doctor,paciente,tratamiento, fecha, hora}=req.body;
    const newLink={
        doctor,
        paciente,
        tratamiento, 
        fecha, 
        hora
    };
    const doctorp=await pool.query('SELECT id_doctor, nombre FROM doctores;');
    const pacientep=await pool.query('SELECT id_paciente, nombrep FROM pacientes;');
    console.log(doctorp, pacientep)
    res.render('citas/add', {doctorp});

    await pool.query('INSERT INTO citas SET ?', [newLink]);
    req.flash('message', 'Cita guardada correctamente');
    res.redirect('/citas');
});



module.exports = router;