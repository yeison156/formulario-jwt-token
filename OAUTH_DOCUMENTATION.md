# 📚 Documentación Completa: OAuth con Redes Sociales

## 🎯 Descripción General

Esta implementación agrega autenticación OAuth con Facebook, Google y Twitter a tu aplicación de formulario JWT. Utiliza Passport.js para manejar las estrategias de autenticación y JWT para mantener las sesiones.

## 🏗️ Arquitectura del Sistema

```
📁 formulario-jwt-token/
├── 📁 server/
│   ├── 📁 config/
│   │   ├── oauth.config.js      # Configuración de credenciales OAuth
│   │   └── passport.js          # Estrategias de Passport
│   ├── 📁 controllers/
│   │   └── oauth.controller.js  # Controlador para OAuth
│   ├── 📁 routes/
│   │   └── oauth.routes.js      # Rutas de OAuth
│   └── server.js                # Servidor principal actualizado
├── 📁 public/
│   ├── 📁 js/
│   │   └── oauth.js             # Frontend OAuth handler
│   ├── login.html               # Página de login actualizada
│   └── 📁 css/
│       └── login.css            # Estilos para botones OAuth
└── env.example                  # Variables de entorno
```

## 🔧 Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install passport passport-facebook passport-google-oauth20 passport-twitter express-session
```

### 2. Configurar Variables de Entorno

Copia `env.example` a `.env` y configura tus credenciales:

```env
# JWT y Session
JWT_SECRET=tu_jwt_secret_super_seguro
SESSION_SECRET=tu_session_secret_super_seguro

# Facebook OAuth
FACEBOOK_CLIENT_ID=tu_facebook_client_id
FACEBOOK_CLIENT_SECRET=tu_facebook_client_secret
FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Twitter OAuth
TWITTER_CONSUMER_KEY=tu_twitter_consumer_key
TWITTER_CONSUMER_SECRET=tu_twitter_consumer_secret
TWITTER_CALLBACK_URL=http://localhost:3000/auth/twitter/callback
```

## 🔑 Obtener Credenciales OAuth

### Facebook
1. Ve a [Facebook Developers](https://developers.facebook.com/apps/)
2. Crea una nueva aplicación
3. En **Configuración > Básica**, copia App ID y App Secret
4. En **Productos > Facebook Login > Configuración**
5. Agrega `http://localhost:3000/auth/facebook/callback` en **Valid OAuth Redirect URIs**

### Google
1. Ve a [Google Cloud Console](https://console.developers.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Google+ API**
4. En **Credenciales**, crea **OAuth 2.0 Client ID**
5. Agrega `http://localhost:3000/auth/google/callback` en **Authorized redirect URIs**

### Twitter
1. Ve a [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Crea una nueva aplicación
3. En **App settings > Authentication settings**
4. Habilita **OAuth 1.0a**
5. Agrega `http://localhost:3000/auth/twitter/callback` en **Callback URLs**

## 🔄 Flujo de Autenticación OAuth

### 1. Inicio de Sesión
```
Usuario → Click en botón OAuth → Frontend redirige a /auth/{provider}
```

### 2. Autenticación con Proveedor
```
Frontend → /auth/{provider} → Passport redirige a proveedor (Facebook/Google/Twitter)
```

### 3. Callback y Procesamiento
```
Proveedor → /auth/{provider}/callback → Passport procesa datos → Genera JWT → Redirige a dashboard
```

### 4. Dashboard
```
Dashboard recibe token → Decodifica JWT → Muestra información del usuario
```

## 📁 Análisis Detallado de Archivos

### 1. `server/config/oauth.config.js`

**Propósito**: Centralizar la configuración de OAuth para todas las redes sociales.

**Funciones principales**:
- Definir credenciales para cada proveedor
- Configurar URLs de callback
- Establecer configuración de sesiones

**Código clave**:
```javascript
module.exports = {
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  // ... más configuraciones
};
```

### 2. `server/config/passport.js`

**Propósito**: Configurar las estrategias de Passport para cada proveedor OAuth.

**Funciones principales**:
- `generateJWTToken()`: Crear JWT tokens
- `normalizeUser()`: Estandarizar datos de usuario de diferentes proveedores
- Estrategias para Facebook, Google y Twitter

**Código clave**:
```javascript
// Estrategia de Facebook
passport.use(new FacebookStrategy({
  clientID: oauthConfig.facebook.clientID,
  clientSecret: oauthConfig.facebook.clientSecret,
  callbackURL: oauthConfig.facebook.callbackURL,
  profileFields: oauthConfig.facebook.profileFields
}, async (accessToken, refreshToken, profile, done) => {
  // Procesar perfil y normalizar datos
  const user = normalizeUser(profile, 'facebook');
  return done(null, user);
}));
```

### 3. `server/controllers/oauth.controller.js`

**Propósito**: Manejar la lógica de negocio para OAuth.

**Métodos principales**:
- `facebookAuth()`, `googleAuth()`, `twitterAuth()`: Iniciar autenticación
- `facebookCallback()`, `googleCallback()`, `twitterCallback()`: Procesar callbacks
- `getUserInfo()`: Obtener información del usuario
- `logout()`: Cerrar sesión

**Código clave**:
```javascript
static facebookCallback(req, res) {
  if (req.user) {
    const token = generateJWTToken(req.user);
    res.redirect(`/dashboard.html?token=${token}&provider=facebook`);
  } else {
    res.redirect('/login.html?error=facebook_auth_failed');
  }
}
```

### 4. `server/routes/oauth.routes.js`

**Propósito**: Definir las rutas HTTP para OAuth.

**Rutas principales**:
- `GET /auth/facebook` - Iniciar autenticación Facebook
- `GET /auth/facebook/callback` - Callback de Facebook
- `GET /auth/google` - Iniciar autenticación Google
- `GET /auth/google/callback` - Callback de Google
- `GET /auth/twitter` - Iniciar autenticación Twitter
- `GET /auth/twitter/callback` - Callback de Twitter

**Código clave**:
```javascript
router.get('/facebook', 
  OAuthController.facebookAuth,
  passport.authenticate('facebook', { 
    scope: ['email', 'public_profile']
  })
);
```

### 5. `public/js/oauth.js`

**Propósito**: Manejar la interacción del usuario con OAuth en el frontend.

**Clase principal**: `OAuthHandler`

**Métodos principales**:
- `authenticateWithFacebook()`, `authenticateWithGoogle()`, `authenticateWithTwitter()`
- `checkForOAuthToken()`: Verificar token en URL después del callback
- `handleOAuthSuccess()`: Procesar autenticación exitosa
- `decodeJWT()`: Decodificar JWT para obtener información del usuario

**Código clave**:
```javascript
authenticateWithFacebook() {
  this.showLoadingState('facebookBtn', 'Conectando con Facebook...');
  window.location.href = `${this.baseURL}/auth/facebook`;
}
```

## 🎨 Frontend y UI

### Botones de OAuth
Los botones están estilizados con los colores oficiales de cada plataforma:
- **Facebook**: Azul (#1877f2)
- **Google**: Rojo (#db4437)
- **Twitter**: Azul claro (#1da1f2)

### Estados de Interacción
- **Normal**: Color de marca
- **Hover**: Color más oscuro + elevación
- **Loading**: Spinner + texto de carga
- **Disabled**: Opacidad reducida

## 🔒 Seguridad

### JWT Tokens
- **Expiración**: 24 horas
- **Payload**: ID, email, nombre, rol, proveedor
- **Firma**: Usando JWT_SECRET

### Sesiones
- **Duración**: 24 horas
- **Seguridad**: Solo HTTPS en producción
- **Almacenamiento**: En memoria (configurable para Redis en producción)

### Validaciones
- Verificación de tokens en cada request
- Sanitización de datos de usuario
- Manejo de errores de autenticación

## 🚀 Uso y Pruebas

### 1. Iniciar el Servidor
```bash
node server/server.js
```

### 2. Probar OAuth
1. Ve a `http://localhost:3000/login.html`
2. Haz click en cualquier botón de red social
3. Completa la autenticación en el proveedor
4. Serás redirigido al dashboard con tu información

### 3. Verificar Funcionamiento
- Revisa la consola del servidor para logs
- Verifica que el token se guarde en localStorage
- Confirma que la información del usuario se muestre correctamente

## 🐛 Debugging y Troubleshooting

### Errores Comunes

1. **"Invalid OAuth redirect URI"**
   - Verifica que las URLs de callback coincidan exactamente
   - Asegúrate de que el dominio esté autorizado en el proveedor

2. **"Client ID not found"**
   - Verifica que las credenciales estén correctas en `.env`
   - Confirma que la aplicación esté activa en el proveedor

3. **"Callback error"**
   - Revisa los logs del servidor
   - Verifica que las rutas estén correctamente configuradas

### Logs de Debug
El sistema incluye logs detallados:
- `🔵 Iniciando autenticación con...`
- `✅ Usuario autenticado con...`
- `❌ Error en estrategia...`

## 📈 Mejoras Futuras

1. **Base de Datos**: Integrar con MongoDB/PostgreSQL para persistir usuarios
2. **Refresh Tokens**: Implementar renovación automática de tokens
3. **Más Proveedores**: Agregar GitHub, LinkedIn, etc.
4. **Perfiles de Usuario**: Permitir edición de información
5. **Logout Global**: Implementar logout en todos los dispositivos

## 📚 Recursos Adicionales

- [Passport.js Documentation](http://www.passportjs.org/)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
- [JWT.io](https://jwt.io/) - Para debuggear tokens
- [Facebook Login](https://developers.facebook.com/docs/facebook-login/)
- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Twitter OAuth](https://developer.twitter.com/en/docs/authentication/oauth-1-0a)

---

**¡Tu implementación OAuth está lista! 🎉**

Ahora puedes autenticarte con Facebook, Google y Twitter de forma segura y profesional. 