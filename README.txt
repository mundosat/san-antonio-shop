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

