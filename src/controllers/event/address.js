const { 
  getSubscriptions,
  sendEvent
} = require('../../utils/subscriptions')

const getEventFunction = (type, sendType) => async (addressId, userId) => {
  const subscriptions = await getSubscriptions('address', type);
  return sendEvent(subscriptions, 'address', sendType, addressId, userId)
}

module.exports = {
  eventAddressCreated: getEventFunction('create', 'CREATED'),
  eventAddressUpdated: getEventFunction('update', 'UPDATED'),
  eventAddressDeleted: getEventFunction('delete', 'DELETED')
}
