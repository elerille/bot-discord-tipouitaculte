# Tipouitaculte
## Bot d'administration dédié au serveur Discord **Tipoui Community+**

Les fonctions de ce bot (ci-après et dans le code dénommé **TiCu**) sont très spécifiques à l'organisation de **Tipoui Community+** (`PUB.servers.commu` dans `/cfg/public.json`) et des serveurs annexes **Tipoui Vigilant·es+** (`PUB.servers.vigi`) et **La Cellule de Crise** (`PUB.servers.cdc`), mais sa structure est appropriée à en faire usage sur différents serveurs. Il est possible de lancer une nouvelle instance du bot pour un autre serveur en personnalisant les fichiers de `/cfg/`, ainsi que d'autoriser certaines fonctions sur des serveurs supplémentaires (on peut d'ailleurs en voir un exemple avec le serveur identifié `PUB.servers.debug` dans `/cfg/public.json` et `/cfg/authorizations/*`).

A partir de la ligne suivante, et pour tous les README.MD des sous-dossiers de ce projet, des explications de code les plus claires possibles seront fournies. Nous ne garantissons cependant aucunement qu'elles soient à jour ou complètes.

----------------

### ./index.js
La partie init permet de charger toutes les configurations, variables et méthodes globales de l'application, et charger le module de logs déportables sur Discord (et son fallback `fakeLog`).
Une fois la connexion à Discord établie, quelques objets sont aussi chargés en mémoire globale, notamment la liste des votes et messages surveillés, puis vient le serveur web pour le génération de lien d'invitations (vers la ligne 100). 
Ensuite vient la liste des évènements Discord surveillés et les actions de parsing, correspondant aux méthodes de `/cfg/loader.js`.

### ./devConfig.json
Ce fichier sert à activer sélectivement certaines fonctions pour le développement de l'application ; par défaut, tout est désactivé. L'activation du mode de développement se fait en lançant l'application avec le paramètre `-d` et éventuellement `-c [devConfig.json]` pour charger un autre fichier de configuration.

### ./tipouitaculte.json
> Fichier de configuration pour le module NodeJS "Forever", permettant à l'instance principale de TiCu de tourner en tant que daemon. Il est envisagé de passer le process sous `systemctl`, lorsque nous aurons pris le temps de comprendre comment cela affectera les logs du bot.

----------------

## Démarrage rapide pour un nouveau serveur

 - Créer un fichier `cfg/private.json`
   - Modifier la valeur de `sequelizeURL` pour référencer la base de donnée au format `{driver}://{user}:{password}@{host}:{port}/{dbname}`
   - Installer le driver utiliser https://sequelize.org/master/manual/getting-started.html
   - Modifier la valeur de `discordToken` pour un token discord pour bot (https://discord.com/developers/applications)
   - Modifier la valeur de `expressSalt` par une grande chaine aléatoire secrete
 - Ajouter le bot à votre server
   - dans votre application https://discord.com/developers/applications
   - OAuth2 > URL Generator
   - Générer un url pour le scope `bot` et les permissions voulues (à priori `Administrator`)
   - Ouvrir le lien dans le navigateur
 - Configuration du Bot (https://discord.com/developers/applications)
   - Activer `presence intent`
   - Activer `server members intent`
   - Activer `message content intent`
 - Configuration des fichiers
   - `cfg/public.json` modifier les ids pour référencer vos propre servers
   - `cfg/public.json` adapter le hash `reverseServers`
   - `cfg/public.json` modifier la liste des utilisateurs
   - `cfg/authorizations/commands.js` supprimer les références à des utilisateurs Tipoui
 - Personalisation
   - `exports/auto/` contient les fonctions à executer (pas de commande mais juste une regex qui doit match avec le message)
   - `exports/autoGames/` idem que `auto`
   - `exports/commands/` contient les définitions des commandes

### Lancer manuellement le bot
```sh
node index.js
```

### Lancer manuellement le bot pour débug
Seul les modules marqueé comme activé dans `devConfig.json` sont actif
```sh
node index.js -d -c devConfig.json
```

en mode dev : 
 - Les log sont envoyer dans `cfg/public.json salons.logsDev`
 - Les commande commence par `%` aulieu de `!`

## Feature

### Discordtainment - tic-tac-boom

Jeux - Envoie un gif de boom de manière aléatoire lors de l'envoie de message tic/tac.

**configuration**:
 - `exports/autoGames/tictac.js:MIN` Nombre minimum de tic/tac avant boom
 - `exports/autoGames/tictac.js:MAX` Nombre maximum de tic/tac avant boom
 - `exports/autoGames/tictac.js:boomTable` Liste des gifs faisant boom
 - `cfg/public.json:salons.tictacboom` Identification du salon tic-tac-boom

### Bot informations - tes parents ?

Lors de l'envoie de la chaîne `tes parents ?` dans le cannal bot, le bot indique des infos à propos de lui. (fonctionne également avec `créateur`, `devs`, `déverloppeurs`, ainsi qu'au féminin et au neutre.

**configuration**: Pas de configuration, mais le code est dans `exports/auto/tesParents.js`

### Bot intéraction - merci ttc

Lors de l'envoie de la chaîne `merci ttc` dans le cannal bot, le bot réponds de rien

**configuration**: Pas de configuration, mais le code est dans `exports/auto/merci.js`

### XP - Level

Lors de chaque message, l'utilisateur gagne de l'XP. Grâce à cet XP il gagne des niveaux.

Calcul et stockage de l'XP et du niveau : `exports/methods/xp.js`
Commande pour gerer l'XP `exports/commands/xp.js`
Commande pour voir l'XP `exports/commands/level.js`
Commande pour désactivé l'XP pour un user `exports/commands/xpstatus.js`

 - `!level` affiche le niveau d'un utilisateur ou du sien
 - `!level` Modifie le mode de notification pour le passage de niveau
 - `!xp` Ajoute ou retire de l'xp à un utilisateur
 - `!xpstatus` Retire ou ajout un utilisateur au système d'XP
 - `mon level ?` ou `notre niveau ?` affiche son propre niveau (voir `exports/auto/monLevel.js`

**configuration**:
 - `exports/methods/xp.js:XPREACTION`
 - `exports/methods/xp.js:XPREACTEDTO`
 - `exports/methods/xp.js:LEVELMAX`
 - `cfg/public.json:categories.*.xpFactor`
 - `cfg/public.json:salons.*.xpFactor`
 - `cfg/public.json:roles.*.xpAddedMultiplicator`







