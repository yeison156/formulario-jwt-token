// routes/auth.routes.js

const express = require('express');
const router = express.Router();
const { login, registro, verificarToken } = require('../controllers/auth.controller');

// Ruta POST para login
router.post('/login', login);

// Ruta POST para registro
router.post('/register', registro);

// Ruta GET para verificar token
router.get('/verificar-token', verificarToken);

module.exports = router;
