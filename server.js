const express = require('express')
const mongoose = require('mongoose')
// import bodyParser from 'body-parser';
// import axios from 'axios';

const customerRoutes = require( './routers/customerRoutes.js');
const CustomerController = require ('./controllers/customerController.js')
const Customer = require ('./models/Customer.js')

const app = express();
app.use('/api', customerRoutes);
const url = 'mongodb+srv://papa:passer123@cluster0.1qaei.mongodb.net/customers?retryWrites=true&w=majority&appName=Cluster0';
function connect(){
  try{
      mongoose.connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true
      });
      console.log('Connected to the database');
  }
  catch(err){
      console.log(err);
  }
}
connect();

const customers = [
  {
            name: 'John',
            lastname: 'DOE',
            email: 'john@example.com',
            phone: '1234567890',
            adress: {
                postalCode: 1234,
                city: 'New York',
                street: '5th Avenue',
              },
            company: true,
        }
]; 
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// app.get('/customers', CustomerController.getAllCustomers);
// app.post('/customers', CustomerController.createCustomer)
// app.get('/customer', CustomerController.createCustomer)

module.exports = app;


// const mockApiUrl = 'https://6606d9f9be53febb857ec4eb.mockapi.io/api/v1/customers';

// let authToken = null;