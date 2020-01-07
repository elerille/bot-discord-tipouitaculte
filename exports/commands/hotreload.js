function clearRequireCache() {
  Object.keys(require.cache).forEach(function(key) {
    delete require.cache[key];
  });
}

module.exports = {
  alias: [
    'hotreload',
    'hr'
  ],
  activated: true,
  authorizations : {
    chans : {
      type: "whitelist",
      list: [PUB.salons.debug.id]
    },
    auths : {
      type: "whitelist",
      list: [PUB.users.xenolune, PUB.users.syrinx]
    },
    roles : {
      type: "any"
    },
    name : "Hot Reload",
    desc : "Recharge la configuration de TipouiTaCulte",
    schema : "!(hotreload|hr) (parsing|ticu)",
    channels : "debug-tipouitaculte",
    authors : "Xenolune & Syrinx",
    roleNames : "Tous"
  },
  run : function(params, msg) {
    clearRequireCache()
    const loader = require('../loader')
    switch(params[0]) {
      case 'parsing':
        loader.loadParsing()
        TiCu.Log.Commands.HotReload(msg, params[0])
        break
      case 'ticu':
        loader.loadTicu('./')
        TiCu.Log.Commands.HotReload(msg, params[0])
        break
      default:
        TiCu.Log.Error('hotreload', 'Vous devez préciser quel type de reload vous souhaitez réaliser (parsing ou ticu)', msg)
    }
  }
}
