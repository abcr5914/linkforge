import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  async function performLogin(formData: FormData) {
    "use server";

    const user = formData.get("username");
    const pass = formData.get("password");

    if (user === "admin" && pass === "admin") {
      const cookieStore = await cookies();
      cookieStore.set("adminAuth", "authenticated", { path: "/", secure: true, httpOnly: true });
      redirect("/");
    }
    // Simple way to show error is redirecting with query param
    redirect("/login?error=1");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-color)] transition-colors duration-300">

      <div className="clay-card p-10 max-w-md w-full relative z-10 animate-fade-in bg-[var(--card-bg)] border border-[var(--border-color)]">
        <h1 className="text-4xl font-bold uppercase text-center mb-8 tracking-tight text-[var(--color-pastel-blue)]" style={{ filter: "brightness(0.8) saturate(1.5)" }}>
          Admin Login
        </h1>

        <form action={performLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm uppercase text-[var(--text-muted)] ml-2">
              Username
            </label>
            <input
              name="username"
              type="text"
              className="clay-input px-4 py-3 text-lg font-medium w-full text-[var(--text-main)] bg-[var(--bg-color)]"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm uppercase text-[var(--text-muted)] ml-2">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="clay-input px-4 py-3 text-lg font-medium w-full text-[var(--text-main)] bg-[var(--bg-color)]"
              required
            />
          </div>

          <button type="submit" className="clay-btn clay-btn-primary mt-6 py-4 text-xl flex justify-center items-center gap-2">
            <span>Login</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </main>
  );
}
