import axios from 'axios';

const params = new URLSearchParams(window.location.search);
const autorId = params.get('id');
const nombre = params.get('nombre');

const tituloPagina = document.getElementById('titulo-autor');
const listaLibrosDiv = document.getElementById('lista-libros');
const formLibro = document.getElementById('form-libro');


const URL_AUTORES = `http://localhost:8080/autores/${autorId}`;
const URL_LIBROS_AUTOR = `http://localhost:8080/autores/${autorId}/libros`;
const URL_LIBROS = `http://localhost:8080/libros`;

let editandoLibro = false;
let idLibroAEditar = null;

const cargarDatos = async () => {
    try {
        const resAutor = await axios.get(URL_AUTORES);
        tituloPagina.innerText = `Libros de ${nombre}`;
        document.getElementById('info-autor').innerText = `Nacionalidad: ${resAutor.data.nacionalidad}. Año de nacimiento: ${resAutor.data.ano_nacimiento}`;

        const resLibros = await axios.get(URL_LIBROS_AUTOR);
        pintarLibros(resLibros.data);
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
};

const pintarLibros = (libros) => {
    listaLibrosDiv.innerHTML = '';

    if (libros.length === 0) {
        listaLibrosDiv.innerHTML = '<p>No hay libros registrados para este autor.</p>';
        return;
    }

    libros.forEach(libro => {
        const tarjetaLibro = document.createElement('div');
        tarjetaLibro.style.border = '1px solid #ccc';
        tarjetaLibro.style.padding = '10px';
        tarjetaLibro.style.margin = '10px';

        tarjetaLibro.innerHTML = `
            <h4>${libro.titulo}</h4>
            <p>Año de publicación: ${libro.ano_publicacion || 'Desconocido'}</p>
            <p>Género: ${libro.genero || 'Desconocido'}</p>
            <p>Descripción: ${libro.descripcion || 'No disponible'}</p>
            <button class="btn-editar" data-id="${libro.id}" data-titulo="${libro.titulo}" data-ano="${libro.ano_publicacion}" 
            data-genero="${libro.genero}" data-desc="${libro.descripcion}">Editar</button>
            <button class="btn-eliminar" data-id="${libro.id}">Eliminar</button>
        `;
        listaLibrosDiv.appendChild(tarjetaLibro);
    });
};

listaLibrosDiv.addEventListener('click', async (e) => {
    const id = e.target.getAttribute('data-id');

    if (e.target.classList.contains('btn-eliminar')) {
        if (confirm('¿Estás seguro de que deseas eliminar este libro?')) {
            await axios.delete(`${URL_LIBROS}/${id}`);
            alert('Libro eliminado con éxito');
            cargarDatos();
        }
    }

    if (e.target.classList.contains('btn-editar')) {
        editandoLibro = true;
        idLibroAEditar = id;

        document.getElementById('titulo').value = e.target.getAttribute('data-titulo');
        document.getElementById('ano_publicacion').value = e.target.getAttribute('data-ano');
        document.getElementById('genero').value = e.target.getAttribute('data-genero');
        document.getElementById('descripcion').value = e.target.getAttribute('data-desc');

        formLibro.querySelector('button').innerText = 'Guardar Cambios';
    }
});

formLibro.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevoLibro = {
        titulo: document.getElementById('titulo').value,
        ano_publicacion: document.getElementById('ano_publicacion').value,
        genero: document.getElementById('genero').value,
        descripcion: document.getElementById('descripcion').value,
        id_autor: autorId
    };

    try {
        if (editandoLibro) {
            await axios.put(`${URL_LIBROS}/${idLibroAEditar}`, nuevoLibro);
            editandoLibro = false;
            idLibroAEditar = null;
            formLibro.querySelector('button').innerText = 'Guardar Cambios';
            alert('Libro editado con éxito');
        } else {
            await axios.post(URL_LIBROS, nuevoLibro);
            alert('Libro registrado con éxito');
        }

        formLibro.reset();
        cargarDatos();
    } catch (error) {
        console.error('Error al registrar libro:', error);
        alert('Error al registrar libro');
    }
});

cargarDatos();