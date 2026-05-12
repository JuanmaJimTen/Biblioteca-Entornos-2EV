import axios from 'axios';

const listaAutoresDiv = document.getElementById('lista-autores');
const formAutor = document.getElementById('form-autor');
const URL_API = 'http://localhost:8080/autores';

let editandoAutor = false;
let idAutorAEditar = null;

const obtenerAutores = async () => {
    try {
        const respuesta = await axios.get(URL_API);
        const autores =  respuesta.data;

        listaAutoresDiv.innerHTML = '';

        if (autores.length === 0) {
            listaAutoresDiv.innerHTML = '<p>No hay autores registrados.</p>';
            return;
        }

        autores.forEach(autor => {
            const tarjetaAutor = document.createElement('div');
            tarjetaAutor.style.border = '1px solid #ccc';
            tarjetaAutor.style.padding = '10px';
            tarjetaAutor.style.margin = '10px';

            tarjetaAutor.innerHTML = `
                <h4>${autor.nombre}</h4>
                <p>Año de nacimiento: ${autor.ano_nacimiento || 'Desconocido'}</p>
                <p>Nacionalidad: ${autor.nacionalidad || 'Desconocida'}</p>
                <button class="btn-ver-libros" onclick="window.location.href='libros.html?id=${autor.id}&nombre=${autor.nombre}'">Ver sus Libros</button>
                <button class="btn-editar" data-id="${autor.id}" data-nombre="${autor.nombre}" data-nacimiento="${autor.ano_nacimiento}" data-nacionalidad="${autor.nacionalidad}">Editar</button>
                <button class="btn-eliminar" data-id="${autor.id}">Eliminar</button>
            `;

            listaAutoresDiv.appendChild(tarjetaAutor);
        });

    } catch (error) {
        console.error('Error al obtener autores:', error);
        listaAutoresDiv.innerHTML = '<p>Error al contactar con el servidor.</p>';
    }
};

    listaAutoresDiv.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-editar')) {
            editandoAutor = true;
            idAutorAEditar = e.target.getAttribute('data-id');

            document.getElementById('nombre').value = e.target.getAttribute('data-nombre');
            document.getElementById('ano_nacimiento').value = e.target.getAttribute('data-nacimiento');
            document.getElementById('nacionalidad').value = e.target.getAttribute('data-nacionalidad');

            formAutor.querySelector('button').innerText = 'Guardar Cambios';
        }

        if (e.target.classList.contains('btn-eliminar')) {
            const id = e.target.getAttribute('data-id');
            if (confirm('¿Estás seguro de que deseas eliminar este autor?')) {
                await axios.delete(`${URL_API}/${id}`);
                obtenerAutores();
                alert('Autor eliminado con éxito');
            }
        }
    });

    formAutor.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nuevoAutor = {
            nombre: document.getElementById('nombre').value,
            ano_nacimiento: document.getElementById('ano_nacimiento').value,
            nacionalidad: document.getElementById('nacionalidad').value
        };

        if (nuevoAutor.nombre.trim() === '') {
            alert('El nombre del autor no puede estar vacío.');
            return;
        }

        try {
            if (editandoAutor) {
                await axios.put(`${URL_API}/${idAutorAEditar}`, nuevoAutor);
                editandoAutor = false;
                idAutorAEditar = null;
                formAutor.querySelector('button').innerText = 'Agregar Autor';
                alert('Autor editado con éxito');
            } else {
                await axios.post(URL_API, nuevoAutor);
                alert('Autor registrado con éxito');
            }

            formAutor.reset();
            obtenerAutores();
            
        } catch (error) {
            console.error('Error al registrar autor:', error);
            alert('Error al registrar autor');
        }
    });

    obtenerAutores();
