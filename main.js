// import { Persona } from './clases/persona.js';
import {
    actualizarTabla,
    filtrarTabla,
    CalcularPromedio,
    ManagerFormularioABM,
    VisualizarTabla,
    OrdenarTabla,
    fromJson,
} from './functions.js';

const stringDeDatos =
    '[{"id":1,"apellido":"Serrano","nombre":"Horacio","fechaNacimiento":19840103,"dni":45876942},{"id":2,"apellido":"Casas","nombre":"Julian","fechaNacimiento":19990723,"dni":98536214},{"id":3,"apellido":"Galeano","nombre":"Julieta","fechaNacimiento":20081103,"dni":74859612},{"id":4,"apellido":"Molina","nombre":"Juana","fechaNacimiento":19681201,"paisOrigen":"Paraguay"},{"id":5,"apellido":"Barrichello","nombre":"Rubens","fechaNacimiento":19720523,"paisOrigen":"Brazil"},{"id":666,"apellido":"Hkkinen","nombre":"Mika","fechaNacimiento":19680928,"paisOrigen":"Finlandia"}]';

const jsonArray = JSON.parse(stringDeDatos);
const arrayPersonas = fromJson(jsonArray);

actualizarTabla(arrayPersonas); // Agrega los elementos del arrayPersonas a la tabla
filtrarTabla(arrayPersonas); // Permite filtrar la Tabla segun Empleados o Clientes
CalcularPromedio(arrayPersonas); // Calcula el Promedio de Edades segun las Personas Filtradas
ManagerFormularioABM(arrayPersonas); // Funcionalidades del Formulario ABM
VisualizarTabla(); // Checkbox para Ver las columnas de la Tabla
OrdenarTabla(arrayPersonas); // Sort de las columnas
