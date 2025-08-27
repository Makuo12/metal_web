# Metal Test Website  

This is a **test environment** for the Metal payment platform. It is designed to demonstrate how Metal could run in production.  

🔗 **Website Link**: [https://lively-mooncake-6bc680.netlify.app](https://lively-mooncake-6bc680.netlify.app)  
🌐 **Test API Domain**: [https://ghost.flizzup-server.com](https://ghost.flizzup-server.com)  
📡 Hosted on **Netlify**  

---

## ⚡ Overview  
- Tokens are **stored in localStorage** (not secure, for testing only).  
- Routes are connected to a **server running on the cloud**.  
- Includes **bank and business account dashboards**.  
- **When logging in**:  
  - Select **Bank** → to access the **Bank Dashboard**.  
  - Select **Business** → to access the **Business Dashboard**.  

---

## 🔑 Test Accounts  

### Bank Accounts  
- **Zenith Bank** → `zen@zenithHQ.com`  
- **Wema Bank** → `wema@wemabank.com`  

### Business Account  
- **Chioma Okwu** → `chioma.okwu@yahoo.com`  

### Password for all accounts  
```
makuo1234
```

---

## 📡 API Routes  

### **Protected Routes** (`/auth`)  
- `GET /profile` → Get user profile  
- `PUT /update` → Update user  
- `GET /businesses` → Get businesses  
- `GET /bank` → Get bank info  
- `GET /account` → Get account info  
- `GET /payments` → Get payments  

### **Public User Routes** (`/user`)  
- `POST /login` → Login  
- `POST /refresh` → Refresh token  
- `POST /register` → Register new user  

---

## ⚠️ Important Notes  
- This site is for **testing purposes only**.  
- Do not store real financial data.  
- Security is not enforced (e.g., tokens in localStorage).  
- Intended to **provide an idea of how Metal works in production**.  
