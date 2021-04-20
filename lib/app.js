const request = require( 'request' ).defaults( { timeout: 9999 } )
const fs = require( './fs' )
const url = require( './url' )
const log = require( './log' )
const config = require( '../config/app.json' )

module.exports.wpcheck = (data) => {

    // app version
    if (data.v) {
        return require('./version')
    }

    // app help
    if (data.h) {
        return require('./help')
    }

    // bulk file
    if (data.b) {
        try {
            data._.push(...fs.readFileLines(data.b))
        } catch (error) {
            log.warn(error)
        }
    }

    // loop
    return data._.forEach(url => {

        init({
            'wpURL': url,
            'siteURL': url,
            'rulesDir': data.r,
            'userAgent': data.u,
            'ignoreRule': data.i,
            'silentMode': data.s
        }).then(data => {
            return lookupSiteURL(data)
        }).then(data => {
            return lookupWpURL(data)
        }).then(data => {
            return loadRules(data)
        }).catch(error => {
            return log.warn(error)
        })
    })
}