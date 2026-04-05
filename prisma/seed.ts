import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Bharat Merchants',
    },
  });

  console.log(`Created Organization: ${org.name} (ID: ${org.id})`);

  // 2. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'rahul@spendwise.in',
      name: 'Rahul Sharma',
      password: hashedPassword,
      memberships: {
        create: {
          organizationId: org.id,
          role: 'admin',
        },
      },
    },
  });

  console.log(`Created Admin: ${admin.name}`);

  // 3. Create Viewers (5 viewers)
  const viewersData = [
    { name: 'Priya Patel', email: 'priya@spendwise.in' },
    { name: 'Amit Verma', email: 'amit@spendwise.in' },
    { name: 'Anjali Gupta', email: 'anjali@spendwise.in' },
    { name: 'Suresh Menon', email: 'suresh@spendwise.in' },
    { name: 'Vikram Singh', email: 'vikram@spendwise.in' },
  ];

  for (const viewer of viewersData) {
    const u = await prisma.user.create({
      data: {
        ...viewer,
        password: hashedPassword,
        memberships: {
          create: {
            organizationId: org.id,
            role: 'viewer',
          },
        },
      },
    });
    console.log(`Created Member: ${u.name}`);
  }

  // 4. Create Transactions (15 transactions with Indian context)
  const transactions = [
    { title: 'Monthly Salary', amount: 85000.0, category: 'Work', type: 'Income', status: 'Approved', date: new Date('2024-03-01') },
    { title: 'Apartment Rent', amount: 25000.0, category: 'Housing', type: 'Expense', status: 'Approved', date: new Date('2024-03-02') },
    { title: 'Big Bazaar Groceries', amount: 4500.0, category: 'Food', type: 'Expense', status: 'Approved', date: new Date('2024-03-05') },
    { title: 'Swiggy Dinner', amount: 850.0, category: 'Food', type: 'Expense', status: 'Pending', date: new Date('2024-03-06') },
    { title: 'Electricity (MSEB)', amount: 2200.0, category: 'Utilities', type: 'Expense', status: 'Approved', date: new Date('2024-03-10') },
    { title: 'Fixed Deposit Interest', amount: 12000.0, category: 'Investment', type: 'Income', status: 'Approved', date: new Date('2024-03-12') },
    { title: 'Freelance Project Pay', amount: 15000.0, category: 'Work', type: 'Income', status: 'Approved', date: new Date('2024-03-15') },
    { title: 'Petrol Refill', amount: 3500.0, category: 'Transport', type: 'Expense', status: 'Approved', date: new Date('2024-03-18') },
    { title: 'Zomato Lunch', amount: 600.0, category: 'Food', type: 'Expense', status: 'Rejected', date: new Date('2024-03-20') },
    { title: 'Jio Fiber Broadband', amount: 999.0, category: 'Utilities', type: 'Expense', status: 'Approved', date: new Date('2024-03-22') },
    { title: 'Health Insurance (Star)', amount: 5000.0, category: 'Health', type: 'Expense', status: 'Approved', date: new Date('2024-03-25') },
    { title: 'Stock Market Dividend', amount: 2500.0, category: 'Investment', type: 'Income', status: 'Approved', date: new Date('2024-03-26') },
    { title: 'Monthly Milk (Amul)', amount: 1800.0, category: 'Food', type: 'Expense', status: 'Approved', date: new Date('2024-03-28') },
    { title: 'Movie Night - PVR', amount: 1200.0, category: 'Entertainment', type: 'Expense', status: 'Approved', date: new Date('2024-03-29') },
    { title: 'Airtel Postpaid Bill', amount: 799.0, category: 'Utilities', type: 'Expense', status: 'Pending', date: new Date('2024-03-31') },
  ];

  for (const t of transactions) {
    await prisma.transaction.create({
      data: {
        ...t,
        organizationId: org.id,
      },
    });
  }

  console.log(`Seeded ${transactions.length} transactions.`);
  console.log(`\n✅ Seeding finished successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
