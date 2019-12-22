* command parser
  * auto commands
    * nom
    * description
    * schema
    * autorisations
       *  salons
       *  users
    * trigger
    * run
  * reaction responses
    * nom
    * description
    * emoji
    * autorisations
       * message
       * salons
       * users
    * run

* routines
  * xp
    * auto
    * give
    * remove
    * checklevel
    * autovote

  * vote
    * type
    * stop
    * check

* commands
  * raid

* webhook github updates PUB.tipoui.bots + minilog + maxilog

> tiens voir les xpBlacklist{} et xpWhistelist{} ça me fait penser que j'ai fait users{}, salons{} et roles{} dans public.son et je pense à terme faire un truc très propre de type en users[ID].answers{} pour faire des réponses personnalisées à certaines phrases, salons[id].xpfactor ou .commandCategory ou salonName(find by salon[id].name) et useHighest(roles[id].xpfactor) et roles[id].altnames pour !add etc.
