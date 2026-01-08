import { createResource, For, Show, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const fetchAdminStats = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/admin/all-stats`, {
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (response.status === 403) throw new Error("You are not admin!");
  if (!response.ok) throw new Error("Server connection error!");
  return response.json();
};

function Admin() {
  const navigate = useNavigate();
  const [stats] = createResource(fetchAdminStats);

  onMount(() => {
    if (localStorage.getItem("role") !== 'admin') navigate("/login");
  });

  const totalClicks = () => stats()?.links?.reduce((acc: number, item: any) => acc + (item.clicks || 0), 0) || 0;

  return (
    <div class="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div class="max-w-7xl mx-auto">
        <header class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-black text-slate-800">Admin<span class="text-indigo-600">Panel</span></h1>
            <p class="text-slate-500 text-sm">Users And Links Control System</p>
          </div>
          <button onClick={() => { localStorage.clear(); navigate("/login"); }} class="bg-white border border-slate-200 text-red-500 px-5 py-2 rounded-xl font-bold hover:bg-red-50 cursor-pointer">Leave</button>
        </header>

        <Show when={!stats.loading} fallback={<p class="animate-pulse text-center">Loading data…</p>}>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div class="bg-white p-6 rounded-2xl border border-slate-100">
              <p class="text-slate-400 text-xs font-bold uppercase">Total Links</p>
              <p class="text-4xl font-black text-indigo-600">{stats()?.links?.length || 0}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-100">
              <p class="text-slate-400 text-xs font-bold uppercase">Total Clicks</p>
              <p class="text-4xl font-black text-emerald-500">{totalClicks()}</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-100">
              <p class="text-slate-400 text-xs font-bold uppercase">Total Users</p>
              <p class="text-4xl font-black text-orange-500">{stats()?.totalUsers || 0}</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left">
              <thead class="bg-slate-50 border-b border-slate-100">
                <tr class="text-slate-500 text-xs font-bold uppercase">
                  <th class="px-6 py-4">Code</th>
                  <th class="px-6 py-4">Owner</th>
                  <th class="px-6 py-4">Original URL</th>
                  <th class="px-6 py-4 text-center">Clicks</th>
                  <th class="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <For each={stats()?.links}>
                  {(item) => (
                    <tr class="hover:bg-indigo-50/20 text-sm">
                      <td class="px-6 py-4 font-bold text-indigo-600">/{item.code}</td>
                      <td class="px-6 py-4">{item.owner}</td>
                      <td class="px-6 py-4 truncate max-w-xs">{item.original_url}</td>
                      <td class="px-6 py-4 text-center">
                        <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">{item.clicks}</span>
                      </td>
                      <td class="px-6 py-4 text-right text-xs text-slate-400">{new Date(item.created_at).toLocaleDateString()}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}
export default Admin;