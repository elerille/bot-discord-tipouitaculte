module.exports = function() {
    this = function(type) {
        let res
        let date = new Date()
        switch(type) {
            case "raw":
                res = Date.now()
                break
            case "fr":
                res = Date.now().format("DD-MM-YYYY h:mm:ss")
                break
            case "frFR":
                res = Date.now()
                break
            case "":
                res = Date.now()
                break
            case "":
                res = Date.now()
                break
            case "":
                res = Date.now()
                break
        }
        return res
    }
}