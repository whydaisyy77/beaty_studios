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
      name: 'Адміністратор',
      email: 'admin@beautysalon.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin created:', admin.email);

  const services = [
    { name: 'Жіноча стрижка', description: 'Стрижка, укладання, оформлення форми', price: 600, duration: 60, category: 'Волосся' },
    { name: 'Чоловіча стрижка', description: 'Стрижка та оформлення', price: 350, duration: 40, category: 'Волосся' },
    { name: 'Фарбування волосся', description: 'Повне фарбування в один тон', price: 1200, duration: 120, category: 'Волосся' },
    { name: 'Бальяж / Омбре', description: 'Техніка плавного переходу кольору', price: 1800, duration: 150, category: 'Волосся' },
    { name: 'Ламінування волосся', description: 'Відновлення та блиск волосся', price: 900, duration: 90, category: 'Волосся' },
    { name: 'Класичний манікюр', description: 'Зрізний манікюр + покриття лаком', price: 380, duration: 60, category: 'Нігті' },
    { name: 'Манікюр гель-лак', description: 'Манікюр з покриттям гель-лаком', price: 550, duration: 90, category: 'Нігті' },
    { name: 'Nail-арт', description: 'Художній розпис та дизайн нігтів', price: 200, duration: 30, category: 'Нігті' },
    { name: 'Педикюр апаратний', description: 'Апаратний педикюр + покриття', price: 550, duration: 90, category: 'Нігті' },
    { name: 'Денний макіяж', description: 'Легкий денний макіяж', price: 700, duration: 60, category: 'Макіяж' },
    { name: 'Вечірній макіяж', description: 'Насичений вечірній макіяж', price: 1000, duration: 90, category: 'Макіяж' },
    { name: 'Весільний макіяж', description: 'Макіяж на весілля з пробним', price: 1500, duration: 120, category: 'Макіяж' },
    { name: 'Нарощування вій (класика)', description: 'Класичне нарощування', price: 900, duration: 120, category: 'Вії' },
    { name: 'Нарощування вій (2D/3D)', description: "Об'ємне нарощування", price: 1200, duration: 150, category: 'Вії' },
    { name: 'Корекція вій', description: 'Виправлення та доповнення', price: 500, duration: 60, category: 'Вії' },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service }).catch(() => {});
  }
  console.log('Services seeded');

  const masters = [
    {
      name: 'Анна Козлова',
      specialty: 'Волосся & Фарбування',
      bio: 'Спеціаліст з фарбування та стрижок з 8-річним досвідом. Майстер бальяжу та омбре.',
      photoUrl: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=500&h=500&fit=crop&q=80',
    },
    {
      name: 'Марія Іванова',
      specialty: 'Манікюр & Педикюр',
      bio: 'Майстер манікюру та педикюру, художній розпис нігтів. 6 років у nail-індустрії.',
      photoUrl: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&h=500&fit=crop&q=80',
    },
    {
      name: 'Олена Петрова',
      specialty: 'Макіяж & Брови',
      bio: 'Візажист та спеціаліст з оформлення брів. 5 років досвіду. Весільний та вечірній макіяж.',
      photoUrl: 'https://images.unsplash.com/photo-1589710751893-f9a6770ad71b?w=500&h=500&fit=crop&q=80',
    },
    {
      name: 'Тетяна Мороз',
      specialty: 'Нарощування вій',
      bio: 'Сертифікований майстер з нарощування вій. Класика, 2D, 3D об\'єм.',
      photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop&q=80',
    },
  ];

  const createdMasters = [];
  for (const master of masters) {
    const m = await prisma.master.create({ data: master }).catch(() => null);
    if (m) createdMasters.push(m);
  }
  console.log('Masters seeded');

  for (const master of createdMasters) {
    for (let day = 1; day <= 6; day++) {
      await prisma.schedule.upsert({
        where: { masterId_dayOfWeek: { masterId: master.id, dayOfWeek: day } },
        update: {},
        create: { masterId: master.id, dayOfWeek: day, startTime: '09:00', endTime: '19:00', isWorking: true },
      });
    }
  }
  console.log('Schedules seeded');

  const gallery = [
    { imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=700&h=700&fit=crop&q=80', category: 'Волосся', title: 'Стрижка та укладання', isFeatured: true },
    { imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=700&h=700&fit=crop&q=80', category: 'Волосся', title: 'Фарбування бальяж', isFeatured: true },
    { imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=700&h=700&fit=crop&q=80', category: 'Нігті', title: 'Манікюр гель-лак', isFeatured: true },
    { imageUrl: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=700&h=700&fit=crop&q=80', category: 'Нігті', title: 'Nail-арт', isFeatured: true },
    { imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=700&h=700&fit=crop&q=80', category: 'Макіяж', title: 'Вечірній макіяж', isFeatured: true },
    { imageUrl: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=700&h=700&fit=crop&q=80', category: 'Вії', title: 'Нарощування вій', isFeatured: true },
    { imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=700&h=700&fit=crop&q=80', category: 'Волосся', title: 'Укладання', isFeatured: false },
    { imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=700&h=700&fit=crop&q=80', category: 'Волосся', title: 'Омбре', isFeatured: false },
    { imageUrl: 'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=700&h=700&fit=crop&q=80', category: 'Макіяж', title: 'Денний макіяж', isFeatured: false },
  ];

  for (const item of gallery) {
    await prisma.gallery.create({ data: item }).catch(() => {});
  }
  console.log('Gallery seeded');

  console.log('\n✅ Database seeded successfully!');
  console.log('Admin login: admin@beautysalon.com / admin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
