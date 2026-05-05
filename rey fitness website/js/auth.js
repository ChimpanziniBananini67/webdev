// Tab switching
const tabs = document.querySelectorAll('.auth-tab');
const forms = { login: document.getElementById('login-form'), register: document.getElementById('register-form') };
function activate(tab){
  tabs.forEach(t=>t.classList.toggle('active', t.dataset.tab===tab));
  Object.entries(forms).forEach(([k,f])=>f.classList.toggle('active', k===tab));
}
tabs.forEach(t=>t.addEventListener('click',()=>activate(t.dataset.tab)));
document.querySelectorAll('[data-switch]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();activate(a.dataset.switch)}));
activate(location.hash.includes('register')?'register':'login');

// Quick fill
const QUICK = {
  admin:   {u:'admin',   p:'admin123'},
  staff:   {u:'staff',   p:'staff123'},
  user:    {u:'user',    p:'user123'},
  default: {u:'default', p:'default123'},
};
document.querySelectorAll('.quick-btn').forEach(b=>b.addEventListener('click',()=>{
  const v = QUICK[b.dataset.fill];
  document.getElementById('login-username').value = v.u;
  document.getElementById('login-password').value = v.p;
}));

function showMsg(id, text, type='error'){
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'auth-message show ' + type;
}

// Login
forms.login.addEventListener('submit', e=>{
  e.preventDefault();
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value;
  const users = Store.get('pulse_users', []);
  const found = users.find(x=>x.username===u && x.password===p);
  if(!found) return showMsg('login-message', 'Invalid username or password.');
  Store.set('pulse_session', {username:found.username, role:found.role, name:found.name});
  showMsg('login-message', `Welcome ${found.name}! Redirecting…`, 'success');
  setTimeout(()=>location.href='dashboard.html', 700);
});

// Register
forms.register.addEventListener('submit', e=>{
  e.preventDefault();
  const get = id => document.getElementById(id).value.trim();
  const u = get('reg-username');
  const pw = get('reg-password');
  const cf = get('reg-confirm');
  if(pw.length < 6) return showMsg('register-message','Password must be at least 6 characters.');
  if(pw !== cf) return showMsg('register-message','Passwords do not match.');
  const users = Store.get('pulse_users', []);
  if(users.some(x=>x.username===u)) return showMsg('register-message','Username already taken.');
  const newUser = {username:u, password:pw, role:'user', name:`${get('reg-first')} ${get('reg-last')}`, email:get('reg-email'), phone:get('reg-phone')};
  users.push(newUser); Store.set('pulse_users', users);
  Store.set('pulse_session', {username:u, role:'user', name:newUser.name});
  showMsg('register-message','Account created! Redirecting…','success');
  setTimeout(()=>location.href='dashboard.html', 800);
});
