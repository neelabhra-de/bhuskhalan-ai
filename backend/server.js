const app = require('./src/app');
const { port } = require('./src/config/env');

app.listen(port, () => console.log(`Bhuskhalan AI Backend listening on port ${port}`));
