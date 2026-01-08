import { useParams, useNavigate } from "@solidjs/router";
import { createResource, For, Show } from "solid-js";
import { fetchLinkStats } from "../services/api";

function LinkStats() {
  const params = useParams();
  const navigate = useNavigate();
  const [stats] = createResource(() => params.code, fetchLinkStats);

  return (
    <div class="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div class="max-w-5xl mx-auto">
        
        <button 
          onClick={() => navigate(-1)}
          class="mb-6 text-indigo-600 font-bold flex items-center gap-2 hover:underline cursor-pointer"
        >
          ← Back to dashboard
        </button>

        <Show when={!stats.loading} fallback={<p>Loading...</p>}>
          <div class="mb-10">
            <h1 class="text-3xl font-black">Statistics: <span class="text-indigo-600">/{params.code}</span></h1>
            <p class="text-slate-500 truncate">Original: {stats()?.original_url}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <p class="text-slate-400 text-xs font-bold uppercase">Total Visitors</p>
              <p class="text-4xl font-black text-indigo-600">{stats()?.total_clicks}</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <table class="w-full text-left">
              <thead class="bg-slate-50 border-b border-slate-100">
                <tr class="text-slate-500 text-xs uppercase font-bold">
                  <th class="px-6 py-4">IP Address</th>
                  <th class="px-6 py-4">Browser</th>
                  <th class="px-6 py-4">Device</th>
                  <th class="px-6 py-4">Referrer</th>
                  <th class="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <For each={stats()?.visitors}>
                  {(v) => (
                    <tr class="text-sm">
                      <td class="px-6 py-4 font-mono text-slate-600">{v.ip}</td>
                      <td class="px-6 py-4">{v.browser}</td>
                      <td class="px-6 py-4">
                        <span class="px-2 py-1 bg-slate-100 rounded text-xs">{v.device}</span>
                      </td>
                      <td class="px-6 py-4 text-slate-500 italic">{v.referrer}</td>
                      <td class="px-6 py-4 text-right text-slate-400">
                        {new Date(v.created_at).toLocaleString()}
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
                <Show when={!stats()?.visitors || stats()?.visitors.length === 0}>
                    <div class="p-20 text-center">
                    <div class="text-slate-300 mb-2 text-5xl">🔗</div>
                    <p class="text-slate-400 font-medium">No visitors found for your link</p>
                    </div>
                </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default LinkStats;