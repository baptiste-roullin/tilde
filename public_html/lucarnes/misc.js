
const main = document.getElementById("main")

function modal() {
	const dialog = document.querySelector("dialog")
	const showButton = document.querySelector("header .title button")
	const closeButton = document.querySelector("dialog button")

	showButton.addEventListener("click", () => {
		dialog.showModal()
	})

	closeButton.addEventListener("click", () => {
		dialog.close()
	})
}



document.addEventListener("DOMContentLoaded", () => {

	modal()
})



