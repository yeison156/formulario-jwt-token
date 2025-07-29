//server.js 
const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de OAuth
const { passport } = require('./config/passport');
const oauthConfig = require('./config/oauth.config');

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de sesiones (necesario para Passport)
app.use(session(oauthConfig.session));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas de la API (deben ir ANTES de los archivos estáticos)
const authRoutes = require('./routes/auth.routes');
const oauthRoutes = require('./routes/oauth.routes');

// Rutas de autenticación tradicional disponibles en /api
app.use('/api', authRoutes);

// Rutas de autenticación tradicional también disponibles directamente
app.use('/', authRoutes);

// Rutas de OAuth disponibles en /auth
app.use('/auth', oauthRoutes);

// Servir archivos estáticos del frontend (debe ir DESPUÉS de las rutas de la API)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ruta directa para login.html (opcional si usas SPA)
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// Fallback para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
