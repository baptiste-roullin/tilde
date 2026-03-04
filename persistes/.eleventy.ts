import slugify from "@sindresorhus/slugify"
import akMap from "./src/akMap.js"

import importedWords from "./src/data/words.js"

export default function (config) {
	
	// length of columns
	let columnLength: number[] = []
	config.addPassthroughCopy("./src/*.css")

	config.addCollection("everything", async () => {
		
		let duplicates: string[] = []
		const grid = new akMap()

		//Première passe pour lister tous les doublons
		importedWords.flat().forEach((element, index, array) => {
			if (array.indexOf(element) !== index) {
				duplicates.push(element)
			}
		})

		importedWords.forEach((column, x, importedWords) => {
			columnLength[x] = column.length
			column.forEach((word, y) => {


// la page a cette forme : 
// mot  null null null
// mot  mot  mot  mot 
// mot  mot  mot  mot 
// mot  mot  mot  mot
// (...)
// mot  mot  mot  null 
// mot  mot  mot  null
				
				// donc on compense en utilisant des coordonnées décalée, passé la première ligne.  
				var realY = y
				if (x > 0) {
					realY = y + 1
				}
				// si doublon, on ajoute un incrément croissant à l'URL
				if (duplicates.includes(word)) {
					var href = slugify(word) + (y + 1)

				} else {
					var href = slugify(word)
				}
				const value = (word ?
					{
						word: word,
						hrefSelf: href
					} : null)
				// les cases vides seront peuplées, mais à null
				grid.set([x, realY], value)
			})
		})

		grid.forEach((value, key, grid) => {
			if (value) {
				function gridGet(direction: string) {
					const x = key[0]
					const y = key[1]
					let adjacentPosition = []

					switch (direction) {
						case "up":
							adjacentPosition = [x, y - 1]
							break
						case "down":
							adjacentPosition = [x, y + 1]
							break
						case "left":
							adjacentPosition = [x - 1, y]
							break
						case "right":
							adjacentPosition = [x + 1, y]
							break
						default:
							adjacentPosition = [null, null]
							break
					}
					let offsetItem = grid.get(adjacentPosition)
					if (direction === 'down' && !offsetItem) { // loop to next column, top row
						offsetItem = grid.get([x + 1, 1]) // "1" is hardcoded, same reason as realyY above
					}
					if (direction === 'up' && !offsetItem) {
						offsetItem = grid.get([x - 1, columnLength[x - 1] - 1]) // loop back to previous column, bottom row
					}
					return offsetItem?.hrefSelf // directions qui n'existent pas : retourne undefined
				}

				grid.set(key, {
					// on reprend la valeur précédente
					word: value?.word,
					hrefSelf: value?.hrefSelf,
					hrefUp: gridGet("up"),
					hrefDown: gridGet("down"),
					hrefRight: gridGet("right"),
					hrefLeft: gridGet("left"),
					// sert uniquement pour afficher les coordonnées à l'utilisateur
					x: key[0] + 1,
					y: key[1] + 1
				}
				)
			}
		})
		//	console.log([...grid.values()])

		// reverse() parce que la lib utilisée pour le dictionnaire semble avoir un ordre d'insertion inversé
		return [...grid.values()].reverse()

	})
	return {
		dir: {
			input: "src",
			output: "../public_html/persistes",
			data: "data"
		},
		passthroughFileCopy: true,
		templateFormats: ["html", "njk",],
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
	}
}
