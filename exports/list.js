module.exports = function() {
    this.TiCu = {
        Server : {
            AutoInvite : require("./server/autoinvite.js")
        },
        Log : require("./log.js"),
        Send : require("./send.js"),
        Date : require("./date.js")
    }
}