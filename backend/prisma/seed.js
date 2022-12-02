const { PrismaClient } = require('@prisma/client')
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient()
const bcrypt = require('bcrypt')

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Admin',
      role: "ADMIN",
      password: await bcrypt.hash('password',10)
    },
  })

  const visitor = await prisma.user.upsert({
    where: { email: 'visitor@visitor.com' },
    update: {},
    create: {
      email: 'visitor@visitor.com',
      name: 'Visitor',
      role:"VISITOR",
      password: await bcrypt.hash('password',10)
    },
  })

  const guide = await prisma.user.upsert({
    where: { email: 'guide@guide.com' },
    update: {},
    create: {
      email: 'guide@guide.com',
      name: 'Guide',
      role: "GUIDE",
      password: await bcrypt.hash('password',10)
    },
  })
  
  const cities = Array.apply(null, Array(5)).map(function () {
    return {
      name: faker.address.city()
    }
  })

  const city = await prisma.city.createMany({
    data: cities
  })

  const cityList = await prisma.city.findMany()
  const cityLength = cityList.length;
  const places = Array.apply(null, Array(100)).map(function(){
    return {
      name: faker.address.streetName(),
      cityId: cityList[Math.floor(Math.random()*cityLength)].id,
      featured: Math.round(Math.random())===0
    }
  })

  const place = await prisma.place.createMany({
    data:places
  })

  const placeList = await prisma.place.findMany()
  const placeLength = placeList.length
  const images = Array.apply(null, Array(1000)).map(function(){
    return {
      src: `/imgs/img-${Math.ceil(Math.random()*12)}.jpg`,
      placeId: placeList[Math.floor(Math.random()*placeLength)].id
    }
  })
  const image = await prisma.image.createMany({
    data: images
  })
  console.log({ admin,visitor,guide })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })