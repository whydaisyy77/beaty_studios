const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@beautysalon.com' },
    update: {},
    create: {
      name: 'Администратор',
      email: 'admin@beautysalon.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin created:', admin.email);

  const services = [
    { name: 'Женская стрижка', description: 'Стрижка, укладка, оформление формы', price: 1500, duration: 60, category: 'Волосы' },
    { name: 'Мужская стрижка', description: 'Стрижка и оформление', price: 800, duration: 40, category: 'Волосы' },
    { name: 'Окрашивание волос', description: 'Полное окрашивание в один тон', price: 3500, duration: 120, category: 'Волосы' },
    { name: 'Маникюр классический', description: 'Обрезной маникюр + покрытие лаком', price: 900, duration: 60, category: 'Ногти' },
    { name: 'Маникюр гель-лак', description: 'Маникюр с покрытием гель-лаком', price: 1400, duration: 90, category: 'Ногти' },
    { name: 'Педикюр', description: 'Классический педикюр', price: 1200, duration: 90, category: 'Ногти' },
    { name: 'Макияж дневной', description: 'Лёгкий дневной макияж', price: 2000, duration: 60, category: 'Макияж' },
    { name: 'Макияж вечерний', description: 'Насыщенный вечерний макияж', price: 3000, duration: 90, category: 'Макияж' },
    { name: 'Наращивание ресниц', description: 'Классическое наращивание', price: 2500, duration: 120, category: 'Ресницы' },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: services.indexOf(service) + 1 },
      update: {},
      create: service,
    });
  }
  console.log('Services seeded');

  const masters = [
    { name: 'Анна Козлова', specialty: 'Волосы', bio: 'Специалист по окрашиванию и стрижкам с 8-летним опытом' },
    { name: 'Мария Иванова', specialty: 'Ногтевой сервис', bio: 'Мастер маникюра и педикюра, художественная роспись ногтей' },
    { name: 'Елена Петрова', specialty: 'Макияж и брови', bio: 'Визажист, специалист по оформлению бровей' },
  ];

  for (const master of masters) {
    await prisma.master.create({ data: master }).catch(() => {});
  }
  console.log('Masters seeded');

  const mastersCreated = await prisma.master.findMany();
  for (const master of mastersCreated) {
    for (let day = 1; day <= 6; day++) {
      await prisma.schedule.upsert({
        where: { masterId_dayOfWeek: { masterId: master.id, dayOfWeek: day } },
        update: {},
        create: {
          masterId: master.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '19:00',
          isWorking: day !== 0,
        },
      });
    }
  }
  console.log('Schedules seeded');

  console.log('Database seeded successfully!');
  console.log('Admin login: admin@beautysalon.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
