const express = require('express');
const cors = require('cors');
const { testConnection } = require('./models');
const userRoutes = require('./routes/userRoutes');

const app = require('express')();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(require('express').json());

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Admin panel');
});

const startServer = async () => {
    await testConnection();

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

startServer();