import { faker } from '@faker-js/faker';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// function main() {
//   Array.from({length: 10}).map(async (_,i)=>{
//     const randomUserId = faker.number.int();
//     await prisma.wallet.create({
//       data: {
//         name: faker.person.fullName(),
//         amount: faker.number.float(),
//         createdAt: faker.date.anytime(),
//         ownership_user: { connect: { id: randomUserId } }
//       }
//     })
//   })
// }
// main()
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    await Promise.all(
      Array.from({ length: 10 }).map(async (_, i) => {
        const randomUserId = faker.datatype.number(); // Sử dụng faker.datatype.number() thay cho faker.number.int()
        await prisma.wallet.create({
          data: {
            name: faker.name.fullName(), // Sử dụng faker.name.findName() để tạo tên ngẫu nhiên
            amount: faker.datatype.float(), // Sử dụng faker.datatype.float() thay cho faker.number.float()
            createdAt: faker.date.past(), // Sử dụng faker.date.past() để tạo ngày thời gian ngẫu nhiên
            ownership_user: { connect: { id: randomUserId } }
          }
        });
      })
    );
    console.log('Data seeding completed successfully.');
  } catch (error) {
    console.error('Data seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
