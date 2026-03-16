SAN ANTONIO SHOP ECUADOR V5
===========================

Esta versión incluye:
- clientes con pedidos persistentes
- panel de repartidores aprobado manualmente
- tracking básico en vivo del repartidor
- ruta automática gratis con Leaflet + OSRM
- costo estimado de envío automático
- métodos de pago: efectivo, contra entrega, tarjeta y transferencia
- calificación de repartidores
- panel administrador con solicitudes, pedidos, pagos y métricas
- autoborrado con historial:
  * pendiente > 3 horas
  * entregado > 30 minutos
  * cancelado > 30 minutos

ARCHIVOS PRINCIPALES
- index.html ........ cliente
- repartidor.html ... repartidor
- admin.html ........ administrador
- shared.js ......... configuración y funciones comunes

CONFIGURACIÓN NECESARIA
1) Firebase Authentication habilitado
2) Firestore Database habilitado
3) Firebase Storage habilitado (para documentos y comprobantes)
4) En usuarios/<tu_uid> agrega:
   isAdmin: true

COLECCIONES USADAS
- usuarios
- pedidos
- repartidores
- calificaciones
- historial_pedidos

REGLAS / ÍNDICES
Puede que Firestore te pida crear índices al usar:
- pedidos where clienteId + orderBy createdAt
- pedidos orderBy createdAt

Si Firestore muestra un enlace para crear el índice, solo ábrelo y confirma.

NOTAS IMPORTANTES
- El cálculo del costo está listo y funcional como estimado local. La distancia inicial usa la ubicación del cliente y una estimación segura para no romper el flujo.
- La ruta en el mapa sí se dibuja en tiempo real cuando un repartidor ya tomó el pedido.
- El autoborrado se ejecuta cuando entra alguien a la app. Si quieres borrado 100% automático aunque nadie abra la app, luego conviene usar una Cloud Function programada.
- Para pagos con tarjeta dejé la estructura lista. La pasarela real se conecta después.

PUBLICAR
Puedes usar localhost, GitHub Pages o hosting HTTPS.
En Firebase Authentication agrega como dominio autorizado:
- mundosat.github.io
(o tu dominio final)



V6 agrega:
- ETA estimado para cliente
- costo usando repartidor activo más cercano cuando exista
- mapa operativo en vivo en admin
- archivos firestore.rules y storage.rules listos para copiar
- soporte para historial y tracking mejorado


GOOGLE MAPS (NUEVO Y OPCIONAL)
1. Abre el archivo google-maps-config.js
2. Reemplaza PON_AQUI_TU_API_KEY_DE_GOOGLE_MAPS por tu key real
3. Activa en Google Cloud estas APIs:
   - Maps JavaScript API
   - Distance Matrix API
   - Directions API
   - Geocoding API (opcional)
4. Si no pones la key, la app sigue funcionando con OpenStreetMap + OSRM
5. Firebase NO fue modificado en esta versión


GOOGLE MAPS API YA COLOCADA
- La key de Google Maps ya fue insertada en google-maps-config.js
- Si luego deseas cambiarla, edita ese archivo
- Recomendado: restringir la key por dominio desde Google Cloud
