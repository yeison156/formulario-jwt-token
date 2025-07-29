window.fbAsyncInit = function () {
    FB.init({
        appId: 'TU_APP_ID_AQUÍ',  // ⬅️ Reemplaza por tu App ID real de Facebook
        cookie: true,
        xfbml: true,
        version: 'v19.0'
    });
};

(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));



