var dateFormat = require("dateformat")
dateFormat.i18n = {
    dayNames: [
        "Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi",
    ],
    monthNames: [
        "Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc", "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ],
    timeNames: [
        'a', 'p', 'am', 'pm', 'A', 'P', 'AM', 'PM'
    ]
}

module.exports = function(type) {
    let res
    let now = Date()
    switch(type) {
        case "raw":
            res = Date.now()
            break
        case "time":
            res = dateFormat(now, "HH:MM:ss")
            break
        case "fr":
            res = dateFormat(now, "dd-mm-yyyy HH:MM:ss")
            break
        case "frDate":
            res = dateFormat(now, "dddd d mmmm yyyy")
            break
        case "frDateTime":
            res = dateFormat(now, "dddd d mmmm yyyy - HH:MM:ss")
            break
        case "log":
            res = dateFormat(now, "yyyy-mm-dd-HH-MM-ss")
            break
        default:
            return 0
    }
    return res
}