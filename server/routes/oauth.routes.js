/**
 * Rutas para autenticación OAuth con redes sociales
 * Define los endpoints para iniciar autenticación y manejar callbacks
 */

const express = require('express');
const passport = require('passport');
const OAuthController = require('../controllers/oauth.controller');

const router = express.Router();

/**
 * RUTAS DE FACEBOOK
 */

// Iniciar autenticación con Facebook
router.get('/facebook', 
  OAuthController.facebookAuth,
  passport.authenticate('facebook', { 
    scope: ['email', 'public_profile'] // Permisos que solicitamos
  })
);

// Callback de Facebook después de la autenticación
router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: '/login.html?error=facebook_auth_failed',
    session: false // No usar sesiones para OAuth
  }),
  OAuthController.facebookCallback
);

/**
 * RUTAS DE GOOGLE
 */

// Iniciar autenticación con Google
router.get('/google',
  OAuthController.googleAuth,
  passport.authenticate('google', {
    scope: ['profile', 'email'] // Permisos que solicitamos
  })
);

// Callback de Google después de la autenticación
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login.html?error=google_auth_failed',
    session: false // No usar sesiones para OAuth
  }),
  OAuthController.googleCallback
);

/**
 * RUTAS DE TWITTER
 */

// Iniciar autenticación con Twitter
router.get('/twitter',
  OAuthController.twitterAuth,
  passport.authenticate('twitter')
);

// Callback de Twitter después de la autenticación
router.get('/twitter/callback',
  passport.authenticate('twitter', {
    failureRedirect: '/login.html?error=twitter_auth_failed',
    session: false // No usar sesiones para OAuth
  }),
  OAuthController.twitterCallback
);

/**
 * RUTAS ADICIONALES
 */

// Obtener información del usuario autenticado
router.get('/user', OAuthController.getUserInfo);

// Cerrar sesión
router.post('/logout', OAuthController.logout);

// Ruta de prueba para verificar que las rutas OAuth están funcionando
router.get('/status', (req, res) => {
  res.json({
    success: true,
    message: 'Rutas OAuth funcionando correctamente',
    availableProviders: ['facebook', 'google', 'twitter'],
    endpoints: {
      facebook: {
        auth: '/auth/facebook',
        callback: '/auth/facebook/callback'
      },
      google: {
        auth: '/auth/google',
        callback: '/auth/google/callback'
      },
      twitter: {
        auth: '/auth/twitter',
        callback: '/auth/twitter/callback'
      }
    }
  });
});

module.exports = router; 