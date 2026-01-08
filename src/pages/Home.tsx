import { createResource, createSignal, For, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { fetchUrls, shortenUrl } from "../services/api";

function Home() {
  const [url, setUrl] = createSignal("");
  const [desc, setDesc] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [error, setError] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [data, { refetch }] = createResource(fetchUrls);
  const [showToast, setShowToast] = createSignal(false);
  const navigate = useNavigate();

  const SHORT_BASE =
    import.meta.env.VITE_SHORT_LINK_BASE || "http://localhost:5000";

  onMount(() => {
    const savedUser = localStorage.getItem("username");
    if (!savedUser) {
      navigate("/login");
    } else {
      setUsername(savedUser);
    }
  });

  const validateAndFormatUrl = (
    inputUrl: string
  ): { isValid: boolean; formattedUrl: string } => {
    const trimmedUrl = inputUrl.trim();
    if (!trimmedUrl) return { isValid: false, formattedUrl: "" };

    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );

    if (!urlPattern.test(trimmedUrl)) {
      return { isValid: false, formattedUrl: "" };
    }

    let finalUrl = trimmedUrl;
    if (
      !trimmedUrl.startsWith("http://") &&
      !trimmedUrl.startsWith("https://")
    ) {
      finalUrl = "https://" + trimmedUrl;
    }

    return { isValid: true, formattedUrl: finalUrl };
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    const { isValid, formattedUrl } = validateAndFormatUrl(url());

    if (!isValid) {
      setError(
        "Please enter a valid URL (e.g., google.com or https://example.com)"
      );
      return;
    }

    if (desc().length > 60) {
      setError("Description is too long (max 60 characters)");
      return;
    }

    setLoading(true);
    try {
      await shortenUrl(formattedUrl, desc());
      setUrl("");
      setDesc("");
      refetch();
    } catch (err) {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const copyToClipboard = async (code: string) => {
    const fullUrl = `${SHORT_BASE}/${code}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = fullUrl;
        Object.assign(textArea.style, {
          position: "fixed",
          left: "-9999px",
          top: "0",
        });
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div class="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-10">
      <div class="max-w-6xl mx-auto">
        <header class="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 class="text-3xl font-black tracking-tight text-indigo-600">
              URL<span class="text-slate-900">Shortener</span>
            </h1>
            <p class="text-slate-500 text-sm italic">
              Welcome back, {username()}!
            </p>
          </div>
          <div class="flex gap-4 text-sm font-medium items-center">
            <div class="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
              Total links:{" "}
              <span class="text-indigo-600 font-bold">
                {data()?.length || 0}
              </span>
            </div>
            <button
              onClick={logout}
              class="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors border border-red-100 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-8 border border-slate-100">
          <form
            onSubmit={handleSubmit}
            class="grid grid-cols-1 md:grid-cols-12 gap-5 items-end"
          >
            <div class="md:col-span-5">
              <label class="block text-sm font-semibold mb-2 ml-1 text-slate-700">
                Original (URL)*
              </label>
              <input
                type="text"
                placeholder="google.com or https://..."
                value={url()}
                onInput={(e) => {
                  setUrl(e.currentTarget.value);
                  if (error()) setError("");
                }}
                class={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-4 ${
                  error()
                    ? "border-red-500 focus:ring-red-100"
                    : "border-slate-200 focus:ring-indigo-100"
                }`}
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
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>
            <div class="md:col-span-2">
              <button
                type="submit"
                disabled={loading()}
                class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loading() ? "Wait..." : "Create Link"}
              </button>
            </div>
          </form>

          <Show when={error()}>
            <p class="text-red-500 text-xs mt-3 ml-1 font-bold">{error()}</p>
          </Show>
        </div>

        <div class="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                  <th class="px-6 py-4 font-bold">Short Link</th>
                  <th class="px-6 py-4 font-bold">Original & Description</th>
                  <th class="px-6 py-4 font-bold text-center">Clicks</th>
                  <th class="px-6 py-4 font-bold text-center">Date</th>
                  <th class="px-6 py-4 font-bold text-right pr-10">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <For each={data()}>
                  {(item) => (
                    <tr class="hover:bg-indigo-50/30 transition-colors group">
                      <td class="px-6 py-5 font-semibold text-indigo-600">
                        <a
                          href={`${SHORT_BASE}/${item.code}`}
                          target="_blank"
                          class="hover:underline"
                        >
                          short.com/{item.code}
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
                          {item.total_clicks || 0}
                        </span>
                      </td>
                      <td class="px-6 py-5 text-center text-xs text-slate-500">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td class="px-6 py-5 text-right pr-6 flex gap-2 justify-end">
                        <button
                          onClick={() => navigate(`/stats/${item.code}`)}
                          class="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Stats
                        </button>
                        <button
                          onClick={() => copyToClipboard(item.code)}
                          class="bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Copy
                        </button>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
          <Show when={!data() || data().length === 0}>
            <div class="p-20 text-center">
              <div class="text-slate-300 mb-2 text-5xl">🔗</div>
              <p class="text-slate-400 font-medium">
                No short links yet. Start by creating one!
              </p>
            </div>
          </Show>
        </div>
      </div>

      <div
        class={`fixed top-10 left-1/2 -translate-x-1/2 flex items-center bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl transition-all duration-300 transform ${
          showToast()
            ? "translate-y-0 opacity-100"
            : "-translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <span class="mr-2">✅</span> Link copied to clipboard!
      </div>
    </div>
  );
}

export default Home;
