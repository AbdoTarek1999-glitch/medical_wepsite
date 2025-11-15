// server.js (Node 14+)
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public')); // ضع ملفات الويب في مجلد public

// in-memory store (demo)
const users = {};

// register
app.post('/api/register', (req,res)=>{
  const { name, email, password } = req.body;
  if(!email || !password) return res.status(400).json({ error:'Missing' });
  if(users[email]) return res.status(409).json({ error:'User exists' });
  users[email] = { name, email, password };
  res.json({ ok:true });
});

// login
app.post('/api/login', (req,res)=>{
  const { email, password } = req.body;
  const u = users[email];
  if(!u || u.password !== password) return res.status(401).json({ error:'Invalid' });
  res.json({ ok:true, user:{ name:u.name, email:u.email } });
});

app.listen(PORT, ()=>console.log(`Server running on ${PORT}`));
