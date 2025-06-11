// history.js

const API_URL = '/api/records';
const tableBody = document.querySelector('#historyTable tbody');
const modal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const closeModalButton = document.querySelector('.close-button');

// Функция для загрузки и отображения записей
async function loadRecords() {
    try {
        const response = await fetch(API_URL);
        const { data } = await response.json();
        
        tableBody.innerHTML = ''; // Очищаем таблицу перед заполнением

        data.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.user === 'Aleksandr' ? 'Саньчи' : 'Таньчи'}</td>
                <td class="${record.type === 'Приход' ? 'income-text' : 'expense-text'}">${record.type}</td>
                <td>${record.category}</td>
                <td>${record.amount} ₽</td>
                <td class="actions">
                    <button class="edit-btn" data-id="${record.id}">✏️</button>
                    <button class="delete-btn" data-id="${record.id}">❌</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Ошибка при загрузке записей:', error);
        alert('Не удалось загрузить историю операций.');
    }
}

// Функция для удаления записи
async function deleteRecord(id) {
    if (!confirm('Вы уверены, что хотите удалить эту запись?')) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Ошибка при удалении');
        
        loadRecords(); // Перезагружаем таблицу
    } catch (error) {
        console.error('Ошибка при удалении записи:', error);
        alert('Не удалось удалить запись.');
    }
}

// Функция для открытия модального окна с данными для редактирования
async function openEditModal(id) {
    try {
        // Найдем нужную запись в уже загруженных данных
        const response = await fetch(API_URL);
        const { data } = await response.json();
        const recordToEdit = data.find(rec => rec.id == id);

        if (recordToEdit) {
            document.getElementById('edit-id').value = recordToEdit.id;
            document.getElementById('edit-date').value = recordToEdit.date;
            document.getElementById('edit-user').value = recordToEdit.user;
            document.getElementById('edit-type').value = recordToEdit.type;
            document.getElementById('edit-category').value = recordToEdit.category;
            document.getElementById('edit-amount').value = recordToEdit.amount;
            modal.style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка при получении данных для редактирования:', error);
    }
}

// Обработчик отправки формы редактирования
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const updatedRecord = {
        date: document.getElementById('edit-date').value,
        user: document.getElementById('edit-user').value,
        type: document.getElementById('edit-type').value,
        category: document.getElementById('edit-category').value,
        amount: Number(document.getElementById('edit-amount').value),
    };

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedRecord),
        });
        if (!response.ok) throw new Error('Ошибка при обновлении');

        modal.style.display = 'none';
        loadRecords(); // Перезагружаем таблицу
    } catch (error) {
        console.error('Ошибка при обновлении записи:', error);
        alert('Не удалось обновить запись.');
    }
});

// Единый обработчик кликов по таблице (делегирование событий)
tableBody.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('delete-btn')) {
        const id = target.dataset.id;
        deleteRecord(id);
    }
    if (target.classList.contains('edit-btn')) {
        const id = target.dataset.id;
        openEditModal(id);
    }
});

// Закрытие модального окна
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});

// Загружаем записи при старте страницы
document.addEventListener('DOMContentLoaded', loadRecords);