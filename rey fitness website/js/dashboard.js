const session = Store.get('pulse_session');
if(!session){ location.href = 'login.html'; }

document.getElementById('welcome').textContent = `Hey, ${session.name.split(' ')[0]}.`;
document.getElementById('role-pill').textContent = session.role.toUpperCase();
document.getElementById('logout-btn').addEventListener('click',()=>{Store.del('pulse_session');location.href='login.html'});

const NAV = {
  admin: ['Overview','Members','Staff','Revenue','Settings'],
  staff: ['Overview','Members','Check-Ins','Schedule'],
  user:  ['Overview','My Plan','Workouts','Billing']
};
const nav = document.getElementById('dash-nav');
nav.innerHTML = NAV[session.role].map((n,i)=>`<a class="${i===0?'active':''}" data-page="${n}">${n}</a>`).join('');
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.querySelectorAll('a').forEach(x=>x.classList.remove('active'));
  a.classList.add('active');
  render(a.dataset.page);
}));

const content = document.getElementById('dash-content');

function render(page){
  if(session.role==='admin') return renderAdmin(page);
  if(session.role==='staff') return renderStaff(page);
  return renderUser(page);
}

function stats(items){
  return `<div class="dash-grid">${items.map(i=>`<div class="stat-card"><div class="label">${i.l}</div><div class="value">${i.v}</div></div>`).join('')}</div>`;
}

function renderAdmin(page){
  const users = Store.get('pulse_users', []);
  if(page==='Members' || page==='Overview'){
    content.innerHTML = `
      ${stats([{l:'Members',v:users.filter(u=>u.role==='user').length},{l:'Staff',v:users.filter(u=>u.role==='staff').length},{l:'Revenue',v:'₱412k'},{l:'Active Today',v:'287'}])}
      <div class="dash-panel">
        <h3>All Users</h3>
        <table class="dash-table">
          <thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>${users.map(u=>`<tr><td>${u.name}</td><td>${u.username}</td><td>${u.email||'-'}</td><td><span class="role-pill">${u.role}</span></td></tr>`).join('')}</tbody>
        </table>
      </div>`;
  } else {
    content.innerHTML = `<div class="dash-panel"><h3>${page}</h3><p class="muted">Admin ${page} panel — full controls.</p></div>`;
  }
}

function renderStaff(page){
  if(page==='Overview'){
    content.innerHTML = `
      ${stats([{l:'Check-Ins Today',v:'142'},{l:'New Sign-ups',v:'8'},{l:'Classes',v:'5'},{l:'Issues',v:'1'}])}
      <div class="dash-panel"><h3>Today's Schedule</h3>
      <table class="dash-table"><thead><tr><th>Time</th><th>Class</th><th>Trainer</th><th>Capacity</th></tr></thead>
      <tbody>
        <tr><td>06:00</td><td>HIIT Burn</td><td>Coach Mia</td><td>18 / 20</td></tr>
        <tr><td>09:00</td><td>Powerlifting</td><td>Coach Rey</td><td>10 / 15</td></tr>
        <tr><td>17:00</td><td>Spin Class</td><td>Coach Jules</td><td>22 / 25</td></tr>
        <tr><td>19:00</td><td>Yoga Flow</td><td>Coach Anna</td><td>14 / 20</td></tr>
      </tbody></table></div>`;
  } else if(page==='Members'){
    const users = Store.get('pulse_users', []).filter(u=>u.role==='user');
    content.innerHTML = `<div class="dash-panel"><h3>Members</h3><table class="dash-table"><thead><tr><th>Name</th><th>Email</th><th>Plan</th></tr></thead><tbody>${users.map(u=>`<tr><td>${u.name}</td><td>${u.email||'-'}</td><td>Black Card</td></tr>`).join('')}</tbody></table></div>`;
  } else {
    content.innerHTML = `<div class="dash-panel"><h3>${page}</h3><p class="muted">Staff ${page} view.</p></div>`;
  }
}

function renderUser(page){
  if(page==='Overview'){
    content.innerHTML = `
      ${stats([{l:'Streak',v:'12d'},{l:'Workouts',v:'48'},{l:'Calories',v:'21k'},{l:'Plan',v:'BLACK'}])}
      <div class="dash-panel"><h3>Upcoming Sessions</h3>
      <table class="dash-table"><thead><tr><th>Date</th><th>Class</th><th>Trainer</th></tr></thead>
      <tbody>
        <tr><td>Tomorrow 06:00</td><td>HIIT Burn</td><td>Coach Mia</td></tr>
        <tr><td>Thu 17:00</td><td>Spin Class</td><td>Coach Jules</td></tr>
        <tr><td>Sat 09:00</td><td>Powerlifting</td><td>Coach Rey</td></tr>
      </tbody></table></div>`;
  } else if(page==='My Plan'){
    content.innerHTML = `<div class="dash-panel"><h3>Black Card Membership</h3><p class="muted">Active · Renews on Jun 5, 2026 · ₱750/mo</p><br/><a class="btn btn-primary">Manage Plan</a></div>`;
  } else if(page==='Billing'){
    content.innerHTML = `<div class="dash-panel"><h3>Billing History</h3><table class="dash-table"><thead><tr><th>Date</th><th>Description</th><th>Amount</th></tr></thead><tbody><tr><td>May 5</td><td>Black Card · Monthly</td><td>₱750.00</td></tr><tr><td>Apr 5</td><td>Black Card · Monthly</td><td>₱750.00</td></tr><tr><td>Mar 5</td><td>Black Card · Monthly</td><td>₱750.00</td></tr></tbody></table></div>`;
  } else {
    content.innerHTML = `<div class="dash-panel"><h3>${page}</h3><p class="muted">Member ${page} content.</p></div>`;
  }
}

render('Overview');
