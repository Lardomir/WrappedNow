/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

document.addEventListener('deviceready', () => {
  const log = (m) => {
    const pre = document.getElementById('log') || document.body.appendChild(document.createElement('pre'));
    pre.id = 'log'; pre.textContent += m + '\n';
  };

  if (!window.FirebasePlugin) { log('FirebasePlugin fehlt'); return; }

  // Android 13+: Benachrichtigungs-Recht
  if (FirebasePlugin.hasPermission) {
    FirebasePlugin.hasPermission((granted) => {
      log('Push permission: ' + granted);
      if (!granted && FirebasePlugin.grantPermission) {
        FirebasePlugin.grantPermission((r)=>log('Permission requested: '+r),(e)=>log('Perm error: '+e));
      }
    });
  }

  // FCM-Token anzeigen (für Test-Push in der Konsole)
  FirebasePlugin.getToken(
    (t)=>log('FCM token:\n' + t),
    (e)=>log('getToken error: ' + e)
  );

  // Beispiel-Analytics
  FirebasePlugin.logEvent("app_open", {});
});
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}
