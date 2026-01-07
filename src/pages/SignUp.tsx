import { createSignal } from "solid-js";
import { useNavigate, A } from "@solidjs/router";

function SignUp() {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: Event) => {
    e.preventDefault();
    setError("");

    if (password().length < 8) {
      setError("Password must be at least 8 characters!");
      return;
    }

    if (password() !== confirmPassword()) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username(), password: password() }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/login?registered=true");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server connection error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div class="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        
        <div class="text-center mb-8">
          <h1 class="text-3xl font-black text-indigo-600 tracking-tight">Create Account</h1>
          <p class="text-slate-500 mt-2">Join us to manage your short links</p>
        </div>

        {error() && (
          <div class="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 text-center font-medium border border-red-100 animate-bounce-subtle">
            {error()}
          </div>
        )}

        <form onSubmit={handleSignUp} class="space-y-5">
          <div>
            <label class="block text-sm font-semibold mb-2 ml-1 text-slate-700">Username*</label>
            <input
              type="text"
              onInput={(e) => setUsername(e.currentTarget.value)}
              class={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-4 ${
                error().toLowerCase().includes("username") 
                ? "border-red-500 focus:ring-red-100" 
                : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-500"
              }`}
              placeholder="user123"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 ml-1 text-slate-700">Password*</label>
            <input
              type="password"
              onInput={(e) => setPassword(e.currentTarget.value)}
              class={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-4 ${
                (error().toLowerCase().includes("password") && !error().includes("match"))
                ? "border-red-500 focus:ring-red-100" 
                : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-500"
              }`}
              placeholder="minimum 8 characters"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-semibold mb-2 ml-1 text-slate-700">Confirm Password*</label>
            <input
              type="password"
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
              class={`w-full px-4 py-3 rounded-xl border outline-none transition-all focus:ring-4 ${
                error().includes("match") 
                ? "border-red-500 focus:ring-red-100" 
                : "border-slate-200 focus:ring-indigo-100 focus:border-indigo-500"
              }`}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading()}
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 mt-2 disabled:opacity-50 flex justify-center items-center"
          >
            {loading() ? (
              <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Register"}
          </button>
        </form>

        <p class="text-center mt-6 text-sm text-slate-600">
          Already have an account? <A href="/login" class="text-indigo-600 font-bold hover:underline">Login</A>
        </p>
      </div>
    </div>
  );
}

export default SignUp;