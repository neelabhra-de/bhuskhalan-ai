const app = require('./src/app'); 
const { port } = require('./src/config/env'); 

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.log('❌ MongoDB connection failed:', err.message);
  });

app.listen(port, () => console.log(`Bhuskhalan AI Backend listening on port ${port}`));