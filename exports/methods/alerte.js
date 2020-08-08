const TIME_BETWEEN_ALERTS = 5 * 60 * 1000//2 * 60 * 60 * 1000

module.exports = {
  getMembers: function () {
    const jsonAction = {
      action: "read",
      target: AlertingFile
    }
    const alerting = TiCu.json(jsonAction)
    if (alerting) {
      return alerting.members
    }
    return []
  },
  addMember: function (memberId) {
    const member = tipoui.members.get(memberId)
    if (member) {
      if (member.roles.get(PUB.roles.turquoise.id)) {
        const jsonAction = {
          action: "read",
          target: AlertingFile
        }
        const alerting = TiCu.json(jsonAction)
        if (alerting) {
          jsonAction.action = "write"
          if (!alerting.members.includes(memberId)) {
            alerting.members.push(memberId)
            jsonAction.content = alerting
            TiCu.json(jsonAction)
            vigi.channels.get(PUB.salons.alertingVigiServ.id).send(`Inscription : <@${memberId}> - ${memberId}.`)
            member.send(`L'inscription a été validée, merci !`)
          } else member.send(`L'inscription a déjà été effectuée, merci !`)
        } else member.send(`L'inscription n'a pas pu être réalisée, désolæ...`)
      } else member.send(`L'inscription est réservée aux Turquoises.`)
    }
  },
  removeMember: function (memberId) {
    const member = tipoui.members.get(memberId)
    const jsonAction = {
      action: "read",
      target: AlertingFile
    }
    const alerting = TiCu.json(jsonAction)
    if (alerting) {
      if (alerting.members.includes(memberId)) {
        jsonAction.action = "write"
        alerting.members = alerting.members.filter(value => value !== memberId)
        jsonAction.content = alerting
        TiCu.json(jsonAction)
        vigi.channels.get(PUB.salons.alertingVigiServ.id).send(`Désinscription : <@${memberId}> - ${memberId}.`)
        if (member) {
          member.send(`La désinscription a été réalisée.`)
        }
      }
    } else if (member) {
      member.send(`La désinscription n'a pas pu être réalisée, désolæ...`)
    }
  },
  dmMembers: function (channel, alert, target = null) {
    if (TiCu.Alerte.isValidTiming()) {
      const members = TiCu.Alerte.getMembers()
      const message = `Alerte lancée dans le salon <#${channel}> ${target ? "sur le message <" + target + "> " : ""}\n ${alert}`
      members.forEach(memberId => {
        tipoui.members.get(memberId).send(message)
      })
      TiCu.Alerte.updateAlertTiming()
    }
  },
  sendVigi: function (author, channel, alert, target = null) {
    vigi.channels.get(PUB.salons.alertingVigiServ.id).send(`Alerte lancée par <@${author}> dans le salon <#${channel}> ${target ? "sur le message <" + target + "> " : ""}\n ${alert}`)
  },
  updateAlertTiming: function() {
    const jsonAction = {
      action: "read",
      target: AlertingFile
    }
    const alerting = TiCu.json(jsonAction)
    if (alerting) {
      alerting.lastAlert = Date.now()
      jsonAction.action = "write"
      jsonAction.content = alerting
      TiCu.json(jsonAction)
    }
  },
  isValidTiming: function () {
    const jsonAction = {
      action: "read",
      target: AlertingFile
    }
    const alerting = TiCu.json(jsonAction)
    if (alerting) {
      return alerting.lastAlert + TIME_BETWEEN_ALERTS < Date.now()
    } else return false
  }
}