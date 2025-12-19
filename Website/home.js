document.addEventListener('DOMContentLoaded', () => {
	let images = document.querySelectorAll("img.display");
	let current = 0;
	
	// Asegurarnos de que la primera imagen sea visible al cargar
	if (images.length > 0) {
		images[current].classList.add('active');
	}
	
	setInterval(() => {
		if (images.length === 0) return;
		
		// Remueve la clase 'active' de la imagen actual
		images[current].classList.remove('active');
		images[current].classList.add('post');
		
		let previous = current;
		
		// Incrementa el índice
		current++;
		if (current >= images.length) {
			current = 0;
		}
		
		// Agrega 'active' a la nueva imagen (esto debe hacerse después de un pequeño delay)
		setTimeout(() => {
			images[current].classList.add('active');
		}, 10);
		
		// Después de la transición, limpia la clase 'post' de la imagen anterior
		setTimeout(() => {
			images[previous].classList.remove('post');
		}, 1000);
		
	}, 3000);
});