const API_URL = 'http://localhost:5000';

export const fetchUrls = async () => {
    const res = await fetch (`${API_URL}/urls`);
    return res.json()
};


export const shortenUrl = async (original_url: string, description: string) => {
    const res = await fetch(`${API_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_url, description })
    });
    return res.json()
}