module.exports = function() {
    Server.get(
        "/discord/invite",
        function(req, res) {
            Discord.channels.get(PUB.inviteChannel)
                .createInvite({maxUses : 1, maxAge : 300})
                .then(invite => {res.send(invite.url);})
        }
    )
}