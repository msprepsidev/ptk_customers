const express = require('express')
const router = express.Router();
const CustomerController = require ('../controllers/customerController.js')
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/customer', authenticateToken, authorizeRole(['developper', 'sales']), CustomerController.createCustomer);
router.get('/customers', authenticateToken, authorizeRole(['developper', 'customers', 'sales', 'marketing', 'management']), CustomerController.getAllCustomers);
router.get('/customer/:id', authenticateToken, authorizeRole(['developper', 'customers', 'sales', 'marketing', 'management']), CustomerController.getCustomerById);
router.put('/customer/:id', authenticateToken, authorizeRole(['developper', 'customers', 'sales', 'management']), CustomerController.updateCustomer);
router.delete('/customer/:id', authenticateToken, authorizeRole(['management']), CustomerController.deleteCustomer);

module.exports = router;