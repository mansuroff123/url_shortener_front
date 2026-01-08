const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token")}`
});

export const fetchUrls = async () => {
  const res = await fetch("http://localhost:5000/api/urls/my-urls", {
    headers: getAuthHeaders()
  });
  return res.json();
};

export const shortenUrl = async (url: string, description: string) => {
  const res = await fetch("http://localhost:5000/api/urls/shorten", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ original_url: url, description })
  });
  return res.json();
};

export const fetchLinkStats = async (code: string) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`http://localhost:5000/api/urls/stats/${code}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Statistikani yuklab bo'lmadi");
  return res.json();
};