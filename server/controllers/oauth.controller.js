/**
 * Controlador para autenticación OAuth con redes sociales
 * Maneja las rutas de autenticación y callbacks para Facebook, Google y Twitter
 */

const { generateJWTToken } = require('../config/passport');

/**
 * Controlador para Facebook OAuth
 */
class OAuthController {
  
  /**
   * Iniciar autenticación con Facebook
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static facebookAuth(req, res) {
    console.log('🔵 Iniciando autenticación con Facebook...');
    // Passport maneja la redirección automáticamente
  }

  /**
   * Callback de Facebook después de la autenticación
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static facebookCallback(req, res) {
    try {
      console.log('🔵 Callback de Facebook recibido');
      
      if (req.user) {
        // Generar JWT token
        const token = generateJWTToken(req.user);
        
        console.log('✅ Usuario autenticado con Facebook:', req.user);
        
        // Redirigir al dashboard con el token
        res.redirect(`/dashboard.html?token=${token}&provider=facebook`);
      } else {
        console.error('❌ No se recibió usuario de Facebook');
        res.redirect('/login.html?error=facebook_auth_failed');
      }
    } catch (error) {
      console.error('❌ Error en callback de Facebook:', error);
      res.redirect('/login.html?error=facebook_auth_error');
    }
  }

  /**
   * Iniciar autenticación con Google
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static googleAuth(req, res) {
    console.log('🟢 Iniciando autenticación con Google...');
    // Passport maneja la redirección automáticamente
  }

  /**
   * Callback de Google después de la autenticación
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static googleCallback(req, res) {
    try {
      console.log('🟢 Callback de Google recibido');
      
      if (req.user) {
        // Generar JWT token
        const token = generateJWTToken(req.user);
        
        console.log('✅ Usuario autenticado con Google:', req.user);
        
        // Redirigir al dashboard con el token
        res.redirect(`/dashboard.html?token=${token}&provider=google`);
      } else {
        console.error('❌ No se recibió usuario de Google');
        res.redirect('/login.html?error=google_auth_failed');
      }
    } catch (error) {
      console.error('❌ Error en callback de Google:', error);
      res.redirect('/login.html?error=google_auth_error');
    }
  }

  /**
   * Iniciar autenticación con Twitter
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static twitterAuth(req, res) {
    console.log('🔵 Iniciando autenticación con Twitter...');
    // Passport maneja la redirección automáticamente
  }

  /**
   * Callback de Twitter después de la autenticación
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static twitterCallback(req, res) {
    try {
      console.log('🔵 Callback de Twitter recibido');
      
      if (req.user) {
        // Generar JWT token
        const token = generateJWTToken(req.user);
        
        console.log('✅ Usuario autenticado con Twitter:', req.user);
        
        // Redirigir al dashboard con el token
        res.redirect(`/dashboard.html?token=${token}&provider=twitter`);
      } else {
        console.error('❌ No se recibió usuario de Twitter');
        res.redirect('/login.html?error=twitter_auth_failed');
      }
    } catch (error) {
      console.error('❌ Error en callback de Twitter:', error);
      res.redirect('/login.html?error=twitter_auth_error');
    }
  }

  /**
   * Obtener información del usuario autenticado
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static getUserInfo(req, res) {
    try {
      if (req.user) {
        console.log('📋 Información del usuario solicitada:', req.user);
        res.json({
          success: true,
          user: req.user
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }
    } catch (error) {
      console.error('❌ Error al obtener información del usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * Cerrar sesión
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   */
  static logout(req, res) {
    try {
      console.log('🚪 Cerrando sesión del usuario');
      
      // Destruir la sesión
      req.logout((err) => {
        if (err) {
          console.error('❌ Error al cerrar sesión:', err);
          return res.status(500).json({
            success: false,
            message: 'Error al cerrar sesión'
          });
        }
        
        // Destruir la sesión
        req.session.destroy((err) => {
          if (err) {
            console.error('❌ Error al destruir sesión:', err);
            return res.status(500).json({
              success: false,
              message: 'Error al destruir sesión'
            });
          }
          
          res.json({
            success: true,
            message: 'Sesión cerrada exitosamente'
          });
        });
      });
    } catch (error) {
      console.error('❌ Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}

module.exports = OAuthController; 