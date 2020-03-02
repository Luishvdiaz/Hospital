CREATE DATABSE bd_hospital;

use bd_hospital;

create table if not exists horario(
	id_horario int not null auto_increment primary key,
	dia VARCHAR(10) NOT NULL,
	entrada VARCHAR(10) not null,
	salida VARCHAR(10) not null) ENGINE=InnoDB;

create table if not exists doctores(
	id_doctor int not null auto_increment primary key,
	nombre VARCHAR(50) not null,
	cedula VARCHAR(50) not null,
	especalidad VARCHAR(7) not null,
	telefono VARCHAR(15) not null,
	email VARCHAR(100) not null,
	direccion VARCHAR(255) not null,
	ciudad VARCHAR(50) not null,
	horario int,
	foreign key (horario) references horario(id_horario) on delete SET NULL)ENGINE=InnoDB;

create table if not exists pacientes(
	id_paciente int not null auto_increment primary key,
	no_seguro VARCHAR(9) not null,
	nombre VARCHAR(100) not null,
	estatura float,
	peso float,
	edad int not null,
	genero boolean,
	tipo_sangre VARCHAR(2) not null,
	fecha_nacimiento DATE,
	alergias VARCHAR(255) not null,
	padecimientos VARCHAR(255) not null,
	no_contacto VARCHAR(11) not null) ENGINE=InnoDB;

create table if not exists recetas(
	id_receta int not null auto_increment primary key,
	paciente int,
	doctor int,
	producto int,
	fecha DATETIME,
	foreign key (paciente) references pacientes(id_paciente) on delete SET NULL,
	foreign key (doctor) references doctores(id_doctor) on delete SET NULL) ENGINE=InnoDB;

create table if not exists usuarios(
	id_usuario int not null auto_increment primary key,
	nombre VARCHAR(50) not null,
	contrasena VARCHAR(50) not null,
	tipo VARCHAR(50) not null,
	doctor int,
	foreign key (doctor) references doctores(id_doctor) on delete SET NULL)ENGINE=InnoDB;

create table if not exists productos(
	id_producto int not null auto_increment primary key,
	nombre VARCHAR(255) not null,
	cantidad int NOT NULL,
	tipo VARCHAR(100) not null,
	tamano VARCHAR(100) not null) ENGINE=InnoDB;

create table if not exists productos_receta(
	id_producto_receta int not null auto_increment primary key,
	receta int,
	producto int,
	administracion VARCHAR(255) NOT NULL,
	foreign key (receta) references recetas(id_receta) on delete SET NULL,
	foreign key (producto) references productos(id_producto) on delete SET NULL)ENGINE=InnoDB;

create table if not exists historial_paciente(
	id_hostorial_paciente int not null auto_increment primary key,
	paciente int,
	fecha DATE,
	comentarios VARCHAR(255) not null,
	diagnostico VARCHAR(255) not null,
	foreign key (paciente) references pacientes(id_paciente) on delete SET NULL)ENGINE=InnoDB;

create table if not exists citas(
	id_cita int not null auto_increment primary key,
	doctor int,
	paciente int,
	hora_fecha DATETIME,
	foreign key (paciente) references pacientes(id_paciente) on delete SET NULL,
	foreign key (doctor) references doctores(id_doctor) on delete SET NULL)ENGINE=InnoDB;
