/**
 * Configuración de OAuth para redes sociales
 * Este archivo contiene las credenciales y configuraciones para Facebook, Google y Twitter
 */

module.exports = {
  // Configuración de Facebook OAuth
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID || 'tu_facebook_client_id',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'tu_facebook_client_secret',
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email'] // Campos que queremos obtener del perfil
  },

  // Configuración de Google OAuth
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || 'tu_google_client_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'tu_google_client_secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
  },

  // Configuración de Twitter OAuth
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY || 'tu_twitter_consumer_key',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'tu_twitter_consumer_secret',
    callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:3000/auth/twitter/callback'
  },

  // Configuración de sesiones
  session: {
    secret: process.env.SESSION_SECRET || 'tu_session_secret_super_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
  }
}; 