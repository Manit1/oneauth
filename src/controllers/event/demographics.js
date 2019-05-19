const { 
  getSubscriptions,
  sendEvent
} = require('../../utils/subscriptions')

const getEventFunction = (type, sendType) => async (demographicId, userId) => {
  const subscriptions = await getSubscriptions('demographic', type);
  return sendEvent(subscriptions, 'demographic', sendType, demographicId, userId)
}

module.exports = {
  eventDemographicCreated: getEventFunction('create', 'CREATED'),
  eventDemographicUpdated: getEventFunction('update', 'UPDATED'),
  eventDemographicDeleted: getEventFunction('delete', 'DELETED')
}
