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

  it('prevents access without authentication', async () => {
    await api
      .get('/api/customers')
      .expect(403)
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
      firstNames: 'Cus4',
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

  it('prevents adding a customer without authentication', async () => {
    const newCustomer = {
      lastName: 'Tomer4',
      firstNames: 'Cus4',
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
      .send(newCustomer)
      .expect(403)
  })

  it('does not accept a customer without both a last name and a company', async () => {
    const newCustomer = {
      lastName: '',
      firstNames: 'Cus4',
      company: '',
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

    const response = await api
      .post('/api/customers')
      .set('Authorization', 'Bearer ' + token)
      .send(newCustomer)
      .expect(400)

    const customersAfter = await customersInDb()
    expect(customersAfter.length).toBe(customersBefore.length)
    expect(response.body).toEqual({ error: 'either company or last name must be provided' })
  })

  it('accepts a customer without a last name but with a company', async () => {
    const newCustomer = {
      lastName: '',
      firstNames: 'Cus4',
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

    const customersAfter = await customersInDb()
    expect(customersAfter.length).toBe(customersBefore.length + 1)
  })
})

describe('PUT /api/customers/:id', () => {

  let token = null

  beforeEach(async () => {
    await initCustomers()
    token = await getToken('testadmin3')
  })

  it('updates an existing customer', async () => {
    const customersBefore = await customersInDb()

    const target = customersBefore[1]
    target.lastName = 'Updatedlastname'
    target.firstNames = 'Updatedfirstname'
    target.company = 'Updatedcompany'
    target.email = 'Newemail'
    target.phone = '5555'
    target.billingAddress.street1 = 'Newstreet1'
    target.billingAddress.street2 = 'Newstreet2'
    target.billingAddress.zip = '9999'
    target.billingAddress.city = 'newcity'
    target.billingAddress.country = 'newcountry'
    target.isInvoicable = true

    await api
      .put(`/api/customers/${target._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const customersAfter = await customersInDb()
    const match = customersAfter.find(c => c._id.toString() === target._id.toString())
    expect(match.toJSON()).toEqual(target.toJSON())
  })

  it('prevents updating a customer without authentication', async () => {
    const customersBefore = await customersInDb()

    const target = customersBefore[1]
    target.lastName = 'Newname'

    await api
      .put(`/api/customers/${target._id}`)
      .send(target)
      .expect(403)

    const customersAfter = await customersInDb()
    const names = customersAfter.map(c => c.lastName)
    expect(customersAfter.length).toBe(customersBefore.length)
    expect(names).not.toContain(target.lastName)
  })

  it('returns error for non-existing id', async () => {
    const nonId = await nonExistingId()
    const customersBefore = await customersInDb()

    const target = customersBefore[1]
    target.lastName = 'Newname'

    await api
      .put(`/api/customers/${nonId}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const customersAfter = await customersInDb()
    const names = customersAfter.map(c => c.lastName)
    expect(customersAfter.length).toBe(customersBefore.length)
    expect(names).not.toContain(target.lastName)
  })

  it('does not accept customer without both last name and company', async () => {
    const customersBefore = await customersInDb()

    const originalTarget = customersBefore[1]
    const target = {
      lastName: '',
      firstNames: 'Updatedfirstname',
      company: '',
      email: 'Newemail',
      phone: '5555',
      billingAddress: {}
    }

    const response = await api
      .put(`/api/customers/${originalTarget._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(400)

    const customersAfter = await customersInDb()
    const match = customersAfter.find(c => c._id.toString() === originalTarget._id.toString())
    expect(customersAfter.length).toBe(customersBefore.length)
    expect(match.toJSON()).toEqual(originalTarget.toJSON())
  })

  it('accepts a customer without a last name but with company', async () => {
    const customersBefore = await customersInDb()

    const originalTarget = customersBefore[1]
    const target = {
      lastName: '',
      firstNames: 'Updatedfirstname',
      company: 'Comp4',
      email: 'Newemail',
      phone: '5555',
      billingAddress: {},
      isInvoicable: true
    }

    await api
      .put(`/api/customers/${originalTarget._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(200)

    const customersAfter = await customersInDb()
    const match = customersAfter.find(c => c._id.toString() === originalTarget._id.toString())
    expect(customersAfter.length).toBe(customersBefore.length)
    expect(match.lastName).toEqual(target.lastName)
    expect(match.firstNames).toEqual(target.firstNames)
    expect(match.company).toEqual(target.company)
    expect(match.email).toEqual(target.email)
    expect(match.phone).toEqual(target.phone)
    expect(match.billingAddress.toJSON()).toEqual(target.billingAddress)
    expect(match.isInvoicable).toEqual(target.isInvoicable)
  })

  it('accepts a customer with a last name but without a company', async () => {
    const customersBefore = await customersInDb()

    const originalTarget = customersBefore[1]
    const target = {
      lastName: 'Newlastname',
      firstNames: 'Updatedfirstname',
      company: '',
      email: 'Newemail',
      phone: '5555',
      billingAddress: {},
      isInvoicable: true
    }

    await api
      .put(`/api/customers/${originalTarget._id}`)
      .set('Authorization', 'Bearer ' + token)
      .send(target)
      .expect(200)

    const customersAfter = await customersInDb()
    const match = customersAfter.find(c => c._id.toString() === originalTarget._id.toString())
    expect(customersAfter.length).toBe(customersBefore.length)
    expect(match.lastName).toEqual(target.lastName)
    expect(match.firstNames).toEqual(target.firstNames)
    expect(match.company).toEqual(target.company)
    expect(match.email).toEqual(target.email)
    expect(match.phone).toEqual(target.phone)
    expect(match.billingAddress.toJSON()).toEqual(target.billingAddress)
    expect(match.isInvoicable).toEqual(target.isInvoicable)
  })

})

describe('DELETE /api/customers/:id', () => {

  let token = null

  beforeEach(async () => {
    await initCustomers()
    token = await getToken('testadmin3')
  })

  it('deleted the correct customer', async () => {
    const customersBefore = await customersInDb()

    await api
      .delete(`/api/customers/${customersBefore[1]._id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204)

    const customersAfter = await customersInDb()
    const ids = customersAfter.map(c => c._id.toString())
    expect(customersAfter.length).toBe(customersBefore.length - 1)
    expect(ids).not.toContain(customersBefore[1]._id.toString())
  })

  it('prevents operation without authentication', async () => {
    const customersBefore = await customersInDb()

    await api
      .delete(`/api/customers/${customersBefore[1]._id}`)
      .expect(403)

    const customersAfter = await customersInDb()
    expect(customersAfter.length).toBe(customersBefore.length)
  })

  it('returns error for nonexisting id', async () => {
    const nonId = await nonExistingId()
    const customersBefore = await customersInDb()

    await api
      .delete(`/api/customers/${nonId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(400)

    const customersAfter = await customersInDb()
    expect(customersAfter.length).toBe(customersBefore.length)
  })

})

afterAll(async () => {
  await server.close()
})