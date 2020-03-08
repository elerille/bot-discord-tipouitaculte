module.exports = {
  commu : {
    cardDisplay: {
      salons : {
        type: "whitelist",
        list: [PUB.salons.debug.id, PUB.salons.magic.id]
      },
      users : {
        type: "any",
      }
    },
    monlevel: {
      salons : {
        type: "whitelist",
        list: [PUB.salons.debug.id, PUB.salons.bots.id]
      },
      users : {
        type: "any",
      }
    },
  },
  vigi : {},
  debug: {
    cardDisplay: {
      salons : {
        type: "any"
      },
      users : {
        type: "any"
      }
    },
  }
}