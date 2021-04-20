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

const init = (data) => {
    return new Promise((resolve, reject) => {

        const siteURL = url.normalize(data.siteURL)

        if (!siteURL) {
            return reject(new Error(`${data.siteURL} is not a valid URL`))
        }

        data.siteURL = data.wpURL = siteURL

        // return function for resolving data
        return resolve(data)
    }) 
}

const lookupSiteURL = (data) => {
    return new Promise((resolve, reject) => {

        const {siteURL, userAgent, silentMode} = data

        // request
        request({
            'url': siteURL,
            'method': 'HEAD',
            'headers': {'User-Agent': userAgent}
        }, (error, response) => {

            // handle errors
            if (error) {
                return reject(new Error(`Can not resolve ${siteURL} (${error.message})`))
            }

            //status code not ok
            if (response.statusCode !== 200) {
                return reject (new Error(`Can not resolve ${siteURL} (${response.statusCode} status code )`))
            }

            //override site url
            if (url.hasRedirects(response)) {
                const finalURL = url.getRedirect(response)

                if (finalURL) {
                    data.siteURL = data.wpURL = finalURL

                    log.info(`New site url: ${siteURL} \u2192 ${finalURL}, ${silentMode}`)
                }
            }
            
            // resolve data
            return resolve(data)
        })
    }) 
}

const lookupWpURL = (data) => {
    return new Promise((resolve, reject) => {

        const {wpURL, siteURL, userAgent, silentMode}
        const targetURL = siteURL + config.testFile

        // request
        request({
            'url': targetURL,
            'method': 'HEAD',
            'headers': {'User-Agent': userAgent}
        }, (error, response) => {

            if (error || response.statusCode !== 200) {
                return extractWpURL(data).then(data => {
                    return resolve(data)
                }).catch( error => {
                    return reject(error)
                })
            }

            // override wp url
            if (url.hasRedirects(response)) {
                const finalURL = url.getRedirect(response)

                if (finalURL) {
                    data.wpURL = finalURL

                    log.info( `New WordPress URL: ${wpURL} \u2192 ${finalURL}`, { silentMode } )
                }
            }

            return resolve(data)
        })
    })
}

// function for extract wp url
const extractWpURL = (data) => {
    return new Promise((resolve, reject) => {

        const {wpURL, siteURL, userAgent, silentMode} = data

        // request
        request({
            'url': wpURL,
            'method': 'GET',
            'headers': {'User-Agent': userAgent}
        }, (error, response, body) => {

            // handle errors
            if (error || response.statusCode !== 200) {
                return reject (new Error(`${siteURL} is not using wordpress (response error)`))
            }

            // identifier not found
            if (!body.includes('/wp-')) {
                return reject (new Error(`${siteURL} is not using wordpress (no referense to wp-*)`))
            }


            const [, parsedURL] = body.match( /["'](https?[^"']+)\/wp-(?:content|includes)/ ) || []

            const finalURL = url.normalize(parsedURL)

            // validate url
            if (!finalURL) {
                return reject (new Error(`${siteURL} is not using wordpress (no valid resposne)`))
            }

            data.wpURL = finalURL

            log.info(`New Wordpress URL: ${wpURL} \u2192 ${finalURL}, ${silentMode}`)

            return resolve(data)
        })
    })
}

