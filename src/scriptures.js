const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

function handleMediaquery(mediaQueryList) {
	if (mediaQueryList.matches) {
		document.querySelector(".dark-button").textContent = "Passer en style clair"
		document.querySelector("[href='dark.css']").disabled = false
		document.querySelector(".dark-manual").disabled = false
		//switchStyle("dark")
	}
	else {
		document.querySelector(".dark-button").textContent = "Passer en style sombre"
		document.querySelector("[href='dark.css']").disabled = true
		document.querySelector(".dark-manual").disabled = true
	}
}

handleMediaquery(mediaQueryList)

mediaQueryList.addEventListener('change', handleMediaquery);



document
	.querySelector(".dark-button")
	.addEventListener("click", (e) => {
		const body = document.querySelector("body")
		console.log(body.dataset.dark)
		if (body.dataset.dark === "false") {
			body.dataset.dark = true
			e.target.textContent = "Passer en style clair"
			document.querySelector("[href='dark.css']").disabled = false
			document.querySelector(".dark-manual").disabled = false
		}
		else {
			body.dataset.dark = false
			e.target.textContent = "Passer en style sombre"
			document.querySelector("[href='dark.css']").disabled = true
			document.querySelector(".dark-manual").disabled = true
		}
	})



function randomItem(array) { return array[Math.floor(Math.random() * array.length)]; }
const visitor = ["premier", "second", "quarante-deuxième et demi", "trois-cent million quatre-vingt-quinze-ième", "dernier"]
const browser = ["Beaker", "Blisk", "Brave", "Chrome", "Chromium", "Coc Coc", "Dragon", "Edge", "Epic", "Falkon", "Maxthon", "Opera", "Otter", "Puffin", "SalamWeb", "Samsung Internet", "Silk", "Sleipnir", "Sputnik", "SRWare", "Torch", "UC", "Vivaldi", "Whale", "Yandex", "Firefox", "Conkeror", "GNU", "IceCat", "IceDragon", "K-Meleon", "PirateBrowser", "SeaMonkey", "TenFourFox", "Tor", "WaterfoxDolphin", "Dooble", "GNOME", "Web", "iCab", "Konqueror", "Midori", "Roccat", "Safari", "360", "Avant", "Basilisk", "Cake", "CM", "eww", "Flow", "Internet Explorer", "Links", "Lunascape", "Lynx", "NetFront", "NetSurf", "Pale", "Moon", "QQ", "Qutebrowser", "SlimBrowser", "w3m"]
const version = Math.floor(Math.random() * 9768545)

const ame = ["orange mat", "cristalline", "a un arrière-goût de métal", "étincèle dans les logs de mon serveur"]
document.querySelector('footer div').innerHTML =
	`<p>Vous êtes le ${randomItem(visitor)} visiteur.</p>
	 <p>Je détecte que vous utilisez le navigateur ${randomItem(browser)} version ${version} avec un impeccable panache.</p>
	 <p>Votre écran comporte ${window.screen.width * window.screen.height * (2 * window.devicePixelRatio)} pixels. Étonnamment il y a exactement autant d'insectes <i>Colilodion schulzi</i> dans une mare au sud du village Sabang aux Philippines.</p>
	 <p>Votre âme est ${randomItem(ame)}. </p>
	 <p>Il y a quelqu'un derrière vous.</p>
	 `