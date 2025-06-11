// history.js

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('editModal');
    const closeButton = document.querySelector('.close-button');
    const editForm = document.getElementById('editForm');

    if(closeButton) {
        closeButton.onclick = () => { modal.style.display = "none"; };
    }
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
    if(editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveEdit();
        });
    }

    loadHistory();
});

async function loadHistory() {
    const tableBody = document.querySelector('#historyTable tbody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="6">Загрузка данных с сервера...</td></tr>';

    try {
        const response = await fetch('/api/history'); // Запрашиваем данные у нашего сервера
        if (!response.ok) throw new Error(`Ошибка сети: ${response.statusText}`);
        
        const history = await response.json();
        
        tableBody.innerHTML = '';

        if (history.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6">В базе данных нет записей.</td></tr>';
            return;
        }

        history.forEach(item => {
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td data-label="Дата">${item.date}</td>
                <td data-label="Тип" class="${item.type === 'income' ? 'income-text' : 'expense-text'}">${item.type === 'income' ? 'Приход' : 'Расход'}</td>
                <td data-label="Категория">${item.category}</td>
                <td data-label="Сумма">${item.amount} ₽</td>
                <td data-label="Пользователь">${item.user}</td>
                <td data-label="Действия" class="actions">
                    <button onclick="openEditModal(${item.id})">✏️</button>
                    <button onclick="deleteEntry(${item.id})">🗑️</button>
                </td>
            `;
        });

    } catch (error) {
        console.error('Не удалось загрузить историю:', error);
        tableBody.innerHTML = `<tr><td colspan="6" style="color: red;">Ошибка загрузки данных.</td></tr>`;
    }
}

async function deleteEntry(id) {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
        try {
            const response = await fetch(`/api/history/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Ошибка при удалении на сервере.');

            loadHistory(); // Перезагружаем таблицу для отображения изменений

        } catch (error) {
            console.error('Ошибка при удалении:', error);
            alert('Произошла ошибка при удалении записи.');
        }
    }
}

function openEditModal(id) {
    // Находим данные прямо из таблицы, чтобы не делать лишний запрос
    const row = event.target.closest('tr');
    const cells = row.querySelectorAll('td');

    document.getElementById('editId').value = id;
    document.getElementById('editDate').value = cells[0].textContent;
    document.getElementById('editType').value = cells[1].textContent === 'Приход' ? 'income' : 'expense';
    document.getElementById('editCategory').value = cells[2].textContent;
    document.getElementById('editAmount').value = parseFloat(cells[3].textContent);
    document.getElementById('editUser').value = cells[4].textContent;
    
    document.getElementById('editModal').style.display = 'block';
}

async function saveEdit() {
    const id = document.getElementById('editId').value;
    const updatedEntry = {
        date: document.getElementById('editDate').value,
        type: document.getElementById('editType').value,
        category: document.getElementById('editCategory').value,
        amount: parseFloat(document.getElementById('editAmount').value),
        user: document.getElementById('editUser').value
    };

    try {
        const response = await fetch(`/api/history/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEntry),
        });

        if (!response.ok) throw new Error('Ошибка при обновлении на сервере.');

        document.getElementById('editModal').style.display = 'none';
        loadHistory(); // Перезагружаем таблицу

    } catch (error) {
        console.error('Ошибка при сохранении изменений:', error);
        alert('Произошла ошибка при сохранении.');
    }
}