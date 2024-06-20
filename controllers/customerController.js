const Customer = require( '../models/Customer.js');
const amqp = require('amqplib/callback_api');
const config = require("../config/config.js")
const logger = require("../config/logger.js")
require("dotenv").config()

function publishToQueue(queue, message) {
    amqp.connect('amqp://localhost' , function(error0, connection) {
        if (error0) {
            logger.error(`RabbitMQ connection error: ${error0}`);
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                logger.error(`RabbitMQ channel error: ${error1}`);
                throw error1;
            }
            channel.assertQueue(queue, { durable: false });
            channel.sendToQueue(queue, Buffer.from(message));
            logger.info(` [x] Sent ${message} to queue ${queue}`);
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
}
const CustomerController = {
    async createCustomer(req, res) {
        try {
            const newCustomerData = req.body;
            const newCustomer = new Customer(newCustomerData);
            await newCustomer.save();
            publishToQueue('customer_created', JSON.stringify(newCustomer));
            res.status(201).json(newCustomer);
        } catch (error) {
            logger.error(`Error creating product: ${error.message}`, { error, user: req.user });
            res.status(500).json({ message: 'Erreur lors de la création du nouveau client.' });
        }
    },
    async getCustomerById(req, res) {
        try {
            const customerId = req.params.id;
            console.log(`Recherche du client avec l'ID : ${customerId}`);
            const customer = await Customer.findById(customerId);

            if (!customer) {
                logger.info(`Client non trouvé`);
                return res.status(404).json({ message: 'Client non trouvé.' });
            }

            res.status(200).json(customer);
        } catch (error) {
            logger.error(`Erreur lors de la récupération du Client : ${error}`);
            res.status(500).json({ message: 'Erreur lors de la recherche du client.' });
        }
    },

    async getAllCustomers(req, res) {
        try {
            const customers = await Customer.find();
            res.json(customers);
        } catch (error) {
            logger.error(`Erreur lors de la récupération des clients : ${error}`);
            res.status(500).json({ message: 'Erreur lors de la récupération des clients depuis la base de données.' });
        }
    },

    async updateCustomer(req, res){
        try {
            const customerId = req.params.id;
            const updatedCustomerData = req.body;
            const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updatedCustomerData, { new: true, runValidators: true });

            if (!updatedCustomer) {
                return res.status(404).json({ message: 'Client non trouvé.' });
            }
            publishToQueue('customer_updated', JSON.stringify(updatedCustomer));
            res.status(200).json(updatedCustomer);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la mise à jour du client.' });
        }
    },
    async deleteCustomer(req, res) {
        try {
            const customerId = req.params.id;
            
            const deletedCustomer = await Customer.findByIdAndDelete(customerId);
            if (!deletedCustomer) {
                return res.status(404).json({ message: 'Client non trouvé.' });
            }
            publishToQueue('customer_deleted', JSON.stringify(deletedCustomer));
            res.status(200).json({ message: 'Client supprimé avec succès.' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression du client.' });
        }
    }
}

module.exports = CustomerController;