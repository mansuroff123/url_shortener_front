import { createSignal, onMount, Show } from "solid-js";
import { useNavigate, useSearchParams, A } from "@solidjs/router";

// BASE_URL from .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function Login() {
  const [searchParams] = useSearchParams();
  const [showSuccess, setShowSuccess] = createSignal(false);
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  onMount(() => {
    if (searchParams.registered === "true") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    }
  });

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Localhost/IP replaced with dynamic BASE_URL
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username(), password: password() }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", username());

        if (data.role === 'admin') {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(data.message || "Login or password wrong!");
      }
    } catch (err) {
      setError("Server connection error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative">
      {/* Toast */}
      <Show when={showSuccess()}>
        <div class="fixed top-5 left-1/2 -translate-x-1/2 z-50">
          <div class="bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400">
            <div class="bg-white/20 rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span class="font-bold text-sm">Successfully registered! Please login.</span>
          </div>
        </div>
      </Show>

      <div class="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 transition-all">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-black text-indigo-600">Welcome!</h1>
          <p class="text-slate-500 mt-2">Enter your credentials to access</p>
        </div>

        {error() && (
          <div class="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 text-center font-medium border border-red-100">
            {error()}
          </div>
        )}

        <form onSubmit={handleLogin} class="space-y-5">
          <div>
            <label class="block text-sm font-semibold mb-2 ml-1 text-slate-700">Username</label>
            <input
              type="text"
              onInput={(e) => setUsername(e.currentTarget.value)}
              class={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-4 ${
                error().toLowerCase().includes("user") 
                ? "border-red-500 focus:ring-red-100" 
                : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-500"
              }`}
              placeholder="Write your username..."
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 ml-1 text-slate-700">Password</label>
            <input
              type="password"
              onInput={(e) => setPassword(e.currentTarget.value)}
              class={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-4 ${
                error().toLowerCase().includes("password") || error().toLowerCase().includes("wrong")
                ? "border-red-500 focus:ring-red-100" 
                : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-500"
              }`}
              placeholder="Write your password..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading()}
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 mt-2 flex justify-center items-center cursor-pointer"
          >
            {loading() ? (
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Enter"}
          </button>
        </form>

        <p class="text-center mt-6 text-sm text-slate-600">
          Don't have an account? <A href="/signup" class="text-indigo-600 font-bold hover:underline">Sign Up</A>
        </p>
      </div>
    </div>
  );
}

export default Login;