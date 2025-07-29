const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'mi_clave_secreta_super_segura';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Usuarios simulados con contraseñas encriptadas
const usuarios = [
  {
    id: 1,
    correo: 'prueba@correo.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' // "123456" encriptada
  }
];

// Función para encriptar contraseñas (útil para registro)
async function encriptarPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Ruta de login mejorada
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ 
        mensaje: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const usuario = usuarios.find(user => user.correo === email);

    if (!usuario) {
      return res.status(401).json({ 
        mensaje: 'Credenciales inválidas' 
      });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({ 
        mensaje: 'Credenciales inválidas' 
      });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: usuario.id, 
        correo: usuario.correo 
      }, 
      SECRET_KEY, 
      { expiresIn: '24h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token: token,
      usuario: {
        id: usuario.id,
        correo: usuario.correo
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      mensaje: 'Error interno del servidor' 
    });
  }
});

// Ruta para verificar token
app.get('/verificar-token', verificarToken, (req, res) => {
  res.json({ 
    mensaje: 'Token válido', 
    usuario: req.usuario 
  });
});

// Ruta protegida
app.get('/protegido', verificarToken, (req, res) => {
  res.json({ 
    mensaje: 'Accediste a una ruta protegida', 
    usuario: req.usuario 
  });
});

// Middleware para verificar token
function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ mensaje: 'Token requerido' });
  }

  try {
    const tokenLimpio = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenLimpio, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (err) {
    console.error('Error verificando token:', err);
    res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}

// Ruta para crear contraseña encriptada (solo para desarrollo)
app.post('/crear-password', async (req, res) => {
  try {
    const { password } = req.body;
    const passwordEncriptada = await encriptarPassword(password);
    res.json({ passwordEncriptada });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al encriptar' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Archivos estáticos servidos desde: public/`);
  console.log(`🔐 Endpoint de login: POST http://localhost:${PORT}/login`);
});

app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Servidor JWT funcionando correctamente</h1>
    <p>📁 <a href="/login.html">Ir al Login</a></p>
    <p>🔐 Endpoints disponibles:</p>
    <ul>
      <li>POST /login - Autenticación</li>
      <li>GET /verificar-token - Verificar token</li>
      <li>GET /protegido - Ruta protegida</li>
    </ul>
  `);
});
