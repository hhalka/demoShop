$(function() {
    // categories
    var hoverMenuItem;
    
    $("#template").tmpl(busket).appendTo(".basketBtn");
    var showTotalPrice = $("#value").tmplItem();
    
    function updateUi(template, data) {
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
        //console.log($(this).text());
        var productsList = products.filter(function(product) {return product.category === $(self).text()});
        //console.log(productsList)
        var productTemplateMarkup = "<li>"+
                                        "<div>"+
                                            "<img src=${look}>"+
                                            "<h5>${label}</h5>"+
                                            "<p><span>Inhalt</span> ${description}</p>"+
                                            "<p>${price}</p>"+
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
        }else {
            busket.increaseAmount(busketSelectedProduct[0]);
            updateUi(showTotalPrice, busket);
        }
    })
});