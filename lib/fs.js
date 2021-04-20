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

	readFile(filePath){
		return fs.readFileSync(this.absolutePath(filePath))	
	},

	readDir(dirPath, callback) {
		fs.readdir(this.absolutePath(dirPath), callback)
	},

	readFileLines(filePath){
		return this.readFile(filePath).toString().split("\n").filter(Boolean)
	},

	requireFile(filePath){
		return require(this.absolutePath(filePath))
	},

	isBlacklistedFile(filePath, blacklist){
		return blacklist.includes(path.basename(filePath))
	},

	absolutePath(objPath) {
		if (path.isAbsolute(objPath)) {
			return objPath
		}

		return path.join(__dirname, '..', objPath)
	}

	joinPaths(path1, path2){
		return path, join(path1, path2)
	}

	fileName(filePath, fileExt) {
		return path.basename(filePath, fileExt)
	}
}