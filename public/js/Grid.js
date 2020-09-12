class Grid {
	constructor(configs) {
		this.option = Object.assign(
			{
				formCreate: '#modal-create form',
				formUpdate: '#modal-update form',
				btnUpdate: '.btn-update',
				btnDelete: '.btn-delete',
			},
			configs
		);

		this.initForm();
		this.initButton();
	}

	initForm() {
		this.formCreate = document.querySelector(this.option.formCreate);

		this.formCreate
			.save()
			.then((json) => {
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});

		this.formUpdate = document.querySelector(this.option.formUpdate);

		this.formUpdate
			.save()
			.then((json) => {
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}

	initButton() {
		[...document.querySelectorAll(this.option.btnUpdate)].forEach((btn) => {
			btn.addEventListener('click', (e) => {
				let tr = e.path.find((el) => {
					return el.tagName.toUpperCase() === 'TR';
				});

				let data = JSON.parse(tr.dataset.row);

				for (let name in data) {
					this.option.onShow(this.formUpdate, name, data);
				}

				$('#modal-update').modal('show');
			});
		});

		[...document.querySelectorAll(this.option.btnDelete)].forEach((btn) => {
			btn.addEventListener('click', (e) => {
				let tr = e.path.find((el) => {
					return el.tagName.toUpperCase() === 'TR';
				});

				let data = JSON.parse(tr.dataset.row);

				if (confirm(eval('`' + this.option.deleteMessage + '`'))) {
					fetch(eval('`' + this.option.deleteURL + '`'), {
						method: 'DELETE',
					})
						.then((res) => {
							res.json();
						})
						.then((json) => {
							window.location.reload();
						});
				}
			});
		});
	}
}
