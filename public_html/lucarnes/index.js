const main = document.getElementById("main")
import sources from "./sources.js"


function makeIframesVisible() {
	function callback(records) {
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
	}
}


function insertTenFrames() {
	let elements = []


	for (let index = 0; index < sources.length / 10; index++) {

		let element = document.createElement("article")
		element.innerHTML = `
	<div class='fallback'>
		<p>🌃</p>
	</div>
	<iframe
			class="hidden-iframe"
			id='${sources[index]}'
			src='${sources[index]}'
			loading='lazy'
			scrolling='yes'
			referrerpolicy='no-referrer'>
		</iframe>`
		sources[index].remove
		elements.push(element)

	}
	main?.append(...elements)
}

async function insertIframes(e) {

	//insertTenFrames()
}


// insert 10 Frames
// DOM mutation => make 10 frames visible
// when end of list is atteined
// insert
// DOM mutation => make visible

var observer = new MutationObserver(makeIframesVisible)
observer.observe(main, {
	childList: true,
	characterData: true
})

document.addEventListener("DOMContentLoaded", insertIframes)


export { }
