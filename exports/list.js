module.exports = function() {
    this.TiCu = {
        Server : {
            AutoInvite : require("./server/autoinvite.js")
        },
        Log : require("./log.js")(),
        Send : require("./send.js")
    }
    global.TiCuDate = require("./ticudate.js")
}