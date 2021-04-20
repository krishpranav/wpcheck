const require = require('request').defaults({followRedirect: false})
const fs = require('../fs')
const log = require('../log')

exports.fire = (data) => {
    const {wpURL, siteURL, userAgent, silentMode} = data
    const filterName = fs.fileName(__filename, '.js')
    const logObj = {silentMode, filterName}
    const targetURL = `${wpURL}/wp-includes/`


    request({
        'url': targetURL,
        'method': 'GET',
        'headers': { 'User-Agent': userAgent}
    }, (error, response, body) => {
        
    })
}