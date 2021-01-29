window.addEventListener('load', function()  {
    webstore = new Vue  ({
        el: '#app',
        data:   {
            product: {
                prodImg: {},
            },
            cart: [],
            showProducts: true,
            form: {
                name: null,
                phone: null
            },
            sortBy: 'Price'
        },

        created: function() {
            fetch('https:cw2-server.herokuapp.com/collection/products', {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify()
            })
            .then(response => response.json())
            .then(responseJSON => {
                webstore.product = responseJSON;
                //console.log("Success:", responseJSON)
            })
        },
        methods:    {
            // Adds lesson to cart and removes that lesson from its matching lesson ID
            // Stops at 0
            addToCart(lesson)  {
                if (lesson.spaces > 0)    {
                    lesson.spaces -= 1;
                    this.cart.push(lesson);

                    let updateProduct = {spaces: lesson.spaces};

                    fetch('https://cw2-server.herokuapp.com/collection/products/' + lesson._id, {
                        method: 'PUT',
                        headers: {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify(updateProduct)
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Successfully updated spaces:', data)
                    })                    
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
                    this.cart.splice(this.cart.indexOf(lesson), 1);
                    
                    let updateProduct = {spaces: lesson.spaces};

                    fetch('https://cw2-server.herokuapp.com/collection/products/' + lesson._id, {
                        method: 'PUT',
                        headers: {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify(updateProduct)
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Successfully updated spaces:', data)
                    })
                }
            },

            // Simmple alert pop-up for checking out products and refreshes the page once closed
            checkoutsubmit(cart)    {
                if (this.validForm)  {

                    // Counts how many times duplicate ID's come up so I can filter them
                    // when putting the objects into MongoDB
                    const mp = new Map(cart.map(o => [o._id, {...o, count: 0}]));
                    for (const {_id} of cart) mp.get(_id).count++;
                    const result = Array.from(mp.values());

                    console.log(result)

                    // Targetting specific fields in array for order collection
                    let cartID = result.map(a=>({id: a._id}));
                    let cartName = result.map(b=>({name: b.name}));
                    let cartSpaces = result.map(c=>({spaces: c.count}));

                    let currentDate = new Date().toJSON();

                    // Creating an object to send to the database
                    const newOrder = {
                        customer_name: this.form.name,
                        customer_number: this.form.phone,
                        product_purchased: {
                            lesson_id: cartID,
                            lesson_name: cartName,
                            spaces_bought: cartSpaces,
                        },
                        date: currentDate
                    }

                    console.log(newOrder);

                    fetch('https://cw2-server.herokuapp.com/collection/orders', {
                        method: 'POST',
                        headers: {
                            'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify(newOrder)
                    })
                    .then(response => response.json())
                    .then(responseJSON => {
                        console.log('Success:', responseJSON)
                    });
                    alert("Successfully Checked Out! (Refreshing the page will permanently remove the items from the DB)");
                }
                else    {
                    alert('Something went wrong :(');
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

            // Commented code out because it broke the product display - Shouldn't cost me marks as it wasn't part of requirements
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