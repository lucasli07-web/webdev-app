// Mock Data
const dashboardData = {
    todayRevenue: 4820,
    ingredientCosts: 1940,
    netProfit: 2880,
    lowStockItems: [
        { name: 'Tomatoes', amount: 'Low Stock', status: 'critical' },
        { name: 'Chicken Breast', amount: 'Critical', status: 'critical' },
        { name: 'Mozzarella', amount: 'Medium', status: 'warning' },
    ],
    topDishes: [
        { dish: 'Truffle Pasta', profit: 420 },
        { dish: 'Margherita Pizza', profit: 355 },
        { dish: 'Caesar Salad', profit: 210 },
    ],
    ingredients: [
        { name: 'Tomatoes', supplier: 'FreshFarm Foods', cost: '$38 / box', status: 'Price Increased', statusClass: 'text-red-500' },
        { name: 'Chicken Breast', supplier: 'West Coast Meats', cost: '$112 / case', status: 'Low Stock', statusClass: 'text-yellow-500' },
        { name: 'Mozzarella', supplier: 'Golden Dairy', cost: '$64 / pack', status: 'Stable', statusClass: 'text-green-600' },
    ]
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    attachEventListeners();
});

// Load Dashboard Data
function loadDashboard() {
    updateMetrics();
    updateLowStockAlerts();
    updateTopDishes();
    updateCostTracker();
}

// Update Metrics
function updateMetrics() {
    document.getElementById('todayRevenue').textContent = formatCurrency(dashboardData.todayRevenue);
    document.getElementById('ingredientCosts').textContent = formatCurrency(dashboardData.ingredientCosts);
    document.getElementById('netProfit').textContent = formatCurrency(dashboardData.netProfit);
}

// Update Low Stock Alerts
function updateLowStockAlerts() {
    const container = document.getElementById('lowStockContainer');
    container.innerHTML = '';

    dashboardData.lowStockItems.forEach(item => {
        const statusColor = item.status === 'critical' ? 'text-red-500' : 'text-yellow-500';
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex items-center justify-between bg-gray-50 p-4 rounded-2xl';
        itemDiv.innerHTML = `
            <span class="font-medium">${item.name}</span>
            <span class="text-sm ${statusColor}">${item.amount}</span>
        `;
        container.appendChild(itemDiv);
    });
}

// Update Top Dishes
function updateTopDishes() {
    const container = document.getElementById('topDishesContainer');
    container.innerHTML = '';

    dashboardData.topDishes.forEach(dish => {
        const dishDiv = document.createElement('div');
        dishDiv.className = 'flex items-center justify-between bg-gray-50 p-4 rounded-2xl';
        dishDiv.innerHTML = `
            <span class="font-medium">${dish.dish}</span>
            <span class="font-semibold">${formatCurrency(dish.profit)}</span>
        `;
        container.appendChild(dishDiv);
    });
}

// Update Cost Tracker
function updateCostTracker() {
    const table = document.getElementById('costTrackerTable');
    table.innerHTML = '';

    dashboardData.ingredients.forEach((ingredient, index) => {
        const row = document.createElement('tr');
        if (index < dashboardData.ingredients.length - 1) {
            row.className = 'border-b';
        }
        row.innerHTML = `
            <td class="py-4">${ingredient.name}</td>
            <td>${ingredient.supplier}</td>
            <td>${ingredient.cost}</td>
            <td class="${ingredient.statusClass}">${ingredient.status}</td>
        `;
        table.appendChild(row);
    });
}

// Event Listeners
function attachEventListeners() {
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    }
}

// Generate Report
function generateReport() {
    console.log('Generating Report...');
    alert('Report generated! Check console for details.');
    console.log('Dashboard Report:', dashboardData);
}

// Utility: Format Currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Utility: Add item to low stock
function addLowStockItem(name, amount, status) {
    dashboardData.lowStockItems.push({ name, amount, status });
    updateLowStockAlerts();
}

// Utility: Add dish
function addTopDish(dish, profit) {
    dashboardData.topDishes.push({ dish, profit });
    updateTopDishes();
}

// Utility: Update metric
function updateMetric(metricName, value) {
    if (dashboardData.hasOwnProperty(metricName)) {
        dashboardData[metricName] = value;
        updateMetrics();
    }
}
