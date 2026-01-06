import { createResource, createSignal, For } from 'solid-js'
import './App.css'
import { fetchUrls, shortenUrl } from './services/api'

function App() {
  const [url, setUrl] = createSignal('')
  const [desc, setDesc] = createSignal('')

  const [data, { refetch }] = createResource(fetchUrls)

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!url()) return;
    
    await shortenUrl(url(), desc());
    setUrl('');
    setDesc('');
    refetch();
  };

  const copyToClipboard = (code: string) => {
  const fullUrl = `http://localhost:5000/${code}`;
  navigator.clipboard.writeText(fullUrl);
  alert("Havola nusxalandi!"); // Yoki chiroyli Toast xabar chiqarish mumkin
};
  return (
    <>
     <div class="container">
      <h1>Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <label>Write original url:</label>
        <input type="url" placeholder='https://...' value={url()} onInput={(e) => setUrl(e.currentTarget.value)} required />
        <label>Write description:</label>
        <input type="text" placeholder='description...' value={desc()} onInput={(e) => setUrl(e.currentTarget.value)} />
        <button type='submit'>Create Link</button>
      </form>

      <hr />

      <table>
        <tr>
          <th>Short Url</th>
          <th>Original Url</th>
          <th>Clicks</th>
          <th>Created at</th>
        </tr>
        <For each={data()}>
          {(item) => (
            <tr>
              <td>
                <a href={`http://localhost:5000/${item.code}`} target='_blank'>http://localhost:5000/{item.code}</a>
              </td>
              <td class="truncate">{item.original_url}</td>
              <td><strong>{item.total_clicks}</strong></td>
              <td>{ item.description || '-' }</td>
              <td>{new Date(item.created_at).toLocaleDateString()}</td>
              <td>
                <div style={{ display: 'flex', gap: '10px', 'align-items': 'center' }}>
                  <button 
                    onClick={() => copyToClipboard(item.code)}
                    style={{ padding: '2px 8px', 'font-size': '12px' }}
                  >
                    Copy
                  </button>
                </div>
              </td>
            </tr>
          )}
        </For>
      </table>
     </div>
     
    </>
  )
}

export default App
