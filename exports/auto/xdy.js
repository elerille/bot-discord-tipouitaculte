module.exports = {
  activated: true,
  methodName: 'xdy',
  name: "XdY",
  desc: "Lancer X dés Y",
  schema: "xdy",
  trigger: /([\d]+)[dD]([\d]+)/,
  authorizations: TiCu.Authorizations.getAuth("auto", "xdy"),
  run: function (msg) {
    msg
      .react("🎲")
      .then(() => {
        let filter = (reaction, user) => {
          return (user.id === msg.author.id)
        }
        msg
          .awaitReactions(filter, {max: 1, time: 60000, errors: ["time"]})
          .then(collected => {
            const reaction = collected.firstKey();
            if (reaction === "🎲") {
              let values = msg.content.match(this.trigger)
              TiCu.Commands.lancer.run([values[1], values[2]], msg)
            }
          })
          .catch()
      })
  }
}
