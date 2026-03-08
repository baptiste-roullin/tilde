import slugify from "@sindresorhus/slugify"
import akMap from "./src/akMap.js"

import importedWords from "./src/data/words.js"

interface Cell {
	word: string | null,
	hrefSelf: string | null,
	hrefUp?: string,
	hrefDown?: string,
	hrefRight?: string,
	hrefLeft?: string,
	x?: number,
	y?: number

}

export default function (config) {
	config.addPassthroughCopy("./src/*.css")

	// length of columns
	let columnsLength: number[] = []
	let duplicates: string[] = []
	const grid = new akMap()
	let map: Cell[][] = []

	function getAdjacent(direction: string, key: number[], grid: akMap) {
		const x = key[0]
		const y = key[1]
		const nextColumn = importedWords[x + 1]
		if (nextColumn) {
			var firstFilledRowOnNextColumn = nextColumn.findIndex(el => el) // always returns "1"
		}
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

		if (!grid) {
			console.log(key, direction)
		}

		let adjacentItem = grid.get(adjacentPosition)
		if (!adjacentItem && ((direction === 'right') || (direction === 'left'))) {
			return null
		}
		// offset peut être undefined (hors de la grille)
		// ou bien offset.word peut être null (dans la grille mais cellule vide)
		if (direction === 'down' && (!adjacentItem || !adjacentItem?.word) && y === columnsLength[x] - 1) { // loop to next column, first filled row
			adjacentItem = grid.get([x + 1, firstFilledRowOnNextColumn])
		}
		if (direction === 'up' && (!adjacentItem || !adjacentItem?.word) && x !== 0) {
			adjacentItem = grid.get([x - 1, columnsLength[x - 1] - 1]) // loop back to previous column, bottom row
		}
		return adjacentItem?.hrefSelf // directions qui n'existent pas : retourne undefined
	}

	//Première passe pour lister tous les doublons
	importedWords.flat().forEach((element, index, array) => {
		if (array.indexOf(element) !== index) {
			duplicates.push(element)
		}
	})


	// on crée la grille et on la peuple avec mot et lien vers soi-même.
	importedWords.forEach((column, x, importedWords) => {
		columnsLength[x] = column.length
		map.push([])
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
			const value: Cell = (word ?
				{
					word: word,
					hrefSelf: href
				} : {
					word: null,
					hrefSelf: null
				})
			grid.set([x, y], value)
			map[x].push(value)
		})
	})

	// On parcoure la grille précédemment créée pour générer les liens vers les items adjacents.
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
				hrefUp: getAdjacent("up", key, grid),
				hrefDown: getAdjacent("down", key, grid),
				hrefRight: getAdjacent("right", key, grid),
				hrefLeft: getAdjacent("left", key, grid),
				// sert uniquement pour afficher les coordonnées à l'utilisateur
				x: key[0] + 1,
				y: key[1] + 1
			}
			)
		}
	})


	config.addCollection("map", async () => {
		//console.log([...grid.values()])
		return map

	})
	config.addCollection("everything", async () => {
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
