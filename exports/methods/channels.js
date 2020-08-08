module.exports = {
  findById: function (id) {
    return Object.values(PUB.salons).find(v => v.id === id)
  },
  isValidChannelId: function (toCheck) {
    return toCheck.match(/^(<#)?([0-9]+)(>)?$/)
  }
}