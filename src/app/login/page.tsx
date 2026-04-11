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
    // Simple way to show error is redirecting with query param but we'll re-render simply
    // Wait, since Next.js Server Actions don't rerender page with local state without useActionState, 
    // redirecting with ?error=1 is easiest.
    redirect("/login?error=1");
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#f4f4f0]">
      {/* Decorative background shapes */}
      <div className="absolute top-20 left-20 shape-circle animate-pop-in" style={{ animationDelay: "0.1s" }} />
      <div className="absolute bottom-20 right-20 shape-triangle animate-pop-in" style={{ animationDelay: "0.2s" }} />
      
      <div className="memphis-card p-10 max-w-md w-full relative z-10 animate-pop-in transform rotate-1">
        <h1 className="text-4xl font-black uppercase text-center mb-6 tracking-tight drop-shadow-[2px_2px_0_rgba(0,0,0,1)] text-[#FF007F]">
          Admin Login
        </h1>
        
        <form action={performLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-lg uppercase bg-[#FFD500] px-2 py-1 self-start border-2 border-black transform -rotate-2">
              Username
            </label>
            <input 
              name="username"
              type="text" 
              className="memphis-input px-4 py-3 text-lg font-bold w-full"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-lg uppercase bg-[#00E5FF] px-2 py-1 self-start border-2 border-black transform rotate-2">
              Password
            </label>
            <input 
              name="password"
              type="password" 
              className="memphis-input px-4 py-3 text-lg font-bold w-full"
              required
            />
          </div>

          <button type="submit" className="memphis-button mt-4 py-4 text-xl">
            LET'S GO 🚀
          </button>
        </form>
      </div>
    </main>
  );
}
