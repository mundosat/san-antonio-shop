const firebaseConfig = {
  apiKey: "AIzaSyAXwplErUJKJOzrJ3CPZGRVjV8xiJfX9C0",
  authDomain: "san-antonio-shoop.firebaseapp.com",
  projectId: "san-antonio-shoop",
  storageBucket: "san-antonio-shoop.firebasestorage.app",
  messagingSenderId: "1000614313564",
  appId: "1:1000614313564:web:a875b213c4051efeeb7099"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage ? firebase.storage() : null;
const FieldValue = firebase.firestore.FieldValue;
const Timestamp = firebase.firestore.Timestamp;
const ECUADOR_PROVINCES = ["Azuay","Bolívar","Cañar","Carchi","Chimborazo","Cotopaxi","El Oro","Esmeraldas","Galápagos","Guayas","Imbabura","Loja","Los Ríos","Manabí","Morona Santiago","Napo","Orellana","Pastaza","Pichincha","Santa Elena","Santo Domingo de los Tsáchilas","Sucumbíos","Tungurahua","Zamora Chinchipe"];

const ECUADOR_CITIES = {
  "Azuay":["Cuenca","Gualaceo","Paute","Sígsig","Chordeleg","Girón","Nabón","Pucará","Santa Isabel"],
  "Bolívar":["Guaranda","San Miguel","Chillanes","Echeandía","Caluma"],
  "Cañar":["Azogues","La Troncal","Cañar","Biblián","Déleg","El Tambo"],
  "Carchi":["Tulcán","Montúfar","San Gabriel","Mira","Bolívar"],
  "Chimborazo":["Riobamba","Guano","Alausí","Colta","Chambo","Guamote"],
  "Cotopaxi":["Latacunga","La Maná","Salcedo","Pujilí","Saquisilí"],
  "El Oro":["Machala","Pasaje","Santa Rosa","Huaquillas","El Guabo","Arenillas"],
  "Esmeraldas":["Esmeraldas","Atacames","Quinindé","Muisne","Rioverde"],
  "Galápagos":["Puerto Ayora","Puerto Baquerizo Moreno","Puerto Villamil"],
  "Guayas":["Guayaquil","Durán","Daule","Samborondón","Milagro","Playas","Naranjal"],
  "Imbabura":["Ibarra","Otavalo","Cotacachi","Antonio Ante","Pimampiro"],
  "Loja":["Loja","Catamayo","Saraguro","Macará","Zapotillo"],
  "Los Ríos":["Babahoyo","Quevedo","Ventanas","Vinces","Buena Fe"],
  "Manabí":["Portoviejo","Manta","Chone","Jipijapa","Montecristi","Bahía de Caráquez"],
  "Morona Santiago":["Macas","Sucúa","Gualaquiza","Limón Indanza"],
  "Napo":["Tena","Archidona","El Chaco"],
  "Orellana":["Coca","La Joya de los Sachas","Loreto"],
  "Pastaza":["Puyo","Mera","Santa Clara","Arajuno"],
  "Pichincha":["Quito","Cayambe","Rumiñahui","Mejía","Pedro Moncayo","Puerto Quito"],
  "Santa Elena":["Santa Elena","La Libertad","Salinas"],
  "Santo Domingo de los Tsáchilas":["Santo Domingo","La Concordia"],
  "Sucumbíos":["Lago Agrio","Shushufindi","Cascales","Cuyabeno"],
  "Tungurahua":["Ambato","Baños","Pelileo","Píllaro","Patate"],
  "Zamora Chinchipe":["Zamora","Yantzaza","El Pangui","Zumba"]
};
function fillCitySelect(id, province='', selected=''){
  const el = $(id); if (!el) return;
  const cities = ECUADOR_CITIES[province] || [];
  const current = selected || el.value || '';
  const options = ['<option value="">Ciudad</option>'].concat(cities.map(c => `<option value="${c}">${c}</option>`));
  if (el.tagName === 'SELECT') {
    el.innerHTML = options.join('');
    if (current) el.value = current;
  } else {
    if (current) el.value = current;
  }
}
function bindProvinceCity(provinceId, cityId, defaultProvince='', defaultCity=''){
  fillProvinceSelect(provinceId, defaultProvince);
  fillCitySelect(cityId, defaultProvince, defaultCity);
  const prov = $(provinceId), city = $(cityId);
  if (!prov || !city || prov.dataset.boundCities === '1') return;
  prov.dataset.boundCities = '1';
  prov.addEventListener('change', () => fillCitySelect(cityId, prov.value, ''));
}

const PAYMENT_METHODS = [
  {value:'efectivo', label:'Efectivo'},
  {value:'contra_entrega', label:'Contra entrega'},
  {value:'tarjeta', label:'Tarjeta'},
  {value:'transferencia', label:'Transferencia bancaria'}
];
const ORDER_STATUSES = ['pendiente','aceptado','en_camino','entregado','cancelado'];
let installPrompt = null;
function $(id){ return document.getElementById(id); }
function showMessage(message, type='success'){
  const box = $('statusMessage');
  if (!box) return;
  box.className = `alert alert-${type}`;
  box.innerHTML = message;
  box.style.display = 'block';
  clearTimeout(showMessage._t);
  showMessage._t = setTimeout(()=>box.style.display='none', 6000);
}
function safe(value, fallback='—'){ return value === null || value === undefined || value === '' ? fallback : String(value); }
function asNumber(v, fallback=0){ const n = Number(v); return Number.isFinite(n) ? n : fallback; }
function currency(v){ return '$' + asNumber(v,0).toFixed(2); }
function formatDate(value){
  try {
    if (!value) return 'Ahora';
    const date = value.toDate ? value.toDate() : new Date(value);
    return date.toLocaleString('es-EC');
  } catch { return 'Ahora'; }
}
function cleanPhone(value){ return String(value || '').replace(/[^\d]/g,''); }
function statusClass(status='pendiente'){ return `status-pill status-${String(status).replace(/\s+/g,'_')}`; }
function paymentStatusClass(status='pendiente'){ return `status-pill payment-${String(status).replace(/\s+/g,'_')}`; }
function fillProvinceSelect(id, selected=''){
  const el = $(id); if (!el) return;
  const current = selected || el.value || '';
  el.innerHTML = '<option value="">Provincia</option>' + ECUADOR_PROVINCES.map(p => `<option value="${p}">${p}</option>`).join('');
  if (current) el.value = current;
}
function fillPaymentSelect(id, selected='efectivo'){
  const el = $(id); if (!el) return;
  el.innerHTML = PAYMENT_METHODS.map(p => `<option value="${p.value}">${p.label}</option>`).join('');
  el.value = selected;
}
function requestNotificationPermission(){
  if (!('Notification' in window)) return Promise.resolve('unsupported');
  if (Notification.permission === 'granted') return Promise.resolve('granted');
  return Notification.requestPermission();
}
function browserNotify(title, body){
  if ('Notification' in window && Notification.permission === 'granted') new Notification(title,{body,icon:'icons/icon-192.png'});
}
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault(); installPrompt = e; const b = $('installBanner'); if (b) b.style.display = 'block';
});
async function installApp(){ if (!installPrompt) return; await installPrompt.prompt(); await installPrompt.userChoice; installPrompt = null; const b = $('installBanner'); if (b) b.style.display = 'none'; }
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(console.error));
async function saveUserProfile(user, role, extra={}){
  return db.collection('usuarios').doc(user.uid).set({
    email: user.email || '',
    role,
    approvalStatus: role === 'repartidor' ? 'pendiente' : 'n/a',
    approvedForDeliveries: role === 'repartidor' ? false : null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    ...extra
  }, {merge:true});
}
async function getUserProfile(uid){ const doc = await db.collection('usuarios').doc(uid).get(); return doc.exists ? doc.data() : null; }
async function uploadCourierFile(file, uid, key){
  if (!file) return '';
  if (!storage) throw new Error('Firebase Storage no está disponible.');
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const ref = storage.ref().child(`repartidores/${uid}/${key}-${Date.now()}.${ext}`);
  await ref.put(file);
  return ref.getDownloadURL();
}
function estimateDeliveryPrice(distanceKm){
  const km = Math.max(0, asNumber(distanceKm, 0));
  const base = 1.50;
  const perKm = 0.50;
  let total = base + km * perKm;
  if (km > 10) total += (km - 10) * 0.15;
  return Number(total.toFixed(2));
}
function estimateOrderTotal(orderValue, deliveryPrice){ return Number((asNumber(orderValue,0) + asNumber(deliveryPrice,0)).toFixed(2)); }
async function archiveOrder(docSnap){
  const d = docSnap.data();
  const historyRef = db.collection('historial_pedidos').doc(docSnap.id);
  await historyRef.set({
    ...d,
    archivedAt: FieldValue.serverTimestamp(),
    sourceCollection: 'pedidos'
  }, {merge:true});
}
async function deleteExpiredOrders(limitPerRun = 60){
  let deleted = 0;
  const now = Date.now();
  const deliveredCutoff = Timestamp.fromDate(new Date(now - 30 * 60 * 1000));
  const pendingCutoff = Timestamp.fromDate(new Date(now - 3 * 60 * 60 * 1000));
  const targets = [
    {statuses:['entregado','cancelado'], cutoff: deliveredCutoff},
    {statuses:['pendiente'], cutoff: pendingCutoff}
  ];
  for (const target of targets){
    const snap = await db.collection('pedidos').where('createdAt','<=', target.cutoff).limit(limitPerRun).get();
    if (snap.empty) continue;
    for (const doc of snap.docs){
      const d = doc.data();
      if (!target.statuses.includes(d.estado)) continue;
      await archiveOrder(doc);
      await doc.ref.delete();
      deleted++;
    }
  }
  return deleted;
}
function scheduleCleanup({showToast=false, intervalMs=10*60*1000}={}){
  const run = async ()=>{
    try{
      const deleted = await deleteExpiredOrders();
      if (showToast && deleted) showMessage(`Se limpiaron ${deleted} pedidos vencidos.`);
    }catch(err){ console.warn('No se pudo limpiar pedidos expirados', err); }
  };
  run();
  return setInterval(run, intervalMs);
}
function orderAgingLabel(data){
  const ts = data.createdAt?.toDate ? data.createdAt.toDate().getTime() : null;
  if (!ts) return '';
  const diffMin = Math.max(0, Math.floor((Date.now() - ts) / 60000));
  if (data.estado === 'pendiente' && diffMin >= 150) return '<span class="badge-chip">Se eliminará pronto</span>';
  if (['entregado','cancelado'].includes(data.estado) && diffMin >= 20) return '<span class="badge-chip">Limpieza próxima</span>';
  return '';
}
function paymentStatusLabel(status='pendiente'){ return String(status).replace(/_/g,' '); }
function orderStatusLabel(status='pendiente'){ return String(status).replace(/_/g,' '); }
function averageRating(items=[]){ if (!items.length) return 0; return items.reduce((a,b)=>a+asNumber(b.rating,0),0)/items.length; }

function haversineKm(lat1, lng1, lat2, lng2){
  const toRad = d => d * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2-lat1), dLng = toRad(lng2-lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
async function fetchRouteMetrics(fromLat, fromLng, toLat, toLng){
  const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=false&alternatives=false&steps=false`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo calcular la ruta.');
  const data = await res.json();
  const route = data?.routes?.[0];
  if (!route) throw new Error('No hay ruta disponible.');
  const distanceKm = Number((route.distance / 1000).toFixed(2));
  const durationMin = Math.max(1, Math.round(route.duration / 60));
  return {distanceKm, durationMin};
}
async function getNearestApprovedCourier(customerLat, customerLng){
  const snap = await db.collection('repartidores').where('activo','==',true).get().catch(()=>null);
  if (!snap || snap.empty) return null;
  let best = null;
  snap.forEach(doc => {
    const d = doc.data();
    if (!d?.lat || !d?.lng) return;
    const km = haversineKm(customerLat, customerLng, Number(d.lat), Number(d.lng));
    if (!best || km < best.distanceKm) best = {id: doc.id, ...d, distanceKm: km};
  });
  return best;
}
function estimateEtaMinutes(distanceKm, status='pendiente'){
  const base = status === 'en_camino' ? 4 : 8;
  const travel = Math.max(3, Math.round(asNumber(distanceKm, 0) * 4.2));
  return base + travel;
}



function timestampToMillis(value){
  try{
    if (!value) return 0;
    if (typeof value.toMillis === 'function') return value.toMillis();
    if (typeof value.toDate === 'function') return value.toDate().getTime();
    const t = new Date(value).getTime();
    return Number.isFinite(t) ? t : 0;
  }catch{return 0;}
}
function sortDocsByRecent(items=[]){
  return [...items].sort((a,b)=>{
    const da=a.data?a.data():a;
    const db=b.data?b.data():b;
    const av = timestampToMillis(da.ultimaActualizacion || da.createdAt || da.deliveredAt || da.updatedAt);
    const bv = timestampToMillis(db.ultimaActualizacion || db.createdAt || db.deliveredAt || db.updatedAt);
    return bv-av;
  });
}
async function saveCourierMirror(uid, payload={}){
  const clean = {...payload};
  delete clean.isAdmin;
  return db.collection('repartidores').doc(uid).set({
    uid,
    nombre: clean.fullName || clean.nombre || '',
    email: clean.email || '',
    telefono: clean.telefono || '',
    provincia: clean.provincia || '',
    ciudad: clean.ciudad || '',
    cedula: clean.cedula || '',
    vehiculo: clean.vehicleType || clean.vehiculo || '',
    vehicleType: clean.vehicleType || clean.vehiculo || '',
    placa: clean.placa || '',
    licencia: clean.licenseNumber || clean.licencia || '',
    licenseNumber: clean.licenseNumber || clean.licencia || '',
    notes: clean.notes || '',
    cedulaDocUrl: clean.cedulaDocUrl || '',
    licenciaDocUrl: clean.licenciaDocUrl || '',
    recordDocUrl: clean.recordDocUrl || '',
    approvalStatus: clean.approvalStatus || 'pendiente',
    estado: clean.approvalStatus === 'aprobado' ? 'aprobado' : (clean.approvalStatus || 'pendiente'),
    aprobado: clean.approvalStatus === 'aprobado',
    approvedForDeliveries: clean.approvedForDeliveries === true,
    activo: clean.approvedForDeliveries === true,
    createdAt: clean.createdAt || FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  }, {merge:true});
}
async function deleteOrdersByStatuses(statuses=[]){
  if (!statuses.length) return 0;
  const snap = await db.collection('pedidos').get();
  let count = 0;
  const batch = db.batch();
  snap.forEach(doc=>{
    const d = doc.data() || {};
    const payment = d.estadoPago || 'pendiente';
    if (statuses.includes(d.estado) || statuses.includes(payment)) { batch.delete(doc.ref); count++; }
  });
  if (count) await batch.commit();
  return count;
}
