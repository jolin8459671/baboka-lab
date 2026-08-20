// =========================================================
// Firebase 專案設定
// 照 README / 對話裡的步驟建立好 Firebase 專案 + Realtime Database
// 後，把 Firebase 主控台「註冊 Web 應用」給你的 firebaseConfig
// 物件，整段貼到下面取代 REPLACE_ME_* 就可以了。
//
// 範例（你的內容長相會類似這樣，但數值不同）：
// const firebaseConfig = {
//   apiKey: "AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
//   authDomain: "babokalab-xxxxx.firebaseapp.com",
//   databaseURL: "https://babokalab-xxxxx-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "babokalab-xxxxx",
//   storageBucket: "babokalab-xxxxx.appspot.com",
//   messagingSenderId: "000000000000",
//   appId: "1:000000000000:web:xxxxxxxxxxxxxxxxxxxxxx"
// };
// =========================================================

const firebaseConfig = {
  apiKey: "AIzaSyDjKxmfz9J2Sawa-tPQ1P8SGAq98tqFkBE",
  authDomain: "babokalab-57cfb.firebaseapp.com",
  databaseURL: "https://babokalab-57cfb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "babokalab-57cfb",
  storageBucket: "babokalab-57cfb.firebasestorage.app",
  messagingSenderId: "872644809991",
  appId: "1:872644809991:web:5d5ae236fe97be55d621a2"
};

// 不用動下面這行：初始化 Firebase App（用 compat 版 SDK，online.js 會透過 window.firebase 使用）
if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== 'REPLACE_ME_API_KEY') {
  firebase.initializeApp(firebaseConfig);
} else if (typeof firebase !== 'undefined') {
  console.warn('firebase-config.js 裡的 firebaseConfig 還沒填，線上對戰無法連線。');
}
