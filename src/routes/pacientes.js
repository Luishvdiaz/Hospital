const express = require('express');
const router = express.Router();
const alert = ('alert-node');
const pool = require('../database');
const {isloggedIn} = require('../lib/auth');


router.get('/add',isloggedIn, (req, res) =>{
    const tipo=req.user.tipo;
    if(tipo!="Doctor"||tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/citas');
    }else{
        res.render('pacientes/add');
    }
});

router.post('/add', isloggedIn,async (req, res) => {
    const {nombrep, no_seguro, estatura, peso, edad, fecha_nacimiento, alergias, padecimientos, no_contacto}=req.body;
    const { id_paciente } = req.params;
    const tipo_sangre = req.body.tipo;
    const genero = req.body.genero;
    const diagnostico = req.body.diagnostico;

    const newpaciente={
        nombrep,
        no_seguro, 
        estatura,
        peso, 
        edad,
        genero,
        tipo_sangre,
        fecha_nacimiento, 
        alergias, 
        padecimientos,
        no_contacto
    };
    // console.log(diagnostico);
    await pool.query('INSERT INTO pacientes SET ?', [newpaciente]);
    if(diagnostico.length <= 0){
        console.log('Diagnostico vacío')
    }else{
        // console.log('Diagnostico NO vacío', diagnostico, id_paciente)
        const ide = await pool.query('SELECT paciente FROM historial_paciente ORDER BY paciente DESC limit 1;');
        const idd=ide[0].paciente;
        const diag=("'"+diagnostico+"'");
        var n = idd.toString();
        console.log(diag, n);
        // await pool.query('UPDATE historial_paciente SET diagnostico = ? WHERE paciente = ?', [diag], [n]);
    }
    // console.log('Se insertó el paciente')
    req.flash('message', 'Paciente guardado correctamente');
    res.redirect('/pacientes');
});




router.get('/', isloggedIn,async (req, res)=>{
    const id=req.user.doctor;

    const pacientes = await pool.query('SELECT * FROM vista_pacientes WHERE doctor = ?;', [id]);
    res.render('pacientes/list', {pacientes});
    
});

router.get('/delete/:id_paciente', isloggedIn,async (req, res) => {
    const tipo=req.user.tipo;
    if(tipo!="Doctor"||tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/citas');
    }else{
        const { id_paciente } = req.params;
        await pool.query('DELETE FROM pacientes WHERE id_paciente = ?', [id_paciente]);
        req.flash('message', 'Paciente eliminado correctamente');
        res.redirect('/pacientes');
    }
    
});



router.get('/edit/:id_paciente', isloggedIn,async (req, res) => {
    const tipo=req.user.tipo;
    if(tipo!="Doctor"||tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/citas');
    }else{
        const { id_paciente } = req.params;
        // console.log('ID paciente = ',id_paciente)
        const link = await pool.query('SELECT * FROM pacientes WHERE id_paciente = ? ', [id_paciente]);
        
        // console.log('link = ',link)
        res.render('pacientes/edit', {link: link[0]});
    }
});

router.post('/edit/:id_paciente', isloggedIn, async (req, res) =>{
    const {id_paciente} = req.params;
    const {nombre, no_seguro, estatura, peso, edad, genero, tipo_sangre, fecha_nacimiento, alergias, padecimientos, no_contacto,}=req.body;
    const nuevoPaciente={
        nombre,
        no_seguro, 
        estatura,
        peso, 
        edad,
        genero,
        tipo_sangre,
        fecha_nacimiento, 
        alergias, 
        padecimientos,
        no_contacto
    };
    
    const id = id_paciente;
    const id_sub= id.substr(1,id.length);

    await pool.query('UPDATE pacientes SET nombrep = ?, no_seguro = ?, estatura= ?, peso = ?, edad = ?, genero = ?, tipo_sangre = ?, fecha_nacimiento = ?, alergias = ?, padecimientos = ?, no_contacto = ?  WHERE id_paciente = ?', [nuevoPaciente.nombre, nuevoPaciente.no_seguro, nuevoPaciente.estatura, nuevoPaciente.peso, nuevoPaciente.edad, nuevoPaciente.genero, nuevoPaciente.tipo_sangre, nuevoPaciente.fecha_nacimiento, nuevoPaciente.alergias, nuevoPaciente.padecimientos, nuevoPaciente.no_contacto, id_sub]);
    req.flash('message', 'Paciente guardado correctamente');
    res.redirect('/pacientes');
});


// router.get('/search/:nombre', async (req, res) => {
//     const { nombrep} = req.params;
//     console.log(nombre)
//     await pool.query('SELECT * FROM pacientes WHERE nombrep= ? ', [nombre]);
//     res.redirect('/pacientes');
// });





router.get('/historial/:id_paciente',isloggedIn, async (req, res) => {
    const tipo=req.user.tipo;
    if(tipo!="Doctor"||tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/citas');
    }else{
        const { id_paciente } = req.params;
        const { nombre } = req.params;
        console.log('ID paciente =  ',id_paciente)
        const num=id_paciente;
        var query='SELECT * FROM vista_historial WHERE paciente = '+num+';';
        var query2='SELECT nombrep FROM vista_historial WHERE paciente = '+num+' LIMIT 1;';
        // console.log(query)
        const link = await pool.query(query);
        const nombre_vista = await pool.query(query2);
        console.log('nombre = ',nombre_vista)
        res.render('pacientes/historial', {link, nombre_vista});
    }
});





router.get('/cita/:id_paciente', isloggedIn,async (req, res) => {
    const tipo=req.user.tipo;
    if(tipo!="Doctor"||tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/citas');
    }else{
        const { id_paciente } = req.params;
        const num=id_paciente;
        var query='SELECT nombrep, id_paciente FROM pacientes WHERE id_paciente = '+num+';';
        var query2='SELECT nombre, id_doctor FROM doctores;';
        const link = await pool.query(query);
        const link2 = await pool.query(query2);
        res.render('pacientes/cita', {link, link2});
    }
});

router.post('/cita', isloggedIn,async(req, res) =>{
    const tipo=req.user.tipo;
    if(tipo!="Doctor"||tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/citas');
    }else{
        const {doctor, paciente, tratamiento, fecha, hora}=req.body;
        const nuevoPaciente={
            doctor,
            paciente,
            tratamiento, 
            fecha, 
            hora
        };
        // console.log(nuevoPaciente.paciente)
        const cadena=nuevoPaciente.paciente;
        let posicion = cadena.indexOf(':');
        const id_numero=cadena.substr(0,posicion);
        // console.log('ID= ', id_numero);
        await pool.query('INSERT INTO citas (doctor, paciente, tratamiento, fecha, hora) VALUES ( ?, ?, ? , ?, ?);', [nuevoPaciente.doctor, id_numero, nuevoPaciente.tratamiento, nuevoPaciente.fecha, nuevoPaciente.hora]);
        req.flash('message', 'Cita guardada correctamente');
        res.redirect('/pacientes');
    }
});
 



module.exports = router;