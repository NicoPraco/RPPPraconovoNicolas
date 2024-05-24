import { Persona } from './clases/persona.js';
import { Ciudadano } from './clases/ciudadano.js';
import { Extranjero } from './clases/extranjero.js';

//#region Constantes

const obtenerCiudadanos = (personas) => personas.filter((persona) => persona instanceof Ciudadano);
const obtenerExtranjeros = (personas) => personas.filter((persona) => persona instanceof Extranjero);

const ordenColumnas = ['id', 'nombre', 'apellido', 'fechaNacimiento', 'dni', 'paisOrigen'];

//#endregion

// ==============================================================================================================================
//#region Funciones de Exportacion |

export function fromJson(jsonString) {
    jsonString.forEach((persona) => {
        Persona.personasID[persona.id] = true;
        if (persona.id > Persona.lastID) {
            Persona.lastID = persona.id;
        }
    });

    return jsonString.map((datos) => {
        if (datos.dni) {
            return new Ciudadano(datos.id, datos.nombre, datos.apellido, datos.fechaNacimiento, datos.dni);
        } else {
            return new Extranjero(datos.id, datos.nombre, datos.apellido, datos.fechaNacimiento, datos.paisOrigen);
        }
    });
}

/**
 *
 * @param {Array Persona} personas
 */
export function actualizarTabla(personas) {
    const columnasOrden = ordenColumnas;
    const tbody = document.getElementById('table-content');

    tbody.innerHTML = '';
    personas.forEach((persona) => {
        const fila = document.createElement('tr');

        columnasOrden.forEach((columna) => {
            const celda = document.createElement('td');

            celda.textContent = persona[columna] || '-';
            fila.appendChild(celda);
        });
        tbody.appendChild(fila);
    });
}

export function filtrarTabla(personas) {
    const selectElement = document.getElementById('filter');

    selectElement.addEventListener('change', () => {
        const selectedValue = selectElement.value;
        let filteredArray = [];

        if (selectedValue === 'Ciudadanos') {
            filteredArray = obtenerCiudadanos(personas);
        } else if (selectedValue === 'Extranjeros') {
            filteredArray = obtenerExtranjeros(personas);
        } else {
            filteredArray = personas;
        }

        RenderizarTabla(filteredArray);
    });
}

export function RenderizarTabla(personas) {
    const tbodyElement = document.getElementById('table-content');
    const checkboxElements = document.querySelectorAll('#show-table-elements input[type="checkbox"]');

    tbodyElement.innerHTML = '';

    personas.forEach((persona) => {
        const fila = document.createElement('tr');

        ordenColumnas.forEach((columna, index) => {
            if (checkboxElements[index].checked) {
                // Verifica si la columna está activada
                const celda = document.createElement('td');
                celda.textContent = persona[columna] || '-';
                fila.appendChild(celda);
            }
        });

        tbodyElement.appendChild(fila);
    });
}

export function CalcularPromedio(personas) {
    const selectElement = document.getElementById('filter');
    const inputElement = document.getElementById('media-output');
    const btnElement = document.getElementById('btn-media');

    btnElement.addEventListener('click', () => {
        let selectedValue = selectElement.value;
        let filteredArray = [];

        if (selectedValue === 'Ciudadanos') {
            filteredArray = obtenerCiudadanos(personas);
        } else if (selectedValue === 'Extranjeros') {
            filteredArray = obtenerExtranjeros(personas);
        } else {
            filteredArray = personas;
        }

        let ageSum = 0;
        let currentDate = new Date();

        for (let persona of filteredArray) {
            let fechaNacimiento = persona.fechaNacimiento.toString();
            let anioNacimiento = parseInt(fechaNacimiento.substring(0, 4));
            let mesNacimiento = parseInt(fechaNacimiento.substring(4, 6)) - 1; // Los meses en JavaScript son de 0 a 11
            let diaNacimiento = parseInt(fechaNacimiento.substring(6, 8));

            let birthDate = new Date(anioNacimiento, mesNacimiento, diaNacimiento);
            let age = currentDate.getFullYear() - birthDate.getFullYear();
            let monthDiff = currentDate.getMonth() - birthDate.getMonth();

            // Si el mes actual es menor que el mes de nacimiento,
            // o es el mismo mes pero el día actual es menor al día de nacimiento, restar 1 año
            if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
                age--;
            }

            ageSum += age;
        }

        const media = (ageSum / filteredArray.length).toFixed(2);
        inputElement.value = media;
    });
}

export function ManagerFormularioABM(personas) {
    const addButton = document.getElementById('btn-table');
    const createButton = document.getElementById('abm-form-create');
    const modifyButton = document.getElementById('abm-form-modify');
    const cancelButton = document.getElementById('abm-form-cancel');
    const deletebutton = document.getElementById('abm-form-delete');

    const tableRows = document.querySelectorAll('#table-content tr');

    // Mostrar el formulario ABM al hacer doble clic en una fila de la tabla
    tableRows.forEach((row) => {
        row.addEventListener('dblclick', () => {
            MostrarFormularioABM();
            LlenarFormularioABMConDatos(personas, row);
        });
    });

    //Logica para agregar una nueva persona
    addButton.addEventListener('click', () => {
        LimpiarFormularioABM();
        MostrarFormularioABMConTodosLosCampos();

        createButton.classList.remove('hidden');
        modifyButton.classList.add('hidden');
        deletebutton.classList.add('hidden');

        document.getElementById('abm-form-type').addEventListener('change', habilitarCamposSegunTipoPersona);
    });

    // Locica del boton de Crear
    createButton.addEventListener('click', () => {
        VerificarAdd(personas, ordenColumnas);

        agregarEventListenersAFilas(personas);
    });

    // Lógica para Modificar a la Persona
    modifyButton.addEventListener('click', () => {
        VerificarModificacion(personas);
    });

    //Logica para eliminar la persona
    deletebutton.addEventListener('click', function () {
        const id = document.getElementById('abm-form-id').value;

        OcultarFormularioABM();
        EliminarPersonaDeLaTabla(personas, id);
    });

    // Cancelar
    cancelButton.addEventListener('click', () => {
        OcultarFormularioABM();
    });
}

export function OrdenarTabla(personas) {
    const headers = document.querySelectorAll('th');
    const filter = document.getElementById('filter');

    headers.forEach((header) => {
        header.addEventListener('click', () => {
            const columnIndex = Array.from(headers).indexOf(header);

            if (filter.value === 'Todos') {
                personas.sort((a, b) => {
                    const valueA = a[ordenColumnas[columnIndex]];
                    const valueB = b[ordenColumnas[columnIndex]];

                    return typeof valueA === 'string' ? valueA.localeCompare(valueB) : valueA - valueB;
                });

                RenderizarTabla(personas);
            } else if (filter.value === 'Ciudadanos') {
                let arrayCiudadanos = obtenerCiudadanos(personas);

                arrayCiudadanos.sort((a, b) => {
                    const valueA = a[ordenColumnas[columnIndex]];
                    const valueB = b[ordenColumnas[columnIndex]];

                    return typeof valueA === 'string' ? valueA.localeCompare(valueB) : valueA - valueB;
                });

                RenderizarTabla(arrayCiudadanos);
            } else {
                let arrayExtranjeros = obtenerExtranjeros(personas);

                arrayExtranjeros.sort((a, b) => {
                    const valueA = a[ordenColumnas[columnIndex]];
                    const valueB = b[ordenColumnas[columnIndex]];

                    return typeof valueA === 'string' ? valueA.localeCompare(valueB) : valueA - valueB;
                });

                RenderizarTabla(arrayExtranjeros);
            }
        });
    });
}

export function VisualizarTabla() {
    const checkboxElements = document.querySelectorAll('[type="checkbox"]');
    const tableElement = document.querySelector('table');

    checkboxElements.forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
            const columnName = event.target.name;
            const columnVisible = event.target.checked;

            ordenColumnas[columnName] = columnVisible;

            tableElement.querySelectorAll('tr').forEach((row) => {
                Array.from(row.cells).forEach((cell, index) => {
                    // Obtén el nombre de la columna de la primera fila (encabezado de tabla)
                    const columnHeader = tableElement.rows[0].cells[index].textContent;
                    // Compara el nombre de la columna con el nombre de la columna actual
                    if (columnHeader === columnName) {
                        cell.style.display = columnVisible ? '' : 'none';
                    }
                });
            });
        });
    });
}

//#endregion
// ==============================================================================================================================

function agregarPersona(personas, nuevaPersona) {
    if (personas != null && nuevaPersona != null) {
        personas.forEach(() => {
            const existe = personas.some((persona) => persona.id === nuevaPersona.id);

            if (!existe) {
                personas.push(nuevaPersona);
            }
        });
    } else {
        console.error('Error, no se han completado los datos de la persona a crear');
    }
}

function VerificarAdd(personas, ordenColumnas) {
    const id = document.getElementById('abm-form-id').value;

    if (id === '') {
        // Se está agregando una nueva persona
        const datosABM = ObtenerDatos();
        OcultarFormularioABM();

        agregarPersona(personas, datosABM);
        actualizarTabla(personas, ordenColumnas);
    }
}

function VerificarModificacion(personas) {
    // Obtener los valores de los campos del formulario
    const id = document.getElementById('abm-form-id').value;

    if (id !== '') {
        // Se está modificando una persona existente
        const datosABM = ObtenerDatos();
        OcultarFormularioABM();
        ModificarPersona(personas, id, datosABM);
        agregarEventListenersAFilas(personas);
    }
}

function EliminarPersonaDeLaTabla(personas, id) {
    const index = personas.findIndex((persona) => persona.id === parseInt(id));

    if (index != null) {
        personas.splice(index, 1);
    } else {
        console.warn('No se ha encontrado el id de la persona a eliminar.');
    }
    actualizarTabla(personas);
}

function agregarEventListenersAFilas(personas) {
    const tableRows = document.querySelectorAll('#table-content tr');

    tableRows.forEach((row) => {
        row.addEventListener('dblclick', () => {
            MostrarFormularioABM();
            LlenarFormularioABMConDatos(personas, row);
        });
    });
}

function ObtenerDatos() {
    const nombre = document.getElementById('abm-form-name').value;
    const apellido = document.getElementById('abm-form-surname').value;
    const fecha = parseInt(document.getElementById('abm-form-date').value);
    const tipo = document.getElementById('abm-form-type').value;
    let dni = parseInt(document.getElementById('abm-form-dni').value);
    let pais = document.getElementById('abm-form-country').value;

    if (nombre != null && apellido != null && fecha != null && tipo != null) {
        // Si el tipo es Ciudadano, establecer los valores de Cliente como '-'
        if (tipo === 'Ciudadano' && dni != null) {
            return new Ciudadano(null, nombre, apellido, fecha, dni);
        }
        // Si el tipo es Cliente, establecer los valores de Empleado como '-'
        else if (tipo === 'Extranjero' && pais != null) {
            return new Extranjero(null, nombre, apellido, fecha, pais);
        } else {
            return null;
        }
    } else {
        console.error('Error, los campos no pueden ser nulos');
    }
}

function ModificarPersona(personas, id, datosABM) {
    let persona = BuscarPersonaPorId(personas, parseInt(id));

    if (persona != null && datosABM != null) {
        if (persona instanceof Ciudadano && datosABM instanceof Ciudadano) {
            persona.nombre = datosABM.nombre;
            persona.apellido = datosABM.apellido;
            persona.fechaNacimiento = datosABM.fechaNacimiento;
            persona.dni = datosABM.dni;
        } else {
            persona.nombre = datosABM.nombre;
            persona.apellido = datosABM.apellido;
            persona.fechaNacimiento = datosABM.fechaNacimiento;
            persona.paisOrigen = datosABM.pais;
        }
        actualizarTabla(personas);
    }
}

function habilitarCamposSegunTipoPersona() {
    const tipo = document.getElementById('abm-form-type').value;
    const dniInput = document.getElementById('abm-form-dni');
    const countryInput = document.getElementById('abm-form-country');

    // Deshabilitar todos los campos
    dniInput.disabled = true;
    countryInput.disabled = true;

    // Habilitar los campos específicos según el tipo de persona seleccionado
    if (tipo === 'Ciudadano') {
        dniInput.disabled = false;
    } else {
        countryInput.disabled = false;
    }
}

//#region Formulario ABM | Mostrar, Limpiar y Ocultar

function MostrarFormularioABM() {
    const header = document.getElementById('header-div');
    const dataform = document.getElementById('form-data');
    const abmForm = document.getElementById('abm-form');

    header.classList.add('hidden');
    dataform.classList.add('hidden');
    abmForm.classList.remove('hidden');
}

function LimpiarFormularioABM() {
    // Restablecer los valores del formulario ABM
    document.getElementById('abm-form-id').value = '';
    document.getElementById('abm-form-name').value = '';
    document.getElementById('abm-form-surname').value = '';
    document.getElementById('abm-form-date').value = '';
    document.getElementById('abm-form-type').value = '';
    document.getElementById('abm-form-dni').value = '';
    document.getElementById('abm-form-country').value = '';

    document.getElementById('abm-form-id').classList.remove('hidden');
    document.getElementById('abm-form-name').classList.remove('hidden');
    document.getElementById('abm-form-surname').classList.remove('hidden');
    document.getElementById('abm-form-date').classList.remove('hidden');
    document.getElementById('abm-form-type').classList.remove('hidden');
    document.getElementById('abm-form-dni').classList.remove('hidden');
    document.getElementById('abm-form-country').classList.remove('hidden');

    document.getElementById('abm-form-create').classList.remove('hidden');
    document.getElementById('abm-form-modify').classList.remove('hidden');
    document.getElementById('abm-form-delete').classList.remove('hidden');
    document.getElementById('abm-form-cancel').classList.remove('hidden');
}

function OcultarFormularioABM() {
    const header = document.getElementById('header-div');
    const dataform = document.getElementById('form-data');
    const abmForm = document.getElementById('abm-form');

    header.classList.remove('hidden');
    dataform.classList.remove('hidden');
    abmForm.classList.add('hidden');

    LimpiarFormularioABM();
}

//#endregion

function MostrarFormularioABMConTodosLosCampos() {
    const header = document.getElementById('header-div');
    const dataform = document.getElementById('form-data');
    const abmForm = document.getElementById('abm-form');

    const idInputElement = document.getElementById('abm-form-name');
    const nombreInputElement = document.getElementById('abm-form-surname');
    const apellidoInputElement = document.getElementById('abm-form-date');
    const fechaInputElement = document.getElementById('abm-form-type');
    const dniInputElement = document.getElementById('abm-form-dni');
    const paisInputElement = document.getElementById('abm-form-country');

    const lblDniElement = document.getElementById('abm-form-lbl-dni');
    const lblPaisElement = document.getElementById('abm-form-lbl-country');

    const tipoPersonaElement = document.getElementById('abm-form-type');

    // Agrego el Hidden al header y al data-form
    // Y le quito el hidden al formulario ABM.
    header.classList.add('hidden');
    dataform.classList.add('hidden');
    abmForm.classList.remove('hidden');

    // Quito cualquier hidden a los input.
    idInputElement.classList.remove('hidden');
    nombreInputElement.classList.remove('hidden');
    apellidoInputElement.classList.remove('hidden');
    fechaInputElement.classList.remove('hidden');
    dniInputElement.classList.remove('hidden');
    paisInputElement.classList.remove('hidden');

    // El select vuelva a ser operativo
    tipoPersonaElement.disabled = false;

    // Le quito el hidden a los label
    lblDniElement.classList.remove('hidden');
    lblPaisElement.classList.remove('hidden');
}

function LlenarFormularioABMConDatos(personas, row) {
    const cells = row.cells;
    const id = cells[0].textContent;

    let miPersona = BuscarPersonaPorId(personas, parseInt(id));

    const inputDniElement = document.getElementById('abm-form-dni');
    const inputPaisElement = document.getElementById('abm-form-country');

    const lblDniElement = document.getElementById('abm-form-lbl-dni');
    const lblPais = document.getElementById('abm-form-lbl-country');

    document.getElementById('abm-form-id').value = miPersona.id;
    document.getElementById('abm-form-name').value = miPersona.nombre;
    document.getElementById('abm-form-surname').value = miPersona.apellido;
    document.getElementById('abm-form-date').value = miPersona.fechaNacimiento;

    document.getElementById('abm-form-create').classList.add('hidden');

    if (miPersona instanceof Ciudadano) {
        document.getElementById('abm-form-type').disabled = true;
        document.getElementById('abm-form-type').value = 'Ciudadano';
        document.getElementById('abm-form-dni').value = miPersona.dni;

        lblDniElement.classList.remove('hidden');
        inputDniElement.classList.remove('hidden');

        inputPaisElement.classList.add('hidden');
        lblPais.classList.add('hidden');
    } else {
        document.getElementById('abm-form-type').disabled = true;
        document.getElementById('abm-form-type').value = 'Extranjero';
        document.getElementById('abm-form-country').value = miPersona.paisOrigen;

        lblDniElement.classList.add('hidden');
        inputDniElement.classList.add('hidden');

        inputPaisElement.classList.remove('hidden');
        lblPais.classList.remove('hidden');
    }
}

function BuscarPersonaPorId(personas, id) {
    // Buscar en los objetos de tipo Ciudadano
    const ciudadanoEncontrado = personas.find((persona) => persona instanceof Ciudadano && persona.id === id);
    if (ciudadanoEncontrado) {
        return ciudadanoEncontrado;
    }

    // Buscar en los objetos de tipo Extranjero
    const extranjeroEncontrado = personas.find((persona) => persona instanceof Extranjero && persona.id === id);
    if (extranjeroEncontrado) {
        return extranjeroEncontrado;
    }
    // Si no se encuentra la persona con el id dado, devolver null
    return null;
}
