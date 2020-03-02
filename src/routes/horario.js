const express = require('express');
const router = express.Router();
const alert = ('alert-node');
const pool = require('../database');
const {isloggedIn} = require('../lib/auth');

router.get('/add',isloggedIn, (req, res) =>{
    res.render('horario/add');
});
 
router.post('/add', isloggedIn,async (req, res) => {
    const {dia, entrada, salida}=req.body;
    const newhor={
        dia,
        entrada, 
        salida
    };
    await pool.query('INSERT INTO horario SET ?', [newhor]);
    req.flash('message', 'Horario guardado correctamente');
    res.redirect('/horario');
});
 
router.get('/', isloggedIn,async (req, res)=>{
    const horarios = await pool.query('SELECT * FROM horario;');
    res.render('horario/list', {horarios});
    //res.json({ok: 'ok'});
});


router.get('/delete/:id_horario', isloggedIn,async (req, res) => {
    const { id_horario } = req.params;
    await pool.query('DELETE FROM horario WHERE id_horario = ?', [id_horario]);
    req.flash('message', 'Horario eliminado correctamente');
    res.redirect('/horario');
    
});


router.get('/edit/:id_horario', isloggedIn,async (req, res) => {
    const { id_horario } = req.params;
    const horario = await pool.query('SELECT * FROM horario WHERE id_horario = ? ', [id_horario]);
    res.render('horario/edit', {horario: horario[0]});
});

router.post('/edit/:id_horario', isloggedIn,async (req, res) =>{
    const {id_horario} = req.params;
    const {dia, entrada, salida} = req.body;
    const nuevoProducto={
        dia, 
        entrada, 
        salida
    };
 
    const id = id_horario;
    const id_sub= id.substr(1,id.length);

    await pool.query('UPDATE horario SET dia= ?, entrada = ?, salida= ? WHERE id_horario = ?', [nuevoProducto.dia, nuevoProducto.entrada, nuevoProducto.salida, id_sub]);
    
    res.redirect('/horario');
    req.flash('message', 'Horario guardado correctamente');
    //res.redirect('/horarios');
});





module.exports = router;


