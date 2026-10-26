# El Guaraniná

Sitio web de El Guaraniná, establecimiento de ganadería regenerativa en Federal,
Entre Ríos, Argentina.

Es un sitio estático —HTML, CSS y JavaScript— sin framework ni proceso de
compilación. Se abre y se edita directamente.

## Cómo verlo

Doble clic en `index.html`, o desde VS Code con la extensión **Live Server**
(clic derecho sobre `index.html` → *Open with Live Server*), que refresca sola
cada vez que guardás.

Necesita internet para las tipografías, que vienen de Google Fonts. Sin conexión
el sitio funciona igual, pero con las tipografías del sistema.

## Estructura

```
index.html                  la estructura de la página y todos los textos
css/
  01-base.css               variables de color y medida, reset, tipografías
  02-barra.css              header, menú desplegable, conmutador de idioma
  03-portada.css            pantalla de carga, video de fondo y frase de entrada
  04-escena.css             los dibujos del campo
  05-secciones.css          el resto de las secciones, el formulario y el pie
  06-animaciones.css        entradas al cargar y al scrollear
js/
  main.js                   idioma, menú, pantalla de carga, video y formulario
img/                        logotipos, dibujos, iconos y logos de aliados
video/
  portada.mp4               fondo de la portada (1,9 MB, 17 s, sin audio)
  portada-poster.jpg        primer cuadro, se ve mientras carga el video
```

### El CSS va numerado

Los archivos se cargan en orden y **cada uno puede pisar al anterior**. Por eso
van numerados: es el orden de la cascada. Si agregás uno nuevo, sumalo a la lista
de `<link>` del `index.html` y numeralo según dónde tenga que entrar.

Los colores, las medidas y las curvas de animación viven todos en `01-base.css`,
dentro de `:root`. Cambiando un valor ahí cambia toda la página.

## Qué tocar

**El correo de contacto** — `js/main.js`, en las primeras líneas:

```js
var EMAIL = "hola@elguaranina.com.ar";
```

Actualiza el formulario y el enlace del pie de una sola vez. Hoy el formulario
abre el programa de correo del visitante con el mensaje ya armado; si se quiere
que los mensajes lleguen directo a una bandeja, se conecta con Formspree o
similar.

**Los textos** — están todos en el `index.html`. Cada elemento traducible lleva
su versión en inglés al lado, en un atributo `data-en`:

```html
<h2 data-en="Who we are">Quiénes somos</h2>
```

El botón ES | EN de la barra intercambia uno por otro. Para corregir una
traducción se edita ese atributo, sin tocar el JavaScript. Los textos que el
JavaScript escribe solo —los avisos del formulario— están en el objeto `TEXTOS`
de `js/main.js`.

**Sumar una sección** — un `<a>` nuevo en `<nav id="menu">` y una
`<section class="banda" id="...">` con la misma estructura que las demás. El
escalonado de entrada del menú está previsto hasta ocho enlaces.

**Reemplazar un dibujo** — PNG o WebP con fondo transparente. Los que están
vienen recortados y teñidos al color de tinta de la página.

## Publicarlo

Las rutas son relativas, así que el sitio anda igual en la raíz de un dominio o
en un subdirectorio. Alcanza con subir la carpeta entera a GitHub Pages, Netlify,
Vercel o Cloudflare Pages.

## Pendiente

- El correo de contacto real: hoy hay un marcador.
- Fotos propias del campo, para acompañar o reemplazar al video de portada.
