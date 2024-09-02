document.addEventListener('DOMContentLoaded', () => {
    const monthsDiv = document.getElementById('months');
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
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
        const salary = localStorage.getItem('salary');
        const fixedExpenses = JSON.parse(localStorage.getItem('fixedExpenses')) || [];
        const goals = JSON.parse(localStorage.getItem('goals')) || [];

        document.getElementById('salary-info').innerText = `Salário: R$${parseFloat(salary || 0).toFixed(2)}`;
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

        console.log('Months buttons created:', monthsDiv.innerHTML); // Debugging log
    };

    // Open popup
    const openPopup = (monthIndex) => {
        console.log(`Opening popup for month index: ${monthIndex}`); // Debugging log
        const monthElement = document.querySelector(`#months div[data-month="${monthIndex}"]`);
        if (!monthElement) {
            console.error('Month element not found');
            console.log('Available month elements:', document.querySelectorAll('#months .month')); // Log available month elements
            return;
        }

        popupMonth.innerText = monthElement.innerText;
        popupMonth.dataset.month = monthIndex; // Store month index in popupMonth dataset

        const monthlyExpenses = JSON.parse(localStorage.getItem(`month-${monthIndex}`)) || [];
        monthlyExpensesList.innerHTML = monthlyExpenses.map(exp => 
            `<p>${exp.description} - R$${parseFloat(exp.amount).toFixed(2)}</p>`
        ).join('');

        const salary = parseFloat(localStorage.getItem('salary')) || 0;
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
                monthlyExpenses.push({ description, amount: amount.toFixed(2) });
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
            openPopup(parseInt(monthIndex)); // Ensure monthIndex is an integer
        }
    });

    // Initial setup
    loadSettings();
    createMonthButtons();
    updateTotalPositive();
});
document.addEventListener('DOMContentLoaded', () => {
    const monthsDiv = document.getElementById('months');
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    const popupMonth = document.getElementById('popup-month');
    const expenseDescriptionInput = document.getElementById('expense-description');
    const expenseAmountInput = document.getElementById('expense-amount');
    const addExpenseButton = document.getElementById('add-expense');
    const closePopupButton = document.getElementById('close-popup');
    const monthlyExpensesList = document.getElementById('monthly-expenses-list');
    const remainingSalaryAmount = document.getElementById('remaining-salary-amount');
    const totalPositiveAmount = document.getElementById('total-positive-amount');
    const statusMessage = document.getElementById('status-message');
    const saveAmountInput = document.getElementById('save-amount');
    const saveButton = document.getElementById('save-button');
    const savingsInfo = document.getElementById('savings-info');

    // Load settings from local storage
    const loadSettings = () => {
        const salary = localStorage.getItem('salary');
        const fixedExpenses = JSON.parse(localStorage.getItem('fixedExpenses')) || [];
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        const savedAmounts = JSON.parse(localStorage.getItem('savedAmounts')) || [];
        const totalSaved = savedAmounts.reduce((total, amount) => total + parseFloat(amount), 0);

        document.getElementById('salary-info').innerText = `Salário: R$${parseFloat(salary || 0).toFixed(2)}`;
        document.getElementById('fixed-expenses-info').innerText = `Gastos Fixos: R$${fixedExpenses.reduce((total, exp) => total + parseFloat(exp.amount), 0).toFixed(2)}`;
        document.getElementById('goals-info').innerText = `Objetivos: R$${goals.reduce((total, goal) => total + parseFloat(goal.amount), 0).toFixed(2)}`;
        savingsInfo.innerText = `Total Guardado: R$${totalSaved.toFixed(2)}`;
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

        // Ensure popupMonth is defined
        const monthElement = document.querySelector(`#months div[data-month="${monthIndex}"]`);
        if (!monthElement) {
            console.error('Month element not found');
            return;
        }

        popupMonth.innerText = monthElement.innerText;
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
                monthlyExpenses.push({ description, amount: amount.toFixed(2) });
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

    // Save amount
    saveButton.addEventListener('click', () => {
        const saveAmount = parseFloat(saveAmountInput.value);

        if (!isNaN(saveAmount) && saveAmount > 0) {
            let savedAmounts = JSON.parse(localStorage.getItem('savedAmounts')) || [];
            savedAmounts.push(saveAmount.toFixed(2));
            localStorage.setItem('savedAmounts', JSON.stringify(savedAmounts));

            const totalSaved = savedAmounts.reduce((total, amount) => total + parseFloat(amount), 0);
            savingsInfo.innerText = `Total Guardado: R$${totalSaved.toFixed(2)}`;
            saveAmountInput.value = '';

            // Update goal progress
            updateGoalProgress();
        } else {
            statusMessage.innerText = 'Por favor, insira um valor válido para guardar.';
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

    // Update goal progress
    const updateGoalProgress = () => {
        const goals = JSON.parse(localStorage.getItem('goals')) || [];
        let totalGoal = goals.reduce((total, goal) => total + parseFloat(goal.amount), 0);
        let totalSaved = JSON.parse(localStorage.getItem('savedAmounts')) || [];
        totalSaved = totalSaved.reduce((total, amount) => total + parseFloat(amount), 0);

        if (totalGoal > 0) {
            const progress = totalSaved / totalGoal * 100;
            const progressText = `Você está ${progress.toFixed(2)}% do seu objetivo.`;
            savingsInfo.innerText += ` | ${progressText}`;
        }
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
    updateGoalProgress();
});
