const Customer = require( '../models/Customer.js');

const CustomerController = {
    async createCustomer(req, res) {
        try {
            const newCustomerData = req.body;
            const newCustomer = new Customer(newCustomerData);
            await newCustomer.save();
            res.status(201).json(newCustomer);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la création du nouveau client.' });
        }
    },
    async getCustomerById(req, res) {
        try {
            const customerId = req.params.id;
            console.log(`Recherche du client avec l'ID : ${customerId}`);
            const customer = await Customer.findById(customerId);

            if (!customer) {
                return res.status(404).json({ message: 'Client non trouvé.' });
            }

            res.status(200).json(customer);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la recherche du client.' });
        }
    },

    async getAllCustomers(req, res) {
        try {
            const customers = await Customer.find();
            res.json(customers);
        } catch (error) {
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

            res.status(200).json(updatedCustomer);
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la mise à jour du client.' });
        }
    },

    async deleteCustomer(req, res) {
        try {
            const deletedCustomer = await Customer.findOneAndDelete({ id: req.params.id });
            if (!deletedCustomer) {
                return res.status(404).json({ message: 'Client non trouvé.' });
            }
            res.json({ message: 'Client supprimé avec succès.' });
        } catch (error) {
            res.status(500).json({ message: 'Erreur lors de la suppression du client.' });
        }
    }
}

module.exports = CustomerController;