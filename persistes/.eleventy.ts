import slugify from "@sindresorhus/slugify"
import importedWords from "./src/words.js"
export default function (config) {

	config.addPassthroughCopy("./src/*.css")


	config.addCollection("everything", async () => {
		let map = {}
		let duplicates = []
		const grid = new Map()
		function countDuplicates() {


		}
		importedWords.forEach((list, x, importedWords) => {
			list.forEach((word, y) => {


				const duplicateCounts = duplicates.reduce((total, x) => total + (x === word), 0)
				if () {
					var href = slugify(word) + ".html"


				} else {
					var href = slugify(word) + ".html"
				}
				const value = (word ?
					{
						word: word,
						hrefSelf: href
					} : undefined)
				grid.set(String(x).padStart(2, "0") + String(y).padStart(2, "0"), value)




			})
		})

		grid.forEach((value, key, grid) => {
			if (value) {
				function gridGet(direction: string) {
					const x = key.slice(0, 2)
					const y = key.slice(2, 4)
					let offsetPosition = ""
					switch (direction) {
						case "down":
							offsetPosition = String(x) + String(Number(y) + 1)
						case "up":
							offsetPosition = String(x) + String(Number(y) - 1)
						case "left":
							offsetPosition = String(Number(x) - 1) + String(y)
						case "right":
							offsetPosition = String(Number(x) + 1) + String(y)
						default:
							break
					}
					const newValue = grid.get(offsetPosition)
					return newValue?.hrefSelf
				}



				grid.set(key, {
					// on reprend la valeur précédente
					word: value?.word,
					hrefSelf: value?.hrefSelf,
					hrefUp: gridGet("up"),
					hrefDown: gridGet("down"),
					hrefRight: gridGet("right"),
					hrefLeft: gridGet("left"),
				}
				)
			}
		})
		//console.log(grid)

		return [...grid.values()]

	})
	return {
		dir: {
			input: "src",
			output: "../public_html/persistes",
		},
		passthroughFileCopy: true,
		templateFormats: ["html", "njk",],
		htmlTemplateEngine: "njk",
		markdownTemplateEngine: "njk",
	}
}
