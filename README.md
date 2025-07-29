# Sistema de Login con JWT

Un sistema completo de autenticación con JWT (JSON Web Tokens) que incluye login, registro y verificación de tokens.

## 🚀 Características

- ✅ Login con email y contraseña
- ✅ Registro de nuevos usuarios
- ✅ Autenticación con JWT
- ✅ Verificación de tokens
- ✅ Interfaz de usuario moderna
- ✅ Dashboard protegido
- ✅ Remember me functionality
- ✅ Validaciones de frontend y backend

## 📋 Requisitos

- Node.js (versión 14 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd formulario-jwt-token
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor**
   ```bash
   npm start
   ```

   O para desarrollo con nodemon:
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 👤 Usuarios de Prueba

El sistema incluye usuarios de prueba predefinidos:

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@example.com | password | admin |
| user@example.com | password | user |

## 📁 Estructura del Proyecto

```
formulario-jwt-token/
├── public/                 # Archivos estáticos del frontend
│   ├── css/               # Estilos CSS
│   ├── js/                # JavaScript del frontend
│   ├── index.html         # Página principal
│   ├── login.html         # Página de login
│   └── dashboard.html     # Dashboard protegido
├── server/                # Backend
│   ├── config/            # Configuración
│   ├── controllers/       # Controladores
│   ├── routes/            # Rutas
│   └── server.js          # Servidor principal
├── package.json
└── README.md
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
JWT_SECRET=tu_secreto_jwt_super_seguro_cambiar_en_produccion
```

### Rutas de la API

- `POST /login` - Iniciar sesión
- `POST /register` - Registrar nuevo usuario
- `GET /verificar-token` - Verificar token JWT

## 🔒 Seguridad

- Las contraseñas se encriptan con bcrypt
- Los tokens JWT tienen expiración de 24 horas
- Validaciones tanto en frontend como backend
- CORS configurado para desarrollo

## 🎨 Personalización

### Estilos CSS

Los estilos se encuentran en:
- `public/css/login.css` - Estilos del login
- `public/css/style.css` - Estilos generales
- `public/css/token.css` - Estilos adicionales

### Configuración del Servidor

El servidor se configura en `server/server.js` y las variables de entorno en `server/config/config.js`.

## 🐛 Solución de Problemas

### El login no funciona

1. Verifica que el servidor esté corriendo en el puerto 3000
2. Asegúrate de que todas las dependencias estén instaladas
3. Revisa la consola del navegador para errores de JavaScript
4. Verifica que las rutas de la API estén funcionando

### Error de CORS

Si tienes problemas de CORS, verifica que el middleware esté configurado correctamente en `server/server.js`.

### Token inválido

Si recibes errores de token inválido:
1. Limpia el localStorage del navegador
2. Verifica que el JWT_SECRET esté configurado
3. Asegúrate de que el token no haya expirado

## 📝 Notas de Desarrollo

- Este es un proyecto de demostración
- En producción, deberías usar una base de datos real
- Cambia el JWT_SECRET por uno más seguro
- Implementa rate limiting para las rutas de autenticación
- Agrega logging para auditoría

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

