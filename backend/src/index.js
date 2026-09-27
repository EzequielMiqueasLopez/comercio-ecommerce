const app = require('./app');
const env = require('./infrastructure/config/env');

app.listen(env.port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${env.port}`);
});
