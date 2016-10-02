var Category = function(name, reference, image) {
	this.name = name;
	this.subcategories = [];
	this.reference = reference;
    this.image = image;
}

Category.prototype.addSubcategory = function(name, reference) {
	var subcategory = new Category(name, reference);
	this.subcategories.push(subcategory);
	return this;
}

var categories = [
	new Category("Home", undefined, "images/0.jpg"),
	new Category("Höhenluft & Abenteuer", undefined, "images/1.jpg"),
	new Category("Kochlust & Provence", undefined, "images/2.jpg")
        .addSubcategory("Essig & Öl"),
	new Category("Handwerk & Tradition", undefined, "images/3.jpg"),
	new Category("Specials & Sales", undefined, "images/4.jpg")
        .addSubcategory("Fashion Sale")
        .addSubcategory("Kauf 3 Zahl 2")
        .addSubcategory("Gratisartikel")
        .addSubcategory("Das 2te Produkt günstiger")
        .addSubcategory("Sale"),
    new Category("Blog", undefined, "images/5.jpg")
];

var Product = function(label, description, category, price, look) {
	this.label = label;
	this.description = description;
	this.category = category;
	this.price = price;
	this.look = look;
};

var products = [
    new Product("Quinta de Sao Vicente Essig", "0.25 Liter(39.60€ / 1 Liter)", "Essig & Öl", "9.90 €", "images/oil_1.png"),
    new Product("Steirisches Kürbiskernöl ggA", "0.25 Liter(56.00€ / 1 Liter)", "Essig & Öl", "14.00 €", "images/oil_2.png"),
    new Product("Quinta de Sao Vicente Öl", "0.25 Liter(27.60€ / 1 Liter)", "Essig & Öl", "6.90 €", "images/oil_3.png")
];

var Order = function(product, amount) {
    this.product = product;
    this.amount = amount;
}

Order.prototype.increaseAmount = function() {
    this.amount++;
}

Order.prototype.decreaseAmount = function() {
    this.amount--;
}


var Basket = function() {
    this.orders = [];
    this.total = "0.0";
};

Basket.prototype.addOrder = function(product) {
    var order = new Order(product, 1);
    this.orders.push(order);
    this.total = this.calculateTotal();
};

Basket.prototype.removeOrder = function(order) {
    this.orders.splice(this.orders.indexOf(order), 1);
    this.total = this.calculateTotal();
};

Basket.prototype.increaseAmount = function(order) {
    order.increaseAmount();
    this.total = this.calculateTotal();
}

Basket.prototype.decreaseAmount = function(order) {
    order.decreaseAmount();
    this.total = this.calculateTotal();
}


Basket.prototype.calculateTotal = function() {
    var total = 0.0;
    for(var i = 0; i < this.orders.length; i++) {
        var order = this.orders[i];
        total += parseFloat(order.product.price) * order.amount;
    }
    console.log(total, total.toFixed(2));
    return total.toFixed(2);
}

var busket = new Basket();