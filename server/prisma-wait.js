// prisma-wait.js
const { PrismaClient, Prisma } = require('./src/generated');


const prisma = new PrismaClient();

async function main() {
  const maxRetries = 10;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await prisma.$connect();
      console.log('✅ Prisma connected successfully');
      await prisma.$disconnect();
      process.exit(0);
    } catch (err) {
      attempt++;
      console.log(`❌ Prisma not ready yet, retrying (${attempt}/${maxRetries})...`);
      await new Promise(res => setTimeout(res, 3000)); // wait 3 seconds
    }
  }
  // This is it

  console.error('🔥 Could not connect to database after max retries');
  process.exit(1);
}

main();
