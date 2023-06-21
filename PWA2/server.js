const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

//conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/deathnotes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conectado ao banco de dados MongoDB');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao banco de dados MongoDB', err);
  });

//objeto Death Note
const deathNoteSchema = new mongoose.Schema({
  nome: String,
  causa: String,
  detalhes: String
});


const DeathNote = mongoose.model('DeathNote', deathNoteSchema);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota principal
app.get('/', async (req, res) => {
  try {
    const deathNotes = await DeathNote.find();
    res.render('index', { deathNotes });
  } catch (err) {
    console.error('Erro ao buscar as notas de morte:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para adicionar uma nova nota de morte
app.post('/adicionar', async (req, res) => {
  try {
    const { nome, causa, detalhes } = req.body;
    const deathNote = new DeathNote({ nome, causa, detalhes });
    await deathNote.save();
    res.redirect('/');
  } catch (err) {
    console.error('Erro ao salvar a nota de morte:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para excluir uma nota de morte
app.post('/excluir/:id', (req, res) => {
  const id = req.params.id;

  DeathNote.findByIdAndRemove(id)
    .then(() => {
      console.log('Registro excluído com sucesso');
      res.redirect('/');
    })
    .catch((error) => {
      console.error('Erro ao excluir registro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    });
});

// Rota para editar uma nota de morte
app.get('/editar/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deathNote = await DeathNote.findById(id);
    res.render('editar', { deathNote });
  } catch (err) {
    console.error('Erro ao buscar a nota de morte para edição:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

// Rota para atualizar uma nota de morte
app.post('/atualizar/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, causa, detalhes } = req.body;
    await DeathNote.findByIdAndUpdate(id, { nome, causa, detalhes });
    res.redirect('/');
  } catch (err) {
    console.error('Erro ao atualizar a nota de morte:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
