document.addEventListener("DOMContentLoaded", (event) => {
    let pizza_info = [
        {
            id: 1,
            icon: 'pizza_7.jpg',
            title: "Імпреза",
            type: 'М’ясна піца',
            content: {
                meat: ['балик', 'салямі'],
                chicken: ['куриця'],
                cheese: ['сир моцарелла', 'сир рокфорд'],
                pineapple: ['ананаси'],
                additional: ['томатна паста', 'петрушка']
            },
            small_size: {
                weight: 370,
                size: 30,
                price: 99
            },
            big_size: {
                weight: 660,
                size: 40,
                price: 169
            },
            is_new: true,
            is_popular: false,
        },
        {
            id: 2,
            icon: 'pizza_2.jpg',
            title: "BBQ",
            type: 'М’ясна піца',
            content: {
                meat: ['мисливські ковбаски', 'ковбаски папероні', 'шинка'],
                cheese: ['сир домашній'],
                mushroom: ['шампінйони'],
                additional: ['петрушка', 'оливки']
            },
            small_size: {
                weight: 460,
                size: 30,
                price: 139
            },
            big_size: {
                weight: 840,
                size: 40,
                price: 199
            },
            is_popular: true
        },
        {
            id: 3,
            icon: 'pizza_1.jpg',
            title: "Міксовий поло",
            type: 'М’ясна піца',
            content: {
                meat: ['вітчина', 'куриця копчена'],
                cheese: ['сир моцарелла'],
                pineapple: ['ананаси'],
                additional: ['кукурудза', 'петрушка', 'соус томатний']
            },
            small_size: {
                weight: 430,
                size: 30,
                price: 115
            },
            big_size: {
                weight: 780,
                size: 40,
                price: 179
            },
            is_popular: true
        },
        {
            id: 17,
            icon: 'pizza_3.jpg',
            title: "Маргарита",
            type: 'Вега піца',
            content: {
                cheese: ['сир моцарелла', 'сир домашній'],
                tomato: ['помідори'],
                additional: ['базилік', 'оливкова олія', 'соус томатний']
            },
            small_size: {
                weight: 370,
                size: 30,
                price: 89
            }
        },
        {
            id: 43,
            icon: 'pizza_6.jpg',
            title: "Мікс смаків",
            type: 'М’ясна піца',
            content: {
                meat: ['ковбаски'],
                cheese: ['сир моцарелла'],
                mushroom: ['шампінйони'],
                pineapple: ['ананаси'],
                additional: ['цибуля кримська', 'огірки квашені', 'соус гірчичний']
            },
            small_size: {
                weight: 470,
                size: 30,
                price: 115
            },
            big_size: {
                weight: 780,
                size: 40,
                price: 180
            }
        },
        {
            id: 90,
            icon: 'pizza_8.jpg',
            title: "Дольче Маре",
            type: 'Морська піца',
            content: {
                ocean: ['криветки тигрові', 'мідії', 'ікра червона', 'філе червоної риби'],
                cheese: ['сир моцарелла'],
                additional: ['оливкова олія', 'вершки']
            },
            big_size: {
                weight: 845,
                size: 40,
                price: 399
            }
        },
        {
            id: 6,
            icon: 'pizza_4.jpg',
            title: "Россо Густо",
            type: 'Морська піца',
            content: {
                ocean: ['ікра червона', 'лосось копчений'],
                cheese: ['сир моцарелла'],
                additional: ['оливкова олія', 'вершки']
            },
            small_size: {
                weight: 400,
                size: 30,
                price: 189
            },
            big_size: {
                weight: 700,
                size: 40,
                price: 299
            }
        },
        {
            id: 4,
            icon: 'pizza_5.jpg',
            title: "Сициліано",
            type: 'М’ясна піца',
            content: {
                meat: ['вітчина', 'салямі'],
                cheese: ['сир моцарелла'],
                mushroom: ['шампіньйони'],
                additional: ['перець болгарський', 'соус томатний']
            },
            small_size: {
                weight: 450,
                size: 30,
                price: 111
            },
            big_size: {
                weight: 790,
                size: 40,
                price: 169
            }
        },
    ];

    const pizzaContainer = document.querySelector('#pizzas-wrapper');
    const orderPizzasContainer = document.querySelector('.orderPizzas');
    const textContentClass = 'textContent';
    const pizzaHeaderClass = 'pizzaType';
    const pizzaTitle = 'pizzaTitle';
    const buyText = 'Купити';
    const ingredients = 'ingredients';
    let totalSum = 0;

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
            default: filteredPizzas = filter === 'Усі' ? pizza_info : pizza_info.filter(pizza => pizza.type === filter);
            break;
    }

    filteredPizzas.forEach(pizza => {
        const pizzaDiv = document.createElement('div');
        pizzaDiv.className = 'pizza';

        const badgeNew = pizza.is_new ? `<p class="badge badge-new">Нова</p>` : '';
        const popularBadge = pizza.is_popular ? `<p class="badge badge-popular ${pizza.id >= 3 ? 'special' : ''}">Популярна</p>` : '';

        const smallSize = pizza.small_size ? `
            <div id="smallSize">  
                <p><img src="size-icon.svg" class="picSize"/>${pizza.small_size.size}</p>
                <p><img src="weight.svg" class="picWeight"/>${pizza.small_size.weight}</p>
                <p id="price">${pizza.small_size.price} <span id=priceUA>грн.</span></p>
                <button class="buyButton"> ${buyText} </button>
            </div>` : '';

        const bigSize = pizza.big_size ? `
            <div id="bigSize">
                <p><img src="size-icon.svg" class="picSize"/>${pizza.big_size.size}</p>
                <p><img src="weight.svg" class="picWeight"/>${pizza.big_size.weight}</p>
                <p id="price">${pizza.big_size.price} <span id=priceUA>грн.</span></p>
                <button class="buyButton "> ${buyText}</button>
            </div>` : '';

        function capitalizeFirstWord(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        const combinedIngredients = [
            ...pizza.content.meat || [],
            ...pizza.content.chicken || [],
            ...pizza.content.cheese || [],
            ...pizza.content.pineapple || [],
            ...pizza.content.additional || []
        ].join(', ');

        const formattedIngredients = capitalizeFirstWord(combinedIngredients);

        const pizzaAll = `
            ${badgeNew}
            ${popularBadge}
            <div class="pizzaAll">
                <img src="${pizza.icon}" alt="${pizza.title}" class="pizza-img">
                <h3 class="${pizzaTitle}">${pizza.title}</h3>
                <section class="${textContentClass}">
                    <p class="${pizzaHeaderClass}">${pizza.type}</p>
                    <section class="${ingredients}">
                        ${formattedIngredients}
                    </section>
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
    document.querySelectorAll('.buyButton').forEach(button => {
        button.addEventListener('click', (event) => {
            const pizzaCard = event.target.closest('.pizza');
            const pizzaTitle = pizzaCard.querySelector('h3').innerText;
            const size = event.target.closest('div').id === 'smallSize' ? 30 : 40;
            const weight = event.target.closest('div').querySelector('.picWeight').nextElementSibling.innerText;
            const price = parseInt(event.target.closest('div').querySelector('#price').innerText, 10);

            const orderDiv = document.createElement('div');
            orderDiv.className = 'pizzaCart';
            orderDiv.innerHTML = `
                <div>${pizzaTitle} (${size} см)</div>
                <div>${price} грн</div>
                <button class="removeButton">X</button>`;

            orderPizzasContainer.appendChild(orderDiv);
            updateTotal(price);

            orderDiv.querySelector('.removeButton').addEventListener('click', () => {
                updateTotal(-price);
                orderDiv.remove();
            });

            saveOrderToLocalStorage();
        });
    });
}

function updateTotal(amount) {
    totalSum += amount;
    document.getElementById('orderPrice').innerText = `${totalSum} грн`;
}

function saveOrderToLocalStorage() {
    const orders = [];
    document.querySelectorAll('.pizzaCart').forEach(pizzaCart => {
        const pizzaTitle = pizzaCart.children[0].innerText;
        const pizzaPrice = parseInt(pizzaCart.children[1].innerText, 10);
        orders.push({ title: pizzaTitle, price: pizzaPrice });
    });
    localStorage.setItem('order', JSON.stringify(orders));
}

function loadOrderFromLocalStorage() {
    const orders = JSON.parse(localStorage.getItem('order')) || [];
    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'pizzaCart';
        orderDiv.innerHTML = `
            <div>${order.title}</div>
            <div>${order.price} грн</div>
            <button class="removeButton">X</button>`;
        
        orderPizzasContainer.appendChild(orderDiv);
        updateTotal(order.price);

        orderDiv.querySelector('.removeButton').addEventListener('click', () => {
            updateTotal(-order.price);
            orderDiv.remove();
            saveOrderToLocalStorage();
        });
    });
}

loadOrderFromLocalStorage();

document.querySelectorAll('#filter .select-decelect').forEach(button => {
    button.addEventListener('click', (event) => {
        document.querySelectorAll('#filter .select-decelect').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        renderPizzas(event.target.dataset.filter);

        // Highlight active filter button
        document.querySelectorAll('.select-decelect').forEach(btn => {
            if (btn === event.target) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    });
});


document.querySelector('.cancel-order').addEventListener('click', () => {
    orderPizzasContainer.innerHTML = '';
    totalSum = 0;
    document.getElementById('orderPrice').innerText = '0 грн';
    localStorage.removeItem('order');
});

renderPizzas();

});