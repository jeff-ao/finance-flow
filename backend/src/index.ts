import express from 'express';

const app = express();
const port = 3000;

app.get('/', (_req, res) => {
  res.send('Servidor Express está rodando com sucesso! 🚀');
});

app.listen(port, () => {
  console.log(`🚀 Servidor ouvindo em http://localhost:${port}`);
});

