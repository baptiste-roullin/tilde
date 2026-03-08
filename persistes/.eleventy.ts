import slugify from "@sindresorhus/slugify"
import akMap from "./src/akMap.js"

import importedWords from "./src/data/words.js"

export default function (config) {
	config.addPassthroughCopy("./src/*.css")

	// length of columns
	let columnsLength: number[] = []

	function gridGet(direction: string, key: number[], grid: akMap) {
		const x = key[0]
		const y = key[1]
		const nextColumn = importedWords[x + 1]
		if (nextColumn) {
			var firstFilledRowOnNextColumn = nextColumn.findIndex(el => el) // always returns "1"
		}
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

		if (!grid) {
			console.log(key, direction)
		}

		let offsetItem = grid.get(offsetPosition)
		if (!offsetItem && ((direction === 'right') || (direction === 'left'))) {
			return null
		}
		// offset peut être undefined (hors de la grille)
		// ou bien offset.word peut être null (dans la grille mais cellule vide)
		if (direction === 'down' && (!offsetItem || !offsetItem?.word) && y === columnsLength[x] - 1) { // loop to next column, first filled row
			offsetItem = grid.get([x + 1, firstFilledRowOnNextColumn])
		}
		if (direction === 'up' && (!offsetItem || !offsetItem?.word) && x !== 0) {
			offsetItem = grid.get([x - 1, columnsLength[x - 1] - 1]) // loop back to previous column, bottom row
		}
		return offsetItem?.hrefSelf // directions qui n'existent pas : retourne undefined
	}

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
			columnsLength[x] = column.length
			column.forEach((word, y) => {
				// la page a cette forme :
				// mot  null null null
				// mot  mot  mot  mot
				// mot  mot  mot  mot
				// mot  mot  mot  mot
				// (...)
				// mot  mot  mot  null
				// mot  mot  mot  null

				if (word) {
					if (duplicates.includes(word)) {
						var href = slugify(word) + y // prevent permalink collision
					} else {
						var href = slugify(word)
					}
				}
				const value = (word ?
					{
						word: word,
						hrefSelf: href
					} : { word: null })
				grid.set([x, y], value)
			})
		})

		grid.forEach((value: Record<string, string>, key: number[], grid: akMap) => {

			if (value.word === null) {
				grid.set(key, {
					// on reprend la valeur précédente
					word: null,
					x: key[0] + 1,
					y: key[1] + 1
				}
				)
			}
			else {
				grid.set(key, {
					// on reprend la valeur précédente
					word: value?.word,
					hrefSelf: value?.hrefSelf,
					hrefUp: gridGet("up", key, grid),
					hrefDown: gridGet("down", key, grid),
					hrefRight: gridGet("right", key, grid),
					hrefLeft: gridGet("left", key, grid),
					// sert uniquement pour afficher les coordonnées à l'utilisateur
					x: key[0] + 1,
					y: key[1] + 1
				}
				)
			}
		})
		//console.log([...grid.values()])
		return [...grid.values()].filter(item => item.word !== null).reverse()

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
