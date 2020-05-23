const DESMAX = 30
const FACESMAX = 1000

function randomDice(nbFaces) {
  if (nbFaces === 2) {
    return Math.ceil(Math.random() * nbFaces) === 1 ? "pile" : "face"
  }
  return Math.ceil(Math.random() * nbFaces)
}

module.exports = {
  alias: [
    "roll",
    "lancer",
    "dice",
    "de"
  ],
  activated: true,
  name : "Lancer",
  desc : `Effectuer un lancer de dé(s). Pas plus de ${DESMAX} dés et pas plus de ${FACESMAX} faces`,
  schema : "!<lancer|roll|dice|de> (nombreDeDes) <nombreDeFaces>",
  authorizations : TiCu.Authorizations.getAuth("command", "roll"),
  run : function(params, msg) {
    if(params.length === 2 && params[0] > 0 && params[1] > 1) {
      let result = ""
      const nbDes = Number(params[0])
      const nbFaces = Number(params[1])
      if (nbDes > DESMAX || nbFaces > FACESMAX) {
        return TiCu.Commands.help.run([this.alias[0], "valeurs trop élevées"], msg)
      }
      for(let i=0;i<nbDes;i++) {
        result += `${randomDice(nbFaces)}\n`
      }
      msg.channel.send(result).catch()
    } else if(params.length === 1 && params[0] > 1) {
      msg.channel.send(randomDice(Number(params[0]))).catch()
    } else return TiCu.Commands.help.run([this.alias[0], "paramètres invalides"], msg)
  }
}
