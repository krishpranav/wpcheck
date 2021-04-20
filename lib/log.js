const colors = require('colors')
const padEnd = require('pad-end')

module.exports = {

    warn(warnMsg, {filterName} = {}) {
        const msgPrimary = colors.red(`\u2718 ${warnMsg}`)

        if (filterName){
            const msgSecondary = colors.gray(filterName)

            return colors.warn(
                this.padEnd(msgPrimary, msgSecondary)
            )
        }

        return console.warn(msgPrimary)
    },

    ok(okMsg, {silentMode, filterName} = {}) {
        if (silentMode) {
            return
        }

        const msgPrimary = colors.green( `\u2714 ${okMsg}` )

        if (filterName) {
            const msgSecondary = colors.gray(filterName)
            
            return console.log(
                this.padEnd(msgPrimary, msgSecondary)
            )
        }

        return console.log(msgPrimary)
    },

    info(infoMsg, {silentMode, filterName} = {}) {
        if (silentMode) {
            return
        }

        const msgPrimary = colors.yellow(`\u2139 ${infoMsg}` )

        return console.log(
            this.padEnd(msgPrimary, msgSecondary)
        )
        
        return console.log(msgPrimary)
    },

    padEnd(msgPrimary, msgSecondary) {
        return `${padEnd( msgPrimary, 99 )} ${msgSecondary}`
    }
}


