const CustomerMessage = require('../models/customerMessage')

const initialCustomerMessages = [
  {
    email: 'message1email',
    name: 'message1name',
    message: 'message 1 very short',
    sent: new Date()
  },
  {
    email: 'message2email',
    name: 'message2name',
    message: 'message 2 very short',
    sent: new Date()
  },
  {
    email: 'message3email',
    name: 'message3name',
    message: 'message 3 very short',
    sent: new Date()
  }
]

const customerMessagesInDb = async () => {
  const customerMessages = await CustomerMessage.find({})
  return customerMessages
}

const nonExisitingId = async () => {
  const customerMessage = new CustomerMessage({

  })
  const savedCustomerMessage = await customerMessage.save()
  const id = savedCustomerMessage._id
  await CustomerMessage.findByIdAndRemove(id)
  return id
}

const initCustomerMessages = async () => {
  await CustomerMessage.remove({})
  const customerMessageObjects = initialCustomerMessages.map(m => new CustomerMessage(m))
  const promiseArray = customerMessageObjects.map(m => m.save())
  await Promise.all(promiseArray)
}

module.exports = {
  initialCustomerMessages,
  customerMessagesInDb,
  nonExisitingId,
  initCustomerMessages
}