// main.js
document.addEventListener('DOMContentLoaded', function () {
    console.log('main.js cargado'); // ✅ Esto debe aparecer en consola
    
    // Event listener para el formulario de registro
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Obtener los datos del formulario
            const datos = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                address: document.getElementById('address').value.trim(),
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                terms: document.getElementById('terms').checked
            };

            // ✅ PASO 1: VALIDAR CAMPOS
            const errorValidacion = validarCampos(datos);
            if (errorValidacion) {
                mostrarMensaje(errorValidacion, 'error');
                return;
            }

            // Cambiar estado del botón durante el envío
            const submitBtn = registrationForm.querySelector('button[type="submit"]');
            const textoOriginal = submitBtn.textContent;
            submitBtn.textContent = 'Creando cuenta...';
            submitBtn.disabled = true;

            try {
                // ✅ PASO 2: ENVIAR DATOS AL SERVIDOR
                const respuesta = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });

                const resultado = await respuesta.json();

                if (respuesta.ok) {
                    // ✅ ÉXITO: Mostrar mensaje y redirigir al login
                    mostrarMensaje('✅ ¡Cuenta creada exitosamente! Redirigiendo al login...', 'success');
                    
                    // NO guardar el token del registro - solo ir al login
                    // El usuario deberá hacer login manualmente
                    
                    // Redirigir después de 2 segundos
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 2000);
                } else {
                    // ❌ ERROR DEL SERVIDOR
                    mostrarMensaje(`❌ ${resultado.mensaje || 'Error al crear la cuenta'}`, 'error');
                }

            } catch (error) {
                console.error('❌ Error al registrar:', error);
                mostrarMensaje('❌ Error de conexión con el servidor', 'error');
            } finally {
                // Restaurar estado del botón
                submitBtn.textContent = textoOriginal;
                submitBtn.disabled = false;
            }
        });
    }

    // ✅ FUNCIÓN DE VALIDACIÓN DE CAMPOS
    function validarCampos(datos) {
        const { firstName, lastName, email, address, password, confirmPassword, terms } = datos;

        // Validar campos requeridos
        if (!firstName || !lastName || !email || !address || !password || !confirmPassword) {
            return 'Por favor, completa todos los campos';
        }

        // Validar longitud de nombres
        if (firstName.length < 2 || lastName.length < 2) {
            return 'Los nombres deben tener al menos 2 caracteres';
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Por favor, ingresa un email válido';
        }

        // Validar longitud de contraseña
        if (password.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            return 'Las contraseñas no coinciden';
        }

        // Validar términos y condiciones
        if (!terms) {
            return 'Debes aceptar los términos y condiciones';
        }

        // Si todo está bien, retornar null
        return null;
    }

    // ✅ FUNCIÓN PARA MOSTRAR MENSAJES
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
            padding: 15px;
            margin: 15px 0;
            border-radius: 8px;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            min-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            ${tipo === 'success' ? 'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
            ${tipo === 'error' ? 'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
        `;

        // Insertar en el body
        document.body.appendChild(divMensaje);

        // Remover mensaje después de 5 segundos
        setTimeout(() => {
            if (divMensaje.parentNode) {
                divMensaje.remove();
            }
        }, 5000);
    }
});

