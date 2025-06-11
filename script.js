// script.js (обновленная версия)

// Основные переменные
let currentType = 'Расход';
let records = []; // Этот массив теперь будет кэшем данных с сервера
let tempInputValues = { 'Расход': {}, 'Приход': {} };
const LOCAL_STORAGE_KEY = 'buhgalteriaTempData';
const API_URL = '/api/records'; // Адрес нашего бэкенда

let categories = {
    'Расход': [
    {name: 'Продукты', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"/><circle cx="9" cy="19" r="1"/><circle cx="20" cy="19" r="1"/></svg>'},
    {name: 'Кварплата', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/><path d="M7 9h2m4 0h2"/></svg>'},
    {name: 'Телефон', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M8 5h8"/></svg>'},
    {name: 'Топливо', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M3 6h18l-2 7H5l-2-7z"/><path d="M19 13v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6"/><circle cx="12" cy="10" r="2"/><path d="M12 2v4"/></svg>'},
    {name: 'Рем. машины', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>'},
    {name: 'Проезд', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><rect x="3" y="11" width="18" height="8" rx="2" ry="2"/><path d="M7 11V7a4 4 0 0 1 8 0v4"/><circle cx="8" cy="16" r="1"/><circle cx="16" cy="16" r="1"/><path d="M8 11h8"/></svg>'},
    {name: 'Кафе', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M5 7h14l-1 7.5a2 2 0 0 1-2 1.5H8a2 2 0 0 1-2-1.5L5 7z"/><path d="M5 7V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2"/><circle cx="12" cy="11" r="2"/></svg>'},
    {name: 'Кофе', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>'},
    {name: 'Алиса', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M8 7s1-2 4-2 4 2 4 2"/></svg>'},
    {name: 'Красота', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"/><path d="M19 13v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6c0-1.5 1.5-3 3-3h8c1.5 0 3 1.5 3 3z"/><circle cx="9" cy="16" r="1"/><circle cx="15" cy="16" r="1"/></svg>'},
    {name: 'Развлечения', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><polygon points="12,2 15.09,8.26 22,9 17,14 18.18,22 12,18.77 5.82,22 7,14 2,9 8.91,8.26"/></svg>'},
    {name: 'Дет. сад', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/><circle cx="12" cy="8" r="1"/><path d="M9 6h6"/></svg>'},
    {name: 'Здоровье', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'},
    {name: 'Компьютер', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>'},
    {name: 'Одежда', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M16 4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2"/><path d="M8 4v18h8V4"/><path d="M6 8h12"/><path d="M6 12h12"/><path d="M6 16h12"/></svg>'},
    {name: 'Для дома', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/><circle cx="12" cy="8" r="1"/></svg>'},
    {name: 'Обучение', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 0 9 1 9-5"/></svg>'},
    {name: 'Спорт', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M8 15l8-8"/><path d="M16 15l-8-8"/></svg>'},
    {name: 'Хобби', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'},
    {name: 'Поездки', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><path d="M14.5 10a4.5 4.5 0 0 0-4.5-4.5c-1.5 0-3.5 1-3.5 2.5s2 1.5 3.5 1.5 5.5-1 5.5-2.5c0-1.5-2-2.5-3.5-2.5a4.5 4.5 0 0 0-4.5 4.5"/><path d="M14 14h.01"/><path d="M10 14h.01"/><path d="M12 14h.01"/><path d="M12 11v10"/><path d="M12 21l3-3m-6 0l3 3"/></svg>'}
    ],
    'Приход': [
    {name: 'Зарплата', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><circle cx="12" cy="14" r="2"/><path d="M6 14h2m8 0h2"/></svg>'},
    {name: 'Премия', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><polygon points="12,2 15.09,8.26 22,9 17,14 18.18,22 12,18.77 5.82,22 7,14 2,9 8.91,8.26"/></svg>'},
    {name: 'Подарок', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><polyline points="20,12 20,22 4,22 4,12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>'},
    {name: 'Инвестиции', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>'},
    {name: 'Фриланс', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="24px" height="24px"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 8h10"/><path d="M7 12h6"/></svg>'}
    ]
};

// <<< ИЗМЕНЕНИЕ: Функция для загрузки всех данных с сервера
async function fetchRecords() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Сетевой ответ был не в порядке.');
        }
        const result = await response.json();
        records = result.data; // Сохраняем данные с сервера в наш кэш
        updateTotals(); // Обновляем итоги на странице
    } catch (error) {
        console.error('Не удалось получить записи:', error);
        alert('Не удалось загрузить данные с сервера. Убедитесь, что он запущен.');
    }
}

// Инициализация страницы
async function loadPage() {
    // Загружаем временные, еще не сохраненные данные из localStorage
    const savedTempData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTempData) {
        try {
            tempInputValues = JSON.parse(savedTempData);
        } catch (e) {
            console.error("Ошибка чтения данных из localStorage:", e);
            tempInputValues = { 'Расход': {}, 'Приход': {} };
        }
    }

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('inputData').value = today;
    const initialUser = document.getElementById('currentUser').value;
    changeUserImg({ target: { value: initialUser } });
    
    // <<< ИЗМЕНЕНИЕ: Загружаем данные из БД и после этого отрисовываем категории
    await fetchRecords();
    loadCategories(currentType);
}

// Смена пользователя
function changeUserImg(event) {
    const userImg = document.getElementById("currentUserImg");
    if (event.target.value === 'Aleksandr') {
    userImg.src = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjQ1IiByPSIyMCIgZmlsbD0iI2ZmY2M4MCIvPjxwYXRoIGQ9Ik0zMCAzNSBRNTAgMjUgNzAgMzUgTDY1IDI1IFE1MCAxNSAzNSAyNSBaIiBmaWxsPSIjNWM2YmMwIi8+PHJlY3QgeD0iNDAiIHk9IjYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjUiIGZpbGw9IiM1YzZiYzAiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQyIiByPSIzIiBmaWxsPSIjMjYzMjM4Ii8+PGNpcmNsZSBjeD0iNjAiIGN5PSI0MiIgcj0iMyIgZmlsbD0iIzI2MzIzOCIvPjwvc3ZnPg==';
    } else { // Tatiana
    userImg.src = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyNSIgZmlsbD0iI2ZmYjc0ZCIgLz48cGF0aCBkPSJNMzAgMzAgYSAxMCAxMCAwIDAgMSAyMCAwIFoiIGZpbGw9IiM3OTU1NDgiIC8+PHBhdGggZD0iTTcwIDMwIGEgMTAgMTAgMCAwIDAgLTIwIDAgWiIgZmlsbD0iIzc5NTU0OCIgLz48Y2lyY2xlIGN4PSI0MiIgY3k9IjQ4IiByPSIzIiBmaWxsPSIjMjEyMTIxIiAvPjxjaXJjbGUgY3g9IjU4IiBjeT0iNDgiIHI9IjMiIGZpbGw9IiMyMTIxMjEiIC8+PHBhdGggZD0iTTQ1IDYwIFE1MCA2NSA1NSA2MCIgc3Ryb2tlPSIjMjEyMTIxIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIC8+PC9zdmc+';
    }
}

// Загрузка категорий
function loadCategories(type) {
    currentType = type;
    const box = document.getElementById('boxCategories');
    box.innerHTML = '';

    categories[type].forEach(cat => {
        const item = document.createElement('div');
        item.className = 'catItems';
        const storedValue = tempInputValues[type][cat.name] || '';

        item.innerHTML = ` 
            <p>${cat.name}</p>
            <span class="catIcon">${cat.icon}</span> 
            <input type="number" placeholder="0" oninput="changeInputNumber(event)" data-category="${cat.name}" value="${storedValue}">
        `;
        if (storedValue) {
            item.classList.add('choise');
        }
        box.appendChild(item);
    });
    updateTotals(); // Обновляем итоги после загрузки категорий
}

// Обновление итогов с учетом временных и сохраненных значений
function updateTotals() {
    // Считаем итоги из сохраненных в БД записей (которые лежат в кэше `records`)
    let income = records.filter(r => r.type === 'Приход').reduce((sum, r) => sum + r.amount, 0);
    let expense = records.filter(r => r.type === 'Расход').reduce((sum, r) => sum + r.amount, 0);

    // Добавляем к ним временные (несохраненные) значения
    for (const category in tempInputValues['Приход']) {
        income += tempInputValues['Приход'][category] || 0;
    }
    for (const category in tempInputValues['Расход']) {
        expense += tempInputValues['Расход'][category] || 0;
    }

    document.getElementById('incomeTotal').textContent = income;
    document.getElementById('expenseTotal').textContent = expense;
}

// <<< ИЗМЕНЕНИЕ: Сохранение данных на сервер
async function saveData() {
    const date = document.getElementById('inputData').value;
    const user = document.getElementById('currentUser').value;
    const recordsToSave = [];

    // Собираем все временные записи в один массив
    for (const type in tempInputValues) {
        for (const category in tempInputValues[type]) {
            const amount = tempInputValues[type][category];
            if (amount) {
                recordsToSave.push({ date, user, type, category, amount });
            }
        }
    }

    if (recordsToSave.length === 0) {
        alert("Нет данных для сохранения.");
        return;
    }

    // Отправляем каждую запись на сервер
    try {
        for (const record of recordsToSave) {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record)
            });
            if (!response.ok) {
                throw new Error(`Ошибка при сохранении записи: ${record.category}`);
            }
        }

        // Если все успешно сохранилось:
        clearAllInputs(); // Очищаем поля ввода и localStorage
        await fetchRecords(); // Запрашиваем обновленный список с сервера
        alert('Данные успешно сохранены!');

    } catch (error) {
        console.error('Ошибка при сохранении данных:', error);
        alert(`Не удалось сохранить данные. ${error.message}`);
    }
}

// Сохранение введенного числа во временное хранилище
function changeInputNumber(event) {
    const input = event.target;
    const categoryName = input.dataset.category;
    const value = Number(input.value);

    if (value) {
        tempInputValues[currentType][categoryName] = value;
    } else {
        delete tempInputValues[currentType][categoryName];
    }
    input.parentElement.classList.toggle('choise', !!value);
    
    updateTotals();
    
    // Сохраняем временные данные в localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tempInputValues));
}

// Полная очистка всех временных полей
function clearAllInputs() {
    tempInputValues = { 'Расход': {}, 'Приход': {} };
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    loadCategories(currentType); // Перерисовываем, чтобы очистить поля
    updateTotals();
}

// Переключение на категории "Приход"
function Entrance() {
    loadCategories('Приход');
}

// Переключение на категории "Расход"
function Expenses() {
    loadCategories('Расход');
}