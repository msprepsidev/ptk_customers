const express = require('express')
const mongoose = require('mongoose')
const customerRoutes = require( './routers/customerRoutes.js');
const config = require('./config/config.js')

const app = express();
app.use('/api', customerRoutes);
mongoose.connect(config.mongoURI, { useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});

module.exports = app;
