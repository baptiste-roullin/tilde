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

		importedWords.flat().forEach((element, index, array) => {
			if (array.indexOf(element) !== index) {
				duplicates.push(element)
			}
		})

		importedWords.forEach((column, x, importedWords) => {
			columnLength[x] = column.length
			column.forEach((word, y) => {

				var realY = y
				if (x > 0) {
					realY = y + 1 // to account for the crooked array
				}
				//const duplicateCounts = duplicates.reduce((total, x) => total + (x === word), 0)
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
				grid.set([x, realY], value)
			})
		})

		grid.forEach((value, key, grid) => {
			if (value) {
				function gridGet(direction: string) {
					const x = key[0]
					const y = key[1]
					let offsetPosition = []

					switch (direction) {
						case "up":
							offsetPosition = [x, y - 1]
							break
						case "down":
							offsetPosition = [x, y + 1]
							break
						case "left":
							offsetPosition = [x - 1, y]
							break
						case "right":
							offsetPosition = [x + 1, y]
							break
						default:
							offsetPosition = [null, null]
							break
					}
					let offsetItem = grid.get(offsetPosition)
					if (direction === 'down' && !offsetItem) { // loop to next column, top row
						offsetItem = grid.get([x + 1, 1]) // "1" is hardcoded
					}
					if (direction === 'up' && !offsetItem) {
						offsetItem = grid.get([x - 1, columnLength[x]]) // loop back to previous column, bottom row
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
					x: key[0] + 1,
					y: key[1] + 1
				}
				)
			}
		})
		//	console.log([...grid.values()])

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
