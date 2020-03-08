function clearRequireCache() {
  Object.keys(require.cache).forEach(function(key) {
    delete require.cache[key];
  });
}

module.exports = {
  alias: [
    "hotreload",
    "hr"
  ],
  activated: true,
  name : "HotReload",
  desc : "Recharge la configuration de TipouiTaCulte",
  schema : "!<hotReload|hr> <parsing|ticu|salons>",
  authorizations : TiCu.Authorizations.getAuth("command", "hotreload"),
  run : function(params, msg) {
    clearRequireCache()
    const loader = require("../loader")
    switch(params[0]) {
      case "parsing":
        loader.loadParsing()
        TiCu.Log.Commands.HotReload(params[0], msg)
        break
      case "ticu":
        loader.loadTicu("./")
        TiCu.Log.Commands.HotReload(params[0], msg)
        break
      case "salons":
        loader.updateSalonsName()
        TiCu.Log.Commands.HotReload(params[0], msg)
        break
      default:
        TiCu.Log.Error("hotreload", "Vous devez préciser quel type de reload vous souhaitez réaliser (parsing, ticu ou pub)", msg)
    }
  }
}
