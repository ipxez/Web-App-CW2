window.addEventListener('load', function()  {
    //lesson = [];
    webstore = new Vue  ({
        el: '#app',
        data:   {
            product: lesson = {},
            cart: [],
            showProducts: true,
            form: {
                name: null,
                phone: null
            },
            sortBy: 'Price'
        },
        created: function() {
            fetch('https://cw2-server.herokuapp.com/collection/products').then(
                function (response) {
                    response.json().then(
                        function (json) {
                            webstore.product = json
                        }
                    )
                }
            )
        },
        methods:    {
            // Adds lesson to cart and removes that lesson from its matching lesson ID
            // Stops at 0
            addToCart(lesson)  {
                if (lesson.spaces > 0)    {
                    lesson.spaces -= 1;
                    this.cart.push(lesson);
                }
            },
            // Hides cart unless there are products in it (this was part of the criteria...)
            isHidden(cart) {
                return cart.length <= 0;
            },
            // Disables Add to Cart Button if stock is less than or equal to 0
            isDisabled(lesson)    {
                return lesson.spaces <= 0;
            },
            // Hides the showProducts section by setting its visibility to false
            // Reveals showProducts section if actioned again by setting visibility to true
            displayCheckout() {
                this.showProducts = this.showProducts ? false : true;
            },
            // Removes product from cart and adds it back to the stock of that product
            removeLesson(lesson)  {
                if (lesson.spaces < 5)  {
                    lesson.spaces += 1;
                    this.cart.pop(lesson);
                }
            },

            // Simmple alert pop-up for checking out products and refreshes the page once closed
            checkoutsubmit()    {
                if (this.validForm)  {
                    alert("Successfully Checked Out!");
                    this.order.push(order.name && order.phone);
                }
            },
        },
        computed:   {
            // Validation for name ensures it is only text
            nameValid() {
                return /^[A-Za-z]+$/.test(this.form.name);
            },
            // Validation for phone ensures only numbers can be entered
            phoneValid()    {
                return typeof this.form.phone == "number";
            },
            // Disables checkout button until validation passes
            validForm() {
                return this.nameValid && this.phoneValid;
            },
            // Sort products in order of price from highest to lowest using drop down menu
            // Hopefully this counts as ascending and descending order
        //     sortedLessons() {
        //         return this.product.sort((a, b) => {
        //            if (this.sortBy == 'highest') {
        //                return b.price - a.price
        //            }
        //            else if (this.sortBy == 'lowest') {
        //                return a.price - b.price
        //            }
        //        })
        //    }
        }
    });
});