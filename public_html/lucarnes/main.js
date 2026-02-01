const main = document.getElementById("main")
import sourcesURL from "./sources.js"

let sources = sourcesURL.slice() // duplicate import into mutable array


function showFrames(elems) {
	//const iframes = document.querySelectorAll("article iframe")
	for (let i = 0; i < elems.length; i++) {

		elems[i].children[1].addEventListener("load", function (e) {
			//console.log("load iframe", e.target.getAttribute("src"))
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
function doStuffafterDOMChange(records) {
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
	console.log("length", sources.length)

	const main = document.querySelector("body main")
	for (let index = 0; index < x; index++) {
		let element = document.createElement("article")
		element.setAttribute("id", "item" + index)
		element.innerHTML = `
		<iframe
		id='iframe${index}'
		src='${sources[index]}'
		loading='lazy'
		scrolling='yes'
		referrerpolicy='no-referrer'>
		</iframe>`
		sources.splice(index, 1)
		elements.push(element)
	}
	main?.append(...elements)
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



function doStuffAfterInitialLoad(e) {
	if (sources.length) {
		insertSomeFrames(5)
	}
}
export { }

