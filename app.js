// js/app.js (paste this file)
const form = document.getElementById('emailForm');
const emailInput = document.getElementById('email');
const resultBox = document.getElementById('result');
const resultJson = document.getElementById('resultJson');
const validateSecureBtn = document.getElementById('validateSecure');

function showResult(obj){
  resultBox.classList.remove('hidden');
  resultJson.textContent = JSON.stringify(obj, null, 2);
}

// DEMO direct call (only if you put a demo key here; not recommended for production)
const DEMO_API_KEY = ''; // leave blank unless testing direct call

async function validateDirect(email){
  if(!DEMO_API_KEY) throw new Error('DEMO_API_KEY is empty. Use proxy for real testing.');
  const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${encodeURIComponent(DEMO_API_KEY)}&email=${encodeURIComponent(email)}`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('Network response not ok: ' + res.status);
  return res.json();
}

async function validateViaProxy(email){
  // explicit absolute URL ensures this works even when index.html is opened as file://
  const proxyUrl = 'http://localhost:3000/validate';
  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if(!res.ok) {
    const text = await res.text();
    throw new Error('Server error: ' + res.status + ' — ' + text);
  }
  return res.json();
}

// Form submit (attempt demo direct, will error if DEMO key missing)
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const email = emailInput.value.trim();
  if(!email) return;
  resultBox.classList.add('hidden');
  try{
    const data = await validateDirect(email); // will throw if DEMO_API_KEY empty
    showResult(data);
  }catch(err){
    showResult({ error: err.message });
  }
});

// Secure validation button (calls your server proxy)
validateSecureBtn.addEventListener('click', async ()=>{
  const email = emailInput.value.trim();
  if(!email) return;
  resultBox.classList.add('hidden');
  try{
    const data = await validateViaProxy(email);
    showResult(data);
  }catch(err){
    showResult({ error: err.message });
  }
});
