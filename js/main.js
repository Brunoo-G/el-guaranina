/* ============================================================
   EL GUARANINÁ · Comportamiento
   Correo de contacto, menú desplegable, video de portada y
   apariciones al scrollear.
   ============================================================ */

(function(){
  /* ============================================================
     CORREO DE CONTACTO — cambiá esta línea por el correo real.
     ============================================================ */
  var EMAIL = "hola@elguaranina.com.ar";

  var pie = document.getElementById("mail-link-pie");
  if(pie){ pie.href = "mailto:" + EMAIL; pie.textContent = EMAIL; }
  var anio = document.getElementById("anio");
  if(anio){ anio.textContent = new Date().getFullYear(); }

  /* --- El video arranca solo; si el navegador lo frena, queda el póster --- */
  var video = document.querySelector(".video-fondo");
  if(video){
    if(matchMedia("(prefers-reduced-motion: reduce)").matches){
      video.removeAttribute("autoplay");
      video.pause();
    }else{
      var arrancar = function(){
        var intento = video.play();
        if(intento && intento.catch){ intento.catch(function(){}); }
      };
      arrancar();
      document.addEventListener("visibilitychange", function(){
        if(!document.hidden) arrancar();
      });
    }
  }

  /* --- Pantalla de carga y entrada de la portada ---
     La portada empieza a aparecer en el mismo momento en que el negro se
     desvanece, así el texto ya está entrando cuando se descubre. El tope de
     4 segundos es un seguro: si algo tarda de más, la página se muestra igual. */
  var carga = document.getElementById("carga");

  function entrar(){
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ document.body.classList.add("lista"); });
    });
  }

  if(carga){
    var listo = false, desde = Date.now(), MINIMO = 600;
    var descubrir = function(){
      if(listo) return;
      listo = true;
      setTimeout(function(){
        carga.classList.add("fuera");
        entrar();
        setTimeout(function(){
          if(carga.parentNode) carga.parentNode.removeChild(carga);
        }, 700);
      }, Math.max(0, MINIMO - (Date.now() - desde)));
    };
    if(document.readyState === "complete") descubrir();
    else window.addEventListener("load", descubrir);
    setTimeout(descubrir, 4000);
  } else {
    entrar();
  }

  /* --- Español / inglés ---
     Cada elemento traducible lleva su texto en inglés en data-en (o data-en-ph
     para el placeholder y data-en-aria para el aria-label). El original en
     español se guarda la primera vez que se cambia, así se puede volver.
     Para retocar una traducción, editá el data-en al lado del texto. */
  var raiz = document.documentElement;
  var idioma = "es";

  var TEXTOS = {
    es: {
      titulo: "El Guaraniná",
      errorCorreo: "Falta tu correo, o está incompleto. Necesitamos uno válido para poder responderte.",
      enviado: "Abrimos tu programa de correo con el mensaje listo para enviar. Si no se abrió, escribinos a ",
      asunto: "Consulta desde la web",
      campoNombre: "Nombre", campoCorreo: "Correo", sinMensaje: "(sin mensaje)"
    },
    en: {
      titulo: "El Guaraniná — Regenerative livestock farming",
      errorCorreo: "Your email is missing or incomplete. We need a valid one to be able to reply.",
      enviado: "We opened your mail app with the message ready to send. If nothing happened, write to us at ",
      asunto: "Enquiry from the website",
      campoNombre: "Name", campoCorreo: "Email", sinMensaje: "(no message)"
    }
  };

  function traducir(cual){
    idioma = (cual === "en") ? "en" : "es";
    var ingles = idioma === "en";

    document.querySelectorAll("[data-en]").forEach(function(el){
      if(el.dataset.es === undefined) el.dataset.es = el.innerHTML;
      el.innerHTML = ingles ? el.dataset.en : el.dataset.es;
    });
    document.querySelectorAll("[data-en-ph]").forEach(function(el){
      if(el.dataset.esPh === undefined) el.dataset.esPh = el.getAttribute("placeholder") || "";
      el.setAttribute("placeholder", ingles ? el.dataset.enPh : el.dataset.esPh);
    });
    document.querySelectorAll("[data-en-aria]").forEach(function(el){
      if(el.dataset.esAria === undefined) el.dataset.esAria = el.getAttribute("aria-label") || "";
      el.setAttribute("aria-label", ingles ? el.dataset.enAria : el.dataset.esAria);
    });

    raiz.lang = idioma;
    document.title = TEXTOS[idioma].titulo;

    document.querySelectorAll(".lang").forEach(function(b){
      var suyo = b.dataset.idioma === idioma;
      b.classList.toggle("activo", suyo);
      b.setAttribute("aria-pressed", String(suyo));
    });

    try{ localStorage.setItem("guaranina-idioma", idioma); }catch(e){}
  }

  document.querySelectorAll(".lang").forEach(function(b){
    b.addEventListener("click", function(){ traducir(b.dataset.idioma); });
  });

  /* Si ya eligió antes, o si el navegador no está en español, arranca en inglés. */
  var guardado = null;
  try{ guardado = localStorage.getItem("guaranina-idioma"); }catch(e){}
  if(guardado === "en" || guardado === "es"){
    if(guardado === "en") traducir("en");
  }

  /* --- La barra aparece con el primer scroll ---
     Mientras la página está en el tope, la portada se ve limpia. Los 40px de
     margen evitan que la barra parpadee con el rebote del celular. */
  var enTope = null;
  function mirarTope(){
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    var ahora = y < 40;
    if(ahora !== enTope){
      enTope = ahora;
      document.body.classList.toggle("tope", ahora);
    }
  }
  mirarTope();
  window.addEventListener("scroll", mirarTope, { passive:true });

  /* --- Menú desplegable --- */
  var barra = document.getElementById("barra");
  var abrir = document.getElementById("abrir");
  var menu  = document.getElementById("menu");
  var velo  = document.getElementById("velo");

  function cerrar(){
    barra.classList.remove("abierta");
    abrir.setAttribute("aria-expanded","false");
  }
  abrir.addEventListener("click", function(){
    var ab = barra.classList.toggle("abierta");
    abrir.setAttribute("aria-expanded", String(ab));
  });
  menu.addEventListener("click", function(e){ if(e.target.closest("a")) cerrar(); });
  velo.addEventListener("click", cerrar);
  document.addEventListener("keydown", function(e){ if(e.key === "Escape") cerrar(); });

  /* --- Entradas al scrollear ---
     El efecto es de ida y de vuelta: el elemento aparece cuando entra en
     pantalla y se vuelve a guardar cuando sale, con la misma transición. Por
     eso no se deja de observar a ninguno. */
  var obs = new IntersectionObserver(function(entradas){
    entradas.forEach(function(e){
      e.target.classList.toggle("vista", e.isIntersecting);
    });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });
  document.querySelectorAll(".rev, .asientos, .escena").forEach(function(el){ obs.observe(el); });

  /* --- Formulario --- */
  var form  = document.getElementById("form");
  var aviso = document.getElementById("aviso");
  form.addEventListener("submit", function(e){
    e.preventDefault();
    var nombre  = form.nombre.value.trim();
    var email   = form.email.value.trim();
    var mensaje = form.mensaje.value.trim();

    if(!email || email.indexOf("@") < 1 || email.indexOf(".") < 3){
      aviso.hidden = false;
      aviso.className = "aviso err";
      aviso.textContent = TEXTOS[idioma].errorCorreo;
      form.email.focus();
      return;
    }

    var t = TEXTOS[idioma];
    var asunto = t.asunto + (nombre ? " — " + nombre : "");
    var cuerpo = (nombre ? t.campoNombre + ": " + nombre + "\n" : "") +
                 t.campoCorreo + ": " + email + "\n\n" + (mensaje || t.sinMensaje);

    window.location.href = "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent(asunto) + "&body=" + encodeURIComponent(cuerpo);

    aviso.hidden = false;
    aviso.className = "aviso";
    aviso.innerHTML = t.enviado + '<a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.';
  });
})();
