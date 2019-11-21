module.exports = function(params, msg) {
  return {
    authorizations : {
      chans : {
        type: "whitelist",
        list: [PUB.tipoui.botsecret]
      },
      auths : {
        type: "any"
      },
      roles : {
        type: "any"
    },
      channels : "Bots Vigilant·es",
      authors : "Tous",
      roleNames : "Tous",
      schema : "!role <target> <+|ajouter|add|addRoles> <[roles]>\nou\n!role <target> <-|enlever|retirer|supprimer|remove|removeRoles> <[roles]>)"
    },
    run : function(params, msg) {
      let action, target
      let roles = []
      target = TiCu.Mention(params[0])
      params.shift()
      switch(params[0]) {
        case "ajouter":
        case "add":
        case "+":
        case "addRoles":
          action = "addRoles"
          break
        case "enlever":
        case "retirer":
        case "supprimer":
        case "remove":
        case "-":
        case "removeRoles":
          action = "removeRoles"
          break
        default:
          action = false
      }
      params.shift()
      for(i=0;i<params.length;i++) {
        let temp = params[i].toLowerCase()
        switch(temp) {
          case "1":
          case "pho":
          case "phos":
          case "phosphate":
          case "alumine":
          case "phosphatealumine":
          case "phosphatedalumine":
          case "phosphated'alumine":
          case "phosphate_d'alumine":
          case "355047698698862592":
            roles.push("355047698698862592")
            break
          case "2":
          case "tutu":
          case "turquoise":
          case "396989117164158978":
            roles.push("396989117164158978")
            break
          case "3":
          case "démo":
          case "démolisseur":
          case "démolisseuse":
          case "démolisseureuse":
          case "démolisseur·euse":
          case "démolisseur.euse":
          case "démolisseurdupatriarcat":
          case "démolisseusedupatriarcat":
          case "démolisseureusedupatriarcat":
          case "démolisseureuse_du_patriarcat":
          case "patriarcaca":
          case "patriarcat":
          case "355060952422416386":
            roles.push("355060952422416386")
            break
          case "4":
          case "queer":
          case "396991048993341440":
            roles.push("396991048993341440")
            break
          case "5":
          case "girl":
          case "grl":
          case "grrl":
          case "grrrl":
          case "grrrrl":
          case "grrrrrl":
          case "grrrrrrl":
          case "396988815266545665":
            roles.push("396988815266545665")
            break
          case "6":
          case "cpc":
          case "certainement":
          case "certainementpas":
          case "certainementpascis":
          case "certainement_pas_cis":
          case "pascis":
          case "cisn't":
          case "455720096799653902":
            roles.push("455720096799653902")
            break
          case "7":
          case "ace":
          case "acecake":
          case "ace_cake":
          case "cake":
          case "asexuel":
          case "asexuelle":
          case "asexuel·le":
          case "asexuel.le":
          case "439068938123345940":
            roles.push("439068938123345940")
            break
          case "8":
          case "aro":
          case "arro":
          case "arrow":
          case "arobow":
          case "aro_bow":
          case "arrobow":
          case "arrowbow":
          case "aromantique":
          case "aromatique":
          case "525280639386386462":
            roles.push("525280639386386462")
            break
          case "9":
          case "luxure":
          case "luxureon":
          case "luxure_on":
          case "on":
          case "sexe":
          case "cul":
          case "chaud":
          case "chaude":
          case "bain":
          case "bains":
          case "grandbain":
          case "grandsbains":
          case "grands_bains":
          case "salonchaud":
          case "salonschauds":
          case "salons_chauds":
          case "majeur":
          case "majeure":
          case "majeur·e":
          case "majeur.e":
          case "507916444701556739":
            roles.push("507916444701556739")
            break
          case "10":
          case "hammer":
          case "flirting":
          case "flirtinghammer":
          case "flirting_hammer":
          case "démoducul":
          case "507916432462577715":
            roles.push("507916432462577715")
            break
          case "11":
          case "naughty":
          case "naughtygirl":
          case "naughty_girl":
          case "naughtygrl":
          case "naughtygrrl":
          case "naughtygrrrl":
          case "naughtygrrrrl":
          case "naughty_grrrrl":
          case "naughtygrrrrrl":
          case "chaudeducul":
          case "507916442826571776":
            roles.push("507916442826571776")
            break
          case "12":
          case "pourfendeureuse":
          case "pourfendeur":
          case "pourfendeuse":
          case "pourfendeur·euse":
          case "pourfendeur.euse":
          case "pourfendeureusedecismecs":
          case "pourfendeureuse_de_cismecs":
          case "misandre":
          case "cismisandre":
          case "misandrie":
          case "cismisandrie":
          case "451734752181878786":
            roles.push("451734752181878786")
            break
          case "13":
          case "vote":
          case "votant":
          case "votante":
          case "votant·e":
          case "votant.e":
          case "522444644999495680":
            roles.push("522444644999495680")
            break
          case "14":
          case "armu":
          case "armurier":
          case "armuriere":
          case "armurière":
          case "armuriær":
          case "armurier·e":
          case "armurier.e":
          case "armuriære":
          case "355279700492550146":
            roles.push("355279700492550146")
            break
          case "15":
          case "yt":
          case "youtube":
          case "notifyt":
          case "notifyoutube":
          case "notif_youtube":
          case "nyt":
          case "n_yt":
          case "n_youtube":
          case "578282816127631370":
            roles.push("578282816127631370")
            break
          case "16":
          case "twitch":
          case "notiftwitch":
          case "ntwitch":
          case "notif_twitch":
          case "n_twitch":
          case "578282808859164672":
            roles.push("578282808859164672")
            break
          case "17":
          case "actu":
          case "notifactu":
          case "notiftipoui":
          case "notif_actu":
          case "notif_tipoui":
          case "nactu":
          case "ntipoui":
          case "n_actu":
          case "n_tipoui":
          case "620630188757221386":
            roles.push("620630188757221386")
            break
          case "18":
          case "event":
          case "notifevent":
          case "notif_event":
          case "nevent":
          case "n_event":
          case "578282812545957899":
            roles.push("578282812545957899")
            break
          case "19":
          case "ruche":
          case "notifruche":
          case "notif_ruche":
          case "nruche":
          case "n_ruche":
          case "esprit":
          case "espritruche":
          case "espritdelaruche":
          case "esprit_de_la_ruche":
          case "bzz":
          case "bzzz":
          case "bzzzz":
          case "bzzzzz":
          case "abeille":
          case "588446918670286858":
            roles.push("588446918670286858")
            break
          case "20":
          case "quarantaine":
          case "cave":
          case "oubliettes":
          case "donjon":
          case "azkaban":
          case "goulag":
          case "prison":
          case "bûcher":
          case "bucher":
          case "458559408667099136":
            roles.push("458559408667099136")
            break
          default:
            roles = false
        }
      }
      if(target) {
        if(action) {
          if(roles) {
            target[action](roles)
              .then(() => TiCu.Log.Prefixed.Roles(target, action, roles, msg))
              .catch(() => TiCu.Log.Error("roles", "erreur API", msg))
          } else TiCu.Log.Error("roles", "rôle invalide", msg)
        } else TiCu.Log.Error( "roles", "ajouter ou enlever ?", msg)
      } else TiCu.Log.Error( "roles", "destination invalide", msg)
    }
  }
}
