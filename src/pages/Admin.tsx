import { createResource, onMount, For } from "solid-js";
import { useNavigate } from "@solidjs/router";

const fetchAdminStats = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5000/api/admin/all-stats", {
    headers: { 
      "Authorization": `Bearer ${token}` 
    }
  });
  if (!response.ok) throw new Error("User is not authorized");
  return response.json();
};

function Admin() {
  const navigate = useNavigate();
  const [stats] = createResource(fetchAdminStats);

  onMount(() => {
    const role = localStorage.getItem("role");
    if (role !== 'admin') {
      navigate("/login");
    }
  });

  return (
    <div class="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-900">
      <div class="max-w-7xl mx-auto">
        <header class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-black text-slate-800">Admin <span class="text-indigo-600">Panel</span></h1>
            <p class="text-slate-500 text-sm">Users and links control</p>
          </div>
          <button 
            onClick={() => { localStorage.clear(); navigate("/login"); }}
            class="bg-white border border-slate-200 text-red-500 px-5 py-2 rounded-xl font-bold shadow-sm hover:bg-red-50 transition-colors"
          >
            Leave
          </button>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Links</p>
            <p class="text-4xl font-black mt-2 text-indigo-600">{stats()?.length || 0}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Clicks</p>
            <p class="text-4xl font-black mt-2 text-emerald-500">
              {stats()?.reduce((acc: number, item: any) => acc + item.clicks, 0) || 0}
            </p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p class="text-slate-400 text-xs uppercase font-bold tracking-wider">Total Users</p>
            <p class="text-4xl font-black mt-2 text-emerald-500">
              {stats()?.reduce((acc: number, item: any) => acc + item.users, 0) || 0}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-slate-50 border-b border-slate-100">
              <tr class="text-slate-500 text-xs uppercase font-bold">
                <th class="px-6 py-4">Short Code</th>
                <th class="px-6 py-4">Owner</th>
                <th class="px-6 py-4">Original URL</th>
                <th class="px-6 py-4 text-center">Clicks</th>
                <th class="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <For each={stats()}>
                {(item) => (
                  <tr class="hover:bg-indigo-50/20 transition-colors">
                    <td class="px-6 py-4 font-bold text-indigo-600 font-mono">/{item.code}</td>
                    <td class="px-6 py-4 text-sm font-medium">{item.owner}</td>
                    <td class="px-6 py-4 text-sm text-slate-500 truncate max-w-xs">{item.original_url}</td>
                    <td class="px-6 py-4 text-center">
                      <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                        {item.clicks}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right text-xs text-slate-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;