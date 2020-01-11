module.exports = {
  activated: true,
  methodName: 'monLevel',
  name : "Mon level ?",
  desc : "wesh læ bot, c'est quoi mon level ?\n",
  schema: "mon level ?",
  trigger: /mon (level|niveau)\s*\?/,
  authorizations : {
    salons : {
      type: "whitelist",
      list: [PUB.salons.debug.id, PUB.salons.bots.id]
    },
    users : {
      type: "any",
    }
  },
  run : function(msg) {
    TiCu.Commands.level.run([], msg)
  }
}
