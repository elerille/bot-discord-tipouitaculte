const https = require('https')

function displayCard(cardData, msg) {
  if (cardData.layout === "transform") {
    for (const cardFace of cardData.card_faces) {
      msg.channel.send(cardFace.image_uris.large)
    }
  } else {
    msg.channel.send(cardData.image_uris.large)
  }
}

function fetchCardImage(name, set, lang, msg) {
  const cardRequest = `/cards/named?fuzzy=${name}${set ? "&set=" + set : ""}`

  const options = {
    hostname: "api.scryfall.com",
    port: 443,
    path: cardRequest,
    method: 'GET'
  }

  const req = https.request(options, res => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      if (res.statusCode === 200) {
        const cardData = JSON.parse(data)
        if (cardData.lang === lang || (!lang && cardData.lang === "fr")) {
          displayCard(cardData, msg)
        } else {
          options.path = `/cards/${set ? set : cardData.set}/${cardData.collector_number}/${lang ? lang : "fr"}`
          const reqLang = https.request(options, resLang => {
            let dataLang = '';
            resLang.on('data', (chunk) => {
              dataLang += chunk;
            });
            resLang.on('end', () => {
              if (res.statusCode === 200) {
                const cardDataLang = JSON.parse(dataLang)
                if (cardDataLang.status !== 404) {
                  displayCard(cardDataLang, msg)
                } else {
                  displayCard(cardData, msg)
                }
              } else if (res.statusCode === 404) {
                displayCard(cardData, msg)
              }
            });
          })
          reqLang.on('error', error => {
            maxilog.send(TiCu.Date("log") + " : Erreur : (`mtg\"\"`, erreur sur l'appel de traduction)")
            displayCard(cardData, msg)
          })
          reqLang.end()
        }
      } else if (res.statusCode === 404) {
        msg.channel.send("Carte non trouvée")
      }
    });
  })
  req.on('error', error => {
    TiCu.Log.Error("mtg\"\"", "erreur interne", msg)
  })
  req.end()
}

const globalRegEx = /mtg"([^":|]+)(\|[a-z\d]{3,5})?(:[a-z]{2})?"/g
const simpleRegex = /mtg"([^":|]+)(\|[a-z\d]{3,5})?(:[a-z]{2})?"/
module.exports = {
  activated: true,
  methodName: "carddisplay",
  name : "Carte Magic",
  desc : "Cherche l'image correspondant à la carte Magic mentionnée",
  schema: "mtg\"nom de la carte(|set)\"",
  trigger: globalRegEx,
  authorizations : {
    salons : {
      type: "whitelist",
      list: [PUB.salons.debug.id, PUB.salons.magic.id]
    },
    users : {
      type: "any",
    }
  },
  run : function(msg) {
    const matches = [...msg.content.match(this.trigger)]
    for (const match of matches) {
      const aux = match.match(simpleRegex)
      fetchCardImage(encodeURIComponent(aux[1]), aux[2] ? aux[2].substr(1) : undefined, aux[3] ? aux[3].substr(1) : undefined, msg)
    }
  }
}
