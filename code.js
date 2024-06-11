document.addEventListener('DOMContentLoaded', () => {
    const pizzasWrapper = document.querySelector('.pizzas-wrapper');
    pizzasWrapper.innerHTML = pizzaData.map(pizza => createPizzaHtml(pizza)).join('');
    updateOrderSummary();
});

function createPizzaHtml(pizza) {
    const description = Object.values(pizza.content).flat().join(', ');
    return `
        <section class="pizza-container">
            ${pizza.is_new ? '<div class="new-badge">Нова</div>' : ''}
            ${pizza.is_popular ? '<div class="popular-badge">Популярна</div>' : ''}
            <img src="${pizza.icon}" alt="${pizza.title}" class="pizza-image">
            <div class="pizza-name">${pizza.title}</div>
            <div class="pizza-type">${pizza.type}</div>
            <div class="pizza-description">${description}</div>
            <section class="pizza-details">
                ${pizza.small_size ? createPizzaSizeHtml(pizza.small_size, pizza.id, 'Мала') : ''}
                ${pizza.big_size ? createPizzaSizeHtml(pizza.big_size, pizza.id, 'Велика') : ''}
            </section>
        </section>
    `;
}

function createPizzaSizeHtml(size, pizzaId, label) {
    return `
        <div class="detail-column">
            <div class="detail-grid">
                <div class="detail-row detail-row-grid">
                    <div class="detail-label">${label} Ø</div>
                    <div class="detail-value-small">${size.size}</div>
                </div>
                <div class="detail-row detail-row-grid">
                    <div class="detail-value-small">
                        <img src="weight.svg" alt="weight Icon" class="weight-icon">
                        ${size.weight}
                    </div>
                </div>
                <div class="detail-row detail-row-grid">
                    <div class="detail-price">
                        <strong>${size.price}</strong> грн.
                    </div>
                </div>
                <div class="detail-row detail-row-grid">
                    <button class="select-button" onclick="buyPizza(${pizzaId}, '${label}')">Купити</button>
                </div>
            </div>
        </div>
    `;
}

function buyPizza(pizzaId, sizeLabel) {
    console.log(`Buying pizza with ID: ${pizzaId}, size: ${sizeLabel}`);
    // Update the order summary here
    updateOrderSummary();
}

function updateOrderSummary() {
    // Dummy order items for demonstration
    const orderItems = [
        { name: 'BBQ', size: 'Мала', price: 139 },
        { name: 'Россо Густо', size: 'Мала', price: 188 },
        { name: 'Міксовий поло', size: 'Велика', price: 179 }
    ];

    const orderItemsContainer = document.querySelector('.order-items');
    orderItemsContainer.innerHTML = orderItems.map(item => createOrderItemHtml(item)).join('');

    const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);
    document.querySelector('.total-price').textContent = totalPrice;
}

function createOrderItemHtml(item) {
    return `
        <div class="order-item">
            <div class="order-item-name">${item.name} (${item.size})</div>
            <div class="order-item-price">${item.price} грн</div>
        </div>
    `;
}
