const { promisify } = require('util');
const fs = require('fs');
const path= require('path');

String.prototype.capitalize = function() {
   return this.charAt(0).toUpperCase() + this.slice(1)
}

function webpackEntryScript (filename, subPath) {
   return ({
      [filename]: `${__dirname}/src/${subPath}/${filename}.ts`
   });
}

function webpackEntryReact (filename) {
   const capitalizeFileName = `react${filename.capitalize()}`

   return {
      [`${capitalizeFileName}`]: `${__dirname}/src/pages/${filename}/index.tsx`
   };
}

/**
* @param {string} filename
 * @param {string[]} chunks
* */
function webpackEntryHtml (filename, chunks = []) {
   const reactFile = `src/pages/${filename}/index.tsx`;
   const htmlFile = `${filename}.html`;
   const excludeChunks = chunks.filter(chunk => chunk !== filename)
   return {
      excludeChunks,
      filename: `static/${htmlFile}`,
      template: `!!prerender-loader?string&entry=${reactFile}!${path.resolve(__dirname, `src/pages/${filename}`, `${htmlFile}`)}`
   };
}

const readdir =  promisify(fs.readdir)

module.exports = {
   readDirEntryFiles: (entryChunks) => {
      let chunks = []
      let result = {
         scripts: {},
         react: {},
         html: [],
         includeScripts: []
      }
      const promises = entryChunks.map(chunk => {
         return readdir(chunk.path)
            .then(files => {
               return files.reduce((acc, prev) => {
                  const filename = path.parse(prev).name;

                  console.log(chunk.type)

                  switch (chunk.type) {
                     case 'script':
                        result.scripts = {
                           ...acc.scripts,
                           ...webpackEntryScript(filename, 'scripts')
                        }

                        chunks = [...chunks, ...Object.keys(result.scripts)]
                        break

                     case 'lib':
                        result.lib = {
                           ...acc.lib,
                           ...webpackEntryScript(filename, 'lib')
                        }
                        result.includeScripts = [
                           ...result.includeScripts,
                           `${filename}.js`,
                           `${filename}.js.map`,
                        ]
                        chunks = [...chunks, ...Object.keys(result.lib)]
                        break

                     case 'react':
                        const capitalizeFileName = `react${filename.capitalize()}`

                        result.react = {
                           ...acc.react,
                           ...webpackEntryReact(filename)
                        }
                        result.includeScripts = [
                           ...result.includeScripts,
                           `${capitalizeFileName}.js`,
                           `${capitalizeFileName}.js.map`
                        ]
                        chunks = [...chunks, ...Object.keys(result.react)]
                        break
                     case 'html':
                        console.log(chunks)
                        result.html = [
                           ...result.html,
                           webpackEntryHtml(filename, [...new Set(chunks)])
                        ]
                        break
                  }

                  return {
                     ...result
                  }
               }, {})
            })
      })
      return Promise.all(promises)
         .then(scripts => scripts.reduce((acc, prev) => {
            return {
               ...acc,
               ...prev
            }}, {}))
   }
}