// social.js
export function signUpFacebook() {
    console.log('Click en Facebook');
    alert('Simulando registro con Facebook');
}

export function signUpTwitter() {
    console.log('Click en Twitter');
    alert('Simulando registro con Twitter');
}

document.addEventListener("DOMContentLoaded", () => {
    const facebookBtn = document.getElementById("facebook-btn");
    const twitterBtn = document.getElementById("twitter-btn");

    if (facebookBtn) {
        facebookBtn.addEventListener("click", () => {
            alert("Iniciar sesión con Facebook");
            // Aquí puedes integrar la lógica real de autenticación si lo deseas
        });
    }

    if (twitterBtn) {
        twitterBtn.addEventListener("click", () => {
            alert("Iniciar sesión con Twitter");
        });
    }

    const instagramBtn = document.getElementById("instagram-btn");

    if (instagramBtn) {
        instagramBtn.addEventListener("click", () => {
            alert("Iniciar sesión con Instagram");
        });
    }
    
});


