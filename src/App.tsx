import { createResource, createSignal, For } from "solid-js";
import { fetchUrls, shortenUrl } from "./services/api";

function App() {
  const [url, setUrl] = createSignal("");
  const [desc, setDesc] = createSignal("");
  const [data, { refetch }] = createResource(fetchUrls);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!url()) return;
    await shortenUrl(url(), desc());
    setUrl("");
    setDesc("");
    refetch();
  };

  const [showToast, setShowToast] = createSignal(false);

  const copyToClipboard = (code: string) => {
    const fullUrl = `http://localhost:5000/${code}`;
    navigator.clipboard.writeText(fullUrl);

    setShowToast(true);

    setTimeout(() => setShowToast(false), 500);
  };

  return (
    <div class="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-10">
      <div class="max-w-6xl mx-auto">
        <header class="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-indigo-600">
              URL<span class="text-slate-900">Shortener</span>
            </h1>
            <p class="text-slate-500 text-sm"></p>
          </div>
          <div class="flex gap-4 text-sm font-medium">
            <div class="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
              Total links:{" "}
              <span class="text-indigo-600 font-bold">
                {data()?.length || 0}
              </span>
            </div>
          </div>
        </header>

        <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-8 border border-slate-100">
          <form
            onSubmit={handleSubmit}
            class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end"
          >
            <div class="md:col-span-5">
              <label class="block text-sm font-semibold mb-2 ml-1 text-slate-700">
                Original (URL)
              </label>
              <input
                type="url"
                placeholder="https://loooong-link.com/special-page"
                value={url()}
                onInput={(e) => setUrl(e.currentTarget.value)}
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                required
              />
            </div>
            <div class="md:col-span-5">
              <label class="block text-sm font-semibold mb-2 ml-1 text-slate-700">
                Description (optional)
              </label>
              <input
                type="text"
                placeholder="Example: Instagram Profile"
                value={desc()}
                onInput={(e) => setDesc(e.currentTarget.value)}
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            <div class="md:col-span-2">
              <button
                type="submit"
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 cursor-pointer"
              >
                Create Link
              </button>
            </div>
          </form>
        </div>

        <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                  <th class="px-6 py-4 font-bold">Short Link</th>
                  <th class="px-6 py-4 font-bold">
                    Original Link And Description
                  </th>
                  <th class="px-6 py-4 font-bold text-center">Clicks</th>
                  <th class="px-6 py-4 font-bold text-center">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <For each={data()}>
                  {(item) => (
                    <tr class="hover:bg-indigo-50/30 transition-colors group">
                      <td class="px-6 py-5">
                        <a
                          href={`http://localhost:5000/${item.code}`}
                          target="_blank"
                          class="text-indigo-600 font-semibold hover:underline decoration-2"
                        >
                          http://localhost:5000/{item.code}
                        </a>
                      </td>
                      <td class="px-6 py-5">
                        <div class="text-sm font-medium text-slate-900 truncate max-w-xs">
                          {item.original_url}
                        </div>
                        <div class="text-xs text-slate-400 mt-0.5">
                          {item.description || "no description :)"}
                        </div>
                      </td>
                      <td class="px-6 py-5 text-center">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          {item.total_clicks}
                        </span>
                      </td>
                      <td class="px-6 py-5 text-center text-xs text-slate-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td class="px-6 py-5 text-right">
                        <button
                          onClick={() => copyToClipboard(item.code)}
                          class="bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                        >
                          Nusxa olish
                        </button>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {(!data() || data().length === 0) && (
            <div class="p-20 text-center">
              <div class="text-slate-300 mb-2 text-5xl">🔗</div>
              <p class="text-slate-400 font-medium">Links not created yet</p>
            </div>
          )}
        </div>
      </div>
      <div
        class={`fixed top-10 left-1/2 -translate-x-1/2 flex items-center bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl transition-all duration-300 transform ${
          showToast()
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <span class="mr-2">✅</span>
        <span class="font-medium">Copied!</span>
      </div>
    </div>
  );
}

export default App;
