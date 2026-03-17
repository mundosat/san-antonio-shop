SAN ANTONIO SHOP ECUADOR V7
===========================

ESTRUCTURA SEPARADA
- index.html ........ app de clientes
- repartidor.html ... app exclusiva de repartidores
- admin.html ........ panel administrador
- shared.js ......... funciones y configuración compartida

QUÉ SE CORRIGIÓ
- separación real entre cliente y repartidor
- formulario roto de cliente reparado
- creación de pedidos reparada
- solicitud de repartidor movida a su propia app
- reglas de Firestore ajustadas para que repartidores aprobados sí puedan ver pedidos pendientes
- login de cliente redirige al panel correcto si la cuenta es de repartidor
- el cliente conserva seguimiento, historial y calificación

IMPORTANTE
1) Publica otra vez firestore.rules en Firebase.
2) Mantén Authentication, Firestore y Storage habilitados.
3) En usuarios/<tu_uid> agrega isAdmin: true para tu cuenta administrativa.
4) Si Firestore pide índices, créalos desde el enlace que te muestre Firebase.

FLUJO RECOMENDADO
- Cliente entra por index.html
- Repartidor entra por repartidor.html
- Admin revisa y aprueba solicitudes en admin.html
- Ambas apps comparten el mismo backend en Firebase
