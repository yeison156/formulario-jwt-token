/**
 * Manejo de autenticación OAuth en el frontend
 * Este archivo maneja los botones de login social y la redirección
 */

class OAuthHandler {
  constructor() {
    this.baseURL = window.location.origin;
    this.init();
  }

  /**
   * Inicializar los event listeners para los botones de OAuth
   */
  init() {
    // Botones de OAuth
    const facebookBtn = document.getElementById('facebookBtn');
    const googleBtn = document.getElementById('googleBtn');
    const twitterBtn = document.getElementById('twitterBtn');

    if (facebookBtn) {
      facebookBtn.addEventListener('click', () => this.authenticateWithFacebook());
    }

    if (googleBtn) {
      googleBtn.addEventListener('click', () => this.authenticateWithGoogle());
    }

    if (twitterBtn) {
      twitterBtn.addEventListener('click', () => this.authenticateWithTwitter());
    }

    // Verificar si hay token en la URL (después del callback)
    this.checkForOAuthToken();
  }

  /**
   * Autenticación con Facebook
   */
  authenticateWithFacebook() {
    console.log('🔵 Iniciando autenticación con Facebook...');
    this.showLoadingState('facebookBtn', 'Conectando con Facebook...');
    
    // Redirigir a la ruta de autenticación de Facebook
    window.location.href = `${this.baseURL}/auth/facebook`;
  }

  /**
   * Autenticación con Google
   */
  authenticateWithGoogle() {
    console.log('🟢 Iniciando autenticación con Google...');
    this.showLoadingState('googleBtn', 'Conectando con Google...');
    
    // Redirigir a la ruta de autenticación de Google
    window.location.href = `${this.baseURL}/auth/google`;
  }

  /**
   * Autenticación con Twitter
   */
  authenticateWithTwitter() {
    console.log('🔵 Iniciando autenticación con Twitter...');
    this.showLoadingState('twitterBtn', 'Conectando con Twitter...');
    
    // Redirigir a la ruta de autenticación de Twitter
    window.location.href = `${this.baseURL}/auth/twitter`;
  }

  /**
   * Mostrar estado de carga en el botón
   * @param {string} buttonId - ID del botón
   * @param {string} text - Texto a mostrar
   */
  showLoadingState(buttonId, text) {
    const button = document.getElementById(buttonId);
    if (button) {
      const originalText = button.innerHTML;
      button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
      button.disabled = true;
      
      // Restaurar después de 5 segundos (por si hay error)
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
      }, 5000);
    }
  }

  /**
   * Verificar si hay token en la URL después del callback OAuth
   */
  checkForOAuthToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const provider = urlParams.get('provider');
    const error = urlParams.get('error');

    if (error) {
      this.handleOAuthError(error);
      return;
    }

    if (token && provider) {
      console.log(`✅ Token recibido de ${provider}:`, token);
      this.handleOAuthSuccess(token, provider);
    }
  }

  /**
   * Manejar éxito en autenticación OAuth
   * @param {string} token - JWT token
   * @param {string} provider - Proveedor (facebook, google, twitter)
   */
  handleOAuthSuccess(token, provider) {
    try {
      // Decodificar el token para obtener información del usuario
      const userInfo = this.decodeJWT(token);
      
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(userInfo));
      localStorage.setItem('oauthProvider', provider);
      
      // Mostrar mensaje de éxito
      this.showSuccessMessage(`¡Bienvenido! Has iniciado sesión con ${this.getProviderName(provider)}`);
      
      // Redirigir al dashboard después de un breve delay
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1500);
      
    } catch (error) {
      console.error('❌ Error al procesar token OAuth:', error);
      this.showErrorMessage('Error al procesar la autenticación');
    }
  }

  /**
   * Manejar errores en autenticación OAuth
   * @param {string} error - Tipo de error
   */
  handleOAuthError(error) {
    console.error('❌ Error en OAuth:', error);
    
    let message = 'Error en la autenticación';
    
    switch (error) {
      case 'facebook_auth_failed':
        message = 'Error al autenticarse con Facebook';
        break;
      case 'google_auth_failed':
        message = 'Error al autenticarse con Google';
        break;
      case 'twitter_auth_failed':
        message = 'Error al autenticarse con Twitter';
        break;
      default:
        message = 'Error en la autenticación con redes sociales';
    }
    
    this.showErrorMessage(message);
  }

  /**
   * Decodificar JWT token (sin verificar firma)
   * @param {string} token - JWT token
   * @returns {Object} Información del usuario
   */
  decodeJWT(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('❌ Error al decodificar JWT:', error);
      throw error;
    }
  }

  /**
   * Obtener nombre amigable del proveedor
   * @param {string} provider - Proveedor
   * @returns {string} Nombre amigable
   */
  getProviderName(provider) {
    const names = {
      facebook: 'Facebook',
      google: 'Google',
      twitter: 'Twitter'
    };
    return names[provider] || provider;
  }

  /**
   * Mostrar mensaje de éxito
   * @param {string} message - Mensaje a mostrar
   */
  showSuccessMessage(message) {
    this.showMessage(message, 'success');
  }

  /**
   * Mostrar mensaje de error
   * @param {string} message - Mensaje a mostrar
   */
  showErrorMessage(message) {
    this.showMessage(message, 'error');
  }

  /**
   * Mostrar mensaje genérico
   * @param {string} message - Mensaje a mostrar
   * @param {string} type - Tipo de mensaje (success, error)
   */
  showMessage(message, type) {
    // Crear elemento de mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `oauth-message ${type}`;
    messageDiv.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    `;
    
    // Agregar estilos
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
    `;
    
    // Agregar al DOM
    document.body.appendChild(messageDiv);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new OAuthHandler();
});

// Agregar estilos CSS para la animación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style); 