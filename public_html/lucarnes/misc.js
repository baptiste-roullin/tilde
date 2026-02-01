
const main = document.getElementById("main")

function modal() {
	const dialog = document.querySelector("dialog")
	const showButton = document.querySelector("header .title")
	const closeButton = document.querySelector("dialog button")

	showButton.addEventListener("click", () => {
		dialog.showModal()
	})

	closeButton.addEventListener("click", () => {
		dialog.close()
	})
}

function setupNavigation() {
	//quand l'attribut 'container' sera supporté, on pourra juste faire sur l'item:
	//scrollIntoView({ block: "end", inline: "nearest", , container: "nearest" })

	//logique du calcul de main.scrollLeft - itemSize
	// main.scrollLeft : c'est à quel point on a scrollé dans le conteneur
	// itemSize : c'est la bordure gauche du second item. Ca équivaut donc à la largeur d'un item + la largeur gap.
	// Tous les items sont de même taille, donc on peut s'en servir comme référence.
	const itemSize = main?.children[1].getBoundingClientRect().x

	document.querySelector("nav .previous").addEventListener("click", (e) => {
		e.preventDefault()
		const main = document.getElementById("main")
		main.scroll({ top: 0, left: main.scrollLeft - itemSize })
	})

	document.querySelector("nav .next").addEventListener("click", (e) => {
		e.preventDefault()
		const main = document.getElementById("main")
		main.scroll({ top: 0, left: main.scrollLeft + itemSize })
	})
}

document.addEventListener("DOMContentLoaded", () => {

	modal()
	setupNavigation()
})



