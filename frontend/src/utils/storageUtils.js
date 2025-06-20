// src/utils/storageUtils.js

export const getLocalStorageSizeKB = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const item = localStorage.getItem(key);
      total += key.length + (item ? item.length : 0);
    }
  }
  return (total / 1024).toFixed(2); // returns size in KB
};
