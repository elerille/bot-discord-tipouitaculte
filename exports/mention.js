module.exports = function(param) {
  let target
  let result
  let snow = new RegExp(/(\d+)/)
  let role = new RegExp(/^<@&(\d+)>$/)
  let user = new RegExp(/^<@!?(\d+)>$/)
  let channel = new RegExp(/^<#(\d+)>$/)
  let discriminated = new RegExp(/#\d{4}$/)
  let type = param.match(role) ? "role" : param.match(user) ? "user" : param.match(channel) ? "channel" : param.match(discriminated) ? "discriminated" : param.match(snow) ? "snow" : "text"
  switch (type) {
    default:
      target = false
      break
    case "role":
      target = Discord.guild.get(PUB.debug.server).roles.get(param.match(snow)[1])
      break
    case "user":
      target = Discord.users.get(param.match(snow)[1])
      break
    case "channel":
      target = Discord.channels.get(param.match(snow)[1])
      break
    case "discriminated":
      target = Discord.users.find("tag", param)
      break
    case "snow":
      if(Discord.users.get(param.match(snow)[1])) {
        type = "user"
        target = Discord.users.get(param.match(snow)[1])
      } else if(Discord.channels.get(param.match(snow)[1])) {
        type = "channel"
        target = Discord.channels.get(param.match(snow)[1])
      } else if(Discord.guild.get(PUB.debug.server).roles.get(param.match(snow)[1])) {
        type = "role"
        target = Discord.guild.get(PUB.debug.server).roles.get(param.match(snow)[1])
      } else {
        target = "error"
      }
      break
    case "text":
      if(Discord.users.find("username", param)) {
        type = "user"
        target = Discord.users.find("username", param)
      } else if(Discord.guilds.get(PUB.tipoui.commu).members.find("displayName", param) {
        type = "user"
        target = Discord.guilds.get(PUB.tipoui.commu).members.find("displayName", param)
      } else if(Discord.guilds.get(PUB.tipoui.commu).channels.find("name", param)) {
        type = "channel"
        target = Discord.channels.get(param.match(snow)[1])
      } else if(Discord.guilds.get(PUB.tipoui.commu).roles.find("name", param)) {
        type = "role"
        target = Discord.guilds.get(PUB.tipoui.commu).roles.find("name", param)
      } else {
        target = false
      }
      break
  }
  return target
}
