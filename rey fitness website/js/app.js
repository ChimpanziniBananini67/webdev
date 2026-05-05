// Shared utilities
const Store = {
  get(k, d=null){ try{ return JSON.parse(localStorage.getItem(k)) ?? d } catch{ return d } },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)) },
  del(k){ localStorage.removeItem(k) }
};

// Seed test users on first load
(function seed(){
  if(!Store.get('pulse_users')){
    Store.set('pulse_users', [
      {username:'admin',    password:'admin123',   role:'admin',   name:'Admin User',  email:'admin@pulse.fit'},
      {username:'staff',    password:'staff123',   role:'staff',   name:'Staff Member',email:'staff@pulse.fit'},
      {username:'user',     password:'user123',    role:'user',    name:'Member One',  email:'user@pulse.fit'},
      {username:'default',  password:'default123', role:'user',    name:'Guest User',  email:'guest@pulse.fit'},
    ]);
  }
})();
