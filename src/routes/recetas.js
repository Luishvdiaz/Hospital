const express = require('express');
const router = express.Router();
const alert = ('alert-node');
const pool = require('../database');
const {isloggedIn} = require('../lib/auth');

router.get('/add',isloggedIn, async (req, res) =>{
    const tipo=req.user.tipo;
    if(tipo!="Doctor"||tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/recetas');
    }else{
        const doctores = await pool.query('SELECT id_doctor, nombre FROM doctores;');
        const pacientes = await pool.query('SELECT id_paciente, nombrep FROM pacientes;');
        const medicamentos = await pool.query('SELECT id_producto, nombre_producto FROM productos;');
        res.render('recetas/add', {doctores, pacientes, medicamentos});
    }
});

router.post('/add',isloggedIn, async (req, res) => {
    const {paciente, doctor, medicamento1, cantidad1, medicamento2, cantidad2, medicamento3, cantidad3, medicamento4, cantidad4, medicamento5, cantidad5, indicaciones, fecha, hora}=req.body;
    const rec={
        paciente, 
        doctor
    };
    const newreceta={
        paciente, 
        doctor,
        medicamento1,
        cantidad1,
        medicamento2,
        cantidad2,
        medicamento3,
        cantidad3,
        medicamento4,
        cantidad4,
        medicamento5,
        cantidad5,
        indicaciones
    };
    const m1=newreceta.medicamento1;
    const m2=newreceta.medicamento2;
    const m3=newreceta.medicamento3;
    const m4=newreceta.medicamento4;
    const m5=newreceta.medicamento5;

    const c1=newreceta.cantidad1;
    const c2=newreceta.cantidad2;
    const c3=newreceta.cantidad3;
    const c4=newreceta.cantidad4;
    const c5=newreceta.cantidad5;

    const m1l=m1.length;
    const m2l=m2.length;
    const m3l=m3.length;
    const m4l=m4.length;
    const m5l=m5.length;

    const c1l=c1.length;
    const c2l=c2.length;
    const c3l=c3.length;
    const c4l=c4.length;
    const c5l=c5.length; 

    await pool.query('INSERT INTO recetas SET paciente= ?, doctor = ?, fecha_hora = NOW();', [rec.paciente, rec.doctor]);

    // console.log('longitudes: \n', m1l, m2l, m3l, m4l, m5l, c1l, c2l, c3l, c4l, c5l);

    if(m1l!=0){
        if(c1l!=0){
            await pool.query('INSERT INTO productos_receta SET producto = ?, cantidad = ?, receta = (SELECT MAX(id_receta) FROM recetas);', [newreceta.medicamento1, newreceta.cantidad1]);
            if(m2l!=0){
                if(c2l!=0){
                    await pool.query('INSERT INTO productos_receta SET producto = ?, cantidad = ?, receta = (SELECT MAX(id_receta) FROM recetas);', [newreceta.medicamento2, newreceta.cantidad2]);
                    if(m3l!=0){
                        if(c3l!=0){
                            await pool.query('INSERT INTO productos_receta SET producto = ?, cantidad = ?, receta = (SELECT MAX(id_receta) FROM recetas);', [newreceta.medicamento3, newreceta.cantidad3]);
                            if(m4l!=0){
                                if(c4l!=0){
                                    await pool.query('INSERT INTO productos_receta SET producto = ?, cantidad = ?, receta = (SELECT MAX(id_receta) FROM recetas);', [newreceta.medicamento4, newreceta.cantidad4]);
                                    if(m5l!=0){
                                        if(c5l!=0){
                                            await pool.query('INSERT INTO productos_receta SET producto = ?, cantidad = ?, receta = (SELECT MAX(id_receta) FROM recetas);', [newreceta.medicamento5, newreceta.cantidad5]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } 
    }
    res.redirect('/recetas');
});
  

router.get('/',isloggedIn, async (req, res)=>{
        const id=req.user.doctor;

        const recetas = await pool.query('SELECT * FROM vista_recetas WHERE doctor = ?;', [id]);
        const recetas_productos = await pool.query('SELECT DISTINCT r.id_receta, p.nombre_producto FROM productos p, productos_receta pr, recetas r WHERE pr.producto = p.id_producto AND pr.receta = r.id_receta;');
        res.render('recetas/list', {recetas, recetas_productos});
});
 
router.get('/delete/:id_receta',isloggedIn, async (req, res) => {
    const tipo=req.user.tipo;
    if(tipo!="Doctor"||tipo!="Gerente"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/recetas');
    }else{
        const { id_receta } = req.params;
        // console.log('Id receta :', id_receta)
        
        const ide=JSON.stringify(id_receta);
        const l1=ide.length-1;
        const l2=l1-2;
        // console.log('largo=', l2)
        const id_sub= ide.substr(2,l2);

        // console.log('ID del usaurio= ', id_sub, '\n',ide)
        
        await pool.query('DELETE FROM recetas WHERE id_receta = ?;', [id_sub]);
        req.flash('message', 'Receta eliminada correctamente');
        res.redirect('/recetas');
    }
        
}); 


router.get('/reporte/:id_receta',isloggedIn, async (req, res) => {
    
    const { id_receta } = req.params;
    // console.log('Id receta :', id_receta)
    const ide=JSON.stringify(id_receta);
    const l1=ide.length-1;
    const l2=l1-2;
    const id_sub= ide.substr(2,l2);

    const receta1 = await pool.query('SELECT nombrep FROM vista_recetas WHERE id_receta = ?;', [id_sub]);
    const receta2 = await pool.query('SELECT doctor FROM vista_recetas WHERE id_receta = ?;', [id_sub]);
    const receta3 = await pool.query('SELECT nombre FROM vista_recetas WHERE id_receta = ?;', [id_sub]);
    const receta4 = await pool.query('SELECT fecha_hora FROM vista_recetas WHERE id_receta = ?;', [id_sub]);
    
    //id_receta, nombrep, doctor, nombre, fecha_hora
    // console.log(receta1, '\n', receta2, '\n', receta3, '\n', receta4)
    const ide1=JSON.stringify(receta1);
    const ide2=JSON.stringify(receta2);
    const ide3=JSON.stringify(receta3);
    const ide4=JSON.stringify(receta4);
    // console.log(ide1,'\n',ide2,'\n',ide3,'\n',ide4)
    const long1=ide1.length-16;
    const long2=ide2.length-15;
    const long3=ide3.length-15;
    const g1=ide1.length;
    const g2=ide2.length;
    const g3=ide3.length;
    // console.log('Longs antes: ',g1, g2, g3)
    // console.log('Longs: ',long1, long2, long3)

    const sub11= ide1.substr(13,long1);
    const sub2= ide2.substr(11,long2);
    const sub3= ide3.substr(12,long3);
    const sub4= ide4.substr(16,19);
    // console.log(sub11)//Pacientre
    // console.log(sub3)//Doctor
    // console.log(sub4)//Fecha y hora

    const producton = await pool.query('SELECT p.nombre_producto FROM productos p, productos_receta pr WHERE pr.producto = p.id_producto AND pr.receta = ?;', [id_sub]);
    const productoc = await pool.query('SELECT pr.cantidad FROM productos p, productos_receta pr WHERE pr.producto = p.id_producto AND pr.receta = ?;', [id_sub]);
    const p1=JSON.stringify(producton);
    var cadena_se=p1.split(",");
    const longi=cadena_se.length;
    var prodNombres=[];
    var dato;

    for(var i=0;i<=longi-1;i++){
        if(i==0){
            var data=cadena_se[i].substr(21);
            var data2=data.split('"');
            prodNombres[0]=data2[0];
        }
        if( (i>0) && (i<longi)){
            var data3=cadena_se[i].substr(20);
            var data4=data3.split('"');
            prodNombres[i]=data4[0];
        }
    }

    const p11=JSON.stringify(productoc);
    var cadena_se1=p11.split(",");
    const longi1=cadena_se1.length;
    // console.log(cadena_se1[0], cadena_se1[1])
    var prodNombres1=[];
    var dato1;
    
    for(var i=0;i<=longi1-1;i++){
        if(i==0){
            var data5=cadena_se1[i].substr(13);
            var data6=data5.split('}');
            prodNombres1[0]=data6[0];
        }
        if( (i>0) && (i<longi)){
            var data7=cadena_se1[i].substr(12);
            var data8=data7.split('}');
            prodNombres1[i]=data8[0];
        }
    }
    var contenido;
    if(prodNombres1.length==2){
        var auxili=[], prodTOTAL=[];
        auxili[0]=prodNombres1[1];
        auxili[1]=prodNombres1[0];
        // console.log(prodNombres, auxili)
        prodTOTAL[0]=prodNombres[0];
        prodTOTAL[1]=auxili[0];

        prodTOTAL[2]=prodNombres[1];
        prodTOTAL[3]=auxili[1];

        
        var final='Producto: '+prodNombres[0]+' cantidad de: '+auxili[0]+'<br>Producto: '+prodNombres[1]+' cantidad de: '+auxili[1];
        console.log(final)
        contenido = '<b><h3>Receta #'+id_sub+'</h3></b></div><div><h5>A nombre de: '+sub11+'</h5></a><h5><p><b>Doctor:</b> '+sub3+'</p> <p><b>Productos recetados:<br></b>'+final+'</p> <p><b>Fecha de expedición:</b> '+sub4+' </p><br><br><p>____________________________________</p><p>____________________________________</p><p>____________________________________</p><p>____________________________________</p></h5>';
    
    }else{
        console.log(prodNombres, prodNombres1)
    }
    

    
    const p2=JSON.stringify(productoc);
    // console.log(p1,'\n',p2,'\n')
    const lp1=p1.length-24;
    const lp2=p2.length-15;
    // const g1=ide1.length;
    // const g2=ide2.length;
    const prod= p1.substr(21,lp1);
    const cant= p2.substr(13,lp2);
    // console.log(prod,'\n',cant)


    var pdf = require('html-pdf');
    var file;
    const sr=JSON.stringify(contenido);
    pdf.create(sr).toFile('../Receta_'+sub11+'.pdf', function(err, res) {
        if (err){
            console.log(err); 
        } else {
            file=JSON.stringify(res);
            
            console.log('Archivo guardado en: ',file);
        }
        
    });
    
    req.flash('message', 'Archivo guardado en escritorio');
    res.redirect('/recetas');
}); 

module.exports = router;