const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { getToken } = require('./usertesthelper')
const Customer = require('../models/customer')
const { initialCustomers, initCustomers, customersInDb, nonExistingId } = require('./customerstesthelper')

describe('GET /api/customers', () => {

  let token = null

  beforeAll(async () => {
    await initCustomers()
    token = await getToken('testadmin3')
  })

  it('works', async () => {
    await api
      .get('/api/customers')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
  })

  it('returns customers as json', async () => {
    await api
      .get('/api/customers')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  it('returns the correct number of customers', async () => {
    const response = await api
      .get('/api/customers')
      .set('Authorization', 'Bearer ' + token)

    expect(response.body.length).toBe(initialCustomers.length)
  })

  it('returns all customers', async () => {
    const response = await api
      .get('/api/customers')
      .set('Authorization', 'Bearer ' + token)

    const customerNames = response.body.map(c => c.lastName)
    initialCustomers.forEach(c => expect(customerNames).toContain(c.lastName))
  })
})

describe('POST /api/customers', () => {

  let token = null
  beforeEach(async () => {
    await initCustomers()
    token = await getToken('testadmin3')
  })

  it('adds a customer', async () => {
    const newCustomer = {
      lastName: 'Tomer4',
      firstName: 'Cus4',
      company: 'Comp4',
      email: 'test4@comp4.com',
      phone: '444-444 444',
      billingAddress: {
        street1: 'Test st 4',
        street2: 'Test st 4 II',
        zip: '44444',
        city: 'Fourton',
        country: 'Fourstan'
      },
      isInvoicable: true
    }

    const customersBefore = await customersInDb()

    await api
      .post('/api/customers')
      .set('Authorization', 'Bearer ' + token)
      .send(newCustomer)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const customersAfter = await customersInDb()
    const customerNames = customersAfter.map(c => c.lastName)

    expect(customersAfter.length).toBe(customersBefore.length + 1)
    expect(customerNames).toContain(newCustomer.lastName)
  })

})

afterAll(async () => {
  await server.close()
})