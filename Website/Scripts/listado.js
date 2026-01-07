function createCard(name, desc, url, text) {
	var card = document.createElement("div");
	var cardIcon = document.createElement("div");
	var cardIconImage = document.createElement("img");
	var cardName = document.createElement("h3");
	var cardDesc = document.createElement("p");
	var cardButton = document.createElement("a");
	cardIcon.appendChild(cardIconImage);
	card.appendChild(cardIcon);
	card.appendChild(cardName);
	card.appendChild(cardDesc);
	card.appendChild(cardButton);
	console.log(name, desc, url, text);
	card.classList.add("card");
	cardIcon.classList.add("card-icon");
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
