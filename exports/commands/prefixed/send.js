module.exports = function(params, msg) {
  return {
    authorizations : {
      chans : [PUB.debug.bots],
      auths : [PUB.xenolune],
      roles : [],
      channels : "Bots / Vigilant·es",
      authors : "Eva",
      roleNames : "Tous"
    },
    run : function(params, msg) {
      let crop = new RegExp(/^(!send +[a-zA-Z0-9<@#!>]+ +)/)
      let target = TiCu.Mention(params[0]).id
      let content = msg.content.substring(msg.content.match(crop)[0].length)
      target ? TiCu.Send(target, content, msg) : TiCu.Log.Error("send", "destination invalide", msg)
    }
  }
}
