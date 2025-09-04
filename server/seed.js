require('dotenv').config();
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Property = require('./models/Property');
const Tenant = require('./models/Tenant');
const Expense = require('./models/Expense');
const BankDeposit = require('./models/BankDeposit');
const RentSchedule = require('./models/RentSchedule');

async function seed(){
  await connectDB();
  await Promise.all([User.deleteMany(), Property.deleteMany(), Tenant.deleteMany(), Expense.deleteMany(), BankDeposit.deleteMany(), RentSchedule.deleteMany()]);
  const adminPass = await bcrypt.hash('admin123',10);
  const userPass = await bcrypt.hash('user123',10);
  const admin = await User.create({ name: 'Admin', email: 'admin@salim.pm', password: adminPass, role: 'admin' });
  const u1 = await User.create({ name: 'Alice', email: 'alice@salim.pm', password: userPass, role: 'user' });
  const u2 = await User.create({ name: 'Bob', email: 'bob@salim.pm', password: userPass, role: 'user' });
  const u3 = await User.create({ name: 'Charlie', email: 'charlie@salim.pm', password: userPass, role: 'user' });

  const p1 = await Property.create({ builderName: 'Builder A', buildingNumber: '12', unitNumber: '1A', address: '123 Main St' });
  const p2 = await Property.create({ builderName: 'Builder B', buildingNumber: '5', unitNumber: '2B', address: '456 Oak Ave' });

  const t1 = await Tenant.create({ name: 'Tenant One', email: 't1@example.com', phone: '111-222-3333', property: p1._id, rent: 1200 });
  const t2 = await Tenant.create({ name: 'Tenant Two', email: 't2@example.com', phone: '222-333-4444', property: p2._id, rent: 900 });

  const expense1 = await Expense.create({ description: 'Plumbing', amount: 150, property: p1._id, createdBy: admin._id });
  const expense2 = await Expense.create({ description: 'Painting', amount: 200, property: p2._id, createdBy: u1._id });

  const month = "2025-09";
  const rent1 = await RentSchedule.create({ tenant: t1._id, month, amount: 1200, status: 'paid' });
  const rent2 = await RentSchedule.create({ tenant: t2._id, month, amount: 900, status: 'unpaid' });

  const deposit1 = await BankDeposit.create({ property: p1._id, depositedBy: admin._id, depositDate: new Date(), depositMonth: month, amount: 1200, description: 'Deposit rent for p1' });

  console.log('Seeded data for month', month);
  process.exit(0);
}

seed().catch(err=>{ console.error(err); process.exit(1); });
