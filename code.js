document.addEventListener("DOMContentLoaded", (event) => {
    const pizzaContainer = document.querySelector('#pizzas-wrapper');
    const textContentClass = 'textContent';
    const pizzaHeaderClass = 'pizzaType';
    const pizzaTitle = 'pizzaTitle';
    const buyText = 'Купити';
    const ingredients = 'ingredients';
    let totalSum = 0;
    let pizza_info = [];

    fetch('pizzas.json')
        .then(response => response.json())
        .then(data => {
            pizza_info = data;
            renderPizzas();
        })
        .catch(error => console.error('Error loading pizza data:', error));

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




renderPizzas();

});