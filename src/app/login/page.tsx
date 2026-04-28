/**
 * Login Page — Apple-inspired
 *
 * Clean, centered layout. Typography is the design.
 * No background images, no particles, no decorations.
 * Just headline → subtext → form.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  async function performLogin(formData: FormData) {
    "use server";

    const user = formData.get("username");
    const pass = formData.get("password");

    if (user === "admin" && pass === "admin") {
      const cookieStore = await cookies();
      cookieStore.set("adminAuth", "authenticated", {
        path: "/",
        secure: true,
        httpOnly: true,
      });
      redirect("/");
    }
    redirect("/login?error=1");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-[var(--bg)]">
      <div className="w-full max-w-sm">

        {/* Logo mark */}
        <div className="flex justify-center mb-12 fade-up">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent)] flex items-center justify-center animate-pulse-glow">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.654a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.934" />
            </svg>
          </div>
        </div>

        {/* Headline — typography is the design */}
        <div className="text-center mb-10">
          <h1 className="text-[2.75rem] leading-[1.05] font-extrabold tracking-tight text-[var(--text-1)] mb-4 fade-up d1">
            Deep links that
            <br />
            <span className="text-gradient">just work.</span>
          </h1>
          <p className="text-base text-[var(--text-2)] leading-relaxed fade-up d2">
            Route clicks directly to native apps.
            <br />
            No prompts. No friction.
          </p>
        </div>

        {/* Login form — clean, minimal */}
        <div className="fade-up d3">
          <form action={performLogin} className="flex flex-col gap-4">
            <div>
              <label htmlFor="login-user" className="block text-xs font-medium text-[var(--text-3)] mb-1.5 ml-0.5 uppercase tracking-wider">
                Username
              </label>
              <input
                id="login-user"
                name="username"
                type="text"
                className="input-field"
                placeholder="admin"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label htmlFor="login-pass" className="block text-xs font-medium text-[var(--text-3)] mb-1.5 ml-0.5 uppercase tracking-wider">
                Password
              </label>
              <input
                id="login-pass"
                name="password"
                type="password"
                className="input-field"
                placeholder="••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-full py-3 mt-2">
              Sign in
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>

        {/* Value props — three tight lines */}
        <div className="mt-12 flex flex-col gap-3 fade-up d4">
          <div className="flex items-center gap-3 text-sm text-[var(--text-2)]">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </div>
            Opens YouTube, Spotify, Instagram natively
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--text-2)]">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            Click analytics per link and platform
          </div>
          <div className="flex items-center gap-3 text-sm text-[var(--text-2)]">
            <div className="w-7 h-7 rounded-lg bg-[var(--accent-light)] flex items-center justify-center flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            Smart OG previews for social sharing
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-12 text-xs text-[var(--text-3)] fade-up d5">
          LinkForge
        </p>

      </div>
    </main>
  );
}
