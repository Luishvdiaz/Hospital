-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.4.12-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win32
-- HeidiSQL Versión:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para bd_hospital
CREATE DATABASE IF NOT EXISTS `bd_hospital` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `bd_hospital`;

-- Volcando estructura para tabla bd_hospital.citas
CREATE TABLE IF NOT EXISTS `citas` (
  `id_cita` int(11) NOT NULL AUTO_INCREMENT,
  `doctor` int(11) DEFAULT NULL,
  `paciente` int(11) DEFAULT NULL,
  `tratamiento` varchar(255) DEFAULT NULL,
  `fecha` varchar(10) DEFAULT NULL,
  `hora` varchar(5) NOT NULL,
  PRIMARY KEY (`id_cita`),
  KEY `paciente` (`paciente`),
  KEY `doctor` (`doctor`),
  CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE SET NULL,
  CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`doctor`) REFERENCES `doctores` (`id_doctor`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_hospital.doctores
CREATE TABLE IF NOT EXISTS `doctores` (
  `id_doctor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `cedula` varchar(8) NOT NULL,
  `especialidad` varchar(50) NOT NULL,
  `telefono` varchar(12) NOT NULL,
  `email` varchar(100) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `ciudad` varchar(50) NOT NULL,
  `horario` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_doctor`),
  KEY `horario` (`horario`),
  CONSTRAINT `doctores_ibfk_1` FOREIGN KEY (`horario`) REFERENCES `horario` (`id_horario`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_hospital.historial_paciente
CREATE TABLE IF NOT EXISTS `historial_paciente` (
  `id_historial_paciente` int(11) NOT NULL AUTO_INCREMENT,
  `paciente` int(11) DEFAULT NULL,
  `fecha` varchar(19) DEFAULT NULL,
  `comentarios` varchar(255) NOT NULL,
  `diagnostico` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_historial_paciente`),
  KEY `paciente` (`paciente`),
  CONSTRAINT `historial_paciente_ibfk_1` FOREIGN KEY (`paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_hospital.horario
CREATE TABLE IF NOT EXISTS `horario` (
  `id_horario` int(11) NOT NULL AUTO_INCREMENT,
  `dia` varchar(200) NOT NULL,
  `entrada` varchar(10) NOT NULL,
  `salida` varchar(10) NOT NULL,
  PRIMARY KEY (`id_horario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_hospital.pacientes
CREATE TABLE IF NOT EXISTS `pacientes` (
  `id_paciente` int(11) NOT NULL AUTO_INCREMENT,
  `nombrep` varchar(100) NOT NULL,
  `no_seguro` varchar(9) NOT NULL,
  `estatura` float DEFAULT NULL,
  `peso` float DEFAULT NULL,
  `edad` int(11) NOT NULL,
  `genero` varchar(9) DEFAULT NULL,
  `tipo_sangre` varchar(4) NOT NULL,
  `fecha_nacimiento` varchar(10) DEFAULT NULL,
  `alergias` varchar(255) DEFAULT NULL,
  `padecimientos` varchar(255) NOT NULL,
  `no_contacto` varchar(12) NOT NULL,
  `doctor` int(255) NOT NULL,
  PRIMARY KEY (`id_paciente`)
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_hospital.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(255) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `tamano` varchar(100) NOT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_hospital.productos_receta
CREATE TABLE IF NOT EXISTS `productos_receta` (
  `id_producto_receta` int(11) NOT NULL AUTO_INCREMENT,
  `producto` int(11) DEFAULT NULL,
  `cantidad` int(255) NOT NULL,
  `receta` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_producto_receta`),
  KEY `producto` (`producto`),
  KEY `receta` (`receta`),
  CONSTRAINT `productos_receta_ibfk_1` FOREIGN KEY (`producto`) REFERENCES `productos` (`id_producto`) ON DELETE SET NULL,
  CONSTRAINT `productos_receta_ibfk_2` FOREIGN KEY (`receta`) REFERENCES `recetas` (`id_receta`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_hospital.recetas
CREATE TABLE IF NOT EXISTS `recetas` (
  `id_receta` int(11) NOT NULL AUTO_INCREMENT,
  `paciente` int(11) DEFAULT NULL,
  `doctor` int(11) DEFAULT NULL,
  `fecha_hora` varchar(19) DEFAULT NULL,
  PRIMARY KEY (`id_receta`),
  KEY `paciente` (`paciente`),
  KEY `doctor` (`doctor`),
  CONSTRAINT `recetas_ibfk_1` FOREIGN KEY (`paciente`) REFERENCES `pacientes` (`id_paciente`) ON DELETE SET NULL,
  CONSTRAINT `recetas_ibfk_2` FOREIGN KEY (`doctor`) REFERENCES `doctores` (`id_doctor`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_hospital.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla bd_hospital.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(50) NOT NULL,
  `tipo` varchar(12) DEFAULT NULL,
  `doctor` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para vista bd_hospital.vista_citas
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_citas` (
	`id_cita` INT(11) NOT NULL,
	`nombre` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`nombrep` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`tratamiento` VARCHAR(255) NULL COLLATE 'utf8_general_ci',
	`fecha` VARCHAR(10) NULL COLLATE 'utf8_general_ci',
	`hora` VARCHAR(5) NOT NULL COLLATE 'utf8_general_ci'
) ENGINE=MyISAM;

-- Volcando estructura para vista bd_hospital.vista_doctores
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_doctores` (
	`id_doctor` INT(11) NOT NULL,
	`nombre` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`cedula` VARCHAR(8) NOT NULL COLLATE 'utf8_general_ci',
	`especialidad` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`telefono` VARCHAR(12) NOT NULL COLLATE 'utf8_general_ci',
	`email` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`direccion` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`ciudad` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`dia` VARCHAR(200) NOT NULL COLLATE 'utf8_general_ci',
	`entrada` VARCHAR(10) NOT NULL COLLATE 'utf8_general_ci',
	`salida` VARCHAR(10) NOT NULL COLLATE 'utf8_general_ci'
) ENGINE=MyISAM;

-- Volcando estructura para vista bd_hospital.vista_doctores2
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_doctores2` (
	`id_doctor` INT(11) NOT NULL,
	`nombre` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`cedula` VARCHAR(8) NOT NULL COLLATE 'utf8_general_ci',
	`especialidad` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`telefono` VARCHAR(12) NOT NULL COLLATE 'utf8_general_ci',
	`email` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`direccion` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`ciudad` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`horario` INT(11) NULL,
	`dia` VARCHAR(200) NOT NULL COLLATE 'utf8_general_ci',
	`entrada` VARCHAR(10) NOT NULL COLLATE 'utf8_general_ci',
	`salida` VARCHAR(10) NOT NULL COLLATE 'utf8_general_ci'
) ENGINE=MyISAM;

-- Volcando estructura para vista bd_hospital.vista_historial
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_historial` (
	`id_historial_paciente` INT(11) NOT NULL,
	`paciente` INT(11) NULL,
	`nombrep` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`fecha` VARCHAR(19) NULL COLLATE 'utf8_general_ci',
	`comentarios` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`diagnostico` VARCHAR(255) NULL COLLATE 'utf8_general_ci'
) ENGINE=MyISAM;

-- Volcando estructura para vista bd_hospital.vista_pacientes
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_pacientes` (
	`id_paciente` INT(11) NOT NULL,
	`nombrep` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`no_seguro` VARCHAR(9) NOT NULL COLLATE 'utf8_general_ci',
	`estatura` FLOAT NULL,
	`peso` FLOAT NULL,
	`edad` INT(11) NOT NULL,
	`genero` VARCHAR(9) NULL COLLATE 'utf8_general_ci',
	`tipo_sangre` VARCHAR(4) NOT NULL COLLATE 'utf8_general_ci',
	`fecha_nacimiento` VARCHAR(10) NULL COLLATE 'utf8_general_ci',
	`alergias` VARCHAR(255) NULL COLLATE 'utf8_general_ci',
	`padecimientos` VARCHAR(255) NOT NULL COLLATE 'utf8_general_ci',
	`no_contacto` VARCHAR(12) NOT NULL COLLATE 'utf8_general_ci',
	`doctor` INT(255) NOT NULL,
	`nombre` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci'
) ENGINE=MyISAM;

-- Volcando estructura para vista bd_hospital.vista_recetas
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `vista_recetas` (
	`id_receta` INT(11) NOT NULL,
	`nombrep` VARCHAR(100) NOT NULL COLLATE 'utf8_general_ci',
	`doctor` INT(11) NULL,
	`nombre` VARCHAR(50) NOT NULL COLLATE 'utf8_general_ci',
	`fecha_hora` VARCHAR(19) NULL COLLATE 'utf8_general_ci'
) ENGINE=MyISAM;

-- Volcando estructura para disparador bd_hospital.historial_paciente_cita
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `historial_paciente_cita` BEFORE INSERT ON `citas` FOR EACH ROW BEGIN
	INSERT INTO historial_paciente SET paciente = (SELECT MAX(id_paciente) FROM pacientes), fecha = NOW(), comentarios = 'Cita agendada', diagnostico= '';
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Volcando estructura para disparador bd_hospital.historial_paciente_creado
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER `historial_paciente_creado` AFTER INSERT ON `pacientes` FOR EACH ROW BEGIN
	INSERT INTO historial_paciente SET paciente = (SELECT MAX(id_paciente) FROM pacientes), fecha = NOW(), comentarios = 'Paciente registrado/dado de alta', diagnostico= '';
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Volcando estructura para vista bd_hospital.vista_citas
-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_citas`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_citas` AS select `c`.`id_cita` AS `id_cita`,`a`.`nombre` AS `nombre`,`b`.`nombrep` AS `nombrep`,`c`.`tratamiento` AS `tratamiento`,`c`.`fecha` AS `fecha`,`c`.`hora` AS `hora` from ((`doctores` `a` join `pacientes` `b`) join `citas` `c`) where ((`a`.`id_doctor` = `c`.`doctor`) and (`b`.`id_paciente` = `c`.`paciente`) and (`c`.`doctor` = 10)) ;

-- Volcando estructura para vista bd_hospital.vista_doctores
-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_doctores`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_doctores` AS select `a`.`id_doctor` AS `id_doctor`,`a`.`nombre` AS `nombre`,`a`.`cedula` AS `cedula`,`a`.`especialidad` AS `especialidad`,`a`.`telefono` AS `telefono`,`a`.`email` AS `email`,`a`.`direccion` AS `direccion`,`a`.`ciudad` AS `ciudad`,`b`.`dia` AS `dia`,`b`.`entrada` AS `entrada`,`b`.`salida` AS `salida` from (`doctores` `a` join `horario` `b`) where (`a`.`horario` = `b`.`id_horario`) ;

-- Volcando estructura para vista bd_hospital.vista_doctores2
-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_doctores2`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_doctores2` AS select `a`.`id_doctor` AS `id_doctor`,`a`.`nombre` AS `nombre`,`a`.`cedula` AS `cedula`,`a`.`especialidad` AS `especialidad`,`a`.`telefono` AS `telefono`,`a`.`email` AS `email`,`a`.`direccion` AS `direccion`,`a`.`ciudad` AS `ciudad`,`a`.`horario` AS `horario`,`b`.`dia` AS `dia`,`b`.`entrada` AS `entrada`,`b`.`salida` AS `salida` from (`doctores` `a` join `horario` `b`) where (`a`.`horario` = `b`.`id_horario`) ;

-- Volcando estructura para vista bd_hospital.vista_historial
-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_historial`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_historial` AS select `b`.`id_historial_paciente` AS `id_historial_paciente`,`b`.`paciente` AS `paciente`,`a`.`nombrep` AS `nombrep`,`b`.`fecha` AS `fecha`,`b`.`comentarios` AS `comentarios`,`b`.`diagnostico` AS `diagnostico` from (`pacientes` `a` join `historial_paciente` `b`) where (`a`.`id_paciente` = `b`.`paciente`) ;

-- Volcando estructura para vista bd_hospital.vista_pacientes
-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_pacientes`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_pacientes` AS select `b`.`id_paciente` AS `id_paciente`,`b`.`nombrep` AS `nombrep`,`b`.`no_seguro` AS `no_seguro`,`b`.`estatura` AS `estatura`,`b`.`peso` AS `peso`,`b`.`edad` AS `edad`,`b`.`genero` AS `genero`,`b`.`tipo_sangre` AS `tipo_sangre`,`b`.`fecha_nacimiento` AS `fecha_nacimiento`,`b`.`alergias` AS `alergias`,`b`.`padecimientos` AS `padecimientos`,`b`.`no_contacto` AS `no_contacto`,`b`.`doctor` AS `doctor`,`a`.`nombre` AS `nombre` from (`doctores` `a` join `pacientes` `b`) where (`b`.`doctor` = `a`.`id_doctor`) ;

-- Volcando estructura para vista bd_hospital.vista_recetas
-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `vista_recetas`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_recetas` AS select distinct `a`.`id_receta` AS `id_receta`,`p`.`nombrep` AS `nombrep`,`a`.`doctor` AS `doctor`,`d`.`nombre` AS `nombre`,`a`.`fecha_hora` AS `fecha_hora` from (((`recetas` `a` join `doctores` `d`) join `pacientes` `p`) join `productos_receta` `pr`) where ((`d`.`id_doctor` = `a`.`doctor`) and (`p`.`id_paciente` = `a`.`paciente`)) order by `a`.`id_receta` ;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
