$(function() {
    // categories
    var hoverMenuItem;
    
    $("#totalPrice").tmpl(busket).appendTo(".basketBtn");
    var showTotalPrice = $("#price").tmplItem();
    
    $("#productsQuantity").tmpl(busket).appendTo(".basketBtn");
    var showProductsQuantity = $("#amount").tmplItem();
    console.log(showProductsQuantity);
    
    $("#zwischensumme").tmpl(busket).appendTo("#busketTotal");
    var showBusketTotal = $("#zwischensummeTotal").tmplItem();
    
    var busketOrders = $("#item").tmpl(busket.orders).appendTo("#orderList");
    
    
    function updateUi(template, data) {
        console.log("updating", template, data);
        template.data.value = data;
        template.update();
    };
    
    var categoryTemplateMarkup = "<li>${name}</li>";
    $.template("categoryTemplate", categoryTemplateMarkup);
    $.tmpl("categoryTemplate", categories).appendTo(".menu");
    
    // subcategories
    
    var menuItems = $(".menu > li");
    var activeMenuItems = menuItems.slice(1);
    
    activeMenuItems.hover(
        function() {
            hoverMenuItem = this;
            menuItems.removeClass("hover");
            $(hoverMenuItem).addClass("hover");
            var corner = $(".menu li:first-child");
            var left = corner.offset().left - parseInt(corner.css('padding-left'));
            
            $(".subcategories ul").html("");
            var subcategoryTemplateMarkup = "<li>${name}</li>";
            $.template("subcategoryTemplate", subcategoryTemplateMarkup);
            var currentCategory = categories.filter(function(category){return category.name === $(hoverMenuItem).text()});
            //console.log(currentCategory[0].subcategories, currentCategory);
            $.tmpl("subcategoryTemplate", currentCategory[0].subcategories).appendTo(".subcategories ul");
            
            $(".representation img").attr({"src": currentCategory[0].image});
            
            $(".popover").css({"display": "block", "left" : left + "px", "right" : left + "px"});
        }, function() {
            $(".popover").css({"display": "none"});
            $(hoverMenuItem).removeClass("hover");
        }
    );
    
    activeMenuItems.click(function() {
        menuItems.removeClass("active");
        $(this).addClass("active");
        $(".popover").css({"display": "none"});
    });
    
    $(".popover").hover(
        function() {
            $(hoverMenuItem).addClass("hover");
            $(this).css({"display": "block"});
        }, function(){
            $(this).css({"display": "none"});
            menuItems.removeClass("hover");
        }
    );
    
    $(".close").on("click", function() {
        $(".popover").css({"display": "none"});
        menuItems.removeClass("hover");
    });
    
    $("body").on("click", ".subcategories li", function () {
        var self = this;
        $(".popover").css({"display": "none"});
        $(".products").css({"display": "block"});
        menuItems.removeClass("active");
        $(hoverMenuItem).addClass("active");
            $(".navCategory").text($(hoverMenuItem).text());
            $(".navSubcategory").text($(self).text());
        console.log($(hoverMenuItem).text(),$(self).text())
        //console.log($(this).text());
        var productsList = products.filter(function(product) {return product.category === $(self).text()});
        $(".productsList").empty();
        //console.log(productsList)
        var productTemplateMarkup = "<li>"+
                                        "<div>"+
                                            "<img src=${look}>"+
                                            "<h5>${label}</h5>"+
                                            "<p><span>Inhalt</span> ${description}</p>"+
                                            "<p class='productPrice'>${price}</p>"+
                                        "</div>"+
                                    "</li>";
        $.template("productTemplate", productTemplateMarkup);
        $.tmpl("productTemplate", productsList).appendTo(".productsList");
    });
    
    $("body").on("click", ".productsList div", function() {
        var self = this;
        var selectedProduct = products.filter(function(product){return product.label === $(self).find("h5").text()})[0];
        //console.log(product);
        var busketSelectedProduct = busket.orders.filter(function(order){return order.product.label === selectedProduct.label});
        if(busketSelectedProduct.length === 0){
            busket.addOrder(selectedProduct);
            //console.log(busket.orders);
            updateUi(showTotalPrice, busket);
            updateUi(showProductsQuantity, busket);
            updateUi(showBusketTotal, busket);
        }else {
            busket.increaseAmount(busketSelectedProduct[0]);
            updateUi(showTotalPrice, busket);
            updateUi(showProductsQuantity, busket);
            updateUi(showBusketTotal, busket);
        }
        $("#orderList").empty().append($("#item").tmpl(busket.orders));
        
        $(".overlay").css({"display": "block"});
    });
    
    $("body").on("click", ".overlay", function(e) {
        if(e.target === $(".overlay")[0]){
            $(this).css({"display": "none"});
        }
    });
    
    $("body").on("click", ".removeItem", function() {
        var orderToRemove = $($(this).parents("li")[0]).data().tmplItem.data;
        console.log(orderToRemove);
        busket.removeOrder(orderToRemove);
        updateUi(showTotalPrice, busket);
        updateUi(showProductsQuantity, busket);
        updateUi(showBusketTotal, busket);
        $("#orderList").empty().append($("#item").tmpl(busket.orders));
    });
    
    $("body").on("click", ".addItem", function() {
        var DOMElement = $(this).parents("li")[0];
        var item =$(DOMElement).data().tmplItem.data;
        console.log(item);
        busket.increaseAmount(item);
        console.log($(DOMElement).index());
        updateUi($(DOMElement).tmplItem(), busket.orders[$(DOMElement).index()]);
        updateUi(showTotalPrice, busket);
        updateUi(showProductsQuantity, busket);
        updateUi(showBusketTotal, busket);
    });
    
    $("body").on("click", ".substractItem", function() {
        var DOMElement = $(this).parents("li")[0];
        var item =$(DOMElement).data().tmplItem.data;
        console.log(item);
        busket.decreaseAmount(item);
        console.log($(DOMElement).index());
        updateUi($(DOMElement).tmplItem(), busket.orders[$(DOMElement).index()]);
        updateUi(showTotalPrice, busket);
        updateUi(showProductsQuantity, busket);
        updateUi(showBusketTotal, busket);
    });
    
    $(".basketBtn").on("click", function() {
        $(".overlay").css({"display": "block"});
    })
});