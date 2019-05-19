const { 
  getSubscriptions,
  sendEvent
} = require('../../utils/subscriptions')

const getEventFunction = (type, sendType) => async (clientId, userId) => {
  const subscriptions = await getSubscriptions('client', type);
  return sendEvent(subscriptions, 'client', sendType, clientId, userId)
}

module.exports = {
  eventClientCreated: getEventFunction('create', 'CREATED'),
  eventClientUpdated: getEventFunction('update', 'UPDATED'),
  eventClientDeleted: getEventFunction('delete', 'DELETED')
}
