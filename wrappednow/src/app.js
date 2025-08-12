import { db } from './firebase.js';
import { collection, getDocs } from 'firebase/firestore/lite';

async function boot() {
  const snap = await getDocs(collection(db, 'cities'));
  const list = snap.docs.map(d => d.data());

  const pre = document.getElementById('log') || document.body.appendChild(document.createElement('pre'));
  pre.id = 'log';
  pre.textContent = JSON.stringify(list, null, 2);
}

document.addEventListener('deviceready', boot);
