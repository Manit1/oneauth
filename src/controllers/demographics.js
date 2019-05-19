const Raven = require('raven')
const { models } = require("../db/models");
const { eventAddressCreated, eventAddressUpdated } = require('./event/address')
const { eventDemographicCreated, eventDemographicUpdated } = require('./event/demographics')

async function findOrCreateDemographic(userId) {
  const [demographic, created] = await models.Demographic.findCreateFind({
    where: { userId: userId },
    include: [models.Address]
  });
  if (created) {
    eventDemographicCreated(demographic.id, userId).catch(Raven.captureException)
  }
  return [demographic, created]
}

async function createAddress(options, userId) {
  const address = await models.Address.create(options);
  eventAddressCreated(address.id, userId).catch(Raven.captureException)
  return address
}

function findDemographic(userId) {
  return models.Demographic.findOne({
    where: { userId: userId }
  });
}

function findAddress(userId, demoUserId) {
  return models.Address.findOne({
    where: {
      id: userId,
      "$demographic.userId$": demoUserId
    },
    include: [models.Demographic, models.State, models.Country]
  });
}

async function updateAddressbyAddrId(addrId, options, userId) {
  const updated = await models.Address.update(options, {
    where: { id: addrId }
  });
  eventAddressUpdated(addrId, userId).catch(Raven.captureException)
  return updated
}

async function updateAddressbyDemoId(demoId, options, userId) {
  const updated = await models.Address.update(options, {
    where: { id: demoId }
  });
  eventDemographicUpdated(demoId, userId).catch(Raven.captureException)
  return updated
}

function findAllAddresses(userId, includes = [models.Demographic]) {
  return models.Address.findAll({
    where: { "$demographic.userId$": userId },
    include: includes
  });
}

function findAllStates() {
  return models.State.findAll({});
}

function findAllCountries() {
  return models.Country.findAll({});
}

function findAllBranches() {
  return models.Branch.findAll({});
}
function findAllColleges() {
  return models.College.findAll({
      order:[
          ['name','ASC']
      ]
  });
}

function upsertDemographic(id, userId, collegeId, branchId) {
  if ((!id) && (!userId)) {
    throw new Error("To upsert demographic either id or userid needed")
  }
  return models.Demographic.upsert({ id, userId, collegeId, branchId });
}

module.exports = {
  findOrCreateDemographic,
  updateAddressbyDemoId,
  updateAddressbyAddrId,
  findAddress,
  createAddress,
  findAllAddresses,
  findDemographic,
  findAllStates,
  findAllCountries,
  findAllBranches,
  findAllColleges,
  upsertDemographic
};
