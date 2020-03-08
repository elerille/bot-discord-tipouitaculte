module.exports = {
  commu : {
    heart: {
      messages : {
        type: "any",
        list: []
      },
      salons : {
        type: "whitelist",
        list: [PUB.salons.debug.id]
      },
      users : {
        type: "whitelist",
        list: ["205399579884126217", "222028577405665283"]
      }
    }
  },
  vigi : {},
  debug: {}
}