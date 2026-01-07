document.addEventListener("DOMContentLoaded", () => {
	let slides = document.querySelectorAll(".slide-container");
	let current = 0;

	// el primero tiene q ser visible
	if (slides.length > 0) {
		slides[current].classList.add("active");
	}

	setInterval(() => {
		if (slides.length === 0) return;

		// inicia quitando pq ya se puso de antes
		slides[current].classList.remove("active");
		slides[current].classList.add("post");

		let previous = current;

		// next until max (0)
		current++;
		current = current % slides.length;

		// Activa el nuevo slide
		setTimeout(() => {
			slides[current].classList.add("active");
		}, 10);

		// reiniciar salido
		setTimeout(() => {
			slides[previous].classList.remove("post");
		}, 1000);
	}, 5000); // 5s to better readability
});
