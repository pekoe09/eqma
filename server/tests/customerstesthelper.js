const Customer = require('../models/customer')

const initialCustomers = [
  {
    lastName: 'Tomer1',
    firstNames: 'Cus1',
    company: 'Comp1',
    email: 'customer1@none.com'
  },
  {
    lastName: 'Tomer2',
    firstNames: 'Cus2',
    company: 'Comp2',
    email: 'customer2@none.com'
  },
  {
    lastName: 'Tomer3',
    firstNames: 'Cus3',
    company: 'Comp3',
    email: 'customer3@none.com'
  }
]

const customersInDb = async () => {
  const customers = await Customer.find({})
  return customers
}

const nonExistingId = async () => {
  const customer = new Customer({
    lastName: 'noone',
    firstNames: 'noone',
    company: 'none',
    email: 'nowhere'
  })
  const savedCustomer = await customer.save()
  const id = savedCustomer._id
  await Customer.findByIdAndRemove(id)
  return id
}

const initCustomers = async () => {
  await Customer.remove({})
  const customerObjects = initialCustomers.map(c => new Customer(c))
  const promiseArray = customerObjects.map(c => c.save())
  await Promise.all(promiseArray)
}

module.exports = {
  initialCustomers,
  customersInDb,
  nonExistingId,
  initCustomers
}