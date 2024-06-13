document.addEventListener('DOMContentLoaded', () => {
    const pizzaContainer = document.querySelector('#pizzas-wrapper');
    const orderPizzas = document.querySelector('.orderPizzas');
    const sumUAH = document.getElementById('sumUAH');
    const orderButton = document.getElementById('orderButton');
    const cancelOrderButton = document.querySelector('.cancel-order');
    const buyText = 'Купити';

    let pizza_info = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function fetchPizzas() {
        // Assuming you have a local JSON file called "pizzas.json"
        fetch('pizzas.json')
            .then(response => response.json())
            .then(data => {
                pizza_info = data;
                renderPizzas();
            })
            .catch(error => console.error('Error fetching pizzas:', error));
    }

    function renderPizzas(filter = 'Усі') {
        pizzaContainer.innerHTML = '';
        let filteredPizzas = [];

        switch (filter) {
            case 'З ананасами':
                filteredPizzas = pizza_info.filter(pizza => pizza.content.pineapple && pizza.content.pineapple.length > 0);
                break;
            case 'З грибами':
                filteredPizzas = pizza_info.filter(pizza => pizza.content.mushroom && pizza.content.mushroom.length > 0);
                break;
            case 'З морепродуктами':
                filteredPizzas = pizza_info.filter(pizza => pizza.content.ocean && pizza.content.ocean.length > 0);
                break;
            default:
                filteredPizzas = filter === 'Усі' ? pizza_info : pizza_info.filter(pizza => pizza.type === filter);
                break;
        }

        filteredPizzas.forEach(pizza => {
            const pizzaDiv = document.createElement('div');
            pizzaDiv.className = 'pizza';

            const badgeNew = pizza.is_new ? `<p class="badge badge-new">Нова</p>` : '';
            const popularBadge = pizza.is_popular ? `<p class="badge badge-popular">Популярна</p>` : '';

            const smallSize = pizza.small_size ? `
                <div id="smallSize">
                    <p><img src="size-icon.svg" class="picSize"/>${pizza.small_size.size}</p>
                    <p><img src="weight.svg" class="picWeight"/>${pizza.small_size.weight}</p>
                    <p id="price">${pizza.small_size.price} <span id=priceUA>грн.</span></p>
                    <button class="buyButton" data-id="${pizza.id}" data-size="small"> ${buyText} </button>
                </div>` : '';

            const bigSize = pizza.big_size ? `
                <div id="bigSize">
                    <p><img src="size-icon.svg" class="picSize"/>${pizza.big_size.size}</p>
                    <p><img src="weight.svg" class="picWeight"/>${pizza.big_size.weight}</p>
                    <p id="price">${pizza.big_size.price} <span id=priceUA>грн.</span></p>
                    <button class="buyButton" data-id="${pizza.id}" data-size="big"> ${buyText} </button>
                </div>` : '';

            const combinedIngredients = [
                ...pizza.content.meat || [],
                ...pizza.content.chicken || [],
                ...pizza.content.cheese || [],
                ...pizza.content.pineapple || [],
                ...pizza.content.additional || []
            ].join(', ');

            const capitalizeFirstWord = string => string.charAt(0).toUpperCase() + string.slice(1);
            const formattedIngredients = capitalizeFirstWord(combinedIngredients);

            const pizzaAll = `
                ${badgeNew}
                ${popularBadge}
                <div class="pizzaAll">
                    <img src="${pizza.icon}" alt="${pizza.title}" class="pizza-img">
                    <h3 class="pizzaTitle">${pizza.title}</h3>
                    <section class="textContent">
                        <p class="pizzaType">${pizza.type}</p>
                        <section class="ingredients">${formattedIngredients}</section>
                        <section class="size">
                            ${smallSize}
                            ${bigSize}
                        </section>
                    </section>
                </div>`;

            pizzaDiv.innerHTML = pizzaAll;
            pizzaContainer.appendChild(pizzaDiv);
        });

        setupBuyButtons();
    }

    function setupBuyButtons() {
        const buyButtons = document.querySelectorAll('.buyButton');
        buyButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const pizzaId = event.target.dataset.id;
                const size = event.target.dataset.size;
                addToCart(pizzaId, size);
            });
        });
    }

    function addToCart(pizzaId, size) {
        const pizza = pizza_info.find(p => p.id == pizzaId);
        const cartItem = cart.find(item => item.id == pizzaId && item.size == size);

        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({
                id: pizza.id,
                title: pizza.title,
                size: size,
                price: size === 'small' ? pizza.small_size.price : pizza.big_size.price,
                weight: size === 'small' ? pizza.small_size.weight : pizza.big_size.weight,
                quantity: 1,
                icon: pizza.icon
            });
        }

        updateCart();
        saveCart();
    }

    function updateCart() {
        orderPizzas.innerHTML = '';

        cart.forEach(pizza => {
            const pizzaElement = document.createElement('section');
            pizzaElement.classList.add('pizzaOrd');
            pizzaElement.innerHTML = `
            <div class="info">  
            <label for="pizaOrd">${pizza.title}</label>
            <div class="sizeAndWeight">
                <div class="sizeCart">
                    <img class="imgSize" src="size-icon.svg"/>
                    <p class="sizeSorB">${pizza.size}</p>
                </div>
                <div class="weightCart">
                    <img class="imgSize" src="weight.svg"/>
                    <p class="sizeNumber">${pizza.weight}</p>
                </div>
            </div>    
            <div class="functionalPanel">
                <div class="sumP"><b>${pizza.price}</b></div>
                <div class="buttonsAmount">
                    <div class="plusAndMinus">
                        <div class="minus">-</div>
                        <div class="amount">${pizza.amount}</div>
                        <div class="plus">+</div>
                    </div>
                    <div class="delete"><b>x</b></div>
                </div>
            </div>
        </div>
        <div class="imgCart">
            <img src="${pizza.icon}" alt="${pizza.title}" class="imgPizzaCart">
        </div>
            `;
            orderPizzas.appendChild(pizzaElement);
        });

        updateTotalSum();
        setupCartButtons();
    }

    function setupCartButtons() {
        orderPizzas.addEventListener('click', (event) => {
            const pizzaId = event.target.dataset.id;
            const size = event.target.dataset.size;

            if (event.target.classList.contains('plus')) {
                updateCartItem(pizzaId, size, 'increment');
            } else if (event.target.classList.contains('minus')) {
                updateCartItem(pizzaId, size, 'decrement');
            } else if (event.target.classList.contains('delete')) {
                removeCartItem(pizzaId, size);
            }
        });
    }

    function updateCartItem(pizzaId, size, action) {
        const cartItem = cart.find(item => item.id == pizzaId && item.size == size);

        if (action === 'increment') {
            cartItem.quantity++;
        } else if (action === 'decrement') {
            cartItem.quantity--;
            if (cartItem.quantity === 0) {
                cart = cart.filter(item => !(item.id == pizzaId && item.size == size));
            }
        }

        updateCart();
        saveCart();
    }

    function removeCartItem(pizzaId, size) {
        cart = cart.filter(item => !(item.id == pizzaId && item.size == size));
        updateCart();
        saveCart();
    }

    function updateTotalSum() {
        let totalSum = 0;
        cart.forEach(pizza => totalSum += pizza.price * pizza.quantity);
        sumUAH.textContent = `${totalSum} грн`;
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function clearCart() {
        cart = [];
        updateCart();
        saveCart();
    }

    cancelOrderButton.addEventListener('click', clearCart);

    fetchPizzas();
    updateCart();
});
