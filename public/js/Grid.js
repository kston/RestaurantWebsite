class Grid {
	constructor(configs) {
		this.option = Object.assign(
			{
				formCreate: '#modal-create form',
				formUpdate: '#modal-update form',
				btnUpdate: 'btn-update',
				btnDelete: 'btn-delete',
				onShow: (form, name, data) => {
					let input = form.querySelector(`[name=${name}]`);
					if (input) input.value = data[name];
				},
			},
			configs
		);

		this.row = [...document.querySelectorAll('table tbody tr')];
		this.initForm();
		this.initButton();
	}

	initForm() {
		this.formCreate = document.querySelector(this.option.formCreate);
		this.formUpdate = document.querySelector(this.option.formUpdate);
		if (this.formCreate || this.formUpdate) {
			this.formCreate.save({
				success: () => {
					window.location.reload();
				},

				failure: (err) => {
					console.log(err);
				},
			});

			this.formUpdate.save({
				success: () => {
					window.location.reload();
				},

				failure: (err) => {
					console.log(err);
				},
			});
		}
	}

	getTrData(e) {
		let tr = e.path.find((el) => {
			return el.tagName.toUpperCase() === 'TR';
		});
		return JSON.parse(tr.dataset.row);
	}

	btnUpdateClick(e) {
		let data = this.getTrData(e);

		for (let name in data) {
			this.option.onShow(this.formUpdate, name, data);
		}
		this.initForm(this.formUpdate);
		$('#modal-update').modal('show');
	}

	btnChangePassword(e) {
		let data = this.getTrData(e);

		document.querySelector('#modal-update-password form [name=id] ').value =
			data.id;

		$('#modal-update-password').modal('show');

		document.querySelector('#modal-update-password form').save({
			success: () => {
				window.location.reload();
			},
			failure: (err) => {
				alert(err);
			},
		});
	}

	btnDeleteClick(e) {
		let data = this.getTrData(e);

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
	}

	initButton() {
		this.row.forEach((row) => {
			[...row.querySelectorAll('.btn')].forEach((btn) => {
				btn.addEventListener('click', (e) => {
					if (e.target.classList.contains(this.option.btnUpdate)) {
						this.btnUpdateClick(e);
					} else if (e.target.classList.contains(this.option.btnDelete)) {
						this.btnDeleteClick(e);
					} else if (
						e.target.classList.contains(this.option.btnChangePassword)
					) {
						this.btnChangePassword(e);
					}
				});
			});
		});
	}
}
