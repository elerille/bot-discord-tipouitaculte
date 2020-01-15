const https = require('https')

function callApi(endpoint, backface = false, msg) {
  const backFaceParameter = "&face=back"
  const options = {
    hostname: "api.scryfall.com",
    port: 443,
    path: endpoint + (backface ? backFaceParameter : ""),
    method: 'GET'
  }

  const req = https.request(options, res => {
    if (res.statusCode === 302) {
      msg.channel.send(res.headers.location)
    } else if (res.statusCode === 404 && !backface) {
      msg.channel.send("Carte non trouvée")
    }
  })
  req.on('error', error => {
    console.error(error)
  })
  req.end()
}

function fetchCardImage(name, set, msg) {
  const baseRequest = "/cards/named?format=image&version=normal"

  const cardRequest = baseRequest + `&fuzzy=${name}${set ? "&set=" + set : ""}`

  callApi(cardRequest, false, msg)
  callApi(cardRequest, true, msg)
}

module.exports = {
  activated: true,
  methodName: 'carddisplay',
  name : "Carte Magic",
  desc : "Cherche l'image correspondant à la carte Magic mentionnée",
  schema: "[carte|card]nom de la carte(|set)[/carte|card]",
  trigger: /\[(carte|card)]([^\[|]+)\|?([a-z0-9]{3})?\[\/(carte|card)]/g,
  authorizations : {
    salons : {
      type: "whitelist",
      list: [PUB.salons.debug.id]
    },
    users : {
      type: "any",
    }
  },
  run : function(msg) {
    const matches = [...msg.content.matchAll(this.trigger)]
    for (const match of matches) {
      fetchCardImage(encodeURIComponent(match[2]), match[3], msg)
    }
  }
}
