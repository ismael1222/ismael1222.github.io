function createCard(name, desc, url, text) {
	var card = document.createElement("div");
	var cardIcon = document.createElement("div");
	var cardIconImage = document.createElement("img");
	var cardName = document.createElement("h4");
	var cardDesc = document.createElement("p");
	var cardButton = document.createElement("a");
	var cardDivision = document.createElement("div");
	var centerer = document.createElement("center");

	cardIcon.appendChild(cardIconImage);
	card.appendChild(cardIcon);
	centerer.appendChild(cardDivision);
	card.appendChild(centerer);
	cardDivision.appendChild(cardName);
	cardDivision.appendChild(cardDesc);
	cardDivision.appendChild(cardButton);

	card.classList.add("card");
	cardDivision.classList.add("card-content");
	cardIcon.classList.add("card-image");
	cardIconImage.src = url || "";
	cardIconImage.alt = name || "unknownImageName";
	cardName.innerText = name || "unknownName";
	cardDesc.innerText = desc || "unknownDesc";
	cardButton.href = text || "unknownHref";
	cardButton.classList.add("boton");
	cardButton.innerHTML = "Añadir al carrito";

	return card;
}
/* fetch("./listado.json").then((response) => {
	if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
	}
	console.log(response);
});
 */
let responseJson = JSON.parse(
	'[{"producto": "Jeans","texto":"whatsappTexto","descripcion":"descripcion","fotoUrl":"https://randommer.io/images/clothes/Jeans.webp"},{"producto":"Cargos","texto":"whatsappTexto","descripcion": "descripcion",		"fotoUrl": "https://randommer.io/images/clothes/Cargos.webp"	},	{		"producto": "Sandals",		"texto": "whatsappTexto",		"descripcion": "descripcion",		"fotoUrl": "https://randommer.io/images/clothes/Sandals.webp"	},	{		"producto": "Top hat",		"texto": "whatsappTexto",		"descripcion": "descripcion",		"fotoUrl": "https://randommer.io/images/clothes/Top%20Hat.webp"	},	{		"producto": "Flannel Shirt",		"texto": "whatsappTexto",		"descripcion": "descripcion",		"fotoUrl":"https://randommer.io/images/clothes/Flannel%20Shirt.webp"},{"producto":"Referee uniform","texto":"whatsappTexto","descripcion":"descripcion","fotoUrl":"https://randommer.io/images/clothes/Referee%20Uniform.webp"},{"producto":"Shirt","texto":"whatsappTexto","descripcion":"descripcion","fotoUrl":"https://randommer.io/images/clothes/Shirt.webp"}]',
);

responseJson.forEach((element) => {
	console.log("//////////");
	console.log(element);
	console.log(element.producto);
	let card = createCard(element.producto, element.descripcion, element.fotoUrl, element.texto);
	console.log(Object.keys(element));
	console.log(card);
	document.querySelector(".cards-grid").appendChild(card);
});
