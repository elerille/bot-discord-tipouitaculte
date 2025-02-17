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

