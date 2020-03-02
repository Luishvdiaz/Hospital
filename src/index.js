const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlstore = require('express-mysql-session');
const passport = require('passport');

const {database}=require('./keys');


//inicializaciones
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main', 
    layoutsDir:  path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');


//middlewares
app.use(session({
    secret: 'faztmysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new mysqlstore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

//variables globales
app.use((req, res, next) =>{
    app.locals.success= req.flash('success');
    app.locals.success= req.flash('message');
    app.locals.user = req.user;
    next();
})



//rutas
app.use(require('./routes'));
app.use(require('./routes/aunthentication'));
app.use('/links', require('./routes/links'));
app.use('/pacientes', require('./routes/pacientes'));
app.use('/doctores', require('./routes/doctores'));
app.use('/horario', require('./routes/horario'));
app.use('/citas', require('./routes/citas'));
app.use('/recetas', require('./routes/recetas'));
app.use('/users', require('./routes/users'));

//archivos publicos
app.use(express.static(path.join(__dirname, 'public')));



//empezar servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto ', app.get('port'));
})
