// server.js

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000; // Используем порт от хостинга, или 3000 для локальной работы
const DB_FILE = process.env.DB_FILE_PATH || 'database.db';

const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('Ошибка при подключении к базе данных:', err.message);
    } else {
        console.log('Успешное подключение к базе данных SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            user TEXT NOT NULL,
            type TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL
        )`);
    }
});

app.use(cors());
app.use(express.json());
// <<< ИЗМЕНЕНИЕ: Добавляем middleware для раздачи статических файлов (html, css, js)
// Теперь браузер сможет сам загружать history.html, history.js и т.д.
app.use(express.static('.')); 

// --- Маршрут для сохранения новой записи ---
app.post('/api/records', (req, res) => {
    const { date, user, type, category, amount } = req.body;
    if (!date || !user || !type || !category || !amount) {
        res.status(400).json({ "error": "Не все поля были переданы." });
        return;
    }
    const sql = 'INSERT INTO records (date, user, type, category, amount) VALUES (?, ?, ?, ?, ?)';
    const params = [date, user, type, category, amount];
    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.status(201).json({
            "message": "success",
            "data": { id: this.lastID, ...req.body }
        });
    });
});

// <<< НОВЫЙ МАРШРУТ: Для удаления записи по ID ---
// Сработает на DELETE-запрос, например: /api/records/15
app.delete('/api/records/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM records WHERE id = ?';
    db.run(sql, id, function(err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        // this.changes вернет количество удаленных строк. Если 1 - значит успешно.
        res.json({ "message": "deleted", "changes": this.changes });
    });
});

// <<< НОВЫЙ МАРШРУТ: Для обновления (редактирования) записи по ID ---
// Сработает на PUT-запрос, например: /api/records/15
app.put('/api/records/:id', (req, res) => {
    const id = req.params.id;
    const { date, user, type, category, amount } = req.body;

    if (!date || !user || !type || !category || !amount) {
        res.status(400).json({ "error": "Не все поля были переданы для обновления." });
        return;
    }

    const sql = `UPDATE records set 
                    date = ?, 
                    user = ?, 
                    type = ?, 
                    category = ?, 
                    amount = ? 
                 WHERE id = ?`;
    const params = [date, user, type, category, amount, id];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.json({
            message: "success",
            data: { id: id, ...req.body },
            changes: this.changes
        });
    });
});

// --- API: Получить все записи из истории ---
app.get('/api/history', (req, res) => {
    const sql = `SELECT * FROM records ORDER BY date DESC, id DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.json(rows);
    });
});

// --- API: Получить ОДНУ запись по ID (для редактирования) ---
app.get('/api/history/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM records WHERE id = ?';
    db.get(sql, id, (err, row) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ "message": "Запись не найдена" });
        }
    });
});

// --- API: Удалить запись по ID ---
app.delete('/api/history/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM records WHERE id = ?';
    db.run(sql, id, function(err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        if (this.changes > 0) {
            res.json({ "message": "Запись успешно удалена" });
        } else {
            res.status(404).json({ "message": "Запись не найдена" });
        }
    });
});

// --- API: Обновить запись по ID ---
app.put('/api/history/:id', (req, res) => {
    const id = req.params.id;
    const { date, type, category, amount, user } = req.body;

    if (!date || !type || !category || amount === undefined || !user) {
        return res.status(400).json({ "error": "Все поля обязательны" });
    }

    const sql = `UPDATE records SET date = ?, type = ?, category = ?, amount = ?, user = ? WHERE id = ?`;
    const params = [date, type, category, amount, user, id];
    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        if (this.changes > 0) {
            res.json({ message: "Запись успешно обновлена" });
        } else {
            res.status(404).json({ "message": "Запись не найдена" });
        }
    });
});

// // Запускаем сервер
// app.listen(PORT, () => {
//     console.log(`Сервер запущен на http://localhost:${port}`);
//     console.log(`Откройте http://localhost:${port}/history.html в браузере`);
// });

app.listen(PORT, () => {
    console.log(`Сервер запущен и слушает порт ${PORT}`);
});

// Обслуживание статических файлов (HTML, CSS, JS) должно быть в конце
app.use(express.static(path.join(__dirname, '')));