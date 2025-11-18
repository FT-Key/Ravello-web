// utils/extractResponseArray.js

export const extractResponseArray = (response, possibleKeys = []) => {
  console.log("📨 RAW response:", response);

  if (!response || typeof response !== "object") return [];

  const data = response.data;
  if (!data) return [];

  // Si la respuesta es directamente un array → devolverlo
  if (Array.isArray(data)) return data;

  // Si tenemos claves específicas como "contacts", "packages", etc.
  for (const key of possibleKeys) {
    if (Array.isArray(data[key])) return data[key];
  }

  // Estructuras comunes
  const commonKeys = ["items", "results", "data", "docs"];
  for (const key of commonKeys) {
    if (Array.isArray(data[key])) return data[key];
  }

  console.warn("⚠️ No se pudo determinar la estructura del array:", data);
  return [];
};
