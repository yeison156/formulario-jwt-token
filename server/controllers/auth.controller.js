const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Simulación de base de datos de usuarios (en producción usarías una base de datos real)
const usuarios = [
  {
    id: 1,
    email: 'admin@example.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    nombre: 'Administrador',
    rol: 'admin'
  },
  {
    id: 2,
    email: 'user@example.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    nombre: 'Usuario',
    rol: 'user'
  }
];

// Función para generar JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email, 
      rol: usuario.rol 
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
};

// Controlador de login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        mensaje: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario por email
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(password, usuario.password);
    if (!contraseñaValida) {
      return res.status(401).json({ 
        mensaje: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = generarToken(usuario);

    // Enviar respuesta exitosa
    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      mensaje: 'Error interno del servidor' 
    });
  }
};

// Controlador de registro
const registro = async (req, res) => {
  try {
    const { firstName, lastName, email, address, password, confirmPassword, terms } = req.body;

    // Validaciones
    if (!firstName || !lastName || !email || !address || !password || !confirmPassword) {
      return res.status(400).json({ 
        mensaje: 'Por favor, completa todos los campos' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        mensaje: 'Las contraseñas no coinciden' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        mensaje: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    if (!terms) {
      return res.status(400).json({ 
        mensaje: 'Debes aceptar los términos y condiciones' 
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
      return res.status(400).json({ 
        mensaje: 'El email ya está registrado' 
      });
    }

    // Encriptar contraseña
    const contraseñaEncriptada = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const nuevoUsuario = {
      id: usuarios.length + 1,
      email,
      password: contraseñaEncriptada,
      nombre: `${firstName} ${lastName}`,
      direccion: address,
      rol: 'user'
    };

    // Agregar a la "base de datos" (en producción guardarías en una BD real)
    usuarios.push(nuevoUsuario);

    // NO generar token en el registro - el usuario debe hacer login manualmente
    res.status(201).json({
      mensaje: 'Registro exitoso. Por favor, inicia sesión con tus credenciales.',
      success: true
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      mensaje: 'Error interno del servidor' 
    });
  }
};

// Controlador para verificar token
const verificarToken = (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        mensaje: 'Token no proporcionado' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Buscar usuario
    const usuario = usuarios.find(u => u.id === decoded.id);
    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Token inválido' 
      });
    }

    res.status(200).json({
      mensaje: 'Token válido',
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({ 
      mensaje: 'Token inválido' 
    });
  }
};

module.exports = {
  login,
  registro,
  verificarToken
}; 