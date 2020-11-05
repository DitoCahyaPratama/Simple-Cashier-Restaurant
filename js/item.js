/** 

Dito Cahya Pratama
TI-2G

List of items
for page all page

**/

function item (id, name, cost, img) {
 	this.id = id;
	this.name = name;
	this.cost = cost;
	this.img = img;
}

var itemList = [];

// set the function item(itemID, itemName, itemCost) 
itemList[0] = new item ('0', 'Piring', 0, 'piring.png');
itemList[2] = new item ('2', 'Pizza', 50000, 'pizza.png');
itemList[3] = new item ('3', 'Burger', 10000, 'burger.png');
itemList[4] = new item ('4', 'Beef', 20000, 'beef.png');
