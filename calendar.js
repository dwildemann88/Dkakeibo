document.addEventListener('DOMContentLoaded', () => {
    const monthsDiv = document.getElementById('months');
    const popup = document.getElementById('popup');
    const popupMonth = document.getElementById('popup-month');
    const expenseDescriptionInput = document.getElementById('expense-description');
    const expenseAmountInput = document.getElementById('expense-amount');
    const addExpenseButton = document.getElementById('add-expense');
    const closePopupButton = document.getElementById('close-popup');
    const monthlyExpensesList = document.getElementById('monthly-expenses-list');
    const remainingSalaryAmount = document.getElementById('remaining-salary-amount');
    const totalPositiveAmount = document.getElementById('total-positive-amount');
    const statusMessage = document.getElementById('status-message');

    // Load settings from local storage
    const loadSettings = () => {
        const salary = parseFloat(localStorage.getItem('salary')) || 0;
        const fixedExpenses = JSON.parse(localStorage.getItem('fixedExpenses')) || [];
        const goals = JSON.parse(localStorage.getItem('goals')) || [];

        document.getElementById('salary-info').innerText = `Salário: R$${salary.toFixed(2)}`;
        document.getElementById('fixed-expenses-info').innerText = `Gastos Fixos: R$${fixedExpenses.reduce((total, exp) => total + parseFloat(exp.amount), 0).toFixed(2)}`;
        document.getElementById('goals-info').innerText = `Objetivos: R$${goals.reduce((total, goal) => total + parseFloat(goal.amount), 0).toFixed(2)}`;
    };

    // Create month buttons
    const createMonthButtons = () => {
        const months = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        monthsDiv.innerHTML = months.map((month, index) => 
            `<div data-month="${index}" class="month">${month}</div>`
        ).join('');
    };

    // Open popup
    const openPopup = (monthIndex) => {
        const monthlyExpenses = JSON.parse(localStorage.getItem(`month-${monthIndex}`)) || [];
        const salary = parseFloat(localStorage.getItem('salary')) || 0;

        popupMonth.innerText = document.querySelector(`#months div[data-month="${monthIndex}"]`).innerText;
        monthlyExpensesList.innerHTML = monthlyExpenses.map(exp => 
            `<p>${exp.description} - R$${parseFloat(exp.amount).toFixed(2)}</p>`
        ).join('');

        const totalExpenses = monthlyExpenses.reduce((total, exp) => total + parseFloat(exp.amount), 0);
        remainingSalaryAmount.innerText = (salary - totalExpenses).toFixed(2);

        popup.classList.remove('hidden');
    };

    // Close popup
    closePopupButton.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    // Add expense
    addExpenseButton.addEventListener('click', () => {
        const monthIndex = parseInt(popupMonth.dataset.month);
        const description = expenseDescriptionInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value);

        if (description && !isNaN(amount) && amount > 0) {
            let monthlyExpenses = JSON.parse(localStorage.getItem(`month-${monthIndex}`)) || [];
            const salary = parseFloat(localStorage.getItem('salary')) || 0;
            const totalExpenses = monthlyExpenses.reduce((total, exp) => total + parseFloat(exp.amount), 0);

            if (totalExpenses + amount <= salary) {
                monthlyExpenses.push({ description, amount });
                localStorage.setItem(`month-${monthIndex}`, JSON.stringify(monthlyExpenses));
                openPopup(monthIndex); // Refresh the popup to show the updated expenses
                updateTotalPositive();
                statusMessage.innerText = 'Despesa adicionada com sucesso!';
                statusMessage.style.color = 'green';
                expenseDescriptionInput.value = '';
                expenseAmountInput.value = '';
            } else {
                statusMessage.innerText = 'Despesas não podem exceder o salário do mês.';
                statusMessage.style.color = 'red';
            }
        } else {
            statusMessage.innerText = 'Por favor, insira uma descrição válida e um valor positivo.';
            statusMessage.style.color = 'red';
        }
    });

    // Update total positive amount
    const updateTotalPositive = () => {
        const months = document.querySelectorAll('#months .month');
        let totalPositive = 0;

        months.forEach(month => {
            const monthIndex = parseInt(month.dataset.month);
            const monthlyExpenses = JSON.parse(localStorage.getItem(`month-${monthIndex}`)) || [];
            const salary = parseFloat(localStorage.getItem('salary')) || 0;
            const totalExpenses = monthlyExpenses.reduce((total, exp) => total + parseFloat(exp.amount), 0);
            const remaining = salary - totalExpenses;

            if (remaining > 0) {
                month.style.backgroundColor = '#c8e6c9'; // Green for positive balance
                totalPositive += remaining;
            } else {
                month.style.backgroundColor = '#ffcccb'; // Red for negative balance
            }
        });

        totalPositiveAmount.innerText = totalPositive.toFixed(2);
    };

    // Event listeners for month buttons
    monthsDiv.addEventListener('click', (event) => {
        const monthIndex = event.target.dataset.month;
        if (monthIndex !== undefined) {
            openPopup(monthIndex);
        }
    });

    // Initial setup
    loadSettings();
    createMonthButtons();
    updateTotalPositive();
});
