document.getElementById('ui-main-date').innerText = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' });

// --- SISTEMA DE NAVEGACIÓN SPA (HISTORY API) ---
function mostrarVista(vistaId) {
    cerrarModales(); 
    if(vistaId === 'landing') {
        document.getElementById('app-container').style.display = 'none';
        document.getElementById('landing-container').style.display = 'block';
    } else {
        document.getElementById('landing-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';
        document.querySelectorAll('.app-view').forEach(e => e.classList.remove('active'));
        
        const targetEl = document.getElementById(vistaId);
        if(targetEl) targetEl.classList.add('active');
        else document.getElementById('vista-selector').classList.add('active');
        
        if(vistaId === 'vista-selector') {
            document.getElementById('btn-volver-web').style.display = 'block';
            document.getElementById('btn-cambiar-rol').style.display = 'none';
        } else {
            document.getElementById('btn-volver-web').style.display = 'none';
            document.getElementById('btn-cambiar-rol').style.display = 'block';
        }
        
        document.getElementById('ui-main-queue').innerText = colaOffline.length;
        render();
    }
    window.scrollTo(0, 0);
}

window.addEventListener('popstate', (e) => {
    if(e.state && e.state.vista) mostrarVista(e.state.vista);
    else mostrarVista('landing');
});

window.addEventListener('load', () => {
    history.replaceState({ vista: 'landing' }, '', window.location.pathname);
    mostrarVista('landing');
});

function abrirApp() { history.pushState({ vista: 'vista-selector' }, '', '#plataforma'); mostrarVista('vista-selector'); }
function cerrarApp() { history.pushState({ vista: 'landing' }, '', '#'); mostrarVista('landing'); }
function volverMenuRoles() { history.pushState({ vista: 'vista-selector' }, '', '#plataforma'); mostrarVista('vista-selector'); }
function seleccionarRol(rol) {
    let targetId = (rol === 'mozo') ? 'vista-mozo-login' : `vista-${rol}`;
    history.pushState({ vista: targetId }, '', `#${targetId}`);
    mostrarVista(targetId);
}

// --- NUEVA LÓGICA DE LOGIN PARA EL SIMULADOR ---
function validarLoginSimulador() {
    const user = document.getElementById('simulador-user').value.toLowerCase();
    const pass = document.getElementById('simulador-pass').value;
    
    if(user === 'admin' && pass === '1234') {
        document.getElementById('simulador-error').style.display = 'none';
        document.getElementById('simulador-user').value = ''; 
        document.getElementById('simulador-pass').value = ''; 
        cerrarModales(); 
        abrirApp(); 
    } else {
        document.getElementById('simulador-error').style.display = 'block';
    }
}

// --- SISTEMA DINÁMICO Y GESTIÓN DE MOZOS ---
let dbMozos = JSON.parse(localStorage.getItem('upn_dbMozos')) || [ { id: 'm1', nombre: 'Carlos Mendoza', pin: '1234' }, { id: 'm2', nombre: 'Juan Pérez', pin: '1234' } ];

function guardarMozos() { localStorage.setItem('upn_dbMozos', JSON.stringify(dbMozos)); }

function renderSelectMozos() {
    const selectLogin = document.getElementById('log-mozo-user'); const selectEdit = document.getElementById('edit-mozo-id');
    selectLogin.innerHTML = ''; selectEdit.innerHTML = '';
    dbMozos.forEach(m => { const opt = `<option value="${m.id}">${m.nombre}</option>`; selectLogin.innerHTML += opt; selectEdit.innerHTML += opt; });
}
renderSelectMozos();

function renderAdminMozos() {
    if(!isAdmin) return;
    const list = document.getElementById('ui-admin-mozos-list');
    if(!list) return;
    list.innerHTML = '';
    dbMozos.forEach(m => {
        list.innerHTML += `
            <div class="order-card" style="border-left: 5px solid var(--info); display: flex; flex-direction: column; align-items: stretch; gap: 10px;">
                <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                    <div>
                        <h4><i class="fa-solid fa-user-tie"></i> ${m.nombre}</h4>
                        <p style="font-size:12px; color:var(--text-muted);">PIN Acceso: ${m.pin}</p>
                    </div>
                </div>
                <button onclick="eliminarMozo('${m.id}')" style="background:var(--danger); color:white; border:none; padding:8px 12px; border-radius:6px; cursor:pointer; width: 100%; font-weight: bold; transition: 0.2s;">
                    <i class="fa-solid fa-trash"></i> Eliminar del Sistema
                </button>
            </div>
        `;
    });
}

function agregarMozo() {
    const nombre = document.getElementById('new-mozo-name').value;
    const pin = document.getElementById('new-mozo-pin').value;
    if(nombre.trim() === '' || pin.trim() === '') {
        alert('Por favor, ingresa el nombre y el PIN del nuevo mozo.');
        return;
    }
    const nuevoId = 'm' + Date.now();
    dbMozos.push({ id: nuevoId, nombre: nombre, pin: pin });
    guardarMozos(); renderSelectMozos(); renderAdminMozos();
    document.getElementById('new-mozo-name').value = ''; document.getElementById('new-mozo-pin').value = '';
}

function eliminarMozo(id) {
    if(dbMozos.length <= 1) { alert('Debe haber al menos un mozo registrado en el sistema.'); return; }
    if(confirm('¿Estás seguro de eliminar a este empleado del sistema permanentemente?')) {
        dbMozos = dbMozos.filter(m => m.id !== id);
        guardarMozos(); renderSelectMozos(); renderAdminMozos();
    }
}

let currentMozo = '';
function loginMozo() {
    const idSeleccionado = document.getElementById('log-mozo-user').value; const p = document.getElementById('log-mozo-pass').value;
    const mozo = dbMozos.find(m => m.id === idSeleccionado);
    if(mozo && mozo.pin === p) { 
        currentMozo = mozo.nombre; document.getElementById('ui-mozo-name').innerText = mozo.nombre; 
        document.getElementById('log-mozo-error').style.display = 'none'; document.getElementById('log-mozo-pass').value = ''; 
        history.pushState({ vista: 'vista-mozo' }, '', '#salon');
        mostrarVista('vista-mozo');
    } else { document.getElementById('log-mozo-error').style.display = 'block'; }
}
function cerrarSesionMozo() { currentMozo = ''; volverMenuRoles(); }

// --- SISTEMA DINÁMICO DE ADMIN Y RECUPERACIÓN ---
let adminCreds = JSON.parse(localStorage.getItem('upn_adminCreds')) || { user: 'admin', pass: 'Taita2026' };
document.getElementById('log-user').placeholder = `Usuario (ej. ${adminCreds.user})`;

function login() {
    const u = document.getElementById('log-user').value; const p = document.getElementById('log-pass').value;
    if(u === adminCreds.user && p === adminCreds.pass) {
        isAdmin = true; 
        document.getElementById('log-error').style.display = 'none'; document.getElementById('log-user').value = ''; document.getElementById('log-pass').value = ''; 
        history.pushState({ vista: 'vista-admin-panel' }, '', '#gerencia');
        mostrarVista('vista-admin-panel');
    } else { document.getElementById('log-error').style.display = 'block'; }
}
function cerrarSesionAdmin() { isAdmin = false; volverMenuRoles(); }

function recuperarAdmin() {
    const master = document.getElementById('rec-master-key').value;
    const newUser = document.getElementById('rec-new-user').value;
    const newPass = document.getElementById('rec-new-pass').value;

    if(master === 'UPN2026') {
        if(newUser.trim() !== '' && newPass.trim() !== '') {
            adminCreds = { user: newUser, pass: newPass };
            localStorage.setItem('upn_adminCreds', JSON.stringify(adminCreds));
            document.getElementById('rec-admin-error').style.display = 'none';
            document.getElementById('rec-admin-success').style.display = 'block';
            document.getElementById('rec-master-key').value = '';
            document.getElementById('log-user').placeholder = `Usuario (ej. ${newUser})`;
        }
    } else {
        document.getElementById('rec-admin-error').style.display = 'block'; document.getElementById('rec-admin-success').style.display = 'none';
    }
}

function cargarDatosMozoEdit() {
    const id = document.getElementById('edit-mozo-id').value; const mozo = dbMozos.find(m => m.id === id);
    if(mozo) { document.getElementById('edit-mozo-name').value = mozo.nombre; document.getElementById('edit-mozo-pin').value = ''; document.getElementById('edit-admin-pass').value = ''; document.getElementById('edit-mozo-error').style.display = 'none'; document.getElementById('edit-mozo-success').style.display = 'none'; }
}

function guardarEdicionMozo() {
    const id = document.getElementById('edit-mozo-id').value; const nuevoNombre = document.getElementById('edit-mozo-name').value;
    const nuevoPin = document.getElementById('edit-mozo-pin').value; const adminPass = document.getElementById('edit-admin-pass').value;
    if(adminPass !== adminCreds.pass) { document.getElementById('edit-mozo-error').style.display = 'block'; document.getElementById('edit-mozo-success').style.display = 'none'; return; }
    const index = dbMozos.findIndex(m => m.id === id);
    if(index !== -1) {
        if(nuevoNombre.trim() !== '') dbMozos[index].nombre = nuevoNombre;
        if(nuevoPin.trim() !== '') dbMozos[index].pin = nuevoPin;
        guardarMozos(); renderSelectMozos(); document.getElementById('edit-mozo-error').style.display = 'none'; document.getElementById('edit-mozo-success').style.display = 'block'; document.getElementById('edit-admin-pass').value = '';
    }
}

// --- FUNCIONES DE BASE DE DATOS Y RED ---
let dbCentral = JSON.parse(localStorage.getItem('upn_dbCentral')) || [];
let colaOffline = JSON.parse(localStorage.getItem('upn_colaOffline')) || [];
let isAdmin = false;

function guardarBD() { localStorage.setItem('upn_dbCentral', JSON.stringify(dbCentral)); localStorage.setItem('upn_colaOffline', JSON.stringify(colaOffline)); document.getElementById('ui-main-queue').innerText = colaOffline.length; }

function resetearSistema() {
    if(confirm("⚠️ ¿Estás seguro de que deseas formatear el sistema y borrar todas las ventas?")) {
        localStorage.removeItem('upn_dbCentral'); localStorage.removeItem('upn_colaOffline');
        dbCentral = []; colaOffline = []; render();
    }
}

let online = navigator.onLine;
function monitorearRed() {
    online = navigator.onLine; const badge = document.getElementById('net-badge'); const statusMain = document.getElementById('ui-main-status');
    if(online) { badge.className = 'net-indicator net-on'; badge.innerHTML = '<i class="fa-solid fa-wifi"></i> CONECTADO'; statusMain.className = 'value green'; statusMain.innerHTML = '<i class="fa-solid fa-check-circle"></i> En Línea'; if(colaOffline.length > 0) { colaOffline.forEach(p => { p.st = 'enviado'; dbCentral.unshift(p); }); colaOffline = []; guardarBD(); } } 
    else { badge.className = 'net-indicator net-off'; badge.innerHTML = '<i class="fa-solid fa-wifi" style="text-decoration: line-through;"></i> SIN SEÑAL'; statusMain.className = 'value orange'; statusMain.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Offline'; }
    render();
}
window.addEventListener('online', monitorearRed); window.addEventListener('offline', monitorearRed);

// --- MANEJO DE PEDIDOS Y PAGOS ---
function enviarPedido() {
    const val = document.getElementById('app-prod').value.split('|'); 
    const cant = parseInt(document.getElementById('app-cant').value);
    const mesaInput = document.getElementById('app-mesa').value;
    const mesaNum = mesaInput ? mesaInput : 'N/A'; 

    const p = { 
        id: Math.random().toString(36).substr(2,6).toUpperCase(), 
        mozo: currentMozo, 
        mesa: mesaNum, 
        nom: val[0], cant: cant, tot: parseFloat(val[1]) * cant, 
        st: online ? 'enviado' : 'pendiente',
        pago: 'pendiente' 
    };
    if(online) dbCentral.unshift(p); else colaOffline.unshift(p);
    
    document.getElementById('app-cant').value = 1; 
    document.getElementById('app-mesa').value = ''; 
    guardarBD(); render();
}

function setEstado(id, est) { const p = dbCentral.find(x => x.id === id); if(p) { p.st = est; guardarBD(); render(); } }

function alternarPago(id, isCajero = false) {
    const p = dbCentral.find(x => x.id === id);
    if(p) {
        if(isCajero && p.pago === 'pendiente') {
            if(!confirm(`💰 ¿Confirmas que recibiste el pago de S/ ${p.tot.toFixed(2)} por este Box?`)) return;
        }
        p.pago = (p.pago === 'pagado') ? 'pendiente' : 'pagado';
        guardarBD(); render();
    }
}

// Variables para los gráficos
let chartMensual = null;
let chartProductos = null;

function renderGraficos(totalActual) {
    if(chartMensual) chartMensual.destroy();
    if(chartProductos) chartProductos.destroy();

    const ctxMes = document.getElementById('chartMensual');
    const ctxProd = document.getElementById('chartProductos');
    if(!ctxMes || !ctxProd) return;

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.borderColor = '#334155';

    // Gráfico 1: Ingresos Históricos (Pregunta: ¿Cuánto se ganó por mes?)
    chartMensual = new Chart(ctxMes.getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun (Actual)'],
            datasets: [{
                label: 'Ingresos (S/)',
                data: [4200, 5100, 4800, 5900, 6200, totalActual > 0 ? totalActual : 850],
                backgroundColor: '#DEFF9A',
                borderRadius: 4
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Gráfico 2: Productos más vendidos
    let prodLabels = ['Pilsen', 'Chilcano', 'Piqueo Taita', 'Red Bull'];
    let prodData = [45, 30, 15, 10];

    const pagados = dbCentral.filter(p => p.pago === 'pagado');
    if(pagados.length > 0) {
        const conteo = {};
        pagados.forEach(p => { conteo[p.nom] = (conteo[p.nom] || 0) + p.cant; });
        const ordenado = Object.entries(conteo).sort((a,b) => b[1] - a[1]);
        prodLabels = ordenado.slice(0, 4).map(item => item[0].split(' ')[0] + '...'); // Acortar nombres largos
        prodData = ordenado.slice(0, 4).map(item => item[1]);
    }

    chartProductos = new Chart(ctxProd.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: prodLabels,
            datasets: [{
                data: prodData,
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
    });
}

function render() {
    document.getElementById('ui-main-queue').innerText = colaOffline.length;
    const rm = document.getElementById('ui-mozo-lista'); rm.innerHTML = '';
    const misPedidosOffline = colaOffline.filter(p => p.mozo === currentMozo); const misPedidosCentral = dbCentral.filter(p => p.mozo === currentMozo);
    
    [...misPedidosOffline, ...misPedidosCentral].forEach(p => { 
        rm.innerHTML += `<div class="order-card st-${p.st}"><div><h4>${p.cant}x ${p.nom}</h4><p style="font-size:12px; color:var(--text-muted);">Box: ${p.mesa || 'N/A'} | ID: ${p.id}</p></div><span class="badge">${p.st}</span></div>`; 
    });

    const cn = document.getElementById('ui-cajero-nuevos'); cn.innerHTML = ''; 
    const cp = document.getElementById('ui-cajero-prep'); cp.innerHTML = '';
    const cc = document.getElementById('ui-cajero-cobrar'); cc.innerHTML = '';
    
    dbCentral.forEach(p => {
        let mesaText = p.mesa ? p.mesa : 'N/A';
        let btnPago = p.pago === 'pagado' 
            ? `<button onclick="alternarPago('${p.id}', true)" style="margin-top:8px; padding:4px 8px; font-size:11px; border:none; border-radius:4px; font-weight:bold; cursor:pointer; color:white; background:var(--success)"><i class="fa-solid fa-check"></i> Pagado</button>`
            : `<button onclick="alternarPago('${p.id}', true)" style="margin-top:8px; padding:4px 8px; font-size:11px; border:none; border-radius:4px; font-weight:bold; cursor:pointer; color:white; background:var(--danger)"><i class="fa-solid fa-money-bill"></i> Cobrar S/ ${p.tot}</button>`;

        let infoHtml = `
            <div>
                <h4>${p.cant}x ${p.nom}</h4>
                <p style="font-size:12px; color:var(--text-muted);"><i class="fa-solid fa-cube" style="color:var(--warning)"></i> Box: ${mesaText} | <i class="fa-solid fa-user-tie"></i> ${p.mozo}</p>
                ${btnPago}
            </div>
        `;

        if(p.st === 'enviado') {
            cn.innerHTML += `<div class="order-card st-enviado">${infoHtml}<button onclick="setEstado('${p.id}','preparando')" style="padding:10px; background:var(--info); color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;" title="Preparar"><i class="fa-solid fa-fire-burner"></i></button></div>`;
        }
        else if(p.st === 'preparando') {
            cp.innerHTML += `<div class="order-card st-preparando">${infoHtml}<button onclick="setEstado('${p.id}','entregado')" style="padding:10px; background:purple; color:white; border:none; border-radius:6px; cursor:pointer; font-weight:bold;" title="Entregar"><i class="fa-solid fa-martini-glass-citrus"></i></button></div>`;
        }
        else if(p.st === 'entregado' && p.pago === 'pendiente') {
            cc.innerHTML += `<div class="order-card st-pendiente">${infoHtml}</div>`;
        }
    });

    if(isAdmin) {
        const ta = document.getElementById('ui-admin-tabla'); ta.innerHTML = ''; 
        let t = 0, c = 0, pend = 0;
        
        dbCentral.forEach(p => { 
            let mesaText = p.mesa ? p.mesa : 'N/A';
            
            let pagoBadge = p.pago === 'pagado' 
                ? `<button onclick="alternarPago('${p.id}', false)" class="badge" style="border:none; cursor:pointer; background:rgba(16,185,129,0.2); color:var(--success)" title="Clic para revertir a Pendiente">Pagado <i class="fa-solid fa-rotate-left"></i></button>` 
                : `<button onclick="alternarPago('${p.id}', false)" class="badge" style="border:none; cursor:pointer; background:rgba(239,68,68,0.2); color:var(--danger)" title="Clic para marcar como Pagado">Pendiente <i class="fa-solid fa-check"></i></button>`;
            
            if(p.pago === 'pagado') {
                t += p.tot; 
                c++; 
            } else {
                pend++;
            }

            ta.innerHTML += `<tr>
                <td>${p.id}</td>
                <td>Box ${mesaText}<br><span style="font-size:11px; color:var(--text-muted)">${p.mozo}</span></td>
                <td>${p.cant}x ${p.nom}</td>
                <td>S/ ${p.tot.toFixed(2)}</td>
                <td>${pagoBadge}</td>
                <td><span class="badge st-${p.st}" style="border: 1px solid">${p.st}</span></td>
            </tr>`; 
        });
        
        document.getElementById('ui-admin-total').innerText = `S/ ${t.toFixed(2)}`; 
        document.getElementById('ui-admin-count').innerText = `${c} Pagados | ${pend} Pendientes`;
        renderAdminMozos();
        
        // Actualiza los gráficos del Dashboard de Gerencia con los montos calculados
        renderGraficos(t);
    }
}

// --- LÓGICA DE MENÚS Y MODALES ---
function toggleA11yMenu() { document.getElementById('a11yPanel').classList.toggle('active'); }
function toggleA11y(claseCSS, btnId) { document.body.classList.toggle(claseCSS); document.getElementById(btnId).classList.toggle('active-a11y'); }

function abrirModal(id, event) { 
    if(event) event.preventDefault(); 
    document.getElementById(id).classList.add('active'); 
}

function cerrarModales() { 
    document.getElementById('modal-mobile').classList.remove('active'); 
    document.getElementById('modal-arq').classList.remove('active'); 
    document.getElementById('modal-edit-mozo').classList.remove('active'); 
    document.getElementById('modal-recover-admin').classList.remove('active');
    document.getElementById('modal-login-simulador').classList.remove('active');
}

monitorearRed();