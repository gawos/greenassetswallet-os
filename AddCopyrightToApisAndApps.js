// use node v10
const fs = require('fs')
const path = require('path')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

async function getFiles (dir) {
  var files = await fs.readdirSync(dir)
  for (var i in files){
    if (files[i].match(/node_modules/gi)) {
      continue
    }
    var name = dir + '/' + files[i]
    if (fs.statSync(name).isDirectory()) {
      await getFiles(name)
    } else if (
      path.extname(files[i]) === '.js' &&
      files[i][0] !== '.' &&
      !files[i].match(/spec/gi) &&
      !name.match(/test/gi)
    ) {
      const dataFile = await readFile(name, 'utf8')
      await writeFile(name, '/*  Copyright (c) 2018 ChromaWay AB. See LICENSE file for license information. */ \n' + dataFile, 'utf8')
    }
  }
  console.log('done')
}

getFiles('./apps')
getFiles('./apis')
