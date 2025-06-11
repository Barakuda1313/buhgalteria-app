document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('editModal');
    const closeButton = document.querySelector('.close-button');
    const editForm = document.getElementById('editForm');

    // Закрытие модального окна по кнопке
    if(closeButton) {
        closeButton.onclick = function() {
            modal.style.display = "none";
        }
    }

    // Закрытие модального окна по клику вне его
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Обработка сохранения формы редактирования
    if(editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveEdit();
        });
    }

    // Загружаем историю из localStorage при открытии страницы
    loadHistory();
});

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('allEntries')) || [];
    const tableBody = document.querySelector('#historyTable tbody');
    
    if (!tableBody) return; // Если таблицы нет на странице, выходим
    
    tableBody.innerHTML = '';

    // Сортируем историю по дате от новой к старой
    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    history.forEach(item => {
        const row = tableBody.insertRow();
        
        // Добавляем data-label для адаптивности
        row.innerHTML = `
            <td data-label="Дата">${item.date}</td>
            <td data-label="Тип" class="${item.type === 'income' ? 'income-text' : 'expense-text'}">${item.type === 'income' ? 'Приход' : 'Расход'}</td>
            <td data-label="Категория">${item.category}</td>
            <td data-label="Сумма">${item.amount} ₽</td>
            <td data-label="Пользователь">${item.user}</td>
            <td data-label="Действия" class="actions">
                <button onclick="openEditModal('${item.id}')">✏️</button>
                <button onclick="deleteEntry('${item.id}')">🗑️</button>
            </td>
        `;
    });
}

function deleteEntry(id) {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
        let history = JSON.parse(localStorage.getItem('allEntries')) || [];
        
        const numericId = Number(id);
        const updatedHistory = history.filter(item => item.id !== numericId);
        
        localStorage.setItem('allEntries', JSON.stringify(updatedHistory));
        
        // Перезагружаем таблицу, чтобы отобразить изменения
        loadHistory();
    }
}

function openEditModal(id) {
    const history = JSON.parse(localStorage.getItem('allEntries')) || [];
    const numericId = Number(id);
    const entry = history.find(item => item.id === numericId);

    if (entry) {
        document.getElementById('editId').value = entry.id;
        document.getElementById('editDate').value = entry.date;
        document.getElementById('editType').value = entry.type;
        document.getElementById('editCategory').value = entry.category;
        document.getElementById('editAmount').value = entry.amount;
        document.getElementById('editUser').value = entry.user;
        
        document.getElementById('editModal').style.display = 'block';
    }
}

function saveEdit() {
    const id = document.getElementById('editId').value;
    const numericId = Number(id);

    let history = JSON.parse(localStorage.getItem('allEntries')) || [];
    const entryIndex = history.findIndex(item => item.id === numericId);

    if (entryIndex > -1) {
        history[entryIndex] = {
            id: numericId,
            date: document.getElementById('editDate').value,
            type: document.getElementById('editType').value,
            category: document.getElementById('editCategory').value,
            amount: parseFloat(document.getElementById('editAmount').value),
            user: document.getElementById('editUser').value
        };

        localStorage.setItem('allEntries', JSON.stringify(history));
        document.getElementById('editModal').style.display = 'none';
        loadHistory();
    }
}