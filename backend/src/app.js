const express = require('express');
const cors = require('cors');
const knex = require('knex');

const app = express();
app.use(cors());
app.use(express.json());

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: 'bibliotecadb.db'
    },
    useNullAsDefault: true
});

app.post('/autores', async (req, res) => {
    try {
        const { nombre, ano_nacimiento, nacionalidad } = req.body;
        await db('autores').insert({ nombre, ano_nacimiento, nacionalidad });
        res.status(201).json({ mensaje: "Autor creado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/libros', async (req, res) => {
    try {
        const { titulo, ano_publicacion, descripcion, genero, id_autor } = req.body;
        await db('libros').insert({ 
            titulo, 
            ano_publicacion, 
            descripcion, 
            genero, 
            id_autor 
        });
        res.status(201).json({ mensaje: "Libro registrado y vinculado al autor" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/autores', async (req, res) => {
    try {
    const autores = await db('autores').select('*');
    res.status(200).json(autores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/libros', async (req, res) => {
    const libros = await db('libros').select('*');
    res.status(200).json(libros);
});

app.listen(8080, () => {
    console.log('El backend se ha iniciado en el puerto 8080');
});