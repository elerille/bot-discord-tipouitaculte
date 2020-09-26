* !help
  * reactions
  * auto

* delay message d'accueil bot nouveaulles arrivant·es

* réaction nouveaulles arrivant·es différente si déjà dans système XP
--> "Hey, bon retour parmi nous. Comme tu n'étais plus là depuis un certain temps, nous tu ne pourras pas utiliser la fonction `!retour`, mais tu peux demander à réinitialiser ton XP pour être remis·e au vote au rythme habituel des phosphates, ou me demander une mise au vote manuelle par l'envoi d'un DM."

* commande !vote [off] [ID] pour mettre fin à un vote dans ce salon.

* ajouter catégories manquantes dans public.json (need admin)
* penser à update régulièrement ROLES.MD et SALONS.MD

> tiens voir les xpBlacklist{} et xpWhistelist{} ça me fait penser que j'ai fait users{}, salons{} et roles{} dans public.son et je pense à terme faire un truc très propre de type en users[ID].answers{} pour faire des réponses personnalisées à certaines phrases, salons[id].xpfactor ou .commandCategory ou salonName(find by salon[id].name) et useHighest(roles[id].xpfactor) et roles[id].altnames pour !add etc.
