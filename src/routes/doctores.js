const express = require('express');
const router = express.Router();
const alert = ('alert-node');
const pool = require('../database');
const {isloggedIn} = require('../lib/auth');


router.get('/add',isloggedIn, async (req, res) =>{
    // console.log('ENTRA¡');
    const tipo=req.user.tipo;
    if(tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/doctores');
        
    }else{
        const horarios = await pool.query('SELECT * FROM horario;');
        res.render('doctores/add', {horarios});
    }
        
});

router.get('/', isloggedIn,async (req, res)=>{
    const doc = await pool.query('SELECT * FROM vista_doctores;');
    res.render('doctores/list', {doc});
    //res.json({ok: 'ok'});
});  

 
router.post('/add', isloggedIn,async (req, res) => {
    const {nombre, cedula, especialidad, telefono,email,direccion,ciudad}=req.body;
    
    const {number} = req.body;
    // const numeros = await pool.query('SELECT id_horario FROM horario;');
    // const largo=numeros.length;
    // console.log(largo, numeros[2])
    // const num = numeros[2];
    // const id = num;
    // const id_sub= id.substr(1,id.length);
    // console.log(largo, id_sub)

    // for(var x;x<=largo;x++){
    //     if(number!=numeros[x]){
    //         console.log('El ID es válido')
    //     }else{
    //         console.log('El ID NO es válido')
    //         res.redirect('/add');
    //         req.flash('message', 'Número de horario no válido');
    //     }
    // }

    const newdoc={
        nombre,
        cedula, 
        especialidad, 
        telefono,
        email,
        direccion,
        ciudad
    };
    // console.log(number)
    
    await pool.query('INSERT INTO doctores SET nombre = ?, cedula = ?, especialidad = ?, telefono = ?, email = ?, direccion = ?, ciudad = ?, horario = ?', [newdoc.nombre, newdoc.cedula, newdoc.especialidad, newdoc.telefono, newdoc.email, newdoc.direccion, newdoc.ciudad, number]);
    req.flash('message', 'Doctor guardado correctamente');
    res.redirect('/doctores');
});


router.get('/delete/:id_doctor',isloggedIn, async (req, res) => {
    const { id_doctor } = req.params;
    const tipo=req.user.tipo;
    // console.log('xasasas',id_doctor)

    const id = id_doctor;
    const id_sub= id.substr(1,id.length);

    if(tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        // console.log('xd',id_sub)
        
    }else{
        await pool.query('DELETE FROM doctores WHERE id_doctor = ?', [id_sub]);
        req.flash('message', 'Doctor eliminado correctamente');
    }
    res.redirect('/doctores');
    
});
 


router.get('/edit/:id_doctor', isloggedIn,async (req, res) => {
    const tipo=req.user.tipo;
    if(tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/doctores');
        
    }else{
        const { id_doctor } = req.params;
        console.log(id_doctor)
        const id = id_doctor;
        const id_sub= id.substr(1,id.length);
        console.log('id del doctor',id_sub)
        const horario= await pool.query('SELECT * FROM vista_doctores2 WHERE id_doctor = ? ', [id_doctor]);
        const horarios = await pool.query('SELECT * FROM horario;');
        const hor = await pool.query('SELECT * FROM horario;');
        const vista = await pool.query('SELECT dia, entrada, salida FROM vista_doctores WHERE id_doctor = ?', [id_doctor]);
        res.render('doctores/edit', {horario: horario[0], vista, horarios, hor});
    }
    
});

router.post('/edit/:id_doctor',  isloggedIn,async (req, res) =>{
    // const { id_doctor } = req.params;
    const { id_doctor } = req.params;
    const {nombre, cedula, especialidad, telefono,email,direccion,ciudad}=req.body;
    const {hor} = req.body;

    const newdoc={
        nombre,
        cedula, 
        especialidad, 
        telefono,
        email,
        direccion,
        ciudad
    };
    // const { id_doctor } = req.params;
    console.log('ID doctor = ',id_doctor)
    const id = id_doctor;
    const id_sub= id.substr(1,id.length);
    console.log('id del doctor',id_sub)
    // console.log(number.trim()); 
    console.log([newdoc.nombre, newdoc.cedula, newdoc.especialidad, newdoc.telefono, newdoc.email, newdoc.direccion, newdoc.ciudad, hor, id_sub]);
    await pool.query('UPDATE doctores SET nombre= ?, cedula = ?, especialidad= ?, telefono= ?, email = ?, direccion = ?, ciudad = ?, horario = ?  WHERE id_doctor = ?', [newdoc.nombre, newdoc.cedula, newdoc.especialidad, newdoc.telefono, newdoc.email, newdoc.direccion, newdoc.ciudad, hor, id_sub]);
    
    res.redirect('/doctores');
    req.flash('message', 'Doctor guardado correctamente');
});

router.get('/cita/:id_doctor',isloggedIn,async (req, res) => {
    const { id_doctor } = req.params;
    const num=id_doctor;
    const num1=num.substr(1,num.length)
    // console.log(num.length, num, num.substr(1,num.length))
    var query='SELECT nombre, id_doctor FROM doctores WHERE id_doctor = '+num1+';';
    var query2='SELECT nombrep, id_paciente FROM pacientes;';
    const doctores = await pool.query(query);
    const pacientes = await pool.query(query2);
    res.render('/doctores/cita', {doctores, pacientes});
});

router.post('/cita/', isloggedIn,async(req, res) =>{
    // const {id_paciente} = req.params;
    const {doctor, paciente, tratamiento, fecha, hora}=req.body;
    // const {paciente}=req.params;
    const nuevoPaciente={
        doctor,
        paciente,
        tratamiento, 
        fecha, 
        hora
    }; 
    console.log(nuevoPaciente)
    const cadena=nuevoPaciente.doctor;
    let posicion = cadena.indexOf(':');
    const id_numero=cadena.substr(0,posicion);
    await pool.query('INSERT INTO citas (doctor, paciente, tratamiento, fecha, hora) VALUES ( ?, ?, ? , ?, ?);', [id_numero, nuevoPaciente.paciente, nuevoPaciente.tratamiento, nuevoPaciente.fecha, nuevoPaciente.hora]);
    req.flash('message', 'Cita guardada correctamente');
    res.redirect('/doctores');
});
module.exports = router;