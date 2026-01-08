const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
});

export const fetchUrls = async () => {
  // Endi localhost o'rniga BASE_URL ishlatamiz
  const res = await fetch(`${BASE_URL}/urls/my-urls`, {
    headers: getAuthHeaders()
  });
  return res.json();
};

export const shortenUrl = async (url: string, description: string) => {
  const res = await fetch(`${BASE_URL}/urls/shorten`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ original_url: url, description })
  });
  return res.json();
};

export const fetchLinkStats = async (code: string) => {
  const res = await fetch(`${BASE_URL}/urls/stats/${code}`, {
    headers: getAuthHeaders()
  });
  
  if (!res.ok) throw new Error("Statistikani yuklab bo'lmadi");
  return res.json();
};