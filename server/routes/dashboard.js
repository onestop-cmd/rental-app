const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Property = require('../models/Property');
const Tenant = require('../models/Tenant');
const Expense = require('../models/Expense');
const BankDeposit = require('../models/BankDeposit');

// Dashboard summary
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [properties, tenants, expenses, deposits] = await Promise.all([
      Property.find(),
      Tenant.find().populate('property'),
      Expense.find(),
      BankDeposit.find(),
    ]);

    // Overdue tenants
    const overdueTenants = tenants
      .map((t) => {
        const overdue = t.payments.filter((p) => p.status === "due");
        if (overdue.length > 0) {
          return {
            _id: t._id,
            name: t.name,
            monthlyRent: t.monthlyRent,
            propertyName: t.property?.builderName || "Unknown",
            overdueMonths: overdue.map((p) => p.month),
          };
        }
        return null;
      })
      .filter(Boolean);

    // Monthly totals
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const rentCollected = tenants.reduce((sum, t) => {
      return sum + t.payments
        .filter((p) => p.month === currentMonth && p.status === "paid")
        .reduce((s, p) => s + p.amount, 0);
    }, 0);

    const monthlyExpenses = expenses
      .filter((e) => e.date.toISOString().startsWith(currentMonth))
      .reduce((s, e) => s + e.amount, 0);

    const monthlyDeposits = deposits
      .filter((d) => d.date.toISOString().startsWith(currentMonth))
      .reduce((s, d) => s + d.amount, 0);

    res.json({
      totalProperties: properties.length,
      totalTenants: tenants.length,
      totalExpenses: expenses.length,
      totalDeposits: deposits.length,
      overdueCount: overdueTenants.length,
      overdueTenants,
      monthlyTotals: {
        rentCollected,
        monthlyExpenses,
        monthlyDeposits,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dashboard" });
  }
});

module.exports = router;
