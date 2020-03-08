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
    monLevel: {
      salons : {
        type: "whitelist",
        list: [PUB.salons.debug.id, PUB.salons.bots.id]
      },
      users : {
        type: "any",
      }
    },
  },
  vigi : {
    monLevel: {
      salons : {
        type: "any"
      },
      users : {
        type: "any",
      }
    }
  },
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