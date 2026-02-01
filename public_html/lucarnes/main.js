import { sourcesURL } from "./sources.js"

const main = document.getElementById("main")
let navIsetup = false

let sources = sourcesURL.slice() // duplicate import into mutable array


function showFrames(elems) {
	for (let i = 0; i < elems.length; i++) {

		elems[i].children[1].addEventListener("load", function (e) {
			console.log("load iframe", e.target.getAttribute("src"))
			const el = e.target.parentElement
			console.log(e.target.src, e.timeStamp)

			//if (e.timeStamp < 6000) {
			el.children[0].style.display = "none"
			el.children[1].classList.remove("hidden-iframe")
			//}
			//tester délai avec https://bettycollober.fr/en-ce-mome/nt
		})
	}
}

function setupNavigation() {

	navIsetup = true
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
function doStuffafterDOMChange(records) {


	if (!navIsetup) {
		setupNavigation()
	}
	const addedNodes = records[0].addedNodes
	//showFrames(addedNodes)

	const firstItem = addedNodes[0]
	if (firstItem.previousSibling) {
		scrollObserver.disconnect()
	}

	const target = addedNodes[addedNodes.length - 1]
	//console.log('DOM change', target.children[1].getAttribute("src"))
	if (sources.length) {
		scrollObserver.observe(target)
	}
}



function insertSomeFrames(x) {
	let elements = []
	const main = document.querySelector("body main")

	const array = sources.splice(0, x)
	for (let index = 0; index < array.length; index++) {
		let element = document.createElement("article")
		element.innerHTML = `
		<iframe
		id='iframe${index}'
		src='${array[index][1]}'
		loading='lazy'
		scrolling='yes'
		title='${array[index][0]}'
		referrerpolicy='no-referrer'>
		</iframe>`
		elements.push(element)
	}
	main?.append(...elements)
}

function doStuffAfterInitialLoad(e) {

	if (sources.length) {
		insertSomeFrames(5)
	}
}


// The flow is:
// 1. DOMcontentLoaded event
// 2. Insert X iframes
// 3. DOM mutation event => show these frames
// 4. Interesction event => Detect we scrolled => load more X iframes
// 5 show theses frames


document.addEventListener("DOMContentLoaded", doStuffAfterInitialLoad)


var scrollObserver = new IntersectionObserver((entries) => {
	if (entries[0].isIntersecting) {
		if (sources.length) {
			insertSomeFrames(5)
		}
	}
}, {
	root: main,
	rootMargin: "0px",
	threshold: .1,
})

var changeObserver = new MutationObserver(doStuffafterDOMChange)

changeObserver.observe(main, {
	childList: true,
})


export { }

