/* Datos de demostración: ubicaciones, productos y vendedores no representan un padrón real. */
const UBICACIONES = [
  "Bermejal", "Cabrera", "Capadocia", "Cubia", "El Bosque", "Fuchatoque", "Juan Gordo",
  "Madrid", "Manta Grande Abajo", "Manta Grande Arriba", "Minas", "Palmar Abajo",
  "Palmar Arriba", "Palogordo", "Peñas", "Quimbita", "Salgado", "Salitre", "Centro o casco urbano"
];

let productos = [
  {id:1, nombre:"Panela orgánica", categoria:"Alimentos", ubicacion:"Bermejal", vendedor:"Trapiche enramada de Bermejal", rating:"★ 4.8", precio:"$8.000 libra", desc:"Panela artesanal molida en trapiche familiar, sin químicos añadidos.",
    imgs:["https://upra.gov.co/sites/default/files/styles/webp/public/2025-04/La%20panela%20colombiana%20conquista%20paladares%20en%20todo%20el%20mundo.jpg.webp?itok=z5_-ylRC"]},
  {id:2, nombre:"Ruana de lana virgen", categoria:"Artesanías", ubicacion:"Palmar Arriba", vendedor:"Doña Rosa Tejidos", rating:"★ 4.9", precio:"$385.000", desc:"Tejida a mano con técnicas heredadas de generación en generación.",
    imgs:["https://static.wixstatic.com/media/478bee_2029d26aec7447bc953625b8c61f0747~mv2.jpg/v1/fill/w_480,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/478bee_2029d26aec7447bc953625b8c61f0747~mv2.jpg"]},
  {id:3, nombre:"Recorrido a la laguna", categoria:"Turismo", ubicacion:"Palmar Arriba", vendedor:"Guías Manta Rural", rating:"★ 4.7", precio:"$35.000 p/persona", desc:"Caminata ecológica de 2 horas con guía certificado, incluye refrigerio campesino.",
    imgs:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrJwr4f69e0bwk_ItoluDt4Xm3Sp6gwCq2tT5AXt7oa-S0LKVWdeHGSw_8&s=10",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAMXlmiG6SPpKH27zU4qTMMoWOfQBIfdVB6g1ip4kiVw&s=10",
          "https://s0.wklcdn.com/image_246/7382818/128231972/81823917.700x525.jpg",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJcWmf8330qUcqK5ZGYIa-dfsky3imeLk180CNHeHo-A&s=10"]},
  {id:4, nombre:"Transporte veredal", categoria:"Servicios", ubicacion:"Manta Grande Abajo", vendedor:"Don Efraín", rating:"★ 4.6", precio:"Según destino", desc:"Servicio de transporte entre veredas y casco urbano, disponible todos los días.",
    imgs:["https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=500"]},
  {id:5, nombre:"Taller de tejido artesanal", categoria:"Servicios", ubicacion:"Salitre", vendedor:"Claudia Mendez", rating:"★ 4.9", precio:"$25.000", desc:"Taller de 2 horas para aprender técnicas básicas de tejido.",
    imgs:["https://elpilon2024.s3.us-west-2.amazonaws.com/2024/05/foto-mochila.jpg"]},
  {id:6, nombre:"Hotel boutique Corazón del Cielo", categoria:"Servicios", ubicacion:"Centro o casco urbano", vendedor:"Hotel Boutique Corazón del Cielo", rating:"★ 4.8", precio:"$60.000 noche", desc:"Hospedaje boutique campestre con desayuno incluido, ideal para turistas.",
    imgs:["https://hotelboutiquecorazondelcielo.com/wp-content/uploads/2026/03/39af9076-674b-43e9-9229-490facb7da22-1-768x1024.jpg",
          "https://hotelboutiquecorazondelcielo.com/wp-content/uploads/2026/03/PHOTO-2026-03-28-12-12-09-683x1024.jpg",
          "https://hotelboutiquecorazondelcielo.com/wp-content/uploads/2026/03/c553d869-3c8f-4f88-96da-81906413726a-1005x1536.jpg"]},
  {id:7, nombre:"Caminata a la quebrada (Cascada El Golpe)", categoria:"Turismo", ubicacion:"Quimbita", vendedor:"Guías Manta Rural", rating:"★ Nuevo", precio:"$20.000 p/persona", desc:"Caminata guiada por senderos rurales hasta la cascada El Golpe, con acompañamiento durante todo el recorrido.",
    imgs:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIel6GjfYuNLLNkLYOa9UwHcVSEVhU347m1jEqfYLFLw&s=10",
          "https://caminatasalairelibre.com/wp-content/uploads/2023/06/20-Caminata-Cascada-El-Golpe.jpg"]},
  {id:8, nombre:"Ternero bovino de levante", categoria:"Animales", subcategoria:"Bovinos", ubicacion:"Juan Gordo", vendedor:"Finca Los Alpes", rating:"★ 4.5", precio:"$3.500.000", desc:"Precio negociable. Ternero sano, vacunado y desparasitado, listo para levante.",
    imgs:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpL5Yuj33iIrl-OuVTPyoAYsG2XhkygtFcZ7gXMtS6sw&s=10"]},
  {id:9, nombre:"Panadería La Espiga Dorada", categoria:"Emprendimientos", subcategoria:"Panadería", ubicacion:"Capadocia", vendedor:"La Espiga Dorada", rating:"★ 4.9", precio:"Desde $2.000", desc:"Pan campesino, almojábanas y pan de queso recién horneados cada mañana.",
    imgs:["https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&q=80&w=500"]},
  {id:10, nombre:"Mazorcas frescas del agro", categoria:"Productos del agro", subcategoria:"Mazorca y cereales", ubicacion:"Minas", vendedor:"Cultivos El Manantial", rating:"★ 4.7", precio:"$3.000 unidad", desc:"Mazorca recién cosechada, cultivada sin químicos en la vereda.",
    imgs:["https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=500"]},
  {id:11, nombre:"Festival de gallina con arepa", categoria:"Eventos", ubicacion:"Centro o casco urbano", vendedor:"Alcaldía de Manta", rating:"★ Nuevo", precio:"Entrada libre", desc:"Festival gastronómico comunitario con concurso de la mejor gallina con arepa, música en vivo y venta de emprendimientos locales.",
    fechaEvento: (()=>{ const f=new Date(); f.setDate(f.getDate()+12); return f.toISOString().slice(0,10); })(),
        imgs:["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtelTs7T5aS5aMAf3G2BMTfUoet7JOBOFbsxmXOwSe4A&s=10",
          "https://elobservador.com.co/wp-content/uploads/2025/10/560654982_1125835319738366_8795887400586422448_n-768x1024.jpg",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgy3S-YNtn90e1YTIEPIFq4TW-EanaPkVoR2Qinuoxeg&s=10"]},
  {id:12, nombre:"Jornada de reciclaje veredal", categoria:"Eventos", ubicacion:"El Bosque", vendedor:"Alcaldía de Manta", rating:"★ Nuevo", precio:"Entrada libre", desc:"Jornada comunitaria de reciclaje y limpieza de las veredas — este ya pasó, es de ejemplo para mostrar que los eventos vencidos se quitan solos.",
    fechaEvento: (()=>{ const f=new Date(); f.setDate(f.getDate()-3); return f.toISOString().slice(0,10); })(),
    imgs:["https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=500"]},
];
productos.forEach(p=>{ p.img = p.imgs[0]; }); // portada = primera foto, para no romper las tarjetas del catálogo
// Reglas de vigencia y subcategorías usadas por el formulario de publicación.
const CATEGORIAS = {
  "Alimentos":        {dias:{min:1, max:60}, subcategorias:null},
  "Artesanías":       {dias:{min:1, max:90}, subcategorias:null},
  "Turismo":          {dias:{min:1, max:60}, subcategorias:null},
  "Servicios":        {dias:{min:1, max:90}, subcategorias:null},
  "Animales":         {dias:{min:1, max:7},  subcategorias:["Bovinos","Porcinos","Avícolas","Otros"]},
  "Emprendimientos":  {dias:{min:1, max:60}, subcategorias:["Gastronómico","Artesanías","Lácteos","Panadería","Cárnicos","Otros"]},
  "Productos del agro":{dias:{min:1, max:30}, subcategorias:["Frutas","Verduras","Tubérculos","Mazorca y cereales","Otros"]},
  "Eventos":          {esEvento:true, subcategorias:null} // se publican con una fecha puntual y se borran solos al pasar
};
/* Estado temporal de navegación y formularios. La persistencia local se concentra más abajo. */
let categoriaActiva = "Todos";
let categoriasFiltroAvanzado = []; // filtros avanzados: varias categorías a la vez
let subtipoFiltroAvanzado = ''; // búsqueda específica dentro de esas categorías (ej. "Bovinos")
let ubicacionFiltroActiva = '';
let sesionActiva = false;
let favoritos = new Set();
let vendedoresRating = {}; // {nombreVendedor:{suma,count}} — calificación real, acumulada por reseñas
let ultimaRutaNoDetalle = 'home'; // recuerda si veníamos del catálogo o de servicios, para que "Volver" regrese ahí
let rutaOrigenPerfilVendedor = 'home';
const scrollPorRuta = new Map();
let misPublicaciones = productos.slice(0,2).map(p=>({...p})); // copia editable, independiente del catálogo general
(function demoVencimientos(){ // ejemplo: una publicación ya vencida y otra vigente, para mostrar ambos estados
  const haceCinco = new Date(); haceCinco.setDate(haceCinco.getDate()-5);
  const enDiez = new Date(); enDiez.setDate(enDiez.getDate()+10);
  if(misPublicaciones[0]){ misPublicaciones[0].duracionDias = 20; misPublicaciones[0].vigenteHasta = haceCinco.toISOString().slice(0,10); }
  if(misPublicaciones[1]){ misPublicaciones[1].duracionDias = 20; misPublicaciones[1].vigenteHasta = enDiez.toISOString().slice(0,10); }
})();
let idEnEdicion = null;
let origenEdicion = null; // 'mis' | 'catalogo' — para saber dónde guardar al editar (el admin puede editar publicaciones ajenas)
let fotosPreview = []; // URLs de las fotos del formulario (máx. 5)
let perfilUsuario = {nombre:"Pepito Pérez Pérez", telefono:"300 000 0000", correo:"user@mail.com", vereda:"El Salitre", instagram:"", facebook:"", tiktok:""};

/* ---------- Admin (simulación) ---------- */
const ADMIN_CORREO = 'admin@mail.com', ADMIN_PASS = 'admin';
let adminActivo = false;
let cuentasPendientes = [
  {id:1, nombre:'Marleny Torres', vereda:'Vereda El Salitre', fecha:'2026-09-24'},
  {id:2, nombre:'Carlos Rodríguez', vereda:'Barrio Centro', fecha:'2026-09-25'},
  {id:3, nombre:'Yesenia Gómez', vereda:'Vereda La Cabaña', fecha:'2026-09-26'},
];
cuentasPendientes = cargarJSON('mantalink-cuentas-pendientes', cuentasPendientes);
let cuentasVerificadas = cargarJSON('mantalink-cuentas-verificadas', []);
let perfilesCuentas = cargarJSON('mantalink-perfiles-cuentas', {});
let correoSesion = '';
let cuentaVerificada = false;
let carTimer = null, carIndex = 0; // estado del carrusel de fotos del detalle
let miUltimaCalificacion = {}; // {vendedor: estrellas} — mi propio voto, para no acumular infinito al reclicar
let reportes = []; // {id, productoId, nombre, motivo, comentario, fecha}
// Indicadores de ejemplo: los avances no se calculan desde registros reales.
const INDICADORES_BSC = [
  {perspectiva:'Financiera', indicador:'Productores vinculados', valor:'32', meta:'Meta: 50 productores / año', avance:64, estado:'64% de avance anual'},
  {perspectiva:'Clientes', indicador:'Satisfacción de usuarios', valor:'76%', meta:'Meta: mínimo 70%', avance:100, estado:'Meta superada'},
  {perspectiva:'Procesos internos', indicador:'Tiempo para publicar', valor:'8 min', meta:'Meta: máximo 10 min', avance:100, estado:'Dentro de la meta'},
  {perspectiva:'Aprendizaje y crecimiento', indicador:'Capacitaciones realizadas', valor:'3 de 4', meta:'Meta: 4 capacitaciones / año', avance:75, estado:'75% de avance anual'},
];

function limpiarEventosVencidos(){
  // "se borran automáticamente": al pasar la fecha, el evento desaparece del catálogo
  const hoy = new Date().toISOString().slice(0,10);
  productos = productos.filter(p => !(p.categoria==='Eventos' && p.fechaEvento && p.fechaEvento < hoy));
  misPublicaciones = misPublicaciones.filter(p => !(p.categoria==='Eventos' && p.fechaEvento && p.fechaEvento < hoy));
}

const I18N = {
  es:{navInicio:"Inicio",navServicios:"Servicios",navAyuda:"Ayuda",navVender:"Publicar",navPerfil:"Perfil",navIngresar:"Ingresar",
      heroTitle:"¿Qué necesitas encontrar hoy en Manta?",buscarPh:"Buscar producto o servicio…",
      destacados:"Destacados esta semana",misProductos:"Mis publicaciones",volver:"← Volver al catálogo",
      serviciosTitle:"Servicios comunitarios",serviciosDesc:"Además de productos, en MantaLink puedes ofrecer o encontrar servicios como transporte, talleres y hospedaje rural.",
      ayudaTitle:"Centro de ayuda",loginTitle:"Ingresar a tu cuenta",loginDesc:"Para publicar y gestionar tus productos.",
      cerrarSesion:"Cerrar sesión",cfgTitle:"Configuración",cfgTheme:"Tema de color",cfgThemeManta:"Manta",
      cfgThemeOscuro:"Modo oscuro",cfgThemeClasico:"Verde clásico",cfgTextSize:"Tamaño de letra",cfgNormal:"Normal",
      cfgGrande:"Grande",cfgLang:"Idioma",skipLink:"Saltar al contenido",
      cfgA11y:"Accesibilidad",cfgA11yFab:"Botón flotante \"A+\" para agrandar la letra",
      ctaVender:"+ Publicar producto o servicio",ctaVenderSub:"Publica lo que ofreces en menos de un minuto.",
      cfgNote:"Estas preferencias se guardan en este dispositivo. La traducción completa del contenido aún está en desarrollo; por ahora se traduce la navegación principal.",
      soloResidentes:"Debes iniciar sesión (solo habitantes de Manta pueden hacerlo)",
      volverVender:"← Volver a mis publicaciones",publicarTitle:"Publicar producto o servicio",editarTitle:"Editar producto o servicio",
      guardarCambios:"Guardar cambios",subirFoto:"Toca para subir una foto",mercaderLbl:"Mercader:",tipoLbl:"Producto",
      nombreProductoLbl:"Nombre del producto",nombreProductoPh:"Ej: Panela orgánica",precioLbl:"Precio",precioPh:"Ej: $8.000 libra",
      fechaLbl:"Publicar hasta",infoLbl:"Información sobre el producto",infoPh:"Cuéntale a la comunidad qué ofreces…",
      notasLbl:"Notas (opcional)",notasPh:"Ej: solo domicilios los fines de semana",contactoMercader:"Contacto del mercader",
      telefonoPh:"Teléfono",whatsappPh:"WhatsApp",instagramPh:"Instagram (opcional)",
      referenciasNote:"✰✰✰✰✰ Las estrellas de referencia reflejan tu reputación como mercader (las genera la comunidad con sus reseñas) — no se editan aquí.",
      masBtn:"Más",sinContacto:"Aún no agregas datos de contacto en tu perfil.",contactoNota:"Estos datos se toman de tu perfil.",
      editarEnPerfil:"Editar en tu perfil",fotosLbl:"Fotos del producto (máximo 5)",misDatos:"Mis datos",nombreLbl:"Nombre completo",
      telefonoLbl:"Teléfono",correoLbl:"Correo",veredaLbl:"Vereda/barrio",redesTitle:"Redes sociales (para tu marketing)",
      restaurarBtn:"↺ Restaurar valores por defecto",emprendedorManta:"Emprendedor · Manta",
      subtipoLbl:"Tipo específico",diasLbl:"Días de publicación",rangoDiasTxt:"Rango permitido:",
      calificarLbl:"Califica a este mercader:",mercaderNuevo:"Mercader nuevo (sin calificaciones aún)",
      vencioTxt:"⏱ Venció",venceEnTxt:"Vence en",diaPalabra:"día",diasPalabra:"días",
      republicarBtn:"Republicar",eliminarBtn:"Eliminar",editarBtn:"Editar",
      confirmarEliminar:"¿Eliminar esta publicación? No se puede deshacer.",
      republicadaTxt:"¡Publicación renovada!",eliminadaTxt:"Publicación eliminada"},
  en:{navInicio:"Home",navServicios:"Services",navAyuda:"Help",navVender:"Publish",navPerfil:"Profile",navIngresar:"Log in",
      heroTitle:"What are you looking for in Manta today?",buscarPh:"Search a product or service…",
      destacados:"Featured this week",misProductos:"My listings",volver:"← Back to catalog",
      serviciosTitle:"Community services",serviciosDesc:"Besides products, MantaLink lets you offer or find services like transport, workshops and rural lodging.",
      ayudaTitle:"Help center",loginTitle:"Log in to your account",loginDesc:"To publish and manage your products.",
      cerrarSesion:"Log out",cfgTitle:"Settings",cfgTheme:"Color theme",cfgThemeManta:"Manta",
      cfgThemeOscuro:"Dark mode",cfgThemeClasico:"Classic green",cfgTextSize:"Text size",cfgNormal:"Normal",
      cfgGrande:"Large",cfgLang:"Language",skipLink:"Skip to content",
      cfgA11y:"Accessibility",cfgA11yFab:"Floating \"A+\" button to enlarge text",
      ctaVender:"+ Publish product or service",ctaVenderSub:"Publish what you offer in under a minute.",
      cfgNote:"These preferences are saved on this device. Full content translation is still in progress; for now only the main navigation is translated.",
      soloResidentes:"You must log in (only Manta residents can)",
      volverVender:"← Back to my listings",publicarTitle:"Publish product or service",editarTitle:"Edit product or service",
      guardarCambios:"Save changes",subirFoto:"Tap to upload a photo",mercaderLbl:"Seller:",tipoLbl:"Product",
      nombreProductoLbl:"Product name",nombreProductoPh:"E.g: Organic panela",precioLbl:"Price",precioPh:"E.g: $8,000 per pound",
      fechaLbl:"Publish until",infoLbl:"Information about the product",infoPh:"Tell the community what you offer…",
      notasLbl:"Notes (optional)",notasPh:"E.g: delivery on weekends only",contactoMercader:"Seller contact",
      telefonoPh:"Phone",whatsappPh:"WhatsApp",instagramPh:"Instagram (optional)",
      masBtn:"More",sinContacto:"You haven't added contact info to your profile yet.",contactoNota:"This info comes from your profile.",
      editarEnPerfil:"Edit in your profile",fotosLbl:"Product photos (5 max)",misDatos:"My info",nombreLbl:"Full name",
      telefonoLbl:"Phone",correoLbl:"Email",veredaLbl:"Village/neighborhood",redesTitle:"Social media (for your marketing)",
      restaurarBtn:"↺ Restore defaults",emprendedorManta:"Entrepreneur · Manta",
      referenciasNote:"✰✰✰✰✰ Reference stars reflect your reputation as a seller (generated by the community's reviews) — they aren't edited here.",
      subtipoLbl:"Specific type",diasLbl:"Days published",rangoDiasTxt:"Allowed range:",
      calificarLbl:"Rate this seller:",mercaderNuevo:"New seller (no reviews yet)",
      vencioTxt:"⏱ Expired",venceEnTxt:"Expires in",diaPalabra:"day",diasPalabra:"days",
      republicarBtn:"Republish",eliminarBtn:"Delete",editarBtn:"Edit",
      confirmarEliminar:"Delete this listing? This can't be undone.",
      republicadaTxt:"Listing renewed!",eliminadaTxt:"Listing deleted"}
};

// localStorage puede no estar disponible en ciertos contextos; el mockup sigue funcionando sin él.
function ls(key,val){ try{ if(val===undefined) return localStorage.getItem(key); localStorage.setItem(key,val);}catch(e){} }
function cargarJSON(key, fallback){ try{ const raw = ls(key); return raw ? JSON.parse(raw) : fallback; }catch(e){ return fallback; } }
function guardarEstadoCuentas(){
  ls('mantalink-cuentas-pendientes', JSON.stringify(cuentasPendientes));
  ls('mantalink-cuentas-verificadas', JSON.stringify(cuentasVerificadas));
  ls('mantalink-perfiles-cuentas', JSON.stringify(perfilesCuentas));
}

// Regenera los chips, selectores y checks de categoría, incluido el panel admin.
function poblarCategorias(){
  const nombres = Object.keys(CATEGORIAS);
  document.getElementById('chips').innerHTML = ['Todos', ...nombres].map(c=>
    `<button class="chip ${c===categoriaActiva?'active':''}" data-c="${c}">${c}</button>`).join('');
  document.getElementById('pubTipo').innerHTML = nombres.map(c=>`<option value="${c}">${c}</option>`).join('');
  document.getElementById('advFiltersCats').innerHTML = nombres.map(c=>`
    <label class="adv-cat-check"><input type="checkbox" value="${c}"> ${c}</label>`).join('');
  document.querySelectorAll('#advFiltersCats input').forEach(chk=>chk.addEventListener('change', actualizarSubtipoAvanzado));
  const adminCont = document.getElementById('adminCategorias');
  if(adminCont){
    adminCont.innerHTML = nombres.map(c=>`<span class="chip">${c}</span>`).join('');
  }
}

// Rellena los selectores de ubicación de búsqueda, registro y publicación.
function poblarUbicaciones(){
  const opciones = UBICACIONES.map(ubicacion=>`<option value="${ubicacion}">${ubicacion}</option>`).join('');
  document.getElementById('filtroUbicacion').innerHTML = `<option value="">Todas las veredas y sectores</option>${opciones}`;
  document.getElementById('regVereda').innerHTML = `<option value="">Selecciona una vereda o sector</option>${opciones}`;
  document.getElementById('pubUbicacion').innerHTML = `<option value="">Selecciona una vereda o sector</option>${opciones}`;
}

function normalizarUbicacion(ubicacion){
  let nombre = (ubicacion || '').trim().replace(/^(vereda|barrio)\s+/i, '');
  if(nombre.toLowerCase()==='el salitre') nombre = 'Salitre';
  return UBICACIONES.find(opcion=>opcion.toLowerCase()===nombre.toLowerCase()) || '';
}

function actualizarSubtipoAvanzado(){
  const marcadas = [...document.querySelectorAll('#advFiltersCats input:checked')].map(i=>i.value);
  const subField = document.getElementById('advSubField');
  const subSel = document.getElementById('advSubtipo');
  const subs = marcadas.length===1 && CATEGORIAS[marcadas[0]] ? CATEGORIAS[marcadas[0]].subcategorias : null;
  if(subs){
    subField.hidden = false;
    subSel.innerHTML = `<option value="">Cualquiera</option>` + subs.map(s=>`<option>${s}</option>`).join('');
  } else {
    subField.hidden = true; subSel.innerHTML = `<option value="">Cualquiera</option>`;
  }
}
document.getElementById('btnFiltrosAvanzados').addEventListener('click', ()=>{
  document.getElementById('advFilters').hidden = !document.getElementById('advFilters').hidden;
});
document.getElementById('btnAplicarFiltros').addEventListener('click', ()=>{
  categoriasFiltroAvanzado = [...document.querySelectorAll('#advFiltersCats input:checked')].map(i=>i.value);
  subtipoFiltroAvanzado = document.getElementById('advSubtipo').value;
  ubicacionFiltroActiva = document.getElementById('filtroUbicacion').value;
  categoriaActiva = 'Todos';
  document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active', c.dataset.c==='Todos'));
  document.getElementById('advFilters').hidden = true;
  renderCatalogo();
  const n = categoriasFiltroAvanzado.length;
  const resumen = [n ? `${n} categoría${n>1?'s':''}${subtipoFiltroAvanzado ? ' · '+subtipoFiltroAvanzado : ''}` : '', ubicacionFiltroActiva].filter(Boolean).join(' · ');
  toast(resumen ? `Filtros aplicados: ${resumen}` : 'Filtros aplicados');
});
document.getElementById('btnLimpiarFiltros').addEventListener('click', ()=>{
  categoriasFiltroAvanzado = []; subtipoFiltroAvanzado = '';
  ubicacionFiltroActiva = '';
  document.querySelectorAll('#advFiltersCats input').forEach(i=>i.checked=false);
  document.getElementById('filtroUbicacion').value = '';
  actualizarSubtipoAvanzado();
  renderCatalogo();
  toast('Filtros avanzados limpiados');
});

/* Flechas para desplazar la fila de categorías */
document.getElementById('chipsPrev').addEventListener('click', ()=> document.getElementById('chips').scrollBy({left:-200, behavior:'smooth'}));
document.getElementById('chipsNext').addEventListener('click', ()=> document.getElementById('chips').scrollBy({left:200, behavior:'smooth'}));

function toggleFavorito(id){
  if(favoritos.has(id)) favoritos.delete(id); else favoritos.add(id);
  ls('mantalink-favoritos', JSON.stringify([...favoritos]));
  renderCatalogo();
}

function promedioVendedor(nombre){
  const r = vendedoresRating[nombre];
  if(r && r.count>0) return (r.suma/r.count).toFixed(1);
  const semilla = productos.find(p=>p.vendedor===nombre && p.rating && p.rating.includes('★'));
  if(semilla){ const n = parseFloat(semilla.rating.replace('★','').trim()); if(!isNaN(n)) return n.toFixed(1); }
  return null; // sin calificaciones todavía = "Nuevo"
}

function calificarVendedor(nombre, estrellas){
  // Tu voto reemplaza al anterior (no se suma cada clic como reseñas infinitas): puedes cambiar de opinión.
  if(!vendedoresRating[nombre]) vendedoresRating[nombre] = {suma:0, count:0};
  const votoPrevio = miUltimaCalificacion[nombre];
  if(votoPrevio){ vendedoresRating[nombre].suma += (estrellas - votoPrevio); }
  else { vendedoresRating[nombre].suma += estrellas; vendedoresRating[nombre].count += 1; }
  miUltimaCalificacion[nombre] = estrellas;
  ls('mantalink-ratings', JSON.stringify(vendedoresRating));
  ls('mantalink-mirating', JSON.stringify(miUltimaCalificacion));
  toast('¡Gracias por tu calificación!');
  const promEl = document.getElementById('sellerRatingTxt');
  if(promEl){ const prom = promedioVendedor(nombre); promEl.textContent = prom ? '★ '+prom : t('mercaderNuevo'); }
}

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2400);
}

/* ---------- Router (hash-based: funciona sin servidor, ej. abriendo el archivo directo) ---------- */
// Ruta pública -> id de <section class="screen">
// Las rutas hash permiten abrir el archivo sin servidor y restaurar scroll por pantalla.
const RUTA_A_PANTALLA = {
  home:'inicio', login:'login', registro:'registro', servicios:'servicios-info',
  favoritos:'favoritos-info', ayuda:'ayuda', publicar:'publicar', perfil:'perfil',
  config:'config', producto:'detalle', vendedor:'perfil-vendedor', admin:'admin'
};
const RUTAS_PROTEGIDAS = ['publicar','perfil'];
// Rutas: #/publicar (mis publicaciones) · #/publicar/nuevo · #/publicar/editar/ID

function rutaActual(){
  const partes = location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
  return {nombre: partes[0] || 'home', param: partes[1], param2: partes[2]};
}

function navegar(ruta){
  // acepta 'home', 'producto/3', etc.
  const destino = '#/'+ruta;
  if(location.hash === destino) return;
  if(location.hash) scrollPorRuta.set(location.hash, window.scrollY);
  location.hash = destino;
}

function sincronizarDesdeHash(){
  let {nombre, param, param2} = rutaActual();
  if(nombre === 'vender') nombre = 'publicar'; // nombre antiguo de la ruta
  if(!RUTA_A_PANTALLA[nombre]) nombre = 'home';

  if(RUTAS_PROTEGIDAS.includes(nombre) && !sesionActiva){
    toast(I18N[idiomaActual()].soloResidentes || 'Debes iniciar sesión primero');
    location.hash = '#/login';
    return;
  }
  if(nombre==='publicar' && !adminActivo && !cuentaVerificada && (param==='nuevo' || param==='editar')){
    toast('Tu cuenta debe ser verificada antes de publicar');
    location.hash = '#/publicar';
    return;
  }
  if(nombre === 'admin' && !adminActivo){
    toast('Esta sección es solo para administradores');
    location.hash = '#/login';
    return;
  }

  const enFormulario = nombre==='publicar' && (param==='nuevo' || param==='editar');
  const idEditar = param==='editar' ? Number(param2) : null;
  if(idEditar && !misPublicaciones.find(x=>x.id===idEditar) && !productos.find(x=>x.id===idEditar)){ location.hash = '#/publicar'; return; }
  const pantallaId = enFormulario ? 'publicar-form' : RUTA_A_PANTALLA[nombre];
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active', s.id===pantallaId));
  document.querySelectorAll('.mainnav button, .bottom-nav button, .more-dropdown button').forEach(b=>b.classList.toggle('active', b.dataset.s===nombre));
  document.getElementById('moreDropdown').classList.remove('open');
  document.getElementById('moreToggle').setAttribute('aria-expanded','false');
  document.getElementById('mainnav').classList.remove('open');
  document.getElementById('menuToggle').setAttribute('aria-expanded','false');
  actualizarSesion(); // por seguridad: re-sincroniza qué botones deben verse en cada navegación
  if(nombre !== 'producto' && nombre !== 'vendedor') ultimaRutaNoDetalle = location.hash.replace(/^#\/?/,'') || nombre;

  if(nombre==='publicar'){ if(enFormulario) cargarFormulario(idEditar); else renderMisProductos(); }
  if(nombre==='servicios') renderServicios();
  if(nombre==='favoritos') renderFavoritos();
  if(nombre==='producto' && param) verDetalle(Number(param));
  if(nombre==='vendedor' && param) renderPerfilVendedor(param);
  if(nombre==='admin') renderAdmin();

  const posicionGuardada = scrollPorRuta.get(location.hash);
  if(posicionGuardada !== undefined){
    window.scrollTo(0, posicionGuardada);
  } else {
    window.scrollTo({top:0, behavior:'smooth'});
  }
}

function idiomaActual(){ return (ls('mantalink-lang') || 'es'); }

document.getElementById('chips').addEventListener('click', e=>{
  const b = e.target.closest('.chip'); if(!b) return;
  categoriaActiva = b.dataset.c;
  categoriasFiltroAvanzado = []; subtipoFiltroAvanzado = ''; // un chip simple reemplaza cualquier filtro avanzado activo
  ubicacionFiltroActiva = '';
  document.getElementById('filtroUbicacion').value = '';
  document.querySelectorAll('#advFiltersCats input').forEach(i=>i.checked=false);
  document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active', c===b));
  renderCatalogo();
});
document.getElementById('buscador').addEventListener('input', renderCatalogo);
document.getElementById('olvide').addEventListener('click', ()=>toast('Se enviaría un enlace de recuperación a tu correo'));
document.getElementById('backBtn').addEventListener('click', ()=>navegar(ultimaRutaNoDetalle));
document.getElementById('backPerfilVendedor').addEventListener('click', ()=>navegar(rutaOrigenPerfilVendedor));
document.getElementById('backPublicarBtn').addEventListener('click', ()=>navegar('publicar'));
document.getElementById('cta-vender').addEventListener('click', ()=>abrirFormularioPublicar(null));
document.getElementById('cta-vender-perfil').addEventListener('click', ()=>abrirFormularioPublicar(null));
document.querySelectorAll('.guardar-publicacion').forEach(b=>b.addEventListener('click', guardarPublicacion));
document.getElementById('btnGuardarPerfil').addEventListener('click', guardarPerfil);

document.getElementById('fotoInput').addEventListener('change', e=>{
  const espacioRestante = 5 - fotosPreview.length;
  Array.from(e.target.files).slice(0, espacioRestante).forEach(archivo=>{
    fotosPreview.push(URL.createObjectURL(archivo));
  });
  renderPhotoGrid();
  e.target.value = '';
});

// Menú "Más" (Ayuda + Configuración): abre/cierra y se cierra al hacer clic fuera o al navegar
document.getElementById('moreToggle').addEventListener('click', e=>{
  e.stopPropagation();
  const abierto = document.getElementById('moreDropdown').classList.toggle('open');
  document.getElementById('moreToggle').setAttribute('aria-expanded', abierto ? 'true' : 'false');
});
document.addEventListener('click', ()=>{
  document.getElementById('moreDropdown').classList.remove('open');
  document.getElementById('moreToggle').setAttribute('aria-expanded','false');
});

document.getElementById('btnRestaurarConfig').addEventListener('click', ()=>{
  applyTheme('manta'); applyTextSize('grande'); applyLang('es'); applyA11yFabVisible(true);
  toast('Configuración restaurada');
});
document.getElementById('menuToggle').addEventListener('click', ()=>{
  const abierto = document.getElementById('mainnav').classList.toggle('open');
  document.getElementById('menuToggle').setAttribute('aria-expanded', abierto ? 'true' : 'false');
});

document.addEventListener('click', e=>{
  const b = e.target.closest('[data-s]'); if(!b) return;
  if(b.dataset.s === 'servicios'){
    categoriaActiva = 'Servicios';
    navegar('servicios');
    return;
  }
  navegar(b.dataset.s);
});

window.addEventListener('hashchange', sincronizarDesdeHash);
if('scrollRestoration' in history) history.scrollRestoration = 'manual';

function ordenarPorReputacion(lista){
  // los mercaderes mejor calificados salen primero; los nuevos (sin reseñas) quedan de últimos, no ocultos
  return [...lista].sort((a,b)=>{
    const ra = promedioVendedor(a.vendedor), rb = promedioVendedor(b.vendedor);
    if(ra===null && rb===null) return 0;
    if(ra===null) return 1;
    if(rb===null) return -1;
    return rb - ra;
  });
}

// Usa Web Share en dispositivos compatibles y ofrece copiar el enlace como alternativa.
async function compartirProducto(id){
  const producto = productos.find(item=>item.id===id) || misPublicaciones.find(item=>item.id===id);
  if(!producto) return;
  const enlace = new URL(location.href);
  enlace.hash = `/producto/${id}`;
  const datosCompartir = {
    title: producto.nombre,
    text: `Mira esta publicación en MantaLink: ${producto.nombre}`,
    url: enlace.href
  };
  if(navigator.share){
    try{
      await navigator.share(datosCompartir);
      toast('Publicación compartida');
      return;
    }catch(error){
      if(error.name==='AbortError') return;
    }
  }
  try{
    await navigator.clipboard.writeText(enlace.href);
    toast('Enlace copiado para compartir');
  }catch(error){
    window.prompt('Copia este enlace para compartir:', enlace.href);
  }
}

// Las acciones superpuestas detienen el clic de la tarjeta, que abre el detalle.
function tarjetaProducto(p){
  const prom = promedioVendedor(p.vendedor);
  const esFav = favoritos.has(p.id);
  return `
    <div class="card" onclick="navegar('producto/${p.id}')">
      <div class="card-fav ${esFav?'active':''}" role="button" tabindex="0" aria-label="Favorito" onclick="event.stopPropagation(); toggleFavorito(${p.id})">${esFav ? '♥' : '♡'}</div>
      <button class="card-share" type="button" title="Compartir publicación" aria-label="Compartir ${p.nombre}" onclick="event.stopPropagation(); compartirProducto(${p.id})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4M8.7 13.3l6.6 4.4"/></svg></button>
      <img src="${p.img}" alt="">
      <div class="body">
        <h4>${p.nombre}</h4>
        <div class="seller">${p.vendedor}</div>
        <div class="product-location">${p.ubicacion || 'Manta'}</div>
        <div class="rating">★ ${prom || 'Nuevo'}</div>
        <button class="btn btn-outline">Más información</button>
      </div>
    </div>`;
}

// Combina búsqueda por texto con categoría, subtipo y ubicación aplicados.
function renderCatalogo(){
  limpiarEventosVencidos();
  const texto = document.getElementById('buscador').value.toLowerCase();
  let visibles = productos.filter(p => {
    if(!p.nombre.toLowerCase().includes(texto)) return false;
    if(ubicacionFiltroActiva && p.ubicacion !== ubicacionFiltroActiva) return false;
    if(categoriasFiltroAvanzado.length){
      if(!categoriasFiltroAvanzado.includes(p.categoria)) return false;
      if(subtipoFiltroAvanzado && p.subcategoria !== subtipoFiltroAvanzado) return false;
      return true;
    }
    return categoriaActiva==='Todos' || p.categoria===categoriaActiva;
  });
  visibles = ordenarPorReputacion(visibles);
  const grid = document.getElementById('grid-productos');
  grid.innerHTML = visibles.length ? visibles.map(tarjetaProducto).join('') : `<p style="color:var(--ink-soft); font-style:italic">No encontramos resultados para tu búsqueda.</p>`;
}

function renderFavoritos(){
  const misFavoritos = ordenarPorReputacion(productos.filter(p=>favoritos.has(p.id)));
  document.getElementById('grid-favoritos').innerHTML = misFavoritos.length
    ? misFavoritos.map(tarjetaProducto).join('')
    : `<p style="color:var(--ink-soft); font-style:italic">Aún no tienes favoritos. Toca el ♡ en un producto para guardarlo aquí.</p>`;
}

function renderServicios(){
  limpiarEventosVencidos();
  const servicios = ordenarPorReputacion(productos.filter(p=>p.categoria==='Servicios'));
  document.getElementById('grid-servicios').innerHTML = servicios.map(tarjetaProducto).join('');
}

// El nombre se codifica en la ruta para admitir espacios y caracteres acentuados.
function abrirPerfilVendedor(nombreCodificado){
  const ruta = `vendedor/${nombreCodificado}`;
  if(location.hash==='#/'+ruta) return;
  rutaOrigenPerfilVendedor = location.hash.replace(/^#\/?/,'') || 'home';
  navegar(ruta);
}

function renderPerfilVendedor(nombreCodificado){
  let nombre;
  try{ nombre = decodeURIComponent(nombreCodificado); }catch(error){ navegar('home'); return; }
  const publicaciones = [...productos, ...misPublicaciones]
    .filter(p=>p.vendedor===nombre)
    .filter((p, indice, lista)=>lista.findIndex(item=>item.id===p.id)===indice);
  if(!publicaciones.length){ toast('No encontramos publicaciones de este vendedor'); navegar('home'); return; }
  const ubicaciones = [...new Set(publicaciones.map(p=>p.ubicacion).filter(Boolean))];
  const categorias = [...new Set(publicaciones.map(p=>p.categoria))];
  const rating = promedioVendedor(nombre);
  document.getElementById('perfilVendedorContenido').innerHTML = `
    <div class="seller-public-header">
      <div class="avatar" aria-hidden="true">${nombre.trim().charAt(0)}</div>
      <div>
        <p class="seller-public-eyebrow">Perfil del productor</p>
        <h2>${nombre}</h2>
        <p>${ubicaciones.join(' · ') || 'Manta'} · ${publicaciones.length} ${publicaciones.length===1?'publicación':'publicaciones'}${rating ? ` · ★ ${rating}` : ''}</p>
        <p>${categorias.join(' · ')}</p>
      </div>
    </div>
    <div class="section-title"><h3>Publicaciones de ${nombre}</h3></div>
    <div class="grid">${ordenarPorReputacion(publicaciones).map(tarjetaProducto).join('')}</div>`;
}

function verDetalle(id){
  const p = productos.find(x=>x.id===id) || misPublicaciones.find(x=>x.id===id);
  if(!p){ navegar('home'); return; }
  clearInterval(carTimer); carIndex = 0;
  const imgs = (p.imgs && p.imgs.length) ? p.imgs : [p.img];
  const prom = promedioVendedor(p.vendedor);
  const miVoto = miUltimaCalificacion[p.vendedor] || 0;
  document.getElementById('detalle-body').innerHTML = `
    <div class="carousel" id="carousel">
      <div class="carousel-track" id="carouselTrack">
        ${imgs.map(u=>`<img src="${u}" class="carousel-slide" alt="">`).join('')}
      </div>
      ${imgs.length>1 ? `
        <button class="carousel-arrow prev" id="carPrev" aria-label="Foto anterior">‹</button>
        <button class="carousel-arrow next" id="carNext" aria-label="Foto siguiente">›</button>
        <div class="carousel-dots" id="carDots">${imgs.map((_,i)=>`<span class="dot ${i===0?'active':''}" data-i="${i}"></span>`).join('')}</div>
      ` : ''}
    </div>
    <div>
      <h2>${p.nombre}</h2>
      <div class="price" style="margin-top:6px">${p.precio}</div>
      <p style="color:var(--ink-soft); line-height:1.55; margin-top:14px">${p.desc}</p>
      <div class="seller-box">
        <div class="avatar">${p.vendedor.charAt(0)}</div>
        <div>
          <button class="seller-profile-link" type="button" onclick="abrirPerfilVendedor('${encodeURIComponent(p.vendedor)}')">${p.vendedor}</button>
          <div style="font-size:.85rem; color:var(--ink-soft)">${p.categoria}${p.subcategoria ? ' · '+p.subcategoria : ''} · ${p.ubicacion || 'Manta'}</div>
          <div class="seller-rating" id="sellerRatingTxt">${prom ? '★ '+prom : t('mercaderNuevo')}</div>
        </div>
      </div>
      <div class="contact-row">
        <button class="btn btn-primary" onclick="toast('Se abriría WhatsApp con el vendedor')">Contactar por WhatsApp</button>
        <button class="btn btn-outline" onclick="toast('Se iniciaría una llamada')">Llamar al productor</button>
      </div>
      <div class="rate-seller">
        <span data-i18n="calificarLbl">Califica a este mercader:</span>
        <div class="stars-input" id="starsInput">
          ${[1,2,3,4,5].map(n=>`<button type="button" class="star-btn ${n<=miVoto?'filled':''}" data-n="${n}" aria-label="${n} estrellas">★</button>`).join('')}
        </div>
        ${miVoto ? `<div class="mi-calificacion-txt">Tu calificación: ${miVoto} ★</div>` : ''}
      </div>

      ${adminActivo ? `
        <div class="admin-only-actions">
          <button class="btn btn-outline" id="btnEditarDesdeDetalle">✎ Editar (admin)</button>
          <button class="btn btn-outline" id="btnDarDeBajaDetalle" style="color:#B4483C; border-color:#B4483C">🚫 Dar de baja</button>
        </div>
      ` : `
        <div class="report-box">
          <button class="link" id="btnMostrarReporte" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4"/><path d="M5 4h14l-3 4 3 4H5"/></svg>Reportar esta publicación</button>
          <div id="reporteForm" hidden>
            <div class="field"><label for="reporteMotivo">Motivo</label>
              <select id="reporteMotivo">
                <option>Información falsa</option>
                <option>Precio engañoso</option>
                <option>Contenido ofensivo</option>
                <option>Producto o servicio prohibido</option>
                <option>Otro</option>
              </select>
            </div>
            <div class="field"><label for="reporteComentario">Comentario (opcional)</label>
              <textarea id="reporteComentario" rows="2" placeholder="Cuéntanos qué pasó…"></textarea>
            </div>
            <div class="report-actions">
              <button class="btn btn-primary" id="btnEnviarReporte" type="button">Enviar reporte</button>
              <button class="btn btn-outline" id="btnCancelarReporte" type="button">Cancelar</button>
            </div>
          </div>
        </div>
      `}
    </div>`;

  // Carrusel: flechas, puntos, swipe táctil y avance automático cada 6s
  if(imgs.length>1){
    document.getElementById('carPrev').addEventListener('click', ()=>irASlide(carIndex-1));
    document.getElementById('carNext').addEventListener('click', ()=>irASlide(carIndex+1));
    document.querySelectorAll('#carDots .dot').forEach(d=>d.addEventListener('click', ()=>irASlide(Number(d.dataset.i))));
    let touchX = null;
    const carEl = document.getElementById('carousel');
    carEl.addEventListener('touchstart', e=>{ touchX = e.touches[0].clientX; }, {passive:true});
    carEl.addEventListener('touchend', e=>{
      if(touchX===null) return;
      const delta = e.changedTouches[0].clientX - touchX;
      if(Math.abs(delta) > 40) irASlide(carIndex + (delta < 0 ? 1 : -1));
      touchX = null;
    }, {passive:true});
    iniciarAutoCarrusel();
  }

  document.querySelectorAll('#starsInput .star-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      const n = Number(b.dataset.n);
      document.querySelectorAll('#starsInput .star-btn').forEach(x=>x.classList.toggle('filled', Number(x.dataset.n) <= n));
      calificarVendedor(p.vendedor, n);
      let nota = document.querySelector('.rate-seller .mi-calificacion-txt');
      if(!nota){
        nota = document.createElement('div'); nota.className = 'mi-calificacion-txt';
        document.getElementById('starsInput').insertAdjacentElement('afterend', nota);
      }
      nota.textContent = `Tu calificación: ${n} ★`;
    });
  });

  if(adminActivo){
    document.getElementById('btnEditarDesdeDetalle').addEventListener('click', ()=>abrirFormularioPublicar(p.id));
    document.getElementById('btnDarDeBajaDetalle').addEventListener('click', ()=>{
      if(!confirm('¿Dar de baja esta publicación?')) return;
      darDeBajaPublicacion(p.id);
      toast('Publicación dada de baja');
      navegar(ultimaRutaNoDetalle);
    });
  } else {
    document.getElementById('btnMostrarReporte').addEventListener('click', ()=>{
      document.getElementById('reporteForm').hidden = false;
      document.getElementById('btnMostrarReporte').hidden = true;
    });
    document.getElementById('btnCancelarReporte').addEventListener('click', ()=>{
      document.getElementById('reporteMotivo').selectedIndex = 0;
      document.getElementById('reporteComentario').value = '';
      document.getElementById('reporteForm').hidden = true;
      document.getElementById('btnMostrarReporte').hidden = false;
    });
    document.getElementById('btnEnviarReporte').addEventListener('click', ()=>{
      reportes.push({
        id: Date.now(), productoId: p.id, nombre: p.nombre,
        motivo: document.getElementById('reporteMotivo').value,
        comentario: document.getElementById('reporteComentario').value.trim(),
        fecha: new Date().toISOString().slice(0,10)
      });
      document.getElementById('reporteForm').hidden = true;
      document.getElementById('btnMostrarReporte').hidden = false;
      toast('Reporte enviado. Un administrador lo revisará.');
    });
  }
  applyLang(idiomaActual()); // traduce el texto recién insertado (Califica a este mercader / stars label)
}

function irASlide(i){
  const slides = document.querySelectorAll('#carouselTrack .carousel-slide');
  if(!slides.length) return;
  carIndex = (i + slides.length) % slides.length;
  document.getElementById('carouselTrack').style.transform = `translateX(-${carIndex*100}%)`;
  document.querySelectorAll('#carDots .dot').forEach((d,ix)=>d.classList.toggle('active', ix===carIndex));
  iniciarAutoCarrusel(); // cualquier interacción manual reinicia el conteo de 6s
}
function iniciarAutoCarrusel(){
  clearInterval(carTimer);
  const slides = document.querySelectorAll('#carouselTrack .carousel-slide');
  if(slides.length <= 1) return;
  carTimer = setInterval(()=>irASlideAuto(), 6000);
}
function irASlideAuto(){ // como irASlide pero sin reiniciar su propio timer
  const slides = document.querySelectorAll('#carouselTrack .carousel-slide');
  if(!slides.length) return;
  carIndex = (carIndex + 1) % slides.length;
  document.getElementById('carouselTrack').style.transform = `translateX(-${carIndex*100}%)`;
  document.querySelectorAll('#carDots .dot').forEach((d,ix)=>d.classList.toggle('active', ix===carIndex));
}

function diasRestantes(p){
  if(!p.vigenteHasta) return null;
  const hoy = new Date(new Date().toDateString());
  const fin = new Date(p.vigenteHasta);
  return Math.round((fin - hoy) / 86400000);
}

function renderMisProductos(){
  const puedePublicar = adminActivo || cuentaVerificada;
  document.getElementById('avisoVerificacionPublicar').hidden = puedePublicar;
  document.getElementById('cta-vender').hidden = !puedePublicar;
  document.getElementById('lista-mis-productos').hidden = !puedePublicar;
  if(!puedePublicar) return;
  document.getElementById('lista-mis-productos').innerHTML = misPublicaciones.map(p=>{
    const restantes = diasRestantes(p);
    const vencido = restantes !== null && restantes < 0;
    const estado = restantes === null ? '' : vencido
      ? `<div class="listing-status expired">${t('vencioTxt')}</div>`
      : `<div class="listing-status">${t('venceEnTxt')} ${restantes} ${restantes===1 ? t('diaPalabra') : t('diasPalabra')}</div>`;
    const acciones = vencido
      ? `<button class="btn btn-primary" onclick="republicar(${p.id})">${t('republicarBtn')}</button>
         <button class="btn btn-outline" onclick="eliminarPublicacion(${p.id})">${t('eliminarBtn')}</button>`
      : `<button class="btn btn-outline" onclick="abrirFormularioPublicar(${p.id})">${t('editarBtn')}</button>`;
    return `
    <div class="list-row">
      <div><strong>${p.nombre}</strong><div style="font-size:.85rem; color:var(--ink-soft)">${p.categoria}${p.subcategoria ? ' · '+p.subcategoria : ''} · ${p.precio}</div>${estado}</div>
      <div class="list-row-actions">${acciones}</div>
    </div>`;
  }).join('');
}

function republicar(id){
  const p = misPublicaciones.find(x=>x.id===id); if(!p) return;
  const cfg = CATEGORIAS[p.categoria] || {dias:{min:1,max:30}};
  const dias = p.duracionDias || cfg.dias.min;
  const fin = new Date(); fin.setDate(fin.getDate() + dias);
  p.vigenteHasta = fin.toISOString().slice(0,10);
  toast(t('republicadaTxt'));
  renderMisProductos();
}

function eliminarPublicacion(id){
  if(!confirm(t('confirmarEliminar'))) return;
  misPublicaciones = misPublicaciones.filter(x=>x.id!==id);
  toast(t('eliminadaTxt'));
  renderMisProductos();
}

function t(clave){ return (I18N[idiomaActual()] || I18N.es)[clave] || clave; }

/* ---------- Admin: dashboard de tarjetas + vistas (simulación) ---------- */
function renderAdmin(){
  document.getElementById('bscIndicators').innerHTML = INDICADORES_BSC.map((indicador, indice)=>`
    <article class="bsc-kpi">
      <p class="bsc-perspective">${indicador.perspectiva}</p>
      <h5>${indicador.indicador}</h5>
      <strong class="bsc-value">${indicador.valor}</strong>
      <p class="bsc-goal">${indicador.meta}</p>
      <progress value="${indicador.avance}" max="100" aria-label="${indicador.perspectiva}: ${indicador.estado}"></progress>
      <span class="bsc-status">${indicador.estado}</span>
    </article>`).join('');
  document.getElementById('nPendientes').textContent = cuentasPendientes.length;
  document.getElementById('nReportadas').textContent = reportes.length;
  document.getElementById('nPublicaciones').textContent = misPublicaciones.length + productos.length;
  document.getElementById('nCategorias').textContent = Object.keys(CATEGORIAS).length;
  document.getElementById('adminVistaWrap').hidden = true;
  document.getElementById('adminDash').hidden = false;
}

document.querySelectorAll('#adminDash .admin-card').forEach(b=>b.addEventListener('click', ()=>abrirVistaAdmin(b.dataset.vista)));
document.getElementById('btnVolverDash').addEventListener('click', renderAdmin);

function abrirVistaAdmin(vista){
  document.getElementById('adminDash').hidden = true;
  document.getElementById('adminVistaWrap').hidden = false;
  const cont = document.getElementById('adminVistaContenido');

  if(vista === 'pendientes'){
    cont.innerHTML = `<h4 class="contact-title" style="margin-top:0">Cuentas pendientes de verificación</h4>` + (cuentasPendientes.length
      ? cuentasPendientes.map(c=>`
        <div class="list-row">
          <div><strong>${c.nombre}</strong><div style="font-size:.85rem; color:var(--ink-soft)">${c.vereda}${c.correo ? ' · '+c.correo : ''} · solicitó el ${c.fecha}</div></div>
          <div class="list-row-actions">
            <button class="btn btn-primary" onclick="aprobarCuenta(${c.id})">Verificar</button>
            <button class="btn btn-outline" onclick="rechazarCuenta(${c.id})">Rechazar</button>
          </div>
        </div>`).join('')
      : `<p style="color:var(--ink-soft); font-style:italic">No hay cuentas pendientes por ahora.</p>`);
  }

  if(vista === 'reportadas'){
    cont.innerHTML = `<h4 class="contact-title" style="margin-top:0">Publicaciones reportadas</h4>` + (reportes.length
      ? reportes.map(r=>`
        <div class="list-row">
          <div><strong>${r.nombre}</strong><div style="font-size:.85rem; color:var(--ink-soft)">${r.motivo}${r.comentario ? ' · "'+r.comentario+'"' : ''} · ${r.fecha}</div></div>
          <div class="list-row-actions">
            <button class="btn btn-outline" onclick="navegar('producto/${r.productoId}')">Ver publicación</button>
            <button class="btn btn-outline" onclick="descartarReporte(${r.id})">Descartar</button>
            <button class="btn btn-primary" style="background:#B4483C" onclick="darDeBajaDesdeReporte(${r.id}, ${r.productoId})">Dar de baja</button>
          </div>
        </div>`).join('')
      : `<p style="color:var(--ink-soft); font-style:italic">No hay publicaciones reportadas.</p>`);
  }

  if(vista === 'publicaciones'){
    const todas = [...misPublicaciones, ...productos];
    cont.innerHTML = `<h4 class="contact-title" style="margin-top:0">Todas las publicaciones</h4>` + todas.map(p=>`
      <div class="list-row">
        <div><strong>${p.nombre}</strong><div style="font-size:.85rem; color:var(--ink-soft)">${p.categoria} · ${p.vendedor}</div></div>
        <div class="list-row-actions">
          <button class="btn btn-outline" onclick="navegar('producto/${p.id}')">Abrir y revisar</button>
        </div>
      </div>`).join('');
  }

  if(vista === 'categorias'){
    cont.innerHTML = `
      <h4 class="contact-title" style="margin-top:0">Categorías</h4>
      <div class="chips" id="adminCategorias" style="justify-content:flex-start; margin-bottom:14px; overflow-x:visible; flex-wrap:wrap"></div>
      <div class="field-row">
        <div class="field"><input id="adminNuevaCategoria" placeholder="Nueva categoría, ej: Mascotas"></div>
        <button class="btn btn-primary" id="btnAgregarCategoria" style="flex:0 0 auto">+ Agregar</button>
      </div>`;
    document.getElementById('adminCategorias').innerHTML = Object.keys(CATEGORIAS).map(c=>`<span class="chip">${c}</span>`).join('');
    document.getElementById('btnAgregarCategoria').addEventListener('click', ()=>{
      const input = document.getElementById('adminNuevaCategoria');
      const nombre = input.value.trim();
      if(!nombre) return;
      if(!CATEGORIAS[nombre]) CATEGORIAS[nombre] = {dias:{min:1,max:30}, subcategorias:null};
      poblarCategorias();
      abrirVistaAdmin('categorias');
      toast(`Categoría "${nombre}" agregada`);
    });
  }
}

function aprobarCuenta(id){
  const c = cuentasPendientes.find(x=>x.id===id);
  cuentasPendientes = cuentasPendientes.filter(x=>x.id!==id);
  if(c && c.correo && !cuentasVerificadas.includes(c.correo)) cuentasVerificadas.push(c.correo);
  guardarEstadoCuentas();
  toast(c ? `Cuenta de ${c.nombre} verificada` : 'Cuenta verificada');
  abrirVistaAdmin('pendientes');
}
function rechazarCuenta(id){
  const c = cuentasPendientes.find(x=>x.id===id);
  cuentasPendientes = cuentasPendientes.filter(x=>x.id!==id);
  if(c && c.correo) delete perfilesCuentas[c.correo];
  guardarEstadoCuentas();
  toast('Solicitud rechazada');
  abrirVistaAdmin('pendientes');
}
function descartarReporte(id){
  reportes = reportes.filter(r=>r.id!==id);
  toast('Reporte descartado');
  abrirVistaAdmin('reportadas');
}
function darDeBajaDesdeReporte(reporteId, productoId){
  if(!confirm('¿Dar de baja esta publicación?')) return;
  darDeBajaPublicacion(productoId);
  reportes = reportes.filter(r=>r.id!==reporteId);
  toast('Publicación dada de baja');
  abrirVistaAdmin('reportadas');
}

function abrirFormularioPublicar(id){
  navegar(id ? 'publicar/editar/'+id : 'publicar/nuevo');
}

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=500';

function actualizarCategoriaForm(){
  const cat = document.getElementById('pubTipo').value;
  const cfg = CATEGORIAS[cat] || {dias:{min:1,max:30}, subcategorias:null};
  const subWrap = document.getElementById('subtipoField');
  const subSel = document.getElementById('pubSubtipo');
  if(cfg.subcategorias){
    subWrap.hidden = false;
    subSel.innerHTML = cfg.subcategorias.map(sub=>`<option>${sub}</option>`).join('');
  } else {
    subWrap.hidden = true;
    subSel.innerHTML = '';
  }
  const esEvento = !!cfg.esEvento;
  document.getElementById('diasFieldWrap').hidden = esEvento;
  document.getElementById('fechaEventoField').hidden = !esEvento;
  if(!esEvento){
    const dias = document.getElementById('pubDias');
    dias.min = cfg.dias.min; dias.max = cfg.dias.max;
    const actual = Number(dias.value);
    if(!actual || actual < cfg.dias.min || actual > cfg.dias.max){
      dias.value = Math.min(cfg.dias.max, Math.max(cfg.dias.min, 15));
    }
    document.getElementById('diasHint').textContent = `${t('rangoDiasTxt')} ${cfg.dias.min}–${cfg.dias.max}`;
  }
}
document.getElementById('pubTipo').addEventListener('change', actualizarCategoriaForm);

function cargarFormulario(id){
  idEnEdicion = id || null;
  origenEdicion = null;
  let p = null;
  if(id){
    p = misPublicaciones.find(x=>x.id===id);
    if(p) origenEdicion = 'mis';
    else { p = productos.find(x=>x.id===id); if(p) origenEdicion = 'catalogo'; }
  }

  document.getElementById('publishTitle').textContent = p ? t('editarTitle') : t('publicarTitle');
  document.getElementById('mercaderNombre').textContent = p ? p.vendedor : perfilUsuario.nombre;
  document.querySelector('#pubTipo option[value="Eventos"]').hidden = !adminActivo;
  document.getElementById('pubTipo').value = p ? p.categoria : Object.keys(CATEGORIAS)[0];
  document.getElementById('pubUbicacion').value = p ? (p.ubicacion || '') : normalizarUbicacion(perfilUsuario.vereda);
  document.getElementById('pubNombre').value = p ? p.nombre : '';
  document.getElementById('pubPrecio').value = p ? p.precio : '';
  document.getElementById('pubInfo').value = p ? p.desc : '';
  document.getElementById('pubNotas').value = '';
  document.getElementById('pubDias').value = p && p.duracionDias ? p.duracionDias : '';
  document.getElementById('pubFechaEvento').value = p && p.fechaEvento ? p.fechaEvento : '';
  actualizarCategoriaForm();
  if(p && p.subcategoria) document.getElementById('pubSubtipo').value = p.subcategoria;

  fotosPreview = p ? [...(p.imgs && p.imgs.length ? p.imgs : [p.img])] : [];
  renderPhotoGrid();
  renderContactoResumen();
}

function renderPhotoGrid(){
  const grid = document.getElementById('photoGrid'); if(!grid) return;
  let html = fotosPreview.map((url,i)=>`
    <div class="photo-slot filled">
      <img src="${url}" alt="">
      <button type="button" class="photo-remove" data-i="${i}" aria-label="Quitar foto">×</button>
    </div>`).join('');
  if(fotosPreview.length < 5){
    html += `<label class="photo-slot add" tabindex="0" role="button" aria-label="Agregar foto">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    </label>`;
  }
  grid.innerHTML = html;
  const addSlot = grid.querySelector('.photo-slot.add');
  if(addSlot){
    addSlot.addEventListener('click', ()=>document.getElementById('fotoInput').click());
    addSlot.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); document.getElementById('fotoInput').click(); }});
  }
  grid.querySelectorAll('.photo-remove').forEach(b=>b.addEventListener('click', ()=>{
    fotosPreview.splice(Number(b.dataset.i),1); renderPhotoGrid();
  }));
}

function renderContactoResumen(){
  const chips = [];
  if(perfilUsuario.telefono) chips.push(`📞 ${perfilUsuario.telefono}`);
  if(perfilUsuario.instagram) chips.push(`Instagram: ${perfilUsuario.instagram}`);
  if(perfilUsuario.facebook) chips.push(`Facebook: ${perfilUsuario.facebook}`);
  if(perfilUsuario.tiktok) chips.push(`TikTok: ${perfilUsuario.tiktok}`);
  const cont = document.getElementById('contactoResumen'); if(!cont) return;
  cont.innerHTML = chips.length
    ? chips.map(x=>`<span class="contact-chip">${x}</span>`).join('')
    : `<span style="color:var(--ink-soft); font-size:.88rem">${t('sinContacto')}</span>`;
}

function guardarPublicacion(){
  if(!adminActivo && !cuentaVerificada){ toast('Tu cuenta debe ser verificada antes de publicar'); return; }
  const categoria = document.getElementById('pubTipo').value;
  if(categoria === 'Eventos' && !adminActivo){ toast('Solo el administrador puede publicar eventos'); return; }
  const ubicacion = document.getElementById('pubUbicacion').value;
  if(!ubicacion){ toast('Selecciona la vereda o sector de la publicación'); return; }
  const nombre = document.getElementById('pubNombre').value.trim();
  if(!nombre){ toast('Ponle un nombre a tu producto o servicio'); return; }
  const cfg = CATEGORIAS[categoria] || {dias:{min:1,max:30}, subcategorias:null};
  const esEvento = !!cfg.esEvento;
  const vendedor = esEvento && adminActivo ? 'Alcaldía de Manta' : (origenEdicion==='catalogo' && idEnEdicion)
    ? ((misPublicaciones.find(x=>x.id===idEnEdicion)||productos.find(x=>x.id===idEnEdicion)||{}).vendedor || perfilUsuario.nombre)
    : perfilUsuario.nombre;

  let datos;
  if(esEvento){
    datos = {
      categoria, subcategoria: null, ubicacion, nombre,
      precio: document.getElementById('pubPrecio').value.trim() || 'Entrada libre',
      desc: document.getElementById('pubInfo').value.trim(),
      vendedor,
      fechaEvento: document.getElementById('pubFechaEvento').value || new Date().toISOString().slice(0,10),
      imgs: fotosPreview.length ? [...fotosPreview] : [DEFAULT_IMG],
      img: fotosPreview[0] || DEFAULT_IMG
    };
  } else {
    let dias = Number(document.getElementById('pubDias').value) || cfg.dias.min;
    dias = Math.min(Math.max(dias, cfg.dias.min), cfg.dias.max);
    const fin = new Date(); fin.setDate(fin.getDate() + dias);
    datos = {
      categoria,
      ubicacion,
      subcategoria: cfg.subcategorias ? document.getElementById('pubSubtipo').value : null,
      nombre,
      precio: document.getElementById('pubPrecio').value.trim() || 'Consultar precio',
      desc: document.getElementById('pubInfo').value.trim(),
      vendedor,
      duracionDias: dias,
      vigenteHasta: fin.toISOString().slice(0,10),
      imgs: fotosPreview.length ? [...fotosPreview] : [DEFAULT_IMG],
      img: fotosPreview[0] || DEFAULT_IMG
    };
  }
  if(idEnEdicion){
    if(origenEdicion === 'catalogo'){
      const idx = productos.findIndex(x=>x.id===idEnEdicion);
      if(idx > -1) productos[idx] = {...productos[idx], ...datos};
    } else {
      const idx = misPublicaciones.findIndex(x=>x.id===idEnEdicion);
      if(idx > -1) misPublicaciones[idx] = {...misPublicaciones[idx], ...datos};
    }
    toast('Cambios guardados');
    navegar(origenEdicion === 'catalogo' ? 'admin' : 'publicar');
  } else {
    if(esEvento && adminActivo){
      productos.push({id:Date.now(), ...datos});
      renderCatalogo();
      toast('Evento publicado en Inicio');
      navegar('admin');
    } else {
      misPublicaciones.push({id: Date.now(), ...datos});
      toast('¡Publicado! Ya aparece en Mis publicaciones');
      navegar('publicar');
    }
  }
}

function darDeBajaPublicacion(id){
  productos = productos.filter(x=>x.id!==id);
  misPublicaciones = misPublicaciones.filter(x=>x.id!==id);
  favoritos.delete(id); ls('mantalink-favoritos', JSON.stringify([...favoritos]));
  reportes = reportes.filter(r=>r.productoId!==id);
}

function cargarPerfil(correo = correoSesion){
  if(correo) correoSesion = correo;
  const perfilGuardado = correoSesion && perfilesCuentas[correoSesion];
  if(perfilGuardado){
    perfilUsuario = {...perfilUsuario, ...perfilGuardado};
  } else {
    try{ const raw = ls('mantalink-perfil'); if(raw) perfilUsuario = {...perfilUsuario, ...JSON.parse(raw)}; }catch(e){}
  }
  document.getElementById('perfilNombreDisplay').textContent = perfilUsuario.nombre;
  document.getElementById('perfilNombre').value = perfilUsuario.nombre;
  document.getElementById('perfilTelefono').value = perfilUsuario.telefono;
  document.getElementById('perfilCorreo').value = perfilUsuario.correo;
  document.getElementById('perfilVereda').value = perfilUsuario.vereda;
  document.getElementById('perfilInstagram').value = perfilUsuario.instagram;
  document.getElementById('perfilFacebook').value = perfilUsuario.facebook;
  document.getElementById('perfilTiktok').value = perfilUsuario.tiktok;
}

function guardarPerfil(){
  perfilUsuario = {
    nombre: document.getElementById('perfilNombre').value.trim() || perfilUsuario.nombre,
    telefono: document.getElementById('perfilTelefono').value.trim(),
    correo: document.getElementById('perfilCorreo').value.trim(),
    vereda: document.getElementById('perfilVereda').value.trim(),
    instagram: document.getElementById('perfilInstagram').value.trim(),
    facebook: document.getElementById('perfilFacebook').value.trim(),
    tiktok: document.getElementById('perfilTiktok').value.trim(),
  };
  ls('mantalink-perfil', JSON.stringify(perfilUsuario));
  if(correoSesion){ perfilesCuentas[correoSesion] = {...perfilUsuario}; guardarEstadoCuentas(); }
  document.getElementById('perfilNombreDisplay').textContent = perfilUsuario.nombre;
  document.getElementById('perfilEditWrap').hidden = true;
  document.getElementById('btnEditarPerfil').hidden = false;
  toast('Perfil actualizado');
}

/* ---------- Sesión (gating de botones) ---------- */
function actualizarSesion(){
  const etiquetaRol = document.getElementById('perfilRol');
  const estadoPerfil = document.getElementById('perfilEstado');
  if(etiquetaRol){
    etiquetaRol.textContent = adminActivo ? 'Admin' : (I18N[idiomaActual()] || I18N.es).emprendedorManta;
    document.getElementById('perfilNombreDisplay').textContent = adminActivo ? 'Administrador' : perfilUsuario.nombre;
    estadoPerfil.textContent = adminActivo ? 'Cuenta administrativa' : cuentaVerificada ? 'Cuenta verificada' : 'Cuenta pendiente de verificación';
    estadoPerfil.classList.toggle('badge-verified', !adminActivo && cuentaVerificada);
    estadoPerfil.hidden = false;
    document.getElementById('btnEditarPerfil').hidden = adminActivo;
    document.getElementById('cta-vender-perfil').hidden = adminActivo || !cuentaVerificada;
  }
  document.getElementById('navVender').hidden = !sesionActiva;
  document.getElementById('navFavoritos').hidden = !sesionActiva;
  document.getElementById('navPerfil').hidden = !sesionActiva;
  document.getElementById('navAdmin').hidden = !adminActivo;
  document.getElementById('navLogin').hidden = sesionActiva || adminActivo;
  document.getElementById('bnVender').hidden = !sesionActiva;
  document.getElementById('bnPerfil').hidden = !sesionActiva;
  document.getElementById('bnLogin').hidden = sesionActiva || adminActivo;
}
// Login de demostración: el admin usa credenciales fijas; cualquier usuario con ambos campos se marca verificado.
document.getElementById('btnLogin').addEventListener('click', ()=>{
  const correo = document.getElementById('loginCorreo').value.trim().toLowerCase();
  const clave = document.getElementById('loginPass').value;
  if(!correo || !clave){ toast('Ingresa tu correo y contraseña'); return; }
  if(correo === ADMIN_CORREO && clave === ADMIN_PASS){
    correoSesion = correo; cuentaVerificada = true;
    adminActivo = true; sesionActiva = true; ls('mantalink-cuenta-correo', correo); ls('mantalink-admin','1'); ls('mantalink-sesion','1'); actualizarSesion();
    toast('Bienvenido, administrador'); navegar('admin'); return;
  }
  correoSesion = correo;
  cargarPerfil(correo);
  cuentaVerificada = true;
  if(!cuentasVerificadas.includes(correo)) cuentasVerificadas.push(correo);
  cuentasPendientes = cuentasPendientes.filter(cuenta=>cuenta.correo!==correo);
  if(!perfilesCuentas[correo]) perfilUsuario = {...perfilUsuario, correo};
  perfilesCuentas[correo] = {...perfilUsuario};
  guardarEstadoCuentas();
  ls('mantalink-perfil', JSON.stringify(perfilUsuario));
  ls('mantalink-cuenta-correo', correo);
  sesionActiva = true; ls('mantalink-sesion','1'); actualizarSesion();
  toast('Cuenta verificada. ¡Bienvenido!'); navegar('home');
});
function cerrarSesion(){
  const eraAdmin = adminActivo;
  sesionActiva = false;
  adminActivo = false;
  ls('mantalink-sesion','0');
  ls('mantalink-admin','0');
  actualizarSesion();
  toast(eraAdmin ? 'Sesión de administrador cerrada' : 'Sesión cerrada');
  navegar('home');
}
document.getElementById('btnLogout').addEventListener('click', cerrarSesion);
document.getElementById('btnLogoutAdmin').addEventListener('click', cerrarSesion);
document.getElementById('btnEditarPerfil').addEventListener('click', ()=>{
  document.getElementById('perfilEditWrap').hidden = false;
  document.getElementById('btnEditarPerfil').hidden = true;
});
document.getElementById('btnRegistro').addEventListener('click', ()=>{
  const nombre = document.getElementById('regNombre').value.trim();
  const correo = document.getElementById('regCorreo').value.trim().toLowerCase();
  const clave = document.getElementById('regPass').value;
  const confirmarClave = document.getElementById('regPass2').value;
  const vereda = document.getElementById('regVereda').value.trim();
  const confirmado = document.getElementById('chkResidente').checked;
  if(!nombre || !correo || !clave || !confirmarClave || clave !== confirmarClave){
    toast('Completa nombre, correo y contraseñas iguales');
    return;
  }
  if(!confirmado || !vereda){
    toast('Debes indicar tu vereda/barrio y confirmar que resides en Manta');
    return;
  }
  if(correo === ADMIN_CORREO || cuentasPendientes.some(c=>c.correo===correo) || cuentasVerificadas.includes(correo)){
    toast('Ese correo ya tiene una cuenta o solicitud');
    return;
  }
  correoSesion = correo;
  cuentaVerificada = false;
  perfilUsuario = {
    nombre, correo, telefono:document.getElementById('regTel').value.trim(), vereda,
    instagram:'', facebook:'', tiktok:''
  };
  perfilesCuentas[correo] = {...perfilUsuario};
  cuentasPendientes.push({id:Date.now(), nombre, correo, vereda, fecha:new Date().toISOString().slice(0,10)});
  guardarEstadoCuentas();
  ls('mantalink-perfil', JSON.stringify(perfilUsuario));
  ls('mantalink-cuenta-correo', correo);
  sesionActiva = true; ls('mantalink-sesion','1'); actualizarSesion();
  toast('Solicitud enviada. Tu cuenta queda pendiente de verificación.');
  navegar('perfil');
});

/* ---------- Tema, tamaño de texto e idioma ---------- */
function applyTheme(name){
  document.documentElement.setAttribute('data-theme', name); ls('mantalink-theme', name);
  document.querySelectorAll('[data-theme-btn]').forEach(b=>b.classList.toggle('active', b.dataset.themeBtn===name));
}
function applyTextSize(size){
  document.documentElement.classList.toggle('text-grande', size==='grande'); ls('mantalink-textsize', size);
  document.querySelectorAll('[data-size-btn]').forEach(b=>b.classList.toggle('active', b.dataset.sizeBtn===size));
  document.getElementById('a11yBtn').classList.toggle('active', size==='grande');
}
function applyLang(lang){
  ls('mantalink-lang', lang);
  document.querySelectorAll('[data-lang-btn]').forEach(b=>b.classList.toggle('active', b.dataset.langBtn===lang));
  const dict = I18N[lang] || I18N.es;
  document.querySelectorAll('[data-i18n]').forEach(el=>{ if(dict[el.dataset.i18n]) el.textContent = dict[el.dataset.i18n]; });
  document.querySelectorAll('[data-i18n-ph]').forEach(el=>{ if(dict[el.dataset.i18nPh]) el.placeholder = dict[el.dataset.i18nPh]; });
}
function applyA11yFabVisible(show){
  document.getElementById('a11yBtn').hidden = !show;
  ls('mantalink-a11yfab', show ? '1' : '0');
  document.getElementById('a11yFabToggle').checked = show;
}
document.getElementById('a11yFabToggle').addEventListener('change', e=>applyA11yFabVisible(e.target.checked));

document.querySelectorAll('[data-theme-btn]').forEach(b=>b.addEventListener('click',()=>applyTheme(b.dataset.themeBtn)));
document.querySelectorAll('[data-size-btn]').forEach(b=>b.addEventListener('click',()=>applyTextSize(b.dataset.sizeBtn)));
document.querySelectorAll('[data-lang-btn]').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.langBtn)));

/* Acceso rápido de accesibilidad: alterna letra grande desde cualquier pantalla, sin entrar a Configuración */
document.getElementById('a11yBtn').addEventListener('click', ()=>{
  const actual = ls('mantalink-textsize') || 'normal';
  applyTextSize(actual === 'grande' ? 'normal' : 'grande');
});

/* ---------- Inicialización ---------- */
(function init(){
  cargarPerfil();
  correoSesion = ls('mantalink-cuenta-correo') || perfilUsuario.correo;
  cargarPerfil(correoSesion);
  cuentaVerificada = cuentasVerificadas.includes(correoSesion);
  try{ const raw = ls('mantalink-favoritos'); if(raw) favoritos = new Set(JSON.parse(raw)); }catch(e){}
  try{ const rawR = ls('mantalink-ratings'); if(rawR) vendedoresRating = JSON.parse(rawR); }catch(e){}
  try{ const rawM = ls('mantalink-mirating'); if(rawM) miUltimaCalificacion = JSON.parse(rawM); }catch(e){}
  poblarCategorias();
  poblarUbicaciones();
  applyTheme(ls('mantalink-theme') || 'manta');
  applyTextSize(ls('mantalink-textsize') || 'grande');
  applyLang(ls('mantalink-lang') || 'es');
  const a11yFabPref = ls('mantalink-a11yfab');
  applyA11yFabVisible(a11yFabPref === null ? true : a11yFabPref === '1'); // activo por defecto
  sesionActiva = ls('mantalink-sesion') === '1';
  adminActivo = ls('mantalink-admin') === '1';
  limpiarEventosVencidos();
  actualizarSesion();
  renderCatalogo();
  if(!location.hash) location.hash = '#/home';
  sincronizarDesdeHash();
})();
