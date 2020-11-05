/** 

Dito Cahya Pratama
TI-2G

**/

/*
 * Init
 */
var currentTarget = $('.slide').removeClass('show').first().addClass('show');
var data = [0];
let cart = [];
var imageUrl = 'img/';
var currency = 'Rp';
/*
 * Init Slider
 */

function prev() {
	var prev = currentTarget.prev();
	var target = prev.length > 0 && prev.hasClass('slide') ? prev : $('.slide').last();

	currentTarget.removeClass('show');
	target.addClass('show');

	currentTarget = target;
}

function next() {
	var next = currentTarget.next();
	var target = next.length > 0 && next.hasClass('slide') ? next : $('.slide').first();

	currentTarget.removeClass('show');
	target.addClass('show');

	currentTarget = target;
}

$('#login-cashier').click(function(){
	const username = $('#uname').val();
	const password = $('#upass').val();

	console.log(password)

	if(username == "admin" && password == "admin"){
		window.location.href = 'cashier.html';
	}else{
		alert('Username dan password salah')
	}
})

$('.prev').click(function () {
	prev();
});

$('.next').click(function () {
	next();
});

/* Init drag bahan */

$('.slide img').on('dragstart', function (event) {
	var id = $(this).attr('id');
	var type = 'copy';

	event.originalEvent.dataTransfer.setData('id', id);
	event.originalEvent.dataTransfer.setData('type', type);
});

$('#order').on('dragstart', '.scale', function (event) {
	var id = data.length - $(this).index() - 1;
	var type = 'move';

	event.originalEvent.dataTransfer.setData('id', id);
	event.originalEvent.dataTransfer.setData('type', type);
});

/* Init drop order */

$('#order, #trash').on('dragover', function (event) {
	/* Preventing Default Action */
	event.preventDefault();
});

$('#order').on('dragenter', '.scale', function (event) {
	$(event.currentTarget).addClass('hover');
});

$('#order').on('dragleave', '.scale', function (event) {
	$('.scale').removeClass('hover');
});

$('#order').on('drop', function (event) {
	var id = event.originalEvent.dataTransfer.getData('id');
	var type = event.originalEvent.dataTransfer.getData('type');
	var indexTarget = data.length - $(event.target).index() - 1;

	id = parseInt(id);

	if (type == 'copy' && isItemAllowed(id)) {
		if (event.currentTarget == event.target) {
			data.splice(1, 0, id);
			draw();
		} else if ($(event.target).hasClass('scale')) {
			var injectPoint = 0;
			var index = $(event.target).index();

			if (index < data.length - 1) {
				injectPoint = data.length - index - 1;
			}

			data.splice(injectPoint, 0, id);
			draw();
		} else {
			alert('Something getting wrong');
		}
	} else if (
		type == 'move' &&
		isItemAllowed(data[id]) &&
		$(event.target).hasClass('scale') &&
		isItemAllowed(data[indexTarget])
	) {
		var temp = data[id];
		data[id] = data[indexTarget];
		data[indexTarget] = temp;

		draw();
	} else {
		alert('Not allowed');
	}
});

$('#trash').on('drop', function (event) {
	var id = event.originalEvent.dataTransfer.getData('id');
	var type = event.originalEvent.dataTransfer.getData('type');

	if (type == 'move' && isItemAllowed(data[id])) {
		data.splice(id, 1);
		draw();
	} else {
		alert('Not Allowed');
	}
});

/* Init button function */

$('#reset').click(function (event) {
	event.preventDefault();

	data = [0];
	draw();
});

$('#process').click(function (event) {
	event.preventDefault();

	const idClient = $('#idClient').val();
	const nameClient = $('#name').val();
	const status = $("input[name='status']:checked").val();

	var order = {
		id: idClient,
		name: nameClient,
		status: status,
		data: cart,
		time: new Date().getTime(),
	};

	// data.forEach(function (id) {
	// 	order.data.push(copy(itemList[id]));
	// });

	order = JSON.stringify(order);

	localStorage.setItem('order', order);
	localStorage.setItem('isProcessed', 'false');

	window.location.href = 'order.html';
});

$("input[name='status']").click(function(event){
	// event.preventDefault();
	draw();
})



/* Utilities */

function copy(data) {
	if (Array.isArray(data)) {
		return Object.assign([], data);
	} else {
		return Object.assign({}, data);
	}
}

function draw() {
	$('#order, #detail, #total, #diskon').empty();

	var status = $("input[name='status']:checked").val();
	console.log(data)

	var total = 0;
	var diskon = 0;
	var type = "";
	if(status === "member"){
		if((data.length - 1) == 1 ){
			diskon = 5
		}else if((data.length - 1) > 1 && (data.length - 1) < 4){
			diskon = 7
		}else if((data.length - 1) > 3){
			diskon = 10
		}
		type = "satuan"
	}else{
		if((data.length - 1) > 1 && (data.length - 1) < 4){
			diskon = 0
		}else if((data.length - 1) > 3 && (data.length - 1) < 6 ){
			diskon = 5
			type = "seluruh"
		}else if((data.length - 1) > 5){
			diskon = 5
			type = "satuan"
		}
	}

	let cartRecent = []

	data.forEach(function (id) {
		var bahan = itemList[id];
		let harga = bahan.cost;
		if(type === "satuan"){
			harga = harga - ((harga * diskon) / 100)
		}
		if (id === 0) {
			$('<img>')
				.attr('src', imageUrl + bahan.img)
				.addClass('scale image-order')
				.prependTo('#order');
		}else{
			$('<img>')
				.attr('src', imageUrl + bahan.img)
				.addClass('scale')
				.prependTo('#order');
		}

		$('<tr></tr>')
			.append($('<td></td>').text(bahan.name))
			.append($('<td></td>').text(currency + harga))
			.prependTo('#detail');

		total += harga;

		cartRecent.push({
			nama: bahan.name,
			harga: harga
		})
	});

	cart = cartRecent

	if(type === "seluruh"){
		total = total - ((total * diskon) / 100)
	}

	$('<tr></tr>')
		.append('<td>Total</td>')
		.append($('<td></td>').text(currency + total))
		.prependTo('#total');

	if(type === "seluruh"){
		$('<tr></tr>')
		.append('<td>Diskon keseluruhan</td>')
		.append($('<td></td>').text(diskon + "%"))
		.prependTo('#diskon');
	}else{
		$('<tr></tr>')
			.append('<td>Diskon / item</td>')
			.append($('<td></td>').text(diskon + "%"))
			.prependTo('#diskon');
	}
	
}

function isItemAllowed(id) {
	return id != 0 && id != 1 && itemList != undefined;
}

/* We will go and ready */

$(document).ready(function () {
	draw();
});
