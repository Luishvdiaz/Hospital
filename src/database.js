const mysql = require('mysql');
const { promisify }= require('util');

const { database } = require('./keys');

const pool = mysql.createPool(database);


pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.log('CONEXION BASE DE DATOS PERDIDA');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.log('DEMASIADAS CONEXIONES CON LA DB');
        }
        if(err.code === 'ENCONNREFUSED'){
            console.log('CONEXION CON DB RECHAZADA');
        }
        if(err.code === 'ER_ACCESS_DENIED_ERROR'){
            console.log('CONEXION DENEGADA');
        }
    }
    if(connection) {
        console.log('CONECTADO');
        connection.release();
    }
    return;
});

//promisify pool querys
pool.query=promisify(pool.query);
module.exports=pool;
