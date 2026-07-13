# DESIGN SYSTEM — Estándares Visuales Reutilizables

> Extraído del proyecto Flujo Base. Paleta, tipografía, espaciado, componentes, animaciones y prompts de branding para IA.

---

## 1. PALETA DE COLORES

### Dark Mode (default)

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-primario` | `#0066FF` | Azul eléctrico — botones, acentos, iconos, links activos |
| `--color-secundario` | `#0052CC` | Azul oscuro — hover states |
| `--color-fondo` | `#0A0A0F` | Negro — fondo general |
| `--color-fondo-footer` | `#060609` | Negro profundo — footer |
| `--color-superficie` | `#12121A` | Gris oscuro — tarjetas, secciones alternas |
| `--color-texto-principal` | `#F0F0F5` | Blanco suave — texto primario |
| `--color-texto-secundario` | `#9090A0` | Gris metálico — texto secundario, labels |
| `--color-borde` | `#2A2A35` | Gris oscuro — bordes de tarjetas e inputs |
| `--color-acento` | `#00D4FF` | Cian — detalles puntuales, métricas, glow |
| `--color-exito` | `#28a745` | Verde — mensajes de éxito |
| `--color-error` | `#dc3545` | Rojo — mensajes de error |

### Light Mode (alternativa)

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-fondo` | `#FFFFFF` | Blanco — fondo general |
| `--color-superficie` | `#F5F5FA` | Gris claro — tarjetas |
| `--color-texto-principal` | `#0A0A0F` | Negro — texto primario |
| `--color-texto-secundario` | `#6B6B80` | Gris — texto secundario |
| `--color-borde` | `#E0E0E8` | Gris claro — bordes |
| `--color-primario` | `#0066FF` | Mismo azul eléctrico |

### Paleta por categoría

| Categoría | Background | Texto | Borde |
|-----------|-----------|-------|-------|
| IA | `rgba(0, 102, 255, 0.3)` | `#4D94FF` | `rgba(0, 102, 255, 0.5)` |
| Automatización | `rgba(0, 212, 255, 0.2)` | `#00D4FF` | `rgba(0, 212, 255, 0.4)` |
| Desarrollo | `rgba(40, 167, 69, 0.2)` | `#5CB85C` | `rgba(40, 167, 69, 0.4)` |
| Datos | `rgba(255, 193, 7, 0.2)` | `#FFC107` | `rgba(255, 193, 7, 0.4)` |
| Consultoría | `rgba(220, 53, 69, 0.2)` | `#DC3545` | `rgba(220, 53, 69, 0.4)` |

---

## 2. TIPOGRAFÍA

### Fuentes

| Rol | Fuente | Pesos | Uso |
|-----|--------|-------|-----|
| **Principal** | Poppins | 300, 400, 500, 600, 700 | Body, labels, inputs, párrafos |
| **Secundaria** | Space Grotesk | 400, 500, 600, 700 | Headings (h1, h2, h3), logo, títulos de sección |

### Escala de tamaños

| Elemento | Desktop | Tablet | Móvil |
|----------|---------|--------|-------|
| `h1` | `3.5rem` (56px) | `2.5rem` (40px) | `2.2rem` (35px) |
| `h2` | `2.5rem` (40px) | `2rem` (32px) | `2rem` (32px) |
| `h3` | `1.5rem` (24px) | `1.3rem` (21px) | `1.2rem` (19px) |
| Body | `1rem` (16px) | `1rem` | `1rem` |
| Subtítulo | `1.1rem` (18px) | `1rem` | `0.95rem` |
| Tags/pills | `0.7rem` - `0.75rem` | `0.7rem` | `0.7rem` |
| Labels | `0.8rem` - `0.9rem` | `0.85rem` | `0.85rem` |
| Small | `0.85rem` | `0.85rem` | `0.8rem` |

### Line-height

- Headings: `1.1` - `1.2`
- Body: `1.6`
- Párrafos largo: `1.8`

### Letter-spacing

- Tags uppercase: `0.5px`
- Labels: `0.3px` - `0.5px`
- Inputs: `0.2px`

---

## 3. SISTEMA DE ESPACIADO

### Variables

```css
--espaciado-seccion: 80px;        /* Padding vertical de cada sección */
--espaciado-card: 2rem;            /* Padding interno de tarjetas */
--espaciado-container: 0 20px;     /* Padding del contenedor max-width */
```

### Valores estándar

| Uso | Valor |
|-----|-------|
| Sección completa | `padding: 130px 0 80px` (desktop) / `100px 0 50px` (móvil) |
| Container max-width | `1100px` |
| Gap entre cards | `1.5rem` - `2rem` |
| Gap entre elementos hijos | `0.5rem` - `1.5rem` |
| Margin-bottom de sección título | `1rem` - `3rem` |
| Padding de card | `1.5rem` - `2rem` |
| Padding de modal | `1.5rem 2rem` |

---

## 4. SOMBRAS Y EFECTOS

```css
--sombra-glow: 0 0 15px rgba(0, 102, 255, 0.4);        /* Glow azul sutil */
--sombra-card: 0 5px 15px rgba(0, 0, 0, 0.3);           /* Sombra de tarjeta */
--sombra-card-hover: 0 10px 25px rgba(0, 102, 255, 0.15); /* Hover con tint azul */
```

### Overlay de fondo

```css
body::before {
    background-color: rgba(10, 10, 15, 0.88);  /* 88% opacidad */
}
```

### Backdrop blur

- Header: `backdrop-filter: blur(10px)`
- Modal backdrop: `backdrop-filter: blur(6px)`

---

## 5. BORDES Y RADIO

```css
--border-radius-card: 10px;       /* Tarjetas, secciones, inputs */
--border-radius-boton: 50px;      /* Botones fully rounded */
--border-radius-pill: 20px;       /* Tags, pills, filtros */
--border-radius-icon: 12px;       /* Iconos de contacto */
```

---

## 6. COMPONENTES

### Botón primario

```css
.btn {
    display: inline-block;
    padding: 12px 28px;
    background-color: var(--color-primario);
    color: #fff;
    border-radius: 50px;
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}
.btn:hover {
    background-color: var(--color-secundario);
    transform: translateY(-2px);
    color: #fff;
}
```

### Botón outline

```css
.btn-outline {
    background-color: transparent;
    border: 1px solid var(--color-primario);
    color: var(--color-primario);
}
.btn-outline:hover {
    background-color: var(--color-primario);
    color: #fff;
}
```

### Botón pequeño

```css
.btn-sm {
    padding: 8px 20px;
    font-size: 0.85rem;
}
```

### Tarjeta base

```css
.card {
    background-color: var(--color-superficie);
    border: 1px solid var(--color-borde);
    border-radius: 10px;
    padding: 2rem;
    transition: transform 0.3s ease, border-color 0.3s ease;
}
.card:hover {
    transform: translateY(-5px);
    border-color: var(--color-primario);
}
```

### Tarjeta con imagen (portfolio/blog)

```css
.card-img {
    overflow: hidden;
    border-radius: 10px;
}
.card-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}
.card-img:hover img {
    transform: scale(1.08);
}
```

### Overlay con info

```css
.overlay {
    background: linear-gradient(
        to top,
        rgba(6, 6, 9, 0.95) 0%,
        rgba(6, 6, 9, 0.7) 40%,
        rgba(6, 6, 9, 0.3) 100%
    );
    opacity: 0;
    transition: opacity 0.35s ease;
}
.card:hover .overlay { opacity: 1; }
```

### Category pill

```css
.category-pill {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 5px 14px;
    border-radius: 20px;
}
```

### Input de formulario

```css
input, textarea, select {
    width: 100%;
    padding: 12px;
    background-color: var(--color-superficie);
    border: 1px solid var(--color-borde);
    border-radius: 8px;
    color: var(--color-texto-principal);
    font-family: 'Poppins', sans-serif;
    font-size: 0.95rem;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
input:focus {
    outline: none;
    border-color: var(--color-primario);
    box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15);
}
```

### Título de sección

```css
.section-title {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-family: 'Space Grotesk', sans-serif;
}
.section-title::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background-color: var(--color-primario);
    margin: 0.5rem auto 0;
    border-radius: 2px;
}
```

### Subtítulo de sección

```css
.section-subtitle {
    text-align: center;
    color: var(--color-texto-secundario);
    font-size: 1.1rem;
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}
```

### Header fijo

```css
header {
    background-color: rgba(10, 10, 15, 0.9);
    backdrop-filter: blur(10px);
    padding: 1rem 0;
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}
header.scrolled {
    background-color: var(--color-fondo);
    padding: 0.7rem 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}
```

### Footer

```css
footer {
    background-color: var(--color-fondo-footer);
    padding: 3rem 0 1.5rem;
    border-top: 1px solid var(--color-borde);
}
.footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 2rem;
}
```

---

## 7. GRID Y RESPONSIVE

### Breakpoints

| Nombre | Rango | Uso |
|--------|-------|-----|
| Móvil | `< 768px` | Stack vertical, 1 columna |
| Tablet | `769px - 1024px` | 2-3 columnas |
| Desktop | `> 1024px` | Layout completo |

### Grids estándar

| Componente | Desktop | Tablet | Móvil |
|-----------|---------|--------|-------|
| Hero | `1fr 1fr` | `1fr` | `1fr` |
| Pilares (5) | `repeat(5, 1fr)` | `repeat(3, 1fr)` | `repeat(2, 1fr)` |
| Valores (4+) | `repeat(4, 1fr)` | `repeat(2, 1fr)` | `1fr` |
| Servicios | `repeat(auto-fit, minmax(300px, 1fr))` | `repeat(auto-fit, minmax(280px, 1fr))` | `1fr` |
| Portfolio | `repeat(auto-fit, minmax(340px, 1fr))` | `repeat(auto-fit, minmax(280px, 1fr))` | `1fr` |
| Blog | `repeat(auto-fit, minmax(300px, 1fr))` | `repeat(auto-fit, minmax(280px, 1fr))` | `1fr` |
| Contacto | `1fr 1.2fr` | `1fr` | `1fr` |
| Footer | `2fr 1fr 1fr 1fr` | `1fr 1fr` | `1fr` |

---

## 8. ANIMACIONES

### Fade-in (scroll)

```css
.fade-in {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}
```

### Modal slide-in

```css
@keyframes modalSlideIn {
    from { opacity: 0; transform: translateY(30px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}
```

### Skeleton shimmer

```css
@keyframes skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
.skeleton-pulse {
    background: linear-gradient(90deg, var(--color-superficie) 25%, var(--color-borde) 50%, var(--color-superficie) 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s ease-in-out infinite;
}
```

### Hover lift

```css
/* Todos los cards usan este patrón */
.card:hover {
    transform: translateY(-5px a -10px);
    border-color: var(--color-primario);
    box-shadow: var(--sombra-card-hover);
}
```

---

## 9. IMÁGENES DE FONDO

### Imagen global con overlay

```css
body {
    background-image: url('tu-imagen.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
}
body::before {
    content: '';
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background-color: rgba(10, 10, 15, 0.88);
    pointer-events: none;
    z-index: -1;
}
```

### Recomendaciones de imagen de fondo

- Resolución mínima: `1920x1080px`
- Formato: WebP preferido, JPG como fallback
- Estilo: Abstracto, tecnológico, gradientes oscuros, partículas, circuitos
- Colores: Tono oscuro (azul/negro) para que el overlay funcione bien

---

## 10. ESTILOS VISUALES

### Personalidad del diseño

| Atributo | Descripción |
|----------|-------------|
| **Estilo** | Minimalista, tecnológico, futurista, elegante |
| **Tono** | Profesional sin ser frío, cercano sin ser informal |
| **Sensación** | Limpio, ordenado, premium, confiable |
| **Referencia** | Dashboards SaaS modernos, fintech, startups tech |

### Reglas visuales

1. **Fondo oscuro siempre** — Las tarjetas se diferencian con `--color-superficie` (un gris muy sutil)
2. **Un solo color de acento** — Azul eléctrico `#0066FF` para todo lo interactivo
3. **Bordes sutiles** — `1px solid var(--color-borde)` en todas las tarjetas
4. **Hover lift** — Todos los cards suben `5px-10px` en hover
5. **Bordes redondeados suaves** — `10px` para cards, `50px` para botones, `20px` para pills
6. **Texto secundario en gris** — Nunca blanco puro para párrafos
7. **Iconos en color primario** — Siempre `var(--color-primario)` para iconos
8. **Overlay oscuro en imágenes** — `88%` opacidad para legibilidad del texto
9. **Transiciones suaves** — `0.3s ease` para la mayoría de transiciones
10. **Fade-in en scroll** — Todos los bloques aparecen al hacer scroll

---

## 11. PROMPTS PARA IA — BRANDING Y PROTOTIPOS VISUALES

### Prompt maestro de proyecto

```
Crea un diseño web profesional para una empresa de tecnología llamada [NOMBRE].
Estilo minimalista, futurista, elegante. Tema oscuro.
Paleta: azul eléctrico #0066FF como acento, fondo negro #0A0A0F,
texto blanco suave #F0F0F5, gris metálico #9090A0 para texto secundario.
Tipografía: sans-serif moderna (Poppins o similar).
Las tarjetas tienen bordes sutiles #2A2A35 y fondo #12121A.
Los botones son fully rounded (border-radius: 50px).
Los hover effects elevan las tarjetas con sombra azul sutil.
El hero tiene imagen de fondo con overlay oscuro al 88%.
Los iconos son azules. El estilo recuerda a dashboards SaaS premium.
```

### Prompt para logo

```
Diseña un logo minimalista para "Flujo Base", empresa de transformación digital.
Estilo geométrico, moderno, tecnológico.
Colores: azul eléctrico #0066FF sobre fondo negro #0A0A0F.
El logo debe funcionar en tamaño pequeño (favicon) y grande.
Forma: circular o cuadrada con esquinas redondeadas.
Sin texto dentro del logo (solo ícono/símbolo).
Estilo similar a logos de empresas SaaS o fintech.
```

### Prompt para imagen de hero

```
Genera una imagen abstracta tecnológica para el hero de un sitio web.
Estilo: partículas, circuitos, datos fluyendo, redes de conexión.
Colores dominantes: azul eléctrico #0066FF, cian #00D4FF, negro #0A0A0F.
La imagen debe ser apta para poner un overlay oscuro encima y que el texto sea legible.
Resolución: 1920x1080px.
Estilo: futurista, limpio, no saturado.
```

### Prompt para imagen de fondo global

```
Crea una textura abstracta tecnológica para fondo de sitio web.
Estilo: gradientes oscuros sutiles, partículas dispersas, patrones geométricos tenues.
Colores: tonos de negro #0A0A0F a gris oscuro #12121A con destellos azules #0066FF muy sutiles.
La textura debe ser repetible o cubrir 1920x1080px.
No debe tener elementos centrales (se cubre con overlay).
```

### Prompt para tarjetas de servicios

```
Diseña una tarjeta de servicio para una empresa de IA y automatización.
Fondo oscuro #12121A, borde sutil #2A2A35, border-radius: 10px.
Icono grande azul #0066FF arriba al centro.
Título en blanco #F0F0F5, descripción en gris #9090A0.
Botón small outlined azul abajo.
Hover: elevación 10px con sombra azul sutil.
Estilo minimalista, tecnológico.
```

### Prompt para hero con dos columnas

```
Diseña un hero section de sitio web con layout de dos columnas.
Izquierda: título grande "Transformamos procesos. Impulsamos resultados." con la segunda parte en azul #0066FF.
Debajo un párrafo descriptivo en gris #9090A0.
Dos botones: uno azul sólido #0066FF y uno outline azul.
Derecha: imagen tecnológica o ilustración abstracta.
Fondo: imagen oscura con overlay al 88%.
Estilo: minimalista, elegante, SaaS.
```

### Prompt para navbar

```
Diseña una barra de navegación fija en la parte superior.
Fondo: negro semitransparente rgba(10, 10, 15, 0.9) con backdrop-blur.
Logo circular con glow azul a la izquierda.
Nombre "Flujo Base" en azul #0066FF.
Links de navegación en blanco #F0F0F5, hover en azul.
Indicador de página activa: línea azul debajo del link.
Estilo: limpio, minimalista, responsive.
```

### Prompt para footer

```
Diseña un footer de sitio web con 4 columnas.
Columna 1: logo circular + nombre + descripción en gris.
Columna 2: links de servicios.
Columna 3: links de empresa.
Columna 4: iconos de redes sociales (LinkedIn, GitHub, Facebook, Instagram, YouTube) en círculos con borde gris.
Fondo: negro profundo #060609.
Borde superior sutil #2A2A35.
Fila inferior: copyright + tagline en cursiva.
```

### Prompt para sección nosotros

```
Diseña una sección "Sobre Nosotros" con layout de dos columnas.
Izquierda: foto circular con borde azul #0066FF y glow.
Derecha: título "Quiénes Somos" seguido de 3 párrafos.
Debajo: 2 tarjetas de Misión y Visión con borde izquierdo azul.
Más abajo: sección "El Fundador" con foto, nombre, cargo y redes sociales.
Estilo: corporativo, cercano, profesional.
```

### Prompt para blog cards

```
Diseña cards de blog para un centro educativo de tecnología.
Cada card tiene: imagen de portada (altura 220px, object-fit cover),
pill de categoría arriba a la izquierda (ej: "IA" en azul),
fecha, título, descripción breve en gris, tags como pills pequeñas.
Hover: elevación 5px + borde azul.
Fondo de card: #12121A, borde: #2A2A35, border-radius: 10px.
Estilo limpio, moderno, fácil de escanear.
```

### Prompt para formulario de contacto

```
Diseña un formulario de contacto en layout de dos columnas.
Izquierda: información de contacto con iconos azules (email, WhatsApp, horario).
Derecha: formulario con campos de nombre, email, tipo de negocio (select),
servicio de interés (select), mensaje (textarea), botón azul "Enviar".
Inputs: fondo #12121A, borde #2A2A35, focus con glow azul.
Estilo: limpio, funcional, confiable.
```

### Prompt para modal de blog

```
Diseña un modal emergente para vista previa de artículo de blog.
Fondo oscuro con backdrop-blur.
Contenedor: max-width 800px, border-radius 10px, fondo #0A0A0F.
Cover image arriba (300px de altura).
Debajo: fecha, título grande, descripción, tags pills.
Footer con botón "Leer Artículo" (azul) y "Cerrar" (outline).
Animación: slide-in desde abajo con scale 0.97 → 1.
```

### Prompt para página de servicios

```
Diseña una página de servicios con 5 tarjetas en grid responsive.
Cada tarjeta: icono grande azul, título, descripción en gris, tags pills pequeños.
Hover: elevación 10px con sombra azul.
Sección alternada con fondo #12121A.
Título de sección con línea decorativa azul debajo.
Estilo: profesional, tecnológico, inspira confianza.
```

### Prompt para casos de éxito

```
Diseña una galería de casos de éxito con overlay hover.
Cada item: imagen (280px), overlay gradiente oscuro que aparece en hover.
Dentro del overlay: pill de categoría, título, descripción, métrica en cian #00D4FF.
Hover: imagen hace scale 1.08, overlay opacity 0 → 1.
Estilo: portfolio premium, inspirador.
```

### Prompt para página 404

```
Diseña una página de error 404 minimalista.
Fondo oscuro #0A0A0F.
Número "404" grande en azul #0066FF con glow.
Mensaje: "Página no encontrada" en blanco.
Botón outline azul "Volver al Inicio".
Estilo limpio, elegante, sin elementos innecesarios.
```

---

## 12. CHECKLIST DE DISEÑO PARA NUEVOS PROYECTOS

- [ ] Paleta definida (máximo 7 colores + variaciones)
- [ ] Tipografía elegida (1 principal + 1 secundaria)
- [ ] Variables CSS configuradas en `:root`
- [ ] Container max-width definido (`1100px`)
- [ ] Sistema de espaciado establecido
- [ ] Componentes base: botón, card, input, pill, navbar, footer
- [ ] Breakpoints responsive: móvil (<768), tablet (769-1024), desktop (>1024)
- [ ] Animaciones: fade-in scroll, hover lift, modal slide-in
- [ ] Overlay en imágenes de fondo (88% opacidad)
- [ ] Imagen de fondo: 1920x1080px, estilo abstracto/tecnológico
- [ ] Logo en formato circular con glow
- [ ] Favicon configurado
- [ ] SEO: meta tags, JSON-LD, sitemap, robots.txt
- [ ] Seguridad: CSP headers, SRI hashes, DOMPurify
- [ ] Accesibilidad: skip-to-content, aria-labels, contraste WCAG AA
