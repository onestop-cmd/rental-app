const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');
const Tenant = require('../models/Tenant');
const RentSchedule = require('../models/RentSchedule');
const Expense = require('../models/Expense');
const BankDeposit = require('../models/BankDeposit');

// GET /api/seed/all
router.get('/all', async (req, res) => {
  try {
    // --- Users ---
    let adminUser = await User.findOne({ email: 'admin@salim.pm' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@salim.pm',
        password: hashedPassword,
        role: 'admin'
      });
    }

    const regularUsers = [
      { name: 'User One', email: 'user1@salim.pm', password: 'user123', role: 'user' },
      { name: 'User Two', email: 'user2@salim.pm', password: 'user123', role: 'user' },
      { name: 'User Three', email: 'user3@salim.pm', password: 'user123', role: 'user' }
    ];

    for (const u of regularUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({ name: u.name, email: u.email, password: hashedPassword, role: u.role });
      }
    }

    // --- Properties ---
    const demoProperties = [
      { builderName: 'Builder A', buildingNumber: '101', unitNumber: '1A', address: '123 Main St' },
      { builderName: 'Builder B', buildingNumber: '102', unitNumber: '2B', address: '456 Elm St' }
    ];

    const createdProperties = [];
    for (const p of demoProperties) {
      let prop = await Property.findOne({ buildingNumber: p.buildingNumber, unitNumber: p.unitNumber });
      if (!prop) prop = await Property.create(p);
      createdProperties.push(prop);
    }

    // --- Tenants ---
    const demoTenants = [
      { name: 'Tenant One', property: createdProperties[0]._id, rent: 1000, paid: false },
      { name: 'Tenant Two', property: createdProperties[1]._id, rent: 1200, paid: true }
    ];

    const createdTenants = [];
    for (const t of demoTenants) {
      let tenant = await Tenant.findOne({ name: t.name });
      if (!tenant) tenant = await Tenant.create(t);
      createdTenants.push(tenant);
    }

    // --- Rent Schedule ---
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    for (const tenant of createdTenants) {
      if (!(await RentSchedule.findOne({ tenant: tenant._id, month }))) {
        await RentSchedule.create({
          tenant: tenant._id,
          month,
          amount: tenant.rent,
          status: tenant.paid ? 'paid' : 'unpaid'
        });
      }
    }

    // --- Expenses ---
    for (const property of createdProperties) {
      if (!(await Expense.findOne({ property: property._id }))) {
        await Expense.create({
          description: 'Maintenance',
          amount: 100,
          property: property._id,
          createdBy: adminUser._id // ✅ use ObjectId
        });
      }
    }

    // --- Bank Deposits ---
    for (const property of createdProperties) {
      if (!(await BankDeposit.findOne({ property: property._id }))) {
        await BankDeposit.create({
          property: property._id,
          depositedBy: adminUser._id, // ✅ use ObjectId
          depositDate: new Date(),
          depositMonth: month,
          amount: 1000,
          description: 'Initial deposit'
        });
      }
    }

    res.status(200).send('Demo data seeded successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error seeding demo data.');
  }
});

module.exports = router;
