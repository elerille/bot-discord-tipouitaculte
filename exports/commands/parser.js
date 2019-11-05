module.exports = function(msg) {
  if(msg.channel.type === "dm" ) {
    TiCu.Commands.auto.dm(msg)
  } else if(msg.channel.id === PUB.tipoui.quarantaineUser || msg.channel.id === PUB.tipoui.quarantaineVigi) {
    TiCu.Commands.auto.quarantaine(msg)
  } else if(msg.content.match(/^![a-zA-Z]/)) {
    let params = msg.content.substring(1).split(/\s+/)
    let cmd = params.shift().toLowerCase()
    TiCu.Commands.prefixed[cmd] ? TiCu.Authorizations("prefixed", cmd, msg) ? TiCu.Commands.prefixed[cmd].run(params, msg) : Event.emit("error", cmd, "permissions manquantes", msg) : Event.emit("error", "noCmd", "", msg)
  }
}
