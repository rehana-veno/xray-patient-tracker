const seed = [
  {name:'Aisha Khan', id:'XR-1042', date:'2026-10-05', xray:'Chest X-Ray', status:'Scheduled'},
  {name:'Rahul Sharma', id:'XR-1043', date:'2026-10-04', xray:'Knee X-Ray', status:'Scanned'},
  {name:'Sana Ali', id:'XR-1044', date:'2026-10-03', xray:'Hand X-Ray', status:'Report Ready'}
];

let records = JSON.parse(localStorage.getItem('xrayRecords') || 'null') || seed;
const $ = (id) => document.getElementById(id);

function save(){localStorage.setItem('xrayRecords', JSON.stringify(records));}
function formatDate(v){if(!v)return '-'; const [y,m,d]=v.split('-'); return `${d}/${m}/${y}`;}
function statusClass(s){return s==='Report Ready'?'ready':s.toLowerCase();}

function render(){
  const q = $('search').value.trim().toLowerCase();
  const f = $('filter').value;
  const filtered = records.filter(r =>
    (f==='All'||r.status===f) &&
    (!q || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
  );
  $('recordsBody').innerHTML = filtered.map(r => `
    <tr>
      <td>${escapeHtml(r.name)}</td><td>${escapeHtml(r.id)}</td><td>${formatDate(r.date)}</td>
      <td>${escapeHtml(r.xray)}</td><td><span class="status ${statusClass(r.status)}">${escapeHtml(r.status)}</span></td>
      <td><button class="delete" data-id="${escapeHtml(r.id)}">Remove</button></td>
    </tr>`).join('');
  $('emptyState').style.display = filtered.length ? 'none' : 'block';
  $('totalPatients').textContent = records.length;
  $('scheduledCount').textContent = records.filter(r=>r.status==='Scheduled').length;
  $('scannedCount').textContent = records.filter(r=>r.status==='Scanned').length;
  $('readyCount').textContent = records.filter(r=>r.status==='Report Ready').length;
}
function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}

$('patientForm').addEventListener('submit', e => {
  e.preventDefault();
  const record = {
    name:$('name').value.trim(), id:$('patientId').value.trim(), date:$('date').value,
    xray:$('xrayType').value, status:$('status').value
  };
  if(records.some(r=>r.id.toLowerCase()===record.id.toLowerCase())){
    alert('Patient ID already exists in this demo. Please use another ID.'); return;
  }
  records.unshift(record); save(); render(); e.target.reset();
});
$('search').addEventListener('input', render);
$('filter').addEventListener('change', render);
$('recordsBody').addEventListener('click', e => {
  if(!e.target.matches('.delete')) return;
  const id = e.target.dataset.id;
  records = records.filter(r=>r.id!==id); save(); render();
});
render();
