const main = document.getElementById("main")
import sourcesURL from "./sources.js"

function doStuffafterDOMIsReallyLoaded(records) {
	const iframes = document.querySelectorAll("article iframe")
	for (let i = 0; i < iframes.length; i++) {

		iframes[i].addEventListener("load", function (e) {
			//console.log("load iframe", e.target.getAttribute("src"))
			const el = e.target.parentElement
			//console.log(e.timeStamp)

			//if (e.timeStamp < 6000) {
			el.children[0].style.display = "none"
			el.children[1].classList.remove("hidden-iframe")
			//}
			//tester délai avec https://bettycollober.fr/en-ce-mome/nt
		})
	}


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


async function insertIframes(e) {
	let elements = []

	const main = document.querySelector("body main")
	for (let index = 0; index < sourcesURL.length; index++) {
		let element = document.createElement("article")
		element.innerHTML = `
		<div class='fallback'>
		<p>🌃</p>
		</div>
		<iframe
		class="hidden-iframe"
		id='iframe${index}'
		src='${sourcesURL[index]}'
		loading='lazy'
		scrolling='yes'
		referrerpolicy='no-referrer'>
		</iframe>`
		elements.push(element)

	}
	main?.append(...elements)
}

document.addEventListener("DOMContentLoaded", insertIframes)

var observer = new MutationObserver(doStuffafterDOMIsReallyLoaded)
observer.observe(main, {
	childList: true,
	characterData: true
})



export { }
