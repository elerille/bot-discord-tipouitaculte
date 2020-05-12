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
  if (timerOn) {
    if (duree > 0) {
      if (duree === 120) {
        msg.channel.send("Il reste 2 minutes")
      } else if (duree === 60) {
        msg.channel.send("Il reste 60 secondes")
      } else if (duree === 5) {
        msg.channel.send("Il reste 5 secondes")
      } else if (duree < 5) {
        msg.channel.send(duree)
      }
      setTimeout(function () {
        waitFor(duree - 1, msg)
      }, 1000)
    } else {
      msg.channel.send("Fin du compte à rebours")
      timerOn = false
    }
  } else {
    const nbMinutes = Math.floor(duree / 60)
    msg.channel.send(`Arrêt manuel du compte à rebours (restait ${nbMinutes > 0 ? nbMinutes + " minutes et " : ""}${duree % 60} secondes)`)
  }
}

let timerOn = false

module.exports = {
  alias: [
    "timer"
  ],
  activated: true,
  name : "Timer",
  desc : "Lance un compte à rebours",
  schema : "!timer <duree> (m|min|minutes|s|sec|secondes)\nou\n!timer stop",
  authorizations : TiCu.Authorizations.getAuth("command", "timer"),
  run : function(params, msg) {
    if (params.length <1) {
      TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
    } else {
      if (params[0] === "stop") {
        timerOn = false
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
              TiCu.Log.Error(this.alias[0], `la durée maximale du compte à rebours est de 30 minutes.`, msg)
            } else if (timerOn) {
              msg.channel.send(`Un compte à rebours a déjà été lancé`)
            } else {
              msg.channel.send(`Début du compte à rebours de ${duree} ${unit}`)
              timerOn = true
              waitFor(totalTime, msg)
            }
          }
        }
      }
    }
  }
}