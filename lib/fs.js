const fs = require('fs')
const path = require('path')

module.exports = {
	isFile(filePath, fileExt) {
		if (!fs.statSync(this.absolutePath(filePath)).isFile()) {
			return false
		}

		if (fileExt) {
			return path.extname(filePath) === fileExt
		}

		return true
	},


	isDir(dirPath) {
		return fs.statSync(this.absolutePath(dirPath)).isDirectory()
	},

	
}