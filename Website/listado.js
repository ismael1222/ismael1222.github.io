function createCard(name, desc, url, text) {
	var card = document.createElement('div')
	var cardIcon = document.createElement("div")
	var cardIconImage = document.createElement("img")
	var cardName = document.createElement("h3")
	var cardDesc = document.createElement("p")
	var cardButton = document.createElement("a")
	cardIcon.appendChild(cardIconImage);
	card.appendChild(cardIcon);
	card.appendChild(cardName);
	card.appendChild(cardDesc);
	card.appendChild(cardButon);

	card.classList.add("card")
	cardIcon.classList.add("card-icon")
	cardIconImage.src = url;
	cardIconImage.alt = name;
	cardName.innerText = name;
	cardDesc.innerText = desc
	cardButton.href = text;
	cardButton.classList.add("boton")

	return card;
}
fetch("./listado.json")
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		console.log(response)
	})