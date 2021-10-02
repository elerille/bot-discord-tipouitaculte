module.exports = {
    alias: [
        "dm",
        "mp"
    ],
    activated: true,
    name : "DM",
    desc : "Afficher les paramètres de messages privés d'eun membre ou éditer ses propres préférences",
    schema : "!dm (<@>|oui|on|non|off|ask|demande)\n!mp (<@>|oui|on|non|off|ask|demande)",
    authorizations : TiCu.Authorizations.getAuth("command", "dm"),
    run : function(params, msg) {
        const memberParam = TiCu.Mention(params[0] ? params[0] : msg.author.id)
        switch (params.length) {
            case 1:
                switch(params[0]) {
                    case "oui":
                    case "on":
                        TiCu.DM.addPref(msg.author.id, "on")
                        TiCu.Log.Commands.DM("on", msg)
                        return;
                    case "non":
                    case "off":
                        TiCu.DM.addPref(msg.author.id, "off")
                        TiCu.Log.Commands.DM("off", msg)
                        return;
                    case "ask":
                    case "demande":
                        TiCu.DM.addPref(msg.author.id, "ask")
                        TiCu.Log.Commands.DM("ask", msg)
                        return;
                }
            default:
                const target = memberParam ? memberParam.id : null
                if (target) {
                    const pref = TiCu.DM.getPref(target)
                    msg.channel.send(`${memberParam.displayName} ${pref === "on" ? "autorise les dms." : pref === "off" ? "n'autorise pas les dms." : "souhaite qu'on lui demande avant d'envoyer un dm."}`)
                }
        }
    }
}
