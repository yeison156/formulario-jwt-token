// auth.js
// Este archivo se encargará de validar el formulario.
// Este archivo solo recibe la petición POST a /register, y si email y password existen, devuelve:

export function validarFormulario(data) {
    const { firstName, lastName, email, address, password, confirmPassword, terms } = data;

    if (!firstName || !lastName || !email || !address || !password || !confirmPassword) {
        return 'Por favor, completa todos los campos';
    }

    if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden';
    }

    if (password.length < 6) {
        return 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!terms) {
        return 'Debes aceptar los términos y condiciones';
    }

    return null; // Sin errores
}

// routes/auth.routes.js
const express = require('express');
const router = express.Router();

// Ruta POST para registrar usuario
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
  }

  console.log('📩 Registro recibido:', email, password);
  return res.status(200).json({ mensaje: 'Usuario registrado exitosamente' });
});

module.exports = router;

