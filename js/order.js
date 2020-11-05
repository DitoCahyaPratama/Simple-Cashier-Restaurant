/** 

Dito Cahya Pratama
TI-2G

**/

var imageUrl = 'img/';
var currency = '$';

var order = localStorage.getItem('order');
var isProcessed = localStorage.getItem('isProcessed');

if (order && isProcessed) {
	order = JSON.parse(order);
	if (Array.isArray(order.data) && order.time < new Date().getTime() && new Date(order.time)) {
		if (isProcessed === 'false') {
			localStorage.setItem('isProcessed', 'true');
			draw();
			process();
		} else {
			if (window.confirm('Pesanan sedang di proses! Kembali ke menu utama')) {
				localStorage.removeItem('order');
				localStorage.removeItem('isProcessed');
				window.location.href = 'cashier.html';
			} else {
				draw();
			}
		}
	} else {
		alert('Invalid Request');
		window.location.href = 'cashier.html';
	}
} else {
	alert('Invalid Request');
	window.location.href = 'cashier.html';
}

function process() {
	/* Send Ajax Here */
}

function draw() {
	$('#detail, #total').empty();

	var total = 0;

	$('<tr></tr>').append($('<td></td>').text('ID Client')).append($('<td></td>').text(order.id)).prependTo('#detail');
	$('<tr></tr>').append($('<td></td>').text('Nama Client')).append($('<td></td>').text(order.name)).prependTo('#detail');
	$('<tr></tr>').append($('<td></td>').text('Status Client')).append($('<td></td>').text(order.status)).prependTo('#detail');

	order.data.forEach(function (bahan) {
		$('<tr></tr>')
			.append($('<td></td>').text(bahan.nama))
			.append($('<td></td>').text(currency + bahan.harga))
			.prependTo('#detail');

		total += bahan.harga;
	});

	$('<tr></tr>')
		.append('<td>TOTAL</td>')
		.append($('<td></td>').text(currency + total))
		.prependTo('#total');

	console.log(order);
	console.log(localStorage.getItem('order'));
}
