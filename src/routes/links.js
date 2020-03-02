const express = require('express');
const router = express.Router();
const alert = ('alert-node');
const pool = require('../database');
const {isloggedIn} = require('../lib/auth');


router.get('/add',isloggedIn, (req, res) =>{
    const tipo=req.user.tipo;
    console.log(tipo)
    if(tipo=="Doctor"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/links');
    }else{
        res.render('links/add');
    }
});







router.get('/surtir',isloggedIn, async (req, res) =>{
    const tipo=req.user.tipo;
    if(tipo=="Doctor"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/links');
    }else{
        const max = await pool.query('SELECT MAX(id_receta) FROM recetas;');
    const max_s=JSON.stringify(max);

    const le=max_s.length ;
    if(le==22){
        men=1;
    }
    if(le==23){
        men=2;
    }
    if(le==24){
        men=3;
    }
    if(le==25){
        men=4;
    }
    if(le==26){
        men=5;
    }
    const le1=max_s.length - men;
    const dife=le-le1;
    const vari= max_s.substr(19, dife);
    // console.log('largo',le, '\nlargo -2:',le1, '\nvalor',vari)

    const num = await pool.query('SELECT id_receta FROM recetas;');
    for(var i=1;i<=vari;i++){

    }
    const p1 = await pool.query('SELECT DISTINCT rece.receta, prod.id_producto, prod.nombre_producto, prod.cantidad "cantidad_i", rece.cantidad FROM recetas re, productos_receta rece, productos prod WHERE  prod.id_producto=rece.producto AND re.id_receta=rece.receta;');
    // console.log(num, productos)

    res.render('links/surtir', {p1});
    }
    
    
});

 












router.get('/confirm/:id_receta',isloggedIn, async (req, res) =>{
    const { id_receta } = req.params;
    const num = await pool.query('SELECT p.nombre_producto, p.cantidad , pr.cantidad "reducir" FROM productos p, recetas r, productos_receta pr WHERE pr.receta=r.id_receta AND pr.producto=p.id_producto AND r.id_receta = ?;', [id_receta]);
    res.render('links/confirm', {num}); 
});
router.post('/confirm/:id_receta', isloggedIn,async (req, res) => {
    const {id_receta} = req.params;
    const {reducir} = req.params;
    console.log(id_receta, reducir);
    await pool.query('UPDATE productos SET cantidad = (cantidad - ?) WHERE id_producto = ?', [reducir, id_receta]);
    req.flash('message', 'Productos surtidos correctamente');
    res.redirect('/links');
});
 
router.post('/add', isloggedIn,async (req, res) => {
    
    const {nombre_producto, cantidad, tipo, tamano}=req.body;
    const newLink={
        nombre_producto,
        cantidad, 
        tipo, 
        tamano
    };
    await pool.query('INSERT INTO productos SET ?', [newLink]);
    req.flash('message', 'Producto guardado correctamente');
    res.redirect('/links');
});



router.get('/',isloggedIn, async (req, res)=>{
    const links = await pool.query('SELECT * FROM productos;');
    const links_buscar = await pool.query('SELECT * FROM productos LIMIT 1;');
    res.render('links/list', {links, links_buscar});
    //res.json({ok: 'ok'});
});





router.get('/delete/:id_producto',isloggedIn, async (req, res) => {
    const tipo=req.user.tipo;
    if(tipo=="Doctor"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
    }else{
        const { id_producto } = req.params;
        await pool.query('DELETE FROM productos WHERE id_producto = ?', [id_producto]);
        req.flash('message', 'Producto eliminado correctamente');
    }
    res.redirect('/links');
});  

router.get('/surtir/receta,id_producto,cantidad',isloggedIn,async (req, res) => {
    console.log('ENTRA EN SURTIR')
    const {receta} = req.params.receta;
    const {cantidad} = req.params.cantidad;
    console.log(receta, cantidad);
    await pool.query('UPDATE productos SET cantidad = (cantidad - ?) WHERE id_producto = ?', [cantidad, receta]);
    req.flash('message', 'Productos surtidos correctamente');
    res.redirect('/links/surtir');
}); 

router.get('/edit/:id_producto',isloggedIn, async (req, res) => {
    const tipo=req.user.tipo;
    if(tipo=="Doctor"){
        req.flash('message', 'Usted no cuenta con permisos para hacer esto');
        res.redirect('/links');
    }else{
        const { id_producto } = req.params;
        console.log('id producto', id_producto)
        const link = await pool.query('SELECT * FROM productos WHERE id_producto = ? ', [id_producto]);
        res.render('links/edit', {link: link[0]});
    }
    
});

router.post('/edit/:id_producto', isloggedIn, async (req, res) =>{
    const {id_producto} = req.params;
    const {nombre_producto, cantidad, tipo, tamano} = req.body;
    const nuevoProducto={
        nombre_producto, 
        cantidad, 
        tipo, 
        tamano
    };
    console.log(nuevoProducto.nombre_producto, nuevoProducto.cantidad, nuevoProducto.tipo, nuevoProducto.tamano, 'ID= ', id_producto);
 
    const id = id_producto;
    const id_sub= id.substr(1,id.length);

    await pool.query('UPDATE productos SET nombre_producto= ?, cantidad = ?, tipo= ?, tamano= ?  WHERE id_producto = ?', [nuevoProducto.nombre_producto, nuevoProducto.cantidad, nuevoProducto.tipo, nuevoProducto.tamano, id_sub]);
    req.flash('message', 'Producto guardado correctamente');
    res.redirect('/links');
    req.flash('message', 'Producto guardado correctamente');
    //res.redirect('/links');
});

// router.post('/search/:nombre', isloggedIn, async (req, res) =>{
//     const {nombre} = req.params;
//     var sub=nombre.substr(1,nombre.length);
//     console.log('Nombre a buscar=', sub);
//     const links = await pool.query('SELECT * FROM productos WHERE nombre_producto = ?;', [sub]);
//     res.redirect('/links/list', links);
// });









module.exports = router;