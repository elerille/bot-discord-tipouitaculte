function getMulFromUnitee(unitee, msg) {
  switch (unitee) {
    case "s":
    case "sec":
    case "seconde":
    case "secondes":
      return 1
    case "m":
    case "min":
    case "minute":
    case "minutes":
      return 60
    default:
      TiCu.Log.Error('timer', `l'unitée "${unitee}" n'est pas reconnue.`, msg)
      return 0
  }
}

function waitFor(duree, msg) {
  if (duree > 0) {
    if (duree > 120) {
      setTimeout(function () {
        msg.channel.send("Il reste 2 minutes")
        waitFor(120, msg)
      }, (duree - 120) * 1000)
    } else if (duree > 60) {
      setTimeout(function () {
        msg.channel.send("Il reste 60 secondes")
        waitFor(60, msg)
      }, (duree - 60) * 1000)
    } else if (duree > 5) {
      setTimeout(function () {
        msg.channel.send("Il reste 5 secondes")
        waitFor(5, msg)
      }, (duree - 5) * 1000)
    } else {
      setTimeout(function () {
        if (duree !== 1) {
          msg.channel.send(duree - 1)
        }
        waitFor(duree - 1, msg)
      }, 1000)
    }
  } else {
    msg.channel.send("Fin du timer")
  }
}

module.exports = {
  alias: [
    "timer"
  ],
  activated: true,
  name : "Timer",
  desc : "Lance un compte à rebours",
  schema : "!<timer> <duree> (m|min|minutes|s|sec|secondes)",
  authorizations : TiCu.Authorizations.getAuth("command", "timer"),
  run : function(params, msg) {
    if (params.length <1) {
      TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
    } else {
      const rewroteParam = params[0].replace(",", ".")
      let unit = "minutes"
      let duree = rewroteParam
      if (params.length === 1) {
        const regEx = /([0-9.]+)(m|min|minutes?|s|sec|secondes?)?/i
        const parsedParam = rewroteParam.match(regEx)
        if (parsedParam) {
          duree = parsedParam[1]
          if (parsedParam[2] !== undefined) {
            unit = parsedParam[2]
          }
        }
      } else {
        unit = params[1]
      }
      if (isNaN(duree)) {
        TiCu.Log.Error(this.alias[0], `la durée "${duree}" n'est pas un nombre`, msg)
      } else {
        const totalTime = getMulFromUnitee(unit, msg) * Number(duree)
        if (totalTime > 0) {
          if (totalTime > 1800) {
            TiCu.Log.Error(this.alias[0], `la durée maximale du timer est de 30 minutes.`, msg)
          } else {
            msg.channel.send(`Début du timer de ${duree} ${unit}`)
            waitFor(totalTime, msg)
          }
        }
      }
    }
  }
}