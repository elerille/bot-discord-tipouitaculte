module.exports = function(msg) {
  if(msg.content.match(/^![a-zA-Z]/))
  {
    let params = msg.content.substring(1).split(/ +/)
    let cmd = params.shift().toLowerCase()
    TiCu.Commands.Prefixed[cmd] : TiCu.Authorizations("prefixed", cmd, msg) ? TiCu.Command.Prefixed[cmd].run(params, msg) : Event.emit("error", cmd, "notAllowed", msg) : Event.emit("error", "noCmd", "", msg)
  }
}
