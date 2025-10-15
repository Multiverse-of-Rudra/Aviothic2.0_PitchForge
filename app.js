/* Senior Sync shared client module
   - Provides a global `SeniorSync` object with methods to log events, manage settings/contacts, and query stats.
   - Stores data in localStorage under 'senior_sync' (for demo only).
*/

(function(window){
  const KEY = 'senior_sync_v1';

  function load(){
    try{ const s = localStorage.getItem(KEY); return s? JSON.parse(s) : {events:[], contacts:[], settings:{sensitivity:'medium'}, active:true}; }catch(e){return {events:[], contacts:[], settings:{sensitivity:'medium'}, active:true}}
  }
  function save(state){ localStorage.setItem(KEY, JSON.stringify(state)); }

  const state = load();

  function now(){ return Date.now(); }

  const SeniorSync = {
    log(level, reason, meta){
      const ev = {id: 'e'+(Math.random()*1e9|0), ts: now(), level, reason, meta:meta||{}};
      state.events.unshift(ev);
      // keep recent 100 for demo
      if(state.events.length>200) state.events.length=200;
      save(state);
      return ev;
    },
    getAll(){ return state.events.slice(); },
    getRecent(n=10){ return state.events.slice(0,n); },
    clear(){ state.events = []; save(state); },
    stats(){
      const total = state.events.length;
      const resolved = state.events.filter(e=>e.meta && e.meta.resolved).length;
      return {total, resolved, active: !!state.active};
    },
    addContact(c){ if(!state.contacts.includes(c)){ state.contacts.push(c); save(state); } },
    removeContact(c){ state.contacts = state.contacts.filter(x=>x!==c); save(state); },
    getContacts(){ return state.contacts.slice(); },
    updateSettings(s){ state.settings = Object.assign({}, state.settings, s); save(state); },
    getSettings(){ return Object.assign({}, state.settings); },
    clearAll(){ state.events=[]; state.contacts=[]; state.settings={sensitivity:'medium'}; save(state); },
  // logo stored as data URL
  setLogo(dataUrl){ state.logo = dataUrl; save(state); },
  removeLogo(){ delete state.logo; save(state); },
  getLogo(){ return state.logo || null; },
  setLogoPath(p){ state.logoPath = p; save(state); },
  getLogoPath(){ return state.logoPath || null; },
  removeLogoPath(){ delete state.logoPath; save(state); },
    speak(text){ if(window.speechSynthesis){ const u=new SpeechSynthesisUtterance(text); window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } },
    // demo triggers
    triggerFall(){ const ev=this.log('critical','Possible fall (impact + immobility)'); this.speak('Possible fall detected. Are you okay?'); return ev },
    triggerSilence(){ const ev=this.log('warning','Prolonged silence / no activity'); this.speak('Unusual silence detected. Are you okay?'); return ev },
    triggerBreath(){ const ev=this.log('warning','Distressed breathing pattern'); this.speak('Breathing irregularity detected. Are you okay?'); return ev },

    // simple analytics: events per day over last N days
    analyticsDays(n=7){
      const days = Array.from({length:n}, (_,i)=>0);
      const nowT = now();
      const dayMs = 24*60*60*1000;
      state.events.forEach(ev=>{
        const daysAgo = Math.floor((nowT - ev.ts)/dayMs);
        if(daysAgo>=0 && daysAgo<n) days[daysAgo]++;
      })
      return days.reverse();
    },

    // render a tiny sparkline in a target element using canvas
    renderSparkline(el, opts){
      const w = opts.width || el.clientWidth || 200; const h = opts.height || 80; el.innerHTML = '';
      const c = document.createElement('canvas'); c.width = w; c.height = h; el.appendChild(c);
      const ctx = c.getContext('2d');
      const data = this.analyticsDays(12);
      const max = Math.max(1, ...data);
      ctx.clearRect(0,0,w,h);
      ctx.strokeStyle = 'rgba(10,110,200,0.95)'; ctx.lineWidth = 2; ctx.beginPath();
      data.forEach((v,i)=>{
        const x = Math.floor((i/(data.length-1))*(w-8))+4;
        const y = Math.floor(h - (v/max)*(h-12)) -6;
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.stroke();
    },

    // scheduled mock check-ins: every `intervalMs` add a benign event (for demo)
    startMockCheckins(intervalMs=60*1000){
      if(window.__senior_sync_checkin) return;
      window.__senior_sync_checkin = setInterval(()=>{ this.log('info','Scheduled check-in (mock)'); }, intervalMs);
    },
    stopMockCheckins(){ if(window.__senior_sync_checkin){ clearInterval(window.__senior_sync_checkin); window.__senior_sync_checkin = null; } }
    ,
    // Simulate notifying caregivers: logs an event per contact and returns results
    notifyCaregivers(payload){
      const results = [];
      const contacts = state.contacts.slice();
      if(!contacts.length){ const ev = this.log('warning','Notify attempted: no caregivers configured'); return {ok:false, results:[], message:'No caregivers configured'} }
      contacts.forEach(c=>{
        const meta = {to:c, payload};
        const res = {to:c, status:'sent', ts: now()};
        this.log('notice', `Notify to ${c}`, meta);
        results.push(res);
      });
      save(state);
      return {ok:true, results};
    }
  };

  window.SeniorSync = SeniorSync;

  // wire demo buttons if present on the page
  document.addEventListener('DOMContentLoaded', ()=>{
    const simFall = document.getElementById('simulate-fall');
    const simSilence = document.getElementById('simulate-silence');
    const simBreath = document.getElementById('simulate-breath');
    const respondOk = document.getElementById('respond-ok');
    const noResponse = document.getElementById('no-response');
    const statusEl = document.getElementById('status');
    const promptEl = document.getElementById('prompt');
    const alertEl = document.getElementById('alert');
    const alertMsg = document.getElementById('alert-msg');

    function setStatus(t){ if(statusEl) statusEl.textContent = t; }

    function showPrompt(reason){
      if(promptEl) promptEl.classList.remove('hidden');
      setStatus('Possible incident detected: '+reason);
      SeniorSync.speak('Senior Sync detected a possible emergency. Are you okay? Say Yes, I am fine to cancel.');
      window.currentTimeout = setTimeout(()=> escalate(reason), 7000);
    }

    function escalate(reason){
      if(promptEl) promptEl.classList.add('hidden');
      if(alertEl) alertEl.classList.remove('hidden');
      const ev = SeniorSync.log('critical', reason);
      const nowS = new Date(ev.ts).toLocaleString();
      const link = 'https://maps.google.com/?q=28.6139,77.2090';
      if(alertMsg) alertMsg.textContent = `${nowS} — ${reason}. Simulated alert created. Location: ${link}`;
      setStatus('Alert sent — awaiting caregiver response.');
      SeniorSync.speak('Alert sent to caregiver.');
    }

    if(simFall) simFall.onclick = ()=>{ setStatus('Impact detected — analyzing...'); setTimeout(()=> showPrompt('Possible fall (impact + immobility)'), 600); }
    if(simSilence) simSilence.onclick = ()=>{ setStatus('Prolonged silence detected — analyzing...'); setTimeout(()=> showPrompt('Prolonged silence / no activity'), 600); }
    if(simBreath) simBreath.onclick = ()=>{ setStatus('Breathing irregularity detected — analyzing...'); setTimeout(()=> showPrompt('Distressed breathing pattern'), 600); }
    if(respondOk) respondOk.onclick = ()=>{ clearTimeout(window.currentTimeout); if(promptEl) promptEl.classList.add('hidden'); setStatus('User responded: I am fine — monitoring resumed.'); SeniorSync.speak('Response received. Monitoring resumed.'); }
    if(noResponse) noResponse.onclick = ()=>{ clearTimeout(window.currentTimeout); escalate('No response to voice prompt'); }

    // populate header logo if present
    const logoData = SeniorSync.getLogo();
    if(logoData){ document.querySelectorAll('#site-logo').forEach(img=>img.src = logoData); }

    // wire settings logo input (if present)
    const logoInput = document.getElementById('logo-input');
    const logoPreview = document.getElementById('logo-preview');
    const removeLogoBtn = document.getElementById('remove-logo');
    if(logoInput){
      if(logoData && logoPreview) logoPreview.innerHTML = `<img src="${logoData}" style="height:48px;border-radius:8px"/>`;
      logoInput.onchange = (e)=>{
        const f = e.target.files && e.target.files[0];
        if(!f) return;
        const reader = new FileReader();
        reader.onload = ()=>{ SeniorSync.setLogo(reader.result); document.querySelectorAll('#site-logo').forEach(img=>img.src = reader.result); if(logoPreview) logoPreview.innerHTML = `<img src="${reader.result}" style="height:48px;border-radius:8px"/>`; };
        reader.readAsDataURL(f);
      }
    }
    if(removeLogoBtn){ removeLogoBtn.onclick = ()=>{ SeniorSync.removeLogo(); document.querySelectorAll('#site-logo').forEach(img=>img.src=''); if(logoPreview) logoPreview.innerHTML = ''; } }

    // wire logo path input
    const logoPathInput = document.getElementById('logo-path-input');
    const setLogoPathBtn = document.getElementById('set-logo-path');
    const removeLogoPathBtn = document.getElementById('remove-logo-path');
    if(logoPathInput && setLogoPathBtn){
      const existingPath = SeniorSync.getLogoPath();
      if(existingPath) logoPathInput.value = existingPath;
      setLogoPathBtn.onclick = ()=>{
        const p = logoPathInput.value.trim();
        if(!p) return alert('Enter a local absolute path');
        // convert Windows path to file URL
        let url = p;
        if(/^([A-Za-z]:\\)/.test(p)){
          url = 'file:///' + p.replace(/\\/g, '/');
        }
        SeniorSync.setLogoPath(url);
        document.querySelectorAll('#site-logo').forEach(img=>img.src = url);
        if(logoPreview) logoPreview.innerHTML = `<img src="${url}" style="height:48px;border-radius:8px"/>`;
      }
    }
    if(removeLogoPathBtn){ removeLogoPathBtn.onclick = ()=>{ SeniorSync.removeLogoPath(); document.querySelectorAll('#site-logo').forEach(img=>img.src=''); if(logoPreview) logoPreview.innerHTML = ''; } }

    // wire dashboard quick actions if present
    const panicBtn = document.getElementById('panic-btn');
    const notifyBtn = document.getElementById('notify-btn');
    if(panicBtn) panicBtn.onclick = ()=>{
      SeniorSync.log('critical','Manual panic button pressed by caregiver');
      SeniorSync.notifyCaregivers({reason:'Manual panic', severity:'critical'});
      alert('Panic simulated: caregivers notified (demo)');
    }
    if(notifyBtn) notifyBtn.onclick = ()=>{
      SeniorSync.log('info','Manual notify to caregivers (context)');
      SeniorSync.notifyCaregivers({reason:'Manual notify', severity:'info'});
      alert('Notify simulated: caregivers received context (demo)');
    }
  })

})(window);
