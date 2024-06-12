const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CustomerController = require('../controllers/customerController');
const Customer = require('../models/Customer');
const config = require('../config/config')

const app = express();
app.use(bodyParser.json());

app.post('/customers', CustomerController.createCustomer);
app.get('/customers/:id', CustomerController.getCustomerById);
app.get('/customers', CustomerController.getAllCustomers);
app.put('/customers/:id', CustomerController.updateCustomer);
app.delete('/customers/:id', CustomerController.deleteCustomer);

beforeAll(async () => {
    const url = config.mongoURI;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('Customer Controller', () => {
    let customerId;

    it('should create a new customer', async () => {
        const response = await request(app)
            .post('/customers')
            .send({
                name: 'John',
                lastname: 'Doe',
                email: 'john.doe@example.com',
                phone: 123456789,
                address: {
                    postalCode: 12345,
                    city: 'Test City',
                    street: '123 Test Street'
                },
                company: false
            });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('John');
        customerId = response.body._id;
    });

    it('should get a customer by ID', async () => {
        const response = await request(app).get(`/customers/${customerId}`);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe('John');
    });

    it('should get all customers', async () => {
        const response = await request(app).get('/customers');
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should update a customer', async () => {
        const response = await request(app)
            .put(`/customers/${customerId}`)
            .send({
                name: 'Jane',
                lastname: 'Doe',
                email: 'jane.doe@example.com',
                phone: 987654321,
                address: {
                    postalCode: 54321,
                    city: 'Updated City',
                    street: '321 Updated Street'
                },
                company: true
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Jane');
    });

    it('should delete a customer', async () => {
        const response = await request(app).delete(`/customers/${customerId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Client supprimé avec succès.');
    });
});
