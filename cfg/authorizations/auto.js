module.exports = {
  commu : {
    cardDisplay: {
      salons : {
        type: "whitelist",
        list: [PUB.salons.debug.id, PUB.salons.magic.id]
      }
    },
    monlevel: {
      salons : {
        type: "whitelist",
        list: [PUB.salons.debug.id, PUB.salons.bots.id]
      }
    },
    tesParents: {
        salons: {
            type: "whitelist",
            list: [PUB.salons.debug.id, PUB.salons.bots.id]
        }
    },
    merci: {}
  },
  vigi : {},
  debug: {
    cardDisplay: {},
    xdy: {}
  },
  cdc : {},
  dm: {}
}