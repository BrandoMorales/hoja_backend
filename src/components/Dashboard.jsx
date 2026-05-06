import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Swal from "sweetalert2";
import "react-calendar/dist/Calendar.css";
import "../styles/dashboard.css";

const LISTA_PROYECTOS = [
  "Acompañamiento Colpatria 2022 - 1",
  "Acompañamiento Colpatria 2022 - 2",
  "Acompañamiento Colpatria Covioriente",
  "Acompañamiento Habitat",
  "Acompañamiento Maria Paz",
  "Acompañamiento Pavcol Grupo 7 Calle 68",
  "Acompañamiento Puente 6 BTS",
  "Acompañamiento Transmilenio Soacha",
  "Acompañamiento de obra Colpatria - Proyecto Covioriente",
  "Acometidas sanitarias CEMSA",
  "Actualización puentes ConexNorte",
  "Aeropuerto Ernesto Cortissoz",
  "Aeropuerto San Andres y Providencia",
  "Ajuste Puente Sonacol Conexión Norte",
  "Ajuste taquillas y estaciones COE 2",
  "Alps Plaza (Palmares)",
  "Altos de la Cruz",
  "Altos de San Antonio Etapa 2",
  "Altos de San Antonio Etapa I",
  "Ampliación Edificio Mirador de Cervantes",
  "Ampliación Planta Ebel",
  "Ampliación Puente Aguas Prietas",
  "Ampliación Puente Ocoa",
  "Ampliación Ponton Arcillas de Soacha",
  "Análisis camión de carga",
  "Análisis y diseños estructurales en Caño Cristales San Jose del Guaviare",
  "Anteproyecto Rio Sinu",
  "Aruba Cideas",
  "Asesoría 3 APPs (Chirajara - Villavicencio)",
  "Asesoría Almacen Troya",
  "Asesoría Autopista Norte Calle 92",
  "Asesoría Bicicarril GMC",
  "Asesoría Box San Andres",
  "Asesoría Cedro Golf",
  "Asesoría Colegios Distritales",
  "Asesoría Concesion Ferrocarril del Pacifico",
  "Asesoría Consorcio Calima",
  "Asesoría Consorcio Estructuracion Vial",
  "Asesoría Cusiana",
  "Asesoría Diseño Estructural Paso Deprimido Calle 80",
  "Asesoría Edificio Ophalac",
  "Asesoría Estructural Juan Amarillo",
  "Asesoría Estructural Quebrada Honda",
  "Asesoría Estructural Via Quemeral - Bajo Achicaya",
  "Asesoría Estructural Via Chaparral-Rio Blanco",
  "Asesoría Estructural Concesion Zipaquira - Bucaramanga",
  "Asesoría Estructural Contrato SITP",
  "Asesoría Estructural Muros Avenida Circunvalar",
  "Asesoría Estructural Puente Peatonal Estacion Alcala",
  "Asesoría Estructuracion Gasoducto - Promigas",
  "Asesoría Estructuras Neiva",
  "Asesoría Hotel Avenida el Dorado",
  "Asesoría Inspeccion Terminal Estacion Americas",
  "Asesoría Intervencion Buenaventura BOX CULVERT",
  "Asesoría Interventoria Aeropuerto Palmira",
  "Asesoría Interventoria Autopista Medellin",
  "Asesoría Interventoria PQP",
  "Asesoría Interventoria Pte Villeta-Quebrada Negra",
  "Asesoría Interventoria Pte Yopal",
  "Asesoría Interventoria Puente Puerto Salgar",
  "Asesoría Mantenimiento Calle 26",
  "Asesoría Montaje Puente Peatonal la Calera",
  "Asesoría Muros - Monumento los Heroes",
  "Asesoría Muros Santander",
  "Asesoría Plaza de Ventas Populares de la Cr 22- Pasto",
  "Asesoría Proyectos G y B",
  "Asesoría Puente Autopista Norte Calle 92",
  "Asesoría Puente la Balsa",
  "Asesoría Puente Peatonal Meizzen",
  "Asesoría Puentes Bogota",
  "Asesoría Puentes Peatonales Calle 26 Cra. 30 CAMPIN",
  "Asesoría Reforzamiento NQS Calle 63",
  "Asesoría San Benito - Sampués",
  "Asesoría San Cristobal Ramajal",
  "Asesoría Tapón Calle 21",
  "Asesoría Tecnoconsulta S.A.S. Ciudad de Cali desde Av, Bosa",
  "Asesoría Unidad Residencia J.Vargas",
  "Asesoría Via segunda calzada Villavicencio",
  "Asesoría Viaducto Tequendama",
  "Asesoría-Inspeccion Terminal Estacion Americas",
  "Asesoría al Puente Adjunto Pericos",
  "Atirantado Chirajara",
  "Atlantic - Cartagena",
  "Auditorio del Senado",
  "Auditorio Mosquera",
  "Aulas Colegio Rafael Pombo",
  "Av. Sexta Primavera",
  "Av. Quebrada Seca - Carrera 15",
  "Avianca",
  "Balcón de Suba (Villa Alcazar)",
  "Balcones de San Carlos",
  "Balcones del Bosque",
  "Batea Aguablanca",
  "Biblioteca Infantil Sopo",
  "Bodega Calle 19 No. 27-39",
  "Bodega Zona Franca",
  "Bodegas Bavaria Riohacha",
  "Bodegas Puerto Central",
  "Box Avenida Boyaca - Calle 183",
  "Box Culvert Bogotá Girardot K144",
  "Box Culvert Canal Salitre con Avenida 68 - Pavcol",
  "Box Culvert K2 + 400",
  "Box Culvert- Tunja",
  "Box El Condor",
  "Box Iquira",
  "Box la Luisa",
  "Box Peatonal Calle 26 Carrera 30",
  "Box Peatonal Calle 26 Avenida 68",
  "Box y Muros Ruta 40",
  "Brisa Marina",
  "C.C. Estaciones Tunja",
  "Cámara Calle 26 El Tiempo",
  "Cámaras Calle 6ta",
  "Cámaras Carrera 10 Calle 26 Transmilenio",
  "Calzada en voladizo la Linea",
  "Caño Bevery - Vichada",
  "Caño Grande - Vichada",
  "Casa Anapoima Romero",
  "Casa el Polo",
  "Casa Familia Bayona",
  "Casa Garay Subachoque",
  "Casa Guateque",
  "Casa la Calera",
  "Casa Mateus",
  "Casa Rubio",
  "Casa San Mateo",
  "Casa Varela",
  "Casa Yerbabuena",
  "Casas Macadamia Etapa B",
  "CC Ventura Cartagena",
  "Cellucrete",
  "Centro Comercial Hugo Niño",
  "Centro Comercial Mall 53",
  "Centro Comercial San Mateo",
  "Centro Cultural Gachancipa",
  "Centro Cultural Gratamira",
  "Centro Cultural Zipaquira",
  "Centro de Convenciones Hotel Dorado Plaza",
  "Centro de Investigaciones Sasaima",
  "Cimentación Arco Metálico Rio Soacha",
  "Clínica David Restrepo",
  "Club el Rancho Puentes",
  "Club el Rancho Sede Tennis",
  "Colegio Buenaventura",
  "Colegio Liceo Campestre",
  "Colegio Maximino",
  "Colegio Nuevo Milenio - Mosquera",
  "Colegio Pablo VI",
  "Colina de San Fernando",
  "Coliseo Sopo",
  "Conectante Calle 37",
  "Conector Calle 68",
  "Conexión Norte (Autopistas del Nordeste)",
  "Conexión Norte Puente - 14",
  "Conexión Norte Puente - 6",
  "Conjunto la Ceiba",
  "Conjunto Residencial Arrayan",
  "Conjunto Residencial Florencia",
  "Conjunto Residencial Paseo de la Castellana",
  "Consultoría Puentes Saldaña - Mocoa",
  "Corredor la 30 Barranquilla",
  "Corredor Verde Cra 7",
  "Cubierta Colegio Celestin Freinet",
  "Cubierta Parque Piedecuesta",
  "Cubierta Puente Peatonal el Eden",
  "Curva de los Policias",
  "Demolición Soacha",
  "Deprimido Concejo",
  "Diagnóstico Estructural Edificio San Telmo",
  "Diagnóstico Puente Simón Bolivar",
  "Diagnóstico Puente Tequendama",
  "Diseño Area de Servicio Tocancipá",
  "Diseño Cafeteria Protabaco",
  "Diseño Casa San Mateo",
  "Diseño Centro Comercial Mall 53",
  "Diseño Estructural Casa Aposentos",
  "Diseño Estructural Casa Calle - Huspedes",
  "Diseño Estructural Casa Velasquez",
  "Diseño Estructural Casas Sindamanoy Etapa 4 , 2",
  "Diseño Estructural Edificio Aranjuez-Pasto",
  "Diseño Estructural Edificio Aranjuez II-Pasto",
  "Diseño Estructural Estación de Servicio Ibague",
  "Diseño Estructural Gimnasio Sopo",
  "Diseño Estructural Intersección Av. Panamericana carrera 22B sector Caracha de Pasto",
  "Diseño Estructural Intersección Av. Panamericana calle 18 de Pasto",
  "Diseño Estructural para la construcción del Viaducto Ruta 40 Tramo 4003 Pericos",
  "Diseño Estructural Puente Quebrada la Chatana",
  "Diseño Estructural Sede Social Sindamanoy",
  "Diseño Estrural Colegio la Violeta",
  "Diseño Estr. del Muro Divisorio Urb. Providencia Media",
  "Diseño Ferrocarril Par vial Izquierdo",
  "Diseño Intersección 1 trayecto 3 Tocancipa - Gachancipa",
  "Diseño Intersección 2 Ramal 1 Bogotá-Gachancipa",
  "Diseño Intersección 2 Ramal 8 Gachancipa-Bogotá",
  "Diseño Intersección 4 Sesquilé",
  "Diseño Intersección Cruce Guateque",
  "Diseño Intersección Fin variante Tocancipa Gachancipa",
  "Diseño Intersección Toca",
  "Diseño Nuevo Reservado - Bosque Madero",
  "Diseño Obras de Urbanismo CTIC",
  "Diseño Obras Cantarrana",
  "Diseño Obras Grupo 7",
  "Diseño pte metalico envalse del sisga",
  "Diseño Pte Quebrada la Union Porce III",
  "Diseño Puente Bogotá Par Vial Derecho",
  "Diseño Puente Bogotá Par Vial Izquierdo",
  "Diseño Puente Canal Venecia",
  "Diseño Puente Carajillo Nuevo-Estructura nueva",
  "Diseño Puente Carajillo Nuevo-Rehabilitación",
  "Diseño Puente Chicamocha k176",
  "Diseño Puente Estación Cabeceras y patios Av. Americas",
  "Diseño Puente Ferrocarril",
  "Diseño Puente Ferrocarril k95+860",
  "Diseño Puente Fin Variante Tunja",
  "Diseño Puente Intersección 10 SORACA",
  "Diseño Puente k48+600 sobre el rio Bogotá",
  "Diseño Puente Los Achotes",
  "Diseño Puente Quebrada albarracin",
  "Diseño Puente Quebrada el Tejar",
  "Diseño Puente Quebrada San Pedro",
  "Diseño Puente Rehabilitación k48+600 sobre rio Bogotá",
  "Diseño Puente Rio Bogotá k48+200",
  "Diseño Puente Rio Chicamocha k 163",
  "Diseño Puente Rio Chiquito",
  "Diseño Puente Rio Sotaquira",
  "Diseño Puente Rio Teatinos",
  "Diseño Puente Rio Upin",
  "Diseño Puente sobre el rio Chicamocha km 160",
  "Diseño Puente Sobre Rio de Aguas Negras",
  "Diseño Puente Variante Tunja",
  "Diseño Puente Avispero-Suaza",
  "Diseño Puente Calle 26 Con Cra 13",
  "Diseño Puente Elevado en Villapinzón",
  "Diseño Puente K2+380",
  "Diseño Puente Quebrada la Florida",
  "Diseño Puente Rio Chulo",
  "Diseño Puente Rio Surba",
  "Diseño Rebosadero del Sisga Nuevo",
  "Diseño Rehabilitación Puente Gullermo Valencia",
  "Diseño Taller de Protesis y Ortesi Cucuta",
  "Diseño Transversal del Sur Box Culverts",
  "Diseños para la reparac.",
  "Doble Calzada Buenaventura Tramo II K24",
  "Doble Calzada Buenaventura Tramo II K25",
  "Doble Calzada Buenaventura Tramo II K26",
  "Ecocuidades - Zafiro",
  "Edificio 344",
  "Edificio 74 Veinte",
  "Edificio Alqueria",
  "Edificio Aranjuez II-Pasto",
  "Edificio Argelia",
  "Edificio Aurora",
  "Edificio Bari",
  "Edificio Basico Plus",
  "Edificio Bellavista Rosales",
  "Edificio Business & Marketing Center",
  "Edificio Calle 103",
  "Edificio Calle 144",
  "Edificio Calle 93",
  "Edificio Colviseg",
  "Edificio El Contador 136",
  "Edificio el Recuerdo",
  "Edificio Entorno 109",
  "Edificio Entorno Calle 106",
  "Edificio Galerias",
  "Edificio Ibiza",
  "Edificio Iwoka",
  "Edificio Javeriana",
  "Edificio la Alambra-Colpatria",
  "Edificio la Fragua",
  "Edificio Laramy",
  "Edificio Milano de Mochuelo",
  "Edificio Multifamiliar Barranquilla",
  "Edificio Multifuncional de Medellin",
  "Edificio Pinar del Country",
  "Edificio Plan Rector de Medellin",
  "Edificio San Blas",
  "Edificio Santa Barbara",
  "Edificio Santa Paula",
  "Edificio Sindawa (campo de aragon)",
  "Edificio Ubik 140",
  "El Meson de los Bucaros",
  "El Otoño Dotacional",
  "El Otoño VIS - Leco City",
  "Encenillos de Sindamanoy",
  "Escuela y Peaje Conexión Norte",
  "Estación Ancon Sur (Metro Medellin)",
  "Estación de Bombeo",
  "Estación de Bomberos Fontibon",
  "Estación de Bomberos Bellavista",
  "Estación de Bomberos Calle 170",
  "Estación de Bomberos Sala de Crisis",
  "Estación Intermedia Banderas",
  "Estación Metro de Medellin",
  "Estudios y diseños al Puente Adjunto Pericos",
  "Evaluación casa calle 96 Carrera 11 A",
  "Evaluación soportes Agora",
  "Hacienda Sumapaz",
  "Hospital Infantil los Angeles - Pasto",
  "Hospital San Pedro",
  "Hotel Calle 127",
  "Hotel Calle 127 Etapa II",
  "Hotel Honda - Masawa",
  "Hotel Paz del Rio",
  "I.C.B.F San Jose del Guaviare",
  "ICBF Mitu",
  "Iglesia Calle 109",
  "Iglesia Manantial",
  "Informe Estructural Demolicion Infraestructura",
  "Inspección de puentes metálicos Los Grillos",
  "Inspecciones BTS",
  "Inspecciones Flandes y Puerto Salgar",
  "Inspecciones Puente Peatonal Portal americas Av.ciudad de Cali",
  "Inspecciones Puentes Menores Magdalena",
  "Intercambiador Versalles",
  "Intersección CIAT",
  "Intersección Galpones",
  "Intersección Ginebra",
  "Intersección Guacarí Malla Vial",
  "Intersección la Dolores - Malla Vial del Cauca",
  "Intersección sálida la Acequía Malla Vial",
  "Intersección Salida Variante de Yumbo - Malla Vial del Cauca",
  "Intersección Santa Helena Malla vial del Valle del Cauca",
  "Intersección Santander de Quilichao Sur",
  "Intersección Sena-Buga Malla Vial del Cauca",
  "Intersección Soacha",
  "Intervencion Avenida Belalcazar",
  "Interventoria BUCARAMANGA - PAMPLONA",
  "Interventoria Concesiones Viales Grupo 3",
  "Interventoria Corredor Férreo Los Llanos",
  "Interventoria Puente Guaymaral",
  "Interventoria Puente Humea",
  "Interventoria Puente Guayuriba",
  "Interventoria Técnica financiera y administrativa de la construcción de un puente peatonal Sopó",
  "La Nariz del Diablo",
  "La Uribe",
  "La Virgencita",
  "Línea subterránea Bosques 2",
  "Local Calle 127 Aut. Norte",
  "Local Calle 171",
  "Local Renatto",
  "Marginal de la Selva",
  "Mejoramiento integral de barrios en las localidades de Rafael Uribe, San Cristobal, Santa Fe",
  "Mezannine Compañía Colombiana Automotirz",
  "Mirador de la Alameda",
  "Modificación Deprimido Américas",
  "Modificación Puente Calle 3",
  "Multicentro Club Residencial Ibague",
  "Multicentro Ibague Etapa 2",
  "Muro de contención Lote 7",
  "Muros de contención Calle 24 A",
  "Muros de contención PR16 San Pascual",
  "Muros de contención Sisga",
  "Muros de contención Turbaco",
  "Muros K-36 Conexión Norte",
  "Muros Nazareth",
  "Neomundo",
  "Nueva Malla Vial - PAVCOL",
  "Nuevo Box Culvert Soacha",
  "Nuevo Puente Maria Paz",
  "Obras adicionales Malla Vial",
  "Oikos Savanna",
  "Parque Casa Blanca",
  "Parque Fontanar del Rio",
  "Parque las Margaritas",
  "Parque Tulio Ospina",
  "Parqueadero Concejo de Bogotá",
  "Patología Puente Río Frayle",
  "Patologías Nueva Malla Vial del Valle",
  "Peritaje Puente Chirajara",
  "Peritaje Puente la Panela",
  "Placa Pte Ospina Perez - Girardot",
  "Placa transferencia Materno Infantil",
  "Plaza de San Joaquin",
  "Plaza de Ventas 20 de Julio Pasto",
  "Plaza del Carnaval de Pasto",
  "Pte metalico sobre el canal america",
  "Pte peatonal Chicoral",
  "Prueba de carga Puente Peatonal el Chispero",
  "Prueba de carga Pte Hoya Grande",
  "Pruebas de carga Conexión Norte",
  "Pruebas de carga puentes vehiculares Covioriente",
  "Pruebas de carga Tacuya - Chitomena",
  "Puente Arroyo Grande",
  "Puente Arroyo Pintao",
  "Puente Av. Ciudad de Cali sobre el Humedal Juan Amarillo",
  "Puente Avenida la Sirena",
  "Puente Bare",
  "Puente Bionergy",
  "Puente Calle 183",
  "Puente Calle 63 con Av 68",
  "Puente Calle 80 NQS Ajuste",
  "Puente Canal Fucha",
  "Puente Canal Salitre y Rio Juan Amarillo",
  "Puente Carmelo Torres - Catoto",
  "Puente Chocontá",
  "Puente Cinabrio",
  "Puente El Juncal",
  "Puente El Paso",
  "Puente El Rodeo",
  "Puente El Salero",
  "Puente Galapago",
  "Puente Gambote",
  "Puente Garcia Cadena",
  "Puente Guarapas",
  "Puente Guillermo Valencia",
  "Puente Humea",
  "Puente Intersección SAO",
  "Puente la Curva del Diablo",
  "Puente la Hormiga",
  "Puente la Paz",
  "Puente Leon",
  "Puente los Salados",
  "Puente Maria Paz",
  "Puente Moñitos",
  "Puente Peatonal Belisario Betancourt-Pto Nariño",
  "Puente Peatonal Duitama",
  "Puente Peatonal El Eden",
  "Puente Peatonal Hospital de San Ignacio",
  "Puente Peatonal Terminal Calima",
  "Puente Rio Chiquito",
  "Puente Rio Luisa",
  "Puente Rio Magui",
  "Puente Rio Muco",
  "Puente Rio Negro",
  "Puente Rio Sabandija",
  "Puente Rio Sinu",
  "Puente San Mateo",
  "Puente San Pascual",
  "Puente San Vicente",
  "Puente Santa Librada",
  "Puente Socuavo",
  "Puente Sopo",
  "Puente Tunjuelo",
  "Puente Upin",
  "Puente Vehicular Calle 80- Sentido S-W",
  "Puente Villa Flor",
  "Regiotram Bogotá - Soacha",
  "Rehabilitación pte Bavaria rio chicamocha",
  "Rehabilitación pte sotaquira",
  "Rehabilitación Quebrada Albarracín",
  "Rehabilitación Quebrada Quincha",
  "Rehabilitación Quebrada San Pedro",
  "Rehabilitación Rio Bogotá k 48+200",
  "Rehabilitación puente Calle 92",
  "Restaurante FRAIDYS Rio Sinu",
  "Revisión Edificio KMA Construcciones",
  "Revisión Estructural Aeropuerto el Dorado",
  "Revisión Estructural San Mateo",
  "Ruta del Sol",
  "Tercer Carril Bogota - Girardot",
  "Torre Central Chia",
  "Torres de Santa Lucia",
  "Transmilenio Calle 26",
  "Transmilenio Calle 68",
  "Transmilenio Soacha Pavcol",
  "Transversal del Sur",
  "Urbanización la Trinidad",
  "Viaducto Chorros",
  "Viaducto Pericos Muros de Acceso",
  "Viaducto Tequendama"
];

const LISTA_CLIENTES = [
  "ALO SUR S.A.S.",
  "Alcaldía de Sopó",
  "Almacen Troya",
  "Arquiurbana",
  "Autopistas de la Sabana S.A.S.",
  "Autopistas del Café S.A.",
  "Autopistas del Nordeste",
  "Avianca",
  "Bateman Ingeniería S.A.",
  "BAVARIA S.A.",
  "BTS Derechos Económicos S.A.S",
  "Cementos San Marcos S.A",
  "Club Campestre El Rancho",
  "COLPATRIA S.A.S.",
  "Concesión Alto Magdalena S.A.S.",
  "Concesión Briceño Tunja-Sogamoso (BTS)",
  "Concesión del Sisga S.A.S.",
  "Concesión Pacifico 3 (Condor)",
  "Concesión Transversal del Sisga S.A.S.",
  "Consorcio ACI - TEC 4",
  "Consorcio Chinchiná",
  "Consorcio Constructor Nueva Malla Vial del Valle",
  "Consorcio Constructor Sisga",
  "Consorcio Diseños Zipaquira Cultural",
  "Consorcio Doble Calzada Buenaventura",
  "Consorcio Férreo del Llano BC",
  "Consorcio Habitat HMI",
  "Consorcio Infraestructura Metro",
  "Consorcio Itagui 2017",
  "Consorcio Maria Paz Corabastos",
  "Consorcio Puentes ConexNorte",
  "Consorcio Ruta 40",
  "Consorcio Solarte Solarte",
  "Consorcio USCO",
  "Consorcio Vial de Soacha",
  "Consorcio Vial Helios",
  "Consorcio Vial Itacol",
  "Consorcio Villagarzón",
  "Construcciones El Condor S.A.",
  "Construcciones Planificadas S.A.",
  "Constructora Collins",
  "CRM Construcciones",
  "CSS Constructores S.A.",
  "Dragados Concay",
  "Empresa de Proyectos Civiles EMPROCIV S.A.S",
  "Entorno",
  "EPM",
  "Fundacion Hospital San Pedro",
  "GH Puentes Grua Colombia SAS",
  "Gisaico",
  "Grupo Metro de Colombia",
  "H.B. Estructuras Metálicas S.A.",
  "Hace Ingenieros",
  "Infraestructura Nacional Ltda",
  "INVIAS",
  "Joyco",
  "KMA Construcciones S.A.S.",
  "Latinco S.A.",
  "Mall Vial del Cauca",
  "Mario Huertas Cotes",
  "MGM Ingenieria y Proyectos S.A.S.",
  "Metrodistrito",
  "Odebrecht",
  "Oikos S.A.S.",
  "OPAIN S.A.",
  "Ortiz Construcciones y Proyectos S.A.",
  "Patrimonio Autónomo Milano de Mochuelo",
  "Pavimentos Colombia S.A.S. (PAVCOL)",
  "PCA",
  "Pedro Gomez y Cia",
  "Proinvioriente S.A.S.",
  "Promotores del Caribe S.A.S.",
  "Sociedad Colombiana de Ingenieros",
  "Tecnoconsulta S.A.S.",
  "Union Temporal Américas Tramo 2",
  "Union Temporal SSB Autonorte",
  "Urbansa",
  "Viu Group SAS"
].sort();

export default function Dashboard({ user, logout }) {
  const [registros, setRegistros] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [busqueda, setBusqueda] = useState("");
  const [filtroEmail, setFiltroEmail] = useState("");

  const [todosLosUsuarios, setTodosLosUsuarios] = useState([]);
  const [aprobados, setAprobados] = useState({});
  const [salarios, setSalarios] = useState({});

  const API_URL = "http://localhost:5000/api";

  // 💰 HELPER: Formatear moneda a Pesos Colombianos
  const formatCOP = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor || 0);
  };

  const [form, setForm] = useState({
    fecha: "",
    horas: "",
    tipo: "normal",
    proyecto: "",
    projectNumber: "", // Nuevo: Número de proyecto
    client: "",        // Nuevo: Contratante (Razón Social)
    coordinator: "",   // Nuevo: Coordinador (persona que invirtió tiempo)
  });

  const META = 220;

  // 🔥 FUNCIÓN PARA CARGAR REGISTROS SEGÚN EL ROL
  const loadRegistros = async () => {
    if (!user) return;
    try {
      const response = await fetch(`${API_URL}/records?email=${user.email}&role=${user.role}`);
      if (response.ok) {
        const data = await response.json();
        setRegistros(data);
      }
    } catch (error) {
      console.error("Error cargando registros:", error);
    }
  };

  const loadConfigs = async () => {
    try {
      const resSalaries = await fetch(`${API_URL}/config/salaries`);
      if (resSalaries.ok) setSalarios(await resSalaries.json());

      const resApprovals = await fetch(`${API_URL}/config/approvals`);
      if (resApprovals.ok) setAprobados(await resApprovals.json());
    } catch (error) {
      console.error("Error cargando configuraciones:", error);
      Swal.fire('Error', 'No se pudo conectar con el servidor para cargar configuraciones', 'error');
    }
  };

  const loadUsersList = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      if (res.ok) setTodosLosUsuarios(await res.json());
    } catch (error) {
      console.error("Error cargando lista de usuarios:", error);
    }
  };

  // 🔥 CARGAR DATOS AL INICIO O CAMBIO DE USUARIO
  useEffect(() => {
    loadRegistros();
    loadConfigs();
    loadUsersList();
  }, [user]); // Dependencia: se ejecuta cuando el usuario cambia

  // 🔹 CÁLCULO PROFESIONAL DE NÓMINA
  const calcular = () => {
    if (!form.fecha) return { horas: 0, pago: 0 };
    
    // Usamos el sueldo configurado para el usuario actual (o 0 si no hay)
    const sueldoActual = Number(salarios[user.email] || 0);
    const VALOR_HORA_BASE = sueldoActual / 220; 

    let horas = Number(form.horas || 0);
    let factorRecargo = 1.0; // Valor por defecto (100%)

    const [year, month, day] = form.fecha.split('-').map(Number);
    const fechaObj = new Date(year, month - 1, day);
    const diaSemana = fechaObj.getDay(); 
    const esFinDeSemana = diaSemana === 0 || diaSemana === 6;

    if (form.tipo === "vacaciones") {
      horas = esFinDeSemana ? 0 : 8;
      factorRecargo = 1.0;
    } else if (form.tipo === "festivo") {
      // Festivos no se trabajan según requerimiento
      horas = 0;
      factorRecargo = 0;
    } else if (form.tipo === "domingo" || diaSemana === 0) {
      // Recargo dominical/festivo legal (75% adicional)
      factorRecargo = 1.75;
    }

    return {
      horas,
      pago: horas * VALOR_HORA_BASE * factorRecargo
    };
  };

  // 🔹 AGREGAR
  const agregar = async () => {
    // Permitimos agregar sin horas si es vacaciones o festivo
    if (!form.fecha || (form.tipo !== "vacaciones" && form.tipo !== "festivo" && !form.horas)) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos obligatorios.',
      });
      return;
    }

    const calc = calcular();

    // Validar que no se intenten registrar horas negativas o cero (excepto en vacaciones automáticas o festivos)
    if (calc.horas <= 0 && form.tipo !== "vacaciones" && form.tipo !== "festivo") {
      Swal.fire({
        icon: 'warning',
        title: 'Horas inválidas',
        text: 'Por favor, ingresa un número de horas mayor a 0.',
      });
      return;
    }

    // Validar que no se superen las 24 horas en un mismo día para el usuario
    const horasYaRegistradas = registros
      .filter(r => r.fecha === form.fecha && r.user === user.email)
      .reduce((acc, r) => acc + Number(r.horas), 0);

    if (horasYaRegistradas + calc.horas > 24) {
      Swal.fire({
        icon: 'error',
        title: 'Límite de horas excedido',
        text: `No es posible registrar más de 24 horas en un día. Ya tienes ${horasYaRegistradas}h registradas para esta fecha.`,
      });
      return;
    }

    if (form.tipo === "vacaciones" && calc.horas === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Día no laboral',
        text: 'No se pueden asignar horas de vacaciones en fin de semana.',
      });
      return;
    }

    const nuevo = {
      user: user.email,
      nombre: user.nombre,
      fecha: form.fecha,
      horas: calc.horas,
      pago: calc.pago,
      tipo: form.tipo,
      projectNumber: form.tipo === "festivo" ? (form.projectNumber || "N/A") : form.projectNumber,
      client: form.tipo === "festivo" ? (form.client || "N/A") : form.client,
      coordinator: form.tipo === "festivo" ? (form.coordinator || "N/A") : form.coordinator,
      proyecto: form.tipo === "festivo" ? (form.proyecto || "Día Festivo") : form.proyecto,
    };

    try {
      const response = await fetch(`${API_URL}/records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevo),
      });
      
      // Si el registro es exitoso, recargar las configuraciones para asegurar que los salarios estén actualizados
      // Esto es importante si el usuario acaba de ser registrado y se le asignó un salario por defecto.
      loadConfigs(); 
      if (response.ok) {
        loadRegistros();
        Swal.fire({ icon: 'success', title: 'Registro guardado', timer: 1000, showConfirmButton: false });
        setForm({
          fecha: "",
          horas: "",
          tipo: "normal",
          projectNumber: "",
          client: "",
          coordinator: "",
          proyecto: "",
        });
      } else {
        const errData = await response.json();
        Swal.fire('No se pudo guardar', errData.message, 'error');
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
  };

  // 🔥 TOGGLE APROBACION (EL CHULEO)
  const toggleAprobacion = async (email) => {
    const approved = !aprobados[email];
    try {
      const response = await fetch(`${API_URL}/config/approvals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, approved }),
      });
      if (response.ok) {
        setAprobados(await response.json());
      }
    } catch (error) {
      console.error("Error actualizando aprobación:", error);
    }
  };

  // 🔥 ELIMINAR
  const eliminar = async (id, ownerEmail) => {
    if (user.role !== "admin") return;

    const result = await Swal.fire({
      title: '¿Eliminar este registro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/records/${id}`, { method: "DELETE" });
        if (response.ok) {
          loadRegistros();
          Swal.fire({
            title: '¡Eliminado!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          });
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el registro", "error");
      }
    }
  };

  // 🔥 ACTUALIZAR SALARIO (Solo Admin)
  const updateSalario = (email, valor) => {
    if (!email) return;

    // 1. Actualizar estado local inmediatamente con el valor del input para que sea fluido
    setSalarios(prev => ({ ...prev, [email]: valor }));

    // 2. Guardar en la base de datos en segundo plano (Debounce)
    clearTimeout(window.saveTimer);
    window.saveTimer = setTimeout(async () => {
      // Limpiamos y convertimos a número solo para el envío a la DB
      const cleanValue = String(valor).replace(/[^0-9.]/g, '');
      const salaryNum = cleanValue === "" ? 0 : Number(cleanValue);

      try {
        await fetch(`${API_URL}/config/salaries`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, salary: salaryNum }),
        });
      } catch (error) {
        console.error("Error al guardar salario:", error);
      }
    }, 500); // Espera 500ms después de que dejes de escribir para enviar a MySQL
  };

  // 🔥 ELIMINAR TODO EL HISTORIAL (Solo Admin)
  const eliminarTodo = async () => {
    const result = await Swal.fire({
      title: '¿Vaciar TODO el historial?',
      text: "Se borrarán los registros de TODOS los usuarios. Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, borrar todo',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/records-all`, { method: "DELETE" });
        if (response.ok) {
          loadRegistros();
          Swal.fire('¡Vaciado!', 'Se han eliminado todos los registros.', 'success');
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo vaciar el historial", "error");
      }
    }
  };

  // 📅 HELPER: Convierte objeto Date a string YYYY-MM-DD local
  const dateToLocalStr = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 📅 FILTROS MENSUALES
  const mesFiltro = dateToLocalStr(fechaSeleccionada).substring(0, 7); // "YYYY-MM"

  const registrosDelMes = registros.filter((r) => r.fecha.startsWith(mesFiltro));

  const registrosParaMostrar = filtroEmail
    ? registrosDelMes.filter((r) => r.user === filtroEmail)
    : registrosDelMes;

  const registrosDelDia = registrosParaMostrar.filter((r) => {
    // Comparamos el string YYYY-MM-DD directamente
    return r.fecha === dateToLocalStr(fechaSeleccionada);
  });

  const registrosFiltrados = registrosParaMostrar.filter((r) => {
    const texto = busqueda.toLowerCase();

    return (
      r.nombre.toLowerCase().includes(texto) ||
      r.user.toLowerCase().includes(texto) ||
      (r.proyecto || "").toLowerCase().includes(texto)
    );
  });

  // 📅 CÁLCULO DE COSTOS REALES SEGÚN SALARIO CONFIGURADO
  const getCostoRegistro = (reg) => {
    const sueldo = Number(salarios[reg.user] || 0);
    const valorHora = sueldo / 220;
    let factor = 1.0;
    
    if (reg.tipo === "domingo") {
      factor = 1.75;
    } else if (reg.tipo === "festivo") {
      // Los festivos no valen horas ni pago extra según la nueva regla
      return 0;
    }
    return Number(reg.horas) * valorHora * factor;
  };

  // Sumatoria asegurando que los valores sean numéricos
  const totalHoras = registrosParaMostrar.reduce((acc, r) => acc + Number(r.horas || 0), 0);
  const liquidacionProyectada = registrosParaMostrar.reduce((acc, r) => acc + Number(getCostoRegistro(r) || 0), 0);
  
  const resumenUsuarios = todosLosUsuarios.map((u) => {
    const email = u.email;
    const registrosUser = registrosDelMes.filter((r) => r.user === email);
    const total = registrosUser.reduce((acc, r) => acc + Number(r.horas || 0), 0);
    const pagoTotal = registrosUser.reduce((acc, r) => acc + getCostoRegistro(r), 0);
    const rendimiento = ((total / META) * 100).toFixed(1);
    return { email, nombre: u.nombre, cedula: u.cedula, total, honorarios: pagoTotal, rendimiento };
  });

  // 📈 LÓGICA DE CUMPLIMIENTO GLOBAL PARA ADMIN O INDIVIDUAL
  let porcentajeCumplimiento;
  let esMetaCumplida;
  let metaDinamica;

  if (user.role === "admin" && !filtroEmail) {
    // Vista Global Admin: % de empleados que cumplieron su meta o están aprobados
    const totalEmpleados = resumenUsuarios.length;
    const empleadosCumplidos = resumenUsuarios.filter(u => u.total >= META || aprobados[u.email]).length;
    porcentajeCumplimiento = totalEmpleados > 0 ? ((empleadosCumplidos / totalEmpleados) * 100).toFixed(1) : "0.0";
    esMetaCumplida = totalEmpleados > 0 && empleadosCumplidos === totalEmpleados;
    metaDinamica = META * totalEmpleados; // Meta global proporcional
  } else {
    // Vista Trabajador o Admin filtrando a uno solo
    porcentajeCumplimiento = Math.min((totalHoras / META) * 100, 100).toFixed(1);
    esMetaCumplida = totalHoras >= META || (filtroEmail ? aprobados[filtroEmail] : aprobados[user.email]);
    metaDinamica = META; // Meta individual estándar
  }

  // � AGRUPAR POR PROYECTO PARA ADMIN
  const resumenProyectos = Object.values(
    registrosDelMes
      .filter((r) => r.proyecto && r.proyecto !== "Día Festivo" && r.proyecto !== "General/Sin Proyecto")
      .reduce((acc, r) => {
        const key = `${r.proyecto}|${r.projectNumber}|${r.client}`;
        if (!acc[key]) {
          acc[key] = {
            nombre: r.proyecto,
            numero: r.projectNumber || "-",
            cliente: r.client || "-",
            horas: 0,
            costo: 0,
          };
        }
        acc[key].horas += Number(r.horas || 0);
        acc[key].costo += getCostoRegistro(r);
        return acc;
      }, {})
  );

  return (
    <div className="container">

      {/* HEADER */}
      <div className="header">
        <h2>
          Bienvenido {user.nombre}
          <span className="badge">{user.role}</span>
        </h2>
        <button onClick={logout}>Cerrar sesión</button>
      </div>

      {/* 🧾 FORMULARIO (PARA TODOS) */}
      <div className="form">
          <input
            type="date"
            value={form.fecha}
            onChange={(e) =>
              setForm({ ...form, fecha: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Horas"
            min="0"
            max="24"
            value={form.horas}
            onChange={(e) => setForm({ ...form, horas: e.target.value })}
            disabled={form.tipo === "vacaciones" || form.tipo === "festivo"}
          />

          <select
            value={form.tipo}
            onChange={(e) =>
              setForm({ ...form, tipo: e.target.value })
            }
          >
            <option value="normal">Normal</option>
            <option value="festivo">Festivo</option>
            <option value="sabado">Sábado</option>
            <option value="domingo">Domingo</option>
            <option value="vacaciones">Vacaciones</option>
          </select>

          <select
            value={form.proyecto}
            onChange={(e) => setForm({ ...form, proyecto: e.target.value })}
          >
            <option value="">Seleccione Proyecto</option>
            {LISTA_PROYECTOS.map((p, index) => (
              <option key={index} value={p}>{p}</option>
            ))}
          </select>

          <input
            placeholder="Número de Proyecto"
            value={form.projectNumber}
            onChange={(e) => setForm({ ...form, projectNumber: e.target.value })}
          />

          <select
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
          >
            <option value="">Seleccione el cliente</option>
            {LISTA_CLIENTES.map((c, index) => (
              <option key={index} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={form.coordinator}
            onChange={(e) => setForm({ ...form, coordinator: e.target.value })}
          >
            <option value="">Seleccione Responsable</option>
            {todosLosUsuarios.map((u) => (
              <option key={u.email} value={u.nombre}>
                {u.nombre}
              </option>
            ))}
          </select>

          <button onClick={agregar}>Agregar</button>
      </div>

      {/* 📅 SELECTOR DE PERIODO */}
      <div className="period-selector">
        <label>Periodo de Nómina:</label>
        <input 
          type="month" 
          value={mesFiltro} 
          onChange={(e) => {
            const [y, m] = e.target.value.split("-");
            setFechaSeleccionada(new Date(parseInt(y), parseInt(m) - 1, 1));
          }}
        />
      </div>

      {/* 📈 DASHBOARD DE MÉTRICAS (KPIs) */}
      <div className="metrics-container">
        <div className="metric-card">
          <span className="metric-label">Horas Totales</span>
          <span className="metric-value">{totalHoras}h</span>
          <div className="metric-sub">Meta: {metaDinamica}h</div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Liquidación Proyectada</span>
          <span className="metric-value">{formatCOP(liquidacionProyectada)}</span>
          <div className="metric-sub">Incluye recargos dom/fest</div>
        </div>
        <div className="metric-card">
          <span className="metric-label">Cumplimiento</span>
          <span className={`metric-value ${esMetaCumplida ? 'ok' : 'bad'}`}>
            {porcentajeCumplimiento}%
          </span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${porcentajeCumplimiento}%`, backgroundColor: esMetaCumplida ? '#10b981' : '#6366f1' }}
            ></div>
          </div>
        </div>
      </div>

      {/* 🧑‍💼 ADMIN */}
      {user.role === "admin" && (
        <>
          {/*  CALENDARIO */}
          <div className="calendar-section">
            <Calendar
              onChange={setFechaSeleccionada}
              value={fechaSeleccionada}
              tileClassName={({ date }) => {
                const dateStr = dateToLocalStr(date);
                const existe = registros.some((r) => r.fecha === dateStr);
                return existe ? "highlight" : null;
              }}
            />
          </div>

          {/* 🔍 SELECTOR Y BUSCADOR (Solo Admin) */}
          <div className="section-title">Panel de Control de Personal</div>
          <div className="form" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select 
              value={filtroEmail} 
              onChange={(e) => setFiltroEmail(e.target.value)}
              style={{ flex: 1, minWidth: '200px' }}
            >
              <option value="">Ver Todos los Trabajadores</option>
              {resumenUsuarios.map(u => (
                <option key={u.email} value={u.email}>
                  👤 {u.nombre} ({u.email})
                </option>
              ))}
            </select>

            <input
              className="search"
              style={{ flex: 2, margin: 0 }}
              placeholder="Buscar registros específicos (nombre, email o proyecto)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* 📋 RESUMEN POR PERSONA */}
          <div className="section-title">Estado de Usuarios</div>
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Cédula</th> {/* Nuevo */}
                <th>Salario Base</th>
                <th>Total Horas</th>
                <th>Liquidación</th>
                <th>Rendimiento</th>
                <th>Meta ({META})</th>
                <th>¿Cumplió?</th>
                <th>Chulear (Manual)</th>
              </tr>
            </thead>
            <tbody>
              {resumenUsuarios.map((u) => (
                <tr key={u.email}>
                  <td>{u.nombre}</td>
                  <td>{u.cedula}</td> {/* Mostrar cédula */}
                  <td>
                    <input 
                      type="number" 
                      step="1000"
                      className="search" 
                      style={{ width: '180px', margin: 0, fontSize: '1.1rem' }} 
                      placeholder="Ej: 1300000"
                      value={salarios[u.email] ?? ""} 
                      onChange={(e) => updateSalario(u.email, e.target.value)}
                    />
                  </td>
                  <td>{u.total}</td>
                  <td>{formatCOP(u.honorarios)}</td>
                  <td>{u.rendimiento}%</td>
                  <td className={u.total >= META ? "ok" : "bad"}>
                    {u.total >= META ? "Superada" : "Pendiente"}
                  </td>
                  <td>{aprobados[u.email] || u.total >= META ? "✅ SI" : "❌ NO"}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!aprobados[u.email]}
                      onChange={() => toggleAprobacion(u.email)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 📁 INVERSIÓN POR PROYECTO */}
          <div className="section-title">Análisis de Inversión por Proyecto</div>
          <table>
            <thead>
              <tr>
                <th>N° Proyecto</th>
                <th>Nombre del Proyecto</th>
                <th>Cliente</th>
                <th>Horas Invertidas</th>
                <th>Costo de Inversión</th>
              </tr>
            </thead>
            <tbody>
              {resumenProyectos.length > 0 ? (
                resumenProyectos.map((p, index) => (
                  <tr key={index}>
                    <td>{p.numero}</td>
                    <td>{p.nombre}</td>
                    <td>{p.cliente}</td>
                    <td>{p.horas}h</td>
                    <td>{formatCOP(p.costo)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No hay datos de proyectos este mes</td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <button className="danger" onClick={eliminarTodo}>
              ⚠️ Vaciar Todo el Historial
            </button>
          </div>
        </>
      )}

      {/* 📊 REGISTROS DEL DÍA (Visible para todos) */}
      <div className="section-title">
        Registros del día: {fechaSeleccionada.toLocaleDateString()}
      </div>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fecha</th>
            <th>Horas</th>
            <th>Tipo</th>
            <th>N° Proyecto</th> {/* Nuevo */}
            <th>Nombre Proyecto</th>
            <th>Contratante</th> {/* Nuevo */}
            <th>Responsable</th> {/* Nuevo */}
            {user.role === "admin" && <th>Acción</th>}
          </tr>
        </thead>
        <tbody>
          {registrosDelDia.length > 0 ? (
            registrosDelDia.map((r) => (
              <tr key={r.id}>
                <td>{r.nombre}</td>
                <td>{r.user}</td>
                <td>{r.fecha.split("T")[0].split("-").reverse().join("/")}</td>
                <td>{r.horas}</td>
                <td>{r.tipo}</td>
                <td>{r.projectNumber || "-"}</td>
                <td>{r.proyecto || "-"}</td>
                <td>{r.client || "-"}</td>
                <td>{r.coordinator || "-"}</td>
                {user.role === "admin" && (
                  <td>
                    <button className="danger" onClick={() => eliminar(r.id, r.user)}>❌</button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr><td colSpan={user.role === "admin" ? 10 : 9} style={{textAlign: 'center'}}>No hay registros para este día</td></tr>
          )}
        </tbody>
      </table>

      {/* 📊 HISTORIAL (Visible para todos) */}
      <div className="section-title">Historial completo</div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fecha</th>
            <th>Horas</th>
            <th>Tipo</th>
            <th>N° Proyecto</th> {/* Nuevo */}
            <th>Nombre Proyecto</th>
            <th>Contratante</th> {/* Nuevo */}
            <th>Responsable</th> {/* Nuevo */}
            {user.role === "admin" && <th>Acción</th>}
          </tr>
        </thead>
        <tbody>
          {registrosFiltrados.map((r) => (
            <tr key={r.id}>
              <td>{r.nombre}</td>
              <td>{r.user}</td>
              <td>{r.fecha.split("T")[0].split("-").reverse().join("/")}</td>
              <td>{r.horas}</td>
              <td>{r.tipo}</td>
              <td>{r.projectNumber || "-"}</td>
              <td>{r.proyecto || "-"}</td>
              <td>{r.client || "-"}</td>
              <td>{r.coordinator || "-"}</td>
              {user.role === "admin" && (
                <td>
                  <button className="danger" onClick={() => eliminar(r.id, r.user)}>❌</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}