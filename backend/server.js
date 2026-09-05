const { port } = require('./src/config/env');
const { connectDatabase } = require('./src/config/db');
const app = require('./src/app');

async function startServer() {
  await connectDatabase();
  app.listen(port, () => console.log(`Bhuskhalan AI Backend listening on port ${port}`));
}

startServer();
