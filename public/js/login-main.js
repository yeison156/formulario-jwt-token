// public/js/login-main.js

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const submitButton = loginForm.querySelector('button[type="submit"]');
  
  // Verificar si ya hay un token guardado
  const tokenGuardado = localStorage.getItem('token');
  if (tokenGuardado) {
    console.log('Token encontrado en localStorage');
    // Opcional: verificar si el token sigue siendo válido
    verificarTokenExistente(tokenGuardado);
  }

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;

    // Validaciones del frontend
    if (!email || !password) {
      mostrarMensaje('Por favor, completa todos los campos', 'error');
      return;
    }

    if (!validarEmail(email)) {
      mostrarMensaje('Por favor, ingresa un email válido', 'error');
      return;
    }

    // Cambiar estado del botón
    const textoOriginal = submitButton.textContent;
    submitButton.textContent = 'Iniciando sesión...';
    submitButton.disabled = true;

    try {
      const respuesta = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Guardar token
        localStorage.setItem('token', datos.token);
        
        // Guardar información del usuario si es necesario
        if (datos.usuario) {
          localStorage.setItem('usuario', JSON.stringify(datos.usuario));
        }

        // Configurar "Remember me"
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberMe');
        }

        mostrarMensaje('✅ Login exitoso! Redirigiendo...', 'success');
        
        // Redirigir después de un breve delay
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1500);

      } else {
        mostrarMensaje(`❌ ${datos.mensaje}`, 'error');
      }
    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      mostrarMensaje('❌ Error de conexión con el servidor', 'error');
    } finally {
      // Restaurar estado del botón
      submitButton.textContent = textoOriginal;
      submitButton.disabled = false;
    }
  });

  // Función para verificar token existente
  async function verificarTokenExistente(token) {
    try {
      const respuesta = await fetch('http://localhost:3000/verificar-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (respuesta.ok) {
        console.log('Token válido, redirigiendo...');
        window.location.href = '/dashboard.html';
      } else {
        // Token inválido, limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    } catch (error) {
      console.error('Error verificando token:', error);
    }
  }

  // Función para validar email
  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Función para mostrar mensajes
  function mostrarMensaje(mensaje, tipo) {
    // Remover mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje');
    if (mensajeAnterior) {
      mensajeAnterior.remove();
    }

    // Crear nuevo mensaje
    const divMensaje = document.createElement('div');
    divMensaje.className = `mensaje ${tipo}`;
    divMensaje.textContent = mensaje;
    divMensaje.style.cssText = `
      padding: 10px;
      margin: 10px 0;
      border-radius: 5px;
      text-align: center;
      font-weight: bold;
      ${tipo === 'success' ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
      ${tipo === 'error' ? 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
    `;

    // Insertar después del formulario
    loginForm.parentNode.insertBefore(divMensaje, loginForm.nextSibling);

    // Remover mensaje después de 5 segundos
    setTimeout(() => {
      if (divMensaje.parentNode) {
        divMensaje.remove();
      }
    }, 5000);
  }
});
