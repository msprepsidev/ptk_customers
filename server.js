const express = require('express')
const mongoose = require('mongoose')
const customerRoutes = require( './routers/customerRoutes.js');
const config = require('./config/config.js')
const { app: metricsApp } = require('./utils/metrics');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./utils/swagger.yaml');


const app = express();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', customerRoutes);
app.use(metricsApp);

mongoose.connect(config.mongoURI, { useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});

module.exports = app;
