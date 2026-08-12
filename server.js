const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'info.json');
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2), 'utf8');
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    try {
        return JSON.parse(raw);
    } catch (error) {
        return { users: [] };
    }
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function generateCardNumber() {
    return '4' + Array(15).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
}

function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

function createDefaultUser(name) {
    return {
        name,
        password: '',
        createdAt: new Date().toISOString(),
        cards: [
            {
                id: generateId(),
                number: generateCardNumber(),
                type: 'Visa',
                balance: { RUB: 0, USD: 0, EUR: 0 },
                isDefault: true,
                createdAt: new Date().toISOString()
            }
        ],
        accounts: [
            {
                id: generateId(),
                name: 'Текущий счёт',
                currency: 'RUB',
                balance: 0,
                type: 'checking',
                isDefault: true
            }
        ],
        transactions: [],
        contacts: [],
        settings: {
            theme: 'light',
            notifications: true,
            twoFactorEnabled: false
        },
        loginHistory: [],
        budget: {
            limit: 0,
            categories: {}
        }
    };
}

app.post('/api/register', (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ error: 'Имя и пароль обязательны.' });
    }

    const data = readData();
    const existing = data.users.find((user) => user.name.toLowerCase() === name.toLowerCase());
    if (existing) {
        return res.status(400).json({ error: 'Пользователь с таким именем уже существует.' });
    }

    const newUser = createDefaultUser(name);
    newUser.password = password;
    data.users.push(newUser);
    saveData(data);

    res.json({ success: true });
});

app.post('/api/login', (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ error: 'Имя и пароль обязательны.' });
    }

    const data = readData();
    const user = data.users.find((item) => item.name === name && item.password === password);
    if (!user) {
        return res.status(400).json({ error: 'Неверное имя пользователя или пароль.' });
    }

    if (!user.loginHistory) user.loginHistory = [];
    user.loginHistory.push({
        date: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });
    if (user.loginHistory.length > 50) user.loginHistory.shift();
    saveData(data);

    res.json({ success: true, user: { name: user.name } });
});

app.get('/api/user/:name', (req, res) => {
    const data = readData();
    const user = data.users.find((u) => u.name === req.params.name);
    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден.' });
    }
    const { password, ...safeUser } = user;
    res.json(safeUser);
});

app.post('/api/transfer', (req, res) => {
    const { fromUser, toUser, cardId, amount, currency } = req.body;
    const data = readData();
    const sender = data.users.find((u) => u.name === fromUser);
    const receiver = data.users.find((u) => u.name === toUser);

    if (!sender || !receiver) {
        return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    const card = sender.cards.find((c) => c.id === cardId);
    if (!card || card.balance[currency] < amount) {
        return res.status(400).json({ error: 'Недостаточно средств.' });
    }

    card.balance[currency] -= amount;
    receiver.cards[0].balance[currency] += amount;

    sender.transactions.push({
        id: generateId(),
        type: 'transfer_out',
        amount,
        currency,
        recipient: toUser,
        date: new Date().toISOString()
    });

    receiver.transactions.push({
        id: generateId(),
        type: 'transfer_in',
        amount,
        currency,
        sender: fromUser,
        date: new Date().toISOString()
    });

    saveData(data);
    res.json({ success: true });
});

app.post('/api/add-money', (req, res) => {
    const { userName, cardId, amount, currency } = req.body;
    const data = readData();
    const user = data.users.find((u) => u.name === userName);

    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    const card = user.cards.find((c) => c.id === cardId);
    if (!card) {
        return res.status(404).json({ error: 'Карта не найдена.' });
    }

    card.balance[currency] += amount;
    user.transactions.push({
        id: generateId(),
        type: 'deposit',
        amount,
        currency,
        date: new Date().toISOString()
    });

    saveData(data);
    res.json({ success: true, balance: card.balance });
});

app.post('/api/new-card', (req, res) => {
    const { userName, cardType, cardDesign, cardName } = req.body;
    const data = readData();
    const user = data.users.find((u) => u.name === userName);

    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    const newCard = {
        id: generateId(),
        number: generateCardNumber(),
        type: cardType || 'Visa',
        design: cardDesign || 'classic',
        name: cardName || `${cardType || 'Visa'} карта`,
        balance: { RUB: 0, USD: 0, EUR: 0 },
        isDefault: user.cards.length === 0,
        status: 'active',
        expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 4)).toISOString(),
        createdAt: new Date().toISOString(),
        dailyLimit: 100000,
        monthlyLimit: 1000000,
        spentToday: 0,
        spentThisMonth: 0
    };

    user.cards.push(newCard);
    user.transactions.push({
        id: generateId(),
        type: 'card_issued',
        description: `Карта ${newCard.type} оформлена`,
        date: new Date().toISOString()
    });
    saveData(data);
    res.json({ success: true, card: newCard });
});

app.post('/api/add-contact', (req, res) => {
    const { userName, contactName, contactUsername } = req.body;
    const data = readData();
    const user = data.users.find((u) => u.name === userName);

    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    user.contacts.push({
        id: generateId(),
        name: contactName,
        username: contactUsername,
        addedAt: new Date().toISOString()
    });

    saveData(data);
    res.json({ success: true });
});

app.post('/api/exchange', (req, res) => {
    const { userName, cardId, fromCurrency, toCurrency, amount } = req.body;
    const data = readData();
    const user = data.users.find((u) => u.name === userName);

    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    const card = user.cards.find((c) => c.id === cardId);
    if (!card || card.balance[fromCurrency] < amount) {
        return res.status(400).json({ error: 'Недостаточно средств.' });
    }

    const rates = { 'RUB-USD': 0.011, 'USD-RUB': 91, 'EUR-RUB': 100, 'RUB-EUR': 0.01, 'USD-EUR': 0.92, 'EUR-USD': 1.09 };
    const key = `${fromCurrency}-${toCurrency}`;
    const rate = rates[key] || 1;
    const convertedAmount = amount * rate;

    card.balance[fromCurrency] -= amount;
    card.balance[toCurrency] += convertedAmount;

    user.transactions.push({
        id: generateId(),
        type: 'exchange',
        fromAmount: amount,
        fromCurrency,
        toAmount: convertedAmount,
        toCurrency,
        rate,
        date: new Date().toISOString()
    });

    saveData(data);
    res.json({ success: true, newBalance: card.balance });
});

app.post('/api/theme', (req, res) => {
    const { userName, theme } = req.body;
    const data = readData();
    const user = data.users.find((u) => u.name === userName);

    if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден.' });
    }

    user.settings.theme = theme;
    saveData(data);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`PayPol server запущен на http://localhost:${PORT}`);
});