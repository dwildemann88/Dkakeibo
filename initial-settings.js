document.addEventListener('DOMContentLoaded', () => {
    const settingsForm = document.getElementById('settings-form');
    const salaryInput = document.getElementById('salary');
    const fixedExpenseInput = document.getElementById('fixed-expense');
    const fixedExpenseAmountInput = document.getElementById('fixed-expense-amount');
    const goalInput = document.getElementById('goal');
    const goalAmountInput = document.getElementById('goal-amount');
    const fixedExpenseList = document.getElementById('fixed-expense-list');
    const goalList = document.getElementById('goal-list');
    const addFixedExpenseButton = document.getElementById('add-fixed-expense');
    const addGoalButton = document.getElementById('add-goal');

    // Load existing settings from local storage
    const loadSettings = () => {
        const salary = localStorage.getItem('salary');
        const fixedExpenses = JSON.parse(localStorage.getItem('fixedExpenses')) || [];
        const goals = JSON.parse(localStorage.getItem('goals')) || [];

        if (salary) salaryInput.value = salary;
        fixedExpenseList.innerHTML = fixedExpenses.map(expense => 
            `<li>${expense.description} - R$${parseFloat(expense.amount).toFixed(2)}</li>`
        ).join('');
        goalList.innerHTML = goals.map(goal => 
            `<li>${goal.description} - R$${parseFloat(goal.amount).toFixed(2)}</li>`
        ).join('');
    };

    // Add a fixed expense
    addFixedExpenseButton.addEventListener('click', () => {
        const description = fixedExpenseInput.value.trim();
        const amount = parseFloat(fixedExpenseAmountInput.value);

        if (description && !isNaN(amount) && amount > 0) {
            let fixedExpenses = JSON.parse(localStorage.getItem('fixedExpenses')) || [];
            fixedExpenses.push({ description, amount: amount.toFixed(2) });
            localStorage.setItem('fixedExpenses', JSON.stringify(fixedExpenses));

            fixedExpenseList.innerHTML += `<li>${description} - R$${amount.toFixed(2)}</li>`;
            fixedExpenseInput.value = '';
            fixedExpenseAmountInput.value = '';
        } else {
            alert('Por favor, insira uma descrição válida e um valor positivo para o gasto fixo.');
        }
    });

    // Add a goal
    addGoalButton.addEventListener('click', () => {
        const description = goalInput.value.trim();
        const amount = parseFloat(goalAmountInput.value);

        if (description && !isNaN(amount) && amount > 0) {
            let goals = JSON.parse(localStorage.getItem('goals')) || [];
            goals.push({ description, amount: amount.toFixed(2) });
            localStorage.setItem('goals', JSON.stringify(goals));

            goalList.innerHTML += `<li>${description} - R$${amount.toFixed(2)}</li>`;
            goalInput.value = '';
            goalAmountInput.value = '';
        } else {
            alert('Por favor, insira uma descrição válida e um valor positivo para o objetivo.');
        }
    });

    // Save settings and redirect to calendar
    settingsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const salary = parseFloat(salaryInput.value);

        if (!isNaN(salary) && salary > 0) {
            localStorage.setItem('salary', salary.toFixed(2));
            window.location.href = 'calendar.html';
        } else {
            alert('Por favor, insira um salário válido.');
        }
    });

    // Initial load
    loadSettings();
});
