document.addEventListener("DOMContentLoaded", (event) => {
    const pizzaContainer = document.querySelector('#pizzas-wrapper'); // Контейнер для виведення піц
    const orderedPizzasContainer = document.querySelector('#orderedPizzasContainer'); // Контейнер для замовлених піц
    const textContentClass = 'textContent';
    const pizzaHeaderClass = 'pizzaType';
    const pizzaTitle = 'pizzaTitle';
    const buyText = 'Купити';
    const ingredients = 'ingredients';
    let totalSum = 0;

    let pizza_info = []; // Масив для збереження інформації про піци

    // Завантаження даних про піци з файлу pizzas.json
    fetch('pizzas.json')
        .then(response => response.json())
        .then(data => {
            pizza_info = data;
            renderPizzas();
        })
        .catch(error => console.error('Error loading pizza data:', error));

    // Функція для рендерингу піц з фільтром
    function renderPizzas(filter = 'Усі') {
        pizzaContainer.innerHTML = '';
        let filteredPizzas = [];

        // Фільтрація піц за категоріями
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
        document.querySelector('.all-pizza .quantity').textContent = filteredPizzas.length;
        // Створення елементів для відображення піц
        filteredPizzas.forEach(pizza => {
            const pizzaDiv = document.createElement('div');
            pizzaDiv.className = 'pizza';

            // значки "Нова" та "Популярна"
            const badgeNew = pizza.is_new ? `<p class="badge badge-new">Нова</p>` : '';
            const popularBadge = pizza.is_popular ? `<p class="badge badge-popular ${pizza.id >= 3 ? 'special' : ''}">Популярна</p>` : '';

            // маленькі піци
            const smallSize = pizza.small_size ? `
                <div id="smallSize">  
                    <p><img src="size-icon.svg" class="picSize"/>${pizza.small_size.size}</p>
                    <p><img src="weight.svg" class="picWeight"/>${pizza.small_size.weight}</p>
                    <p id="price">${pizza.small_size.price} <span id=priceUA>грн.</span></p>
                    <button class="buyButton"> ${buyText} </button>
                </div>` : '';

            //  великі піци
            const bigSize = pizza.big_size ? `
                <div id="bigSize">
                    <p><img src="size-icon.svg" class="picSize"/>${pizza.big_size.size}</p>
                    <p><img src="weight.svg" class="picWeight"/>${pizza.big_size.weight}</p>
                    <p id="price">${pizza.big_size.price} <span id=priceUA>грн.</span></p>
                    <button class="buyButton"> ${buyText}</button>
                </div>` : '';

            // Функція для додавання розміру
            function capitalizeFirstWord(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }

            // Об'єднання всіх інгредієнтів в один рядок
            const combinedIngredients = [
                ...pizza.content.meat || [],
                ...pizza.content.chicken || [],
                ...pizza.content.cheese || [],
                ...pizza.content.pineapple || [],
                ...pizza.content.additional || []
            ].join(', ');

            const formattedIngredients = capitalizeFirstWord(combinedIngredients);

            // Формування HTML структури піци
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
        setupBuyButtons(); // Налаштування кнопок "Купити"
    }

    // Налаштування фільтрів
    document.querySelectorAll('#filter .select-decelect').forEach(button => {
        button.addEventListener('click', (event) => {
            document.querySelectorAll('#filter .select-decelect').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            renderPizzas(event.target.dataset.filter);
        });
    });

    // Функція для налаштування кнопок "Купити"
    function setupBuyButtons() {
        document.querySelectorAll('.buyButton').forEach(button => {
            button.addEventListener('click', (event) => {
                const pizzaCard = event.target.closest('.pizza');
                const pizzaTitle = pizzaCard.querySelector('.pizzaTitle').innerText;
                const size = event.target.closest('div').id === 'smallSize' ? 30 : 40;
                const weight = event.target.previousElementSibling.previousElementSibling.innerText;
                const price = parseInt(event.target.previousElementSibling.innerText, 10);
                const icon = pizzaCard.querySelector('img').src;
                const orderedPizzas = JSON.parse(localStorage.getItem('orderedPizzas')) || [];
            
                const sizeText = size === 30 ? ' (мала)' : ' (велика)';
            
                let existingPizza = orderedPizzas.find(pizza => pizza.title === pizzaTitle + sizeText && pizza.size === size);
                if (existingPizza) {
                    existingPizza.amount++;
                } else {
                    existingPizza = {
                        title: pizzaTitle + sizeText,
                        weight,
                        size,
                        price,
                        icon,
                        amount: 1
                    };
                    orderedPizzas.push(existingPizza);
                }
            
                updateLocalStorage(orderedPizzas); // оновлення даних
                renderOrderedPizzas(); //  обрані
                updateTotalSum(); // загальна сума
                updatePizzaCount(); // rskmrscnm
            });
            
        });
    }

    // Ініціалізація сховища
    function setUpLocalStorage() {
        if (!localStorage.getItem('orderedPizzas')) {
            localStorage.setItem('orderedPizzas', JSON.stringify([]));
        }
    }

    function updatePizzaCount() {
        const orderedPizzas = JSON.parse(localStorage.getItem('orderedPizzas')) || [];
        const pizzaCount = orderedPizzas.reduce((count, pizza) => count + pizza.amount, 0);
        document.querySelector('#circle').textContent = pizzaCount;
    }
// Функція для відображення замовлених піц
function renderOrderedPizzas() {
    const orderedPizzas = JSON.parse(localStorage.getItem('orderedPizzas')) || [];
    orderedPizzasContainer.innerHTML = '';

    orderedPizzas.forEach(pizza => {
        const orderedPizza = document.createElement('div');
        orderedPizza.className = 'pizzaCart';
        orderedPizza.innerHTML = `
            <div class="info">  
                <label for="pizaCart">${pizza.title}</label>
                <div class="sizeAndWeight">
                    <div class="sizeCart">
                        <img class="imgSize" src="size-icon.svg"/>
                        <p class="sizeNumber">${pizza.size}</p>
                    </div>
                    <div class="weightCart">
                        <img class="imgSize" src="weight.svg"/>
                        <p class="sizeNumber">${pizza.weight}</p>
                    </div>
                </div>    
                <div class="functionalPanel">
                    <div class="sum">
                        <b class="totalPizzaSum">${pizza.price * pizza.amount} грн</b> 
                    </div>
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

        orderedPizzasContainer.appendChild(orderedPizza);

        // Налаштування кнопок для збільшення, зменшення та видалення піц
        const plusButton = orderedPizza.querySelector('.plus');
        const minusButton = orderedPizza.querySelector('.minus');
        const amountDisplay = orderedPizza.querySelector('.amount');
        const totalPizzaSumDisplay = orderedPizza.querySelector('.totalPizzaSum'); // Виправлено

        plusButton.addEventListener('click', () => {
            pizza.amount++;
            amountDisplay.textContent = pizza.amount;
            totalPizzaSumDisplay.textContent = `${pizza.price * pizza.amount} грн`; // Оновлення загальної суми
            updateLocalStorage(orderedPizzas);
            updateTotalSum();
            updatePizzaCount(); 
        });

        minusButton.addEventListener('click', () => {
            if (pizza.amount > 1) {
                pizza.amount--;
                amountDisplay.textContent = pizza.amount;
                totalPizzaSumDisplay.textContent = `${pizza.price * pizza.amount} грн`; // Оновлення загальної суми
                updateLocalStorage(orderedPizzas);
                updateTotalSum();
                updatePizzaCount(); 
            } else if (pizza.amount === 1) {
                orderedPizzas.splice(orderedPizzas.indexOf(pizza), 1);
                updateLocalStorage(orderedPizzas);
                renderOrderedPizzas();
                updateTotalSum();
                updatePizzaCount();
            }
        });

        orderedPizza.querySelector('.delete').addEventListener('click', () => {
            // Видалення піци з orderedPizzas
            orderedPizzas.splice(orderedPizzas.indexOf(pizza), 1);
            updateLocalStorage(orderedPizzas); // Оновлення даних
            renderOrderedPizzas(); // відображення замовлених піц
            updateTotalSum(); // загальна суми
            updatePizzaCount(); 
        });
    });

    updateTotalSum(); // загальна суми
}


    // Оновлення даних 
    function updateLocalStorage(orderedPizzas) {
        localStorage.setItem('orderedPizzas', JSON.stringify(orderedPizzas));
    }

    // Оновлення загальної суми
    function updateTotalSum() {
        const orderedPizzas = JSON.parse(localStorage.getItem('orderedPizzas')) || [];
        totalSum = orderedPizzas.reduce((sum, pizza) => sum + pizza.price * pizza.amount, 0);
        document.querySelector('#sumOfAll').textContent = `${totalSum} грн`;
    }

    setUpLocalStorage(); // Ініціалізація LocalStorage
    renderOrderedPizzas(); // Відображення замовлених піц
    updatePizzaCount();

    // Очищення замовлень
    document.querySelector('#clearLabel').addEventListener('click', () => {
        localStorage.setItem('orderedPizzas', JSON.stringify([]));
        renderOrderedPizzas();
        updatePizzaCount(); 
    });

    // Оновлення даних для табл WebDataRocks
    function updateWebDataRocks() {
        const orderedPizzas = JSON.parse(localStorage.getItem('orderedPizzas')) || [];
        const pivotData = orderedPizzas.map(pizza => ({
            title: pizza.title,
            amount: pizza.amount
        }));

        pivot.updateData({
            data: pivotData
        });
    }

    pivot.on("reportcomplete", updateWebDataRocks); 
    updateWebDataRocks(); //  оновлення даних

});
