// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBttX0vip3xIPpmxqtF0c972OBurCncp_4",
    authDomain: "crytw-5653d.firebaseapp.com",
    projectId: "crytw-5653d",
    storageBucket: "crytw-5653d.firebasestorage.app",
    messagingSenderId: "1068204969995",
    appId: "1:1068204969995:web:79f6b2b4da0d3364b4f70e",
    measurementId: "G-X6K808XGVH"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const signInBtn = document.getElementById('sign-in-btn');
const signOutBtn = document.getElementById('sign-out-btn');
const totalBalance = document.getElementById('total-balance');
const cryptoBreakdown = document.getElementById('crypto-breakdown');
const transactionHistory = document.getElementById('transaction-history');
const sendBtn = document.getElementById('send-btn');
const receiveBtn = document.getElementById('receive-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

// Authentication
signInBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(result => {
        alert('Signed in successfully');
    }).catch(error => {
        console.error(error.message);
    });
});

signOutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        alert('Signed out successfully');
    }).catch(error => {
        console.error(error.message);
    });
});

// Fetch User Balance and Breakdown
function fetchUserBalance() {
    db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
        if (doc.exists) {
            const data = doc.data();
            totalBalance.textContent = `$${data.totalBalance || 0}`;
            cryptoBreakdown.innerHTML = '';
            Object.entries(data.cryptos || {}).forEach(([crypto, amount]) => {
                const li = document.createElement('li');
                li.textContent = `${crypto}: ${amount}`;
                cryptoBreakdown.appendChild(li);
            });
        }
    });
}

// Fetch Transaction History
function fetchTransactionHistory() {
    db.collection('transactions').where('userId', '==', auth.currentUser.uid)
        .orderBy('date', 'desc').limit(10)
        .get().then(snapshot => {
            transactionHistory.innerHTML = '';
            snapshot.forEach(doc => {
                const data = doc.data();
                const li = document.createElement('li');
                li.textContent = `${data.date.toDate().toLocaleString()} - ${data.type}: $${data.amount} (${data.currency})`;
                transactionHistory.appendChild(li);
            });
        });
}

// Transaction Actions
sendBtn.addEventListener('click', () => {
    alert('Send Crypto feature coming soon!');
});

receiveBtn.addEventListener('click', () => {
    alert('Receive Crypto feature coming soon!');
});

// Theme Toggle
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Load Theme Preference
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Monitor Auth State
auth.onAuthStateChanged(user => {
    if (user) {
        fetchUserBalance();
        fetchTransactionHistory();
        signInBtn.style.display = 'none';
        signOutBtn.style.display = 'block';
    } else {
        totalBalance.textContent = '$0.00';
        cryptoBreakdown.innerHTML = '';
        transactionHistory.innerHTML = '';
        signInBtn.style.display = 'block';
        signOutBtn.style.display = 'none';
    }
});
