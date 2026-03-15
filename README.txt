SAN ANTONIO SHOP ECUADOR PRO
============================

Esta versión viene lista para GitHub Pages y Firebase.

Incluye:
- Clientes con pedidos y cálculo automático de envío
- Repartidores con ubicación en vivo y ruta en mapa
- Panel administrador
- Seguimiento tipo Uber Eats
- Calificación de repartidores
- App instalable (PWA)
- Caché offline básico

ANTES DE SUBIR A GITHUB
-----------------------
1) Haz respaldo de tu repositorio actual.
2) Reemplaza los archivos del repositorio por esta versión.
3) Sube los cambios a GitHub.
4) En Firebase publica también las reglas nuevas.

ARCHIVOS IMPORTANTES
--------------------
- index.html
- repartidor.html
- admin.html
- shared.js
- styles.css
- manifest.json
- service-worker.js
- firestore.rules
- storage.rules
- icons/

PASOS EN GITHUB (WEB)
---------------------
1) Entra al repositorio.
2) Pulsa Add file > Upload files.
3) Sube todos los archivos extraídos de este ZIP.
4) Confirma con un commit, por ejemplo:
   update san antonio shop pro

PASOS EN FIREBASE
-----------------
Publica las reglas nuevas desde consola o CLI:
- firestore.rules
- storage.rules

SI YA TIENES USUARIOS REGISTRADOS
---------------------------------
No se borran por subir estos archivos. Los usuarios están en Firebase Auth.
Tampoco se borran tus pedidos o repartidores por reemplazar el front-end.

PARA EL ADMIN
-------------
El usuario administrador debe tener en Firestore:
usuarios/TU_UID -> isAdmin: true

NOTA IMPORTANTE
---------------
Las notificaciones de esta versión son del navegador (Web Notifications).
Para push real en segundo plano con Firebase Cloud Messaging faltaría configurar:
- VAPID key
- firebase-messaging-sw.js
- token por usuario

Esta base ya quedó preparada para seguir creciendo sin romper la versión anterior.
