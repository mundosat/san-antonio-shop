(function(){
  const state = { loaded:false, loading:false, promise:null, error:null };
  window.googleMapsState = state;

  window.hasGoogleMapsApiKey = function(){
    const key = String(window.GOOGLE_MAPS_API_KEY || '').trim();
    return !!key && !/^PON_AQUI_/i.test(key);
  };

  window.isGoogleMapsReady = function(){
    return !!(window.google && window.google.maps);
  };

  window.getMapProviderName = function(){
    return window.isGoogleMapsReady() ? 'Google Maps' : 'OpenStreetMap';
  };

  window.loadGoogleMapsApi = function(){
    if (window.isGoogleMapsReady()) {
      state.loaded = true;
      return Promise.resolve(window.google.maps);
    }
    if (!window.hasGoogleMapsApiKey()) return Promise.resolve(null);
    if (state.promise) return state.promise;
    state.loading = true;
    state.promise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-google-maps-loader="1"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.google?.maps || null), {once:true});
        existing.addEventListener('error', () => reject(new Error('No se pudo cargar Google Maps.')), {once:true});
        return;
      }
      const libraries = Array.isArray(window.GOOGLE_MAPS_LIBRARIES) ? window.GOOGLE_MAPS_LIBRARIES.join(',') : 'places,geometry';
      const region = encodeURIComponent(window.GOOGLE_MAPS_REGION || 'EC');
      const language = encodeURIComponent(window.GOOGLE_MAPS_LANGUAGE || 'es');
      const callbackName = '__googleMapsReady_' + Math.random().toString(36).slice(2);
      window[callbackName] = function(){
        state.loaded = true;
        state.loading = false;
        resolve(window.google.maps);
        try { delete window[callbackName]; } catch(_) { window[callbackName] = undefined; }
      };
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(window.GOOGLE_MAPS_API_KEY) + '&libraries=' + encodeURIComponent(libraries) + '&region=' + region + '&language=' + language + '&callback=' + callbackName;
      script.async = true;
      script.defer = true;
      script.dataset.googleMapsLoader = '1';
      script.onerror = function(){
        state.loading = false;
        state.error = new Error('No se pudo cargar Google Maps.');
        reject(state.error);
      };
      document.head.appendChild(script);
    });
    return state.promise;
  };

  window.googleDistanceMatrixRoute = async function(fromLat, fromLng, toLat, toLng){
    if (!window.hasGoogleMapsApiKey()) return null;
    const maps = await window.loadGoogleMapsApi();
    if (!maps?.DistanceMatrixService) return null;
    return new Promise((resolve, reject) => {
      const service = new maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [{lat:Number(fromLat), lng:Number(fromLng)}],
        destinations: [{lat:Number(toLat), lng:Number(toLng)}],
        travelMode: maps.TravelMode.DRIVING,
        unitSystem: maps.UnitSystem.METRIC,
        drivingOptions: { departureTime: new Date() },
        region: window.GOOGLE_MAPS_REGION || 'EC'
      }, (response, status) => {
        if (status !== 'OK') return reject(new Error('Google Maps Distance Matrix devolvió: ' + status));
        const element = response?.rows?.[0]?.elements?.[0];
        if (!element || element.status !== 'OK') return reject(new Error('Google Maps no encontró una ruta disponible.'));
        const distanceKm = Number(((element.distance?.value || 0) / 1000).toFixed(2));
        const durationMin = Math.max(1, Math.round((element.duration_in_traffic?.value || element.duration?.value || 0) / 60));
        resolve({distanceKm, durationMin, provider:'google'});
      });
    });
  };
})();
