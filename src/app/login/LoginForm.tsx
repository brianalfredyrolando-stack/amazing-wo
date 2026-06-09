"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal masuk.");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5 tracking-wide uppercase">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full rounded-lg border border-parchment bg-white/70 px-4 py-2.5 text-ink outline-none focus:border-botanical focus:ring-2 focus:ring-botanical/15 transition"
          placeholder="owner@weddingco.id"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-muted mb-1.5 tracking-wide uppercase">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-parchment bg-white/70 px-4 py-2.5 text-ink outline-none focus:border-botanical focus:ring-2 focus:ring-botanical/15 transition"
          placeholder="••••••••"
        />
      </div>
      {error && (
        <p className="text-sm text-terracotta bg-terracotta/10 rounded-md px-3 py-2">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-botanical text-ivory py-2.5 font-medium tracking-wide hover:bg-botanical-soft transition disabled:opacity-60"
      >
        {loading ? "Memproses…" : "Masuk"}
      </button>
    </form>
  );
}
