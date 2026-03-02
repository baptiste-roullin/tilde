import slugify from "@sindresorhus/slugify"
import importedWords from "./src/words.js"
export default function (config) {

	config.addPassthroughCopy("./src/*.css")
	let id = 0

	config.addCollection("everything", async () => {


		// TODO algo duplicates
		// return : {word: string, indexGlobal: number}

		const duplicates = importedWords.flat().filter((item, index) => importedWords.indexOf(item) !== index)

		let duplicate = ""
		let numberOfHIts = 0
		const wordsGrid = importedWords
			.map((wordsList, x) => {
				//on parcourt l'array d'array
				return wordsList.map((word, y, array) => {
					let down = ""
					let up = ""
					let right = ""
					let left = ""

					let wordObject = {
						word: "",
						hrefUp: "",
						hrefDown: "",
						hrefRight: "",
						hrefLeft: "",
						href: "",
						d: id++,
						x: x + 1,
						y: y + 1,

					}



					//on checke les liens verticaux à ajouter
					// on check que l'item n'est pas le dernier de la liste
					if (y < array.length - 1) {
						// TODO algo duplicates
						// if (wordsList[y + 1]).id == duplicates.includes(wordObject.id))
						// setDiseambuigateLink()
						// else
						// wordObject.down = ...

						down = `/${slugify(wordsList[y + 1])}.html`
					}
					else if (x < importedWords.length - 1) { // loop
						word = word
						down = `/${slugify(importedWords[x + 1][0])}.html`

					}
					// on check que l'item n'est pas le premier de laliste
					if (y > 0) {
						up = `/${slugify(wordsList[y - 1])}.html`
					}

					//on checke les liens horizontaux à ajouter
					// en  vérifiant les colonnes de structure différente
					// y > 0 : pour lien droite désactivé au niveau de "tu persistes"
					if (x < importedWords.length - 1 && y > 0) {
						var rightList = importedWords[x + 1]
						if (y < rightList.length) {
							right = `/${slugify(rightList[y])}.html`
						}
					}

					if (x > 0) {
						var leftList = importedWords[x - 1]
						if (y < leftList.length) {
							left = `/${slugify(leftList[y])}.html`
						}
					}
					wordObject = {
						word: word,
						hrefUp: up,
						hrefDown: down,
						hrefRight: right,
						hrefLeft: left,
						href: "",
						d: id++,
						x: x + 1,
						y: y + 1,

					}
					//leftRight = importedWords[x  -1]
					return wordObject
				})
			})

		//on aplatit pour avoir une seule liste pour générer toutes les pages facilement
		// avec la `pagination` d'Eleventy

		const flattenedWordsGrid = wordsGrid.flat()
			.map((item, i, array) => {

				// on gère les mots identiques en générant un href différent.
				/*			const foundIndex = array.findIndex(
								(t) => (t["word"] === item["word"]))

							if (i !== foundIndex) {
								if (duplicate === item.word) {
									numberOfHIts++
								}
								else {
									numberOfHIts = 0
								}
								duplicate = item.word
								item.href = slugify(item.word + numberOfHIts)
							} else {
								item.href = slugify(item.word)
							}*/
				return item
			})

		return flattenedWordsGrid
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
