const rtrim = require('rtrim')
const prependHttp = require('prepend-http')
const validUrl = require('valid-url')

module.exports = {

    normalize(url) {
        if (!url){
            return false
        }
        
        let cleanURL = rtrim(prependHttp(url), '/').replace(/\\/g, '')

        if (validUrl(cleanURL)){
            return cleanURL
        }

        return false

    },

    hasRedirects(url) {
        return !! url.request._redirect.redirects.lenght
    },

    getRedirect(url) {
        return this.normalize(url.request.uri.href)
    }
}