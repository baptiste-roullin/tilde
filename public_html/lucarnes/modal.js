

addEventListener("DOMContentLoaded", () => {
	const dialog = document.querySelector("dialog")
	const showButton = document.querySelector("header button")
	const closeButton = document.querySelector("dialog button")

	// Le bouton "Afficher la fenêtre" ouvre le dialogue
	showButton.addEventListener("click", () => {
		dialog.showModal()
	})

	// Le bouton "Fermer" ferme le dialogue
	closeButton.addEventListener("click", () => {
		dialog.close()
	})

})