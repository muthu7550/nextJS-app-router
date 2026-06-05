 "use client"
 
 import CryptoJS from 'crypto-js';

const SECRET_KEY = 'my-secret-key-123';

export const setEncryptedItem = (key, data) => {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  localStorage.setItem(key, encryptedData);
};

// 3. Get and Decrypt Data
export const getDecryptedItem = (key) => {
  const encryptedData = localStorage.getItem(key);
  
  if (!encryptedData) return null;

  try {
    // Decrypt data
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    // Convert back to string and parse JSON
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
};

// // --- Usage Example ---
// const userExperience = { 
//   id: 1, 
//   role: 'Senior Developer', 
//   years: 5 
// };

// // Set
// setEncryptedItem('experience', userExperience);

// // Get
// const decryptedData = getDecryptedItem('');
// console.log(decryptedData); // Outputs original object