import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg)]">
      <div className="text-center max-w-xs fade-up">
        <div className="text-4xl mb-5 animate-float opacity-40">🔍</div>
        <h1 className="text-xl font-bold text-[var(--text-1)] mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          Link Not Found
        </h1>
        <p className="text-sm text-[var(--text-2)] mb-6">
          This short link doesn&apos;t exist or has been removed.
        </p>
        <Link href="/" className="btn btn-primary px-5 py-2.5 text-sm inline-flex">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
