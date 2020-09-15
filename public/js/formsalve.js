HTMLFormElement.prototype.save = function (configs) {
	let form = this;

	return new Promise((resolve, reject) => {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			let formData = new FormData(form);

			fetch(form.action, {
				method: form.method,
				body: formData,
			})
				.then((response) => response.json())
				.then((json) => {
					if (json.error) {
						if (typeof configs.failure === 'function')
							configs.failure(json.error);
					} else {
						if (typeof configs.failure === 'function') configs.success(json);
					}
				})
				.catch((err) => {
					if (typeof configs.failure === 'function') configs.failure(err);
				});
		});
	});
};
