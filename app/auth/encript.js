"use client";

import CryptoJS from "crypto-js";

const SECRET_KEY = "my-secret-key-123";

// Save encrypted data
export const setEncryptedItem = (key, data) => {
  if (typeof window === "undefined") {
    return;
  }

  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();

  localStorage.setItem(key, encryptedData);
};

// Get decrypted data
export const getDecryptedItem = (key) => {
  if (typeof window === "undefined") {
    return null;
  }

  const encryptedData = localStorage.getItem(key);

  if (!encryptedData) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptedData,
      SECRET_KEY
    );

    return JSON.parse(
      bytes.toString(CryptoJS.enc.Utf8)
    );
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null;
  }
};