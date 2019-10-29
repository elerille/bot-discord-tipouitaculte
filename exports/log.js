module.exports = function() {
    return {
        Send : function(message) {
        Discord.channels.get(PUB.debug.maxilog).send(TiCuDate("log") + " : Send \n" + message.channel.toString() + "\n" + message.url)
            .then( function(){
                Discord.channels.get(PUB.debug.maxilog).send(message.toString())
            })
        }  
    }
}