/**
 * Configuración de Passport.js para autenticación OAuth
 * Este archivo configura las estrategias de autenticación para diferentes redes sociales
 */

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const jwt = require('jsonwebtoken');
const oauthConfig = require('./oauth.config');

/**
 * Función para generar JWT token
 * @param {Object} user - Objeto con información del usuario
 * @returns {String} JWT token
 */
const generateJWTToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol || 'user',
      provider: user.provider // Para identificar de qué red social viene
    },
    process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro',
    { expiresIn: '24h' }
  );
};

/**
 * Función para normalizar datos del usuario
 * @param {Object} profile - Perfil de la red social
 * @param {String} provider - Proveedor (facebook, google, twitter)
 * @returns {Object} Usuario normalizado
 */
const normalizeUser = (profile, provider) => {
  let user = {
    id: profile.id,
    provider: provider,
    rol: 'user'
  };

  switch (provider) {
    case 'facebook':
      user.nombre = profile.displayName;
      user.email = profile.emails?.[0]?.value;
      user.foto = profile.photos?.[0]?.value;
      break;

    case 'google':
      user.nombre = profile.displayName;
      user.email = profile.emails?.[0]?.value;
      user.foto = profile.photos?.[0]?.value;
      break;

    case 'twitter':
      user.nombre = profile.displayName;
      user.email = profile.emails?.[0]?.value;
      user.foto = profile.photos?.[0]?.value;
      user.username = profile.username;
      break;
  }

  return user;
};

// Configuración de Passport
passport.serializeUser((user, done) => {
  // Serializar usuario para la sesión
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Deserializar usuario de la sesión
  done(null, user);
});

/**
 * Estrategia de Facebook
 * Maneja la autenticación con Facebook OAuth
 */
passport.use(new FacebookStrategy({
  clientID: oauthConfig.facebook.clientID,
  clientSecret: oauthConfig.facebook.clientSecret,
  callbackURL: oauthConfig.facebook.callbackURL,
  profileFields: oauthConfig.facebook.profileFields
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🔵 Facebook profile:', profile);
    
    // Normalizar datos del usuario
    const user = normalizeUser(profile, 'facebook');
    
    // Aquí normalmente guardarías el usuario en tu base de datos
    // Por ahora, solo retornamos el usuario normalizado
    console.log('✅ Usuario Facebook normalizado:', user);
    
    return done(null, user);
  } catch (error) {
    console.error('❌ Error en estrategia Facebook:', error);
    return done(error, null);
  }
}));

/**
 * Estrategia de Google
 * Maneja la autenticación con Google OAuth
 */
passport.use(new GoogleStrategy({
  clientID: oauthConfig.google.clientID,
  clientSecret: oauthConfig.google.clientSecret,
  callbackURL: oauthConfig.google.callbackURL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('🟢 Google profile:', profile);
    
    // Normalizar datos del usuario
    const user = normalizeUser(profile, 'google');
    
    // Aquí normalmente guardarías el usuario en tu base de datos
    console.log('✅ Usuario Google normalizado:', user);
    
    return done(null, user);
  } catch (error) {
    console.error('❌ Error en estrategia Google:', error);
    return done(error, null);
  }
}));

/**
 * Estrategia de Twitter
 * Maneja la autenticación con Twitter OAuth
 */
passport.use(new TwitterStrategy({
  consumerKey: oauthConfig.twitter.consumerKey,
  consumerSecret: oauthConfig.twitter.consumerSecret,
  callbackURL: oauthConfig.twitter.callbackURL,
  includeEmail: true // Solicitar email del usuario
}, async (token, tokenSecret, profile, done) => {
  try {
    console.log('🔵 Twitter profile:', profile);
    
    // Normalizar datos del usuario
    const user = normalizeUser(profile, 'twitter');
    
    // Aquí normalmente guardarías el usuario en tu base de datos
    console.log('✅ Usuario Twitter normalizado:', user);
    
    return done(null, user);
  } catch (error) {
    console.error('❌ Error en estrategia Twitter:', error);
    return done(error, null);
  }
}));

module.exports = {
  passport,
  generateJWTToken,
  normalizeUser
}; 