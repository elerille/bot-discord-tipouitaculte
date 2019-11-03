module.exports = function(params, msg) {
  return {
    authorizations : {
      chans : [PUB.debug.bots],
      auths : [PUB.xenolune],
      roles : []
      channels : "Bots / Vigilant·es",
      authors : "Eva",
      roleNames : "Tous"
    },
    run : function(params, msg) {
      target = TiCu.Mention(params[0])
      target ? TiCu.Send(target, msg) : TiCu.Log.Error("send", "destination invalide", msg)
    }
  }
}
