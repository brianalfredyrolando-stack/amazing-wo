import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <section className="relative hidden lg:flex flex-col justify-between p-12 bg-botanical text-ivory overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(176,141,87,0.5), transparent 40%), radial-gradient(circle at 80% 70%, rgba(168,183,158,0.35), transparent 45%)",
          }}
        />
        <div className="relative">
          <p className="text-xs tracking-[0.35em] uppercase text-sage">Amazing Wedding Organizer</p>
        </div>
        <div className="relative">
          <h1 className="font-display text-5xl leading-[1.05] mb-5">
            Setiap detail,
            <br />
            terkurasi rapi.
          </h1>
          <p className="text-sage/90 max-w-sm leading-relaxed">
            Pantau progress setiap project pernikahan — checklist, vendor, budget, dan hitung mundur hari-H — dalam satu ruang kerja.
          </p>
        </div>
        <div className="relative text-xs text-sage/70 tracking-wider">© {new Date().getFullYear()} — Internal Tool</div>
      </section>

      {/* Right: form */}
      <section className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm animate-rise">
          <div className="lg:hidden mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-gold">Amazing Wedding Organizer</p>
          </div>
          <h2 className="font-display text-3xl text-ink mb-1">Masuk</h2>
          <p className="text-muted text-sm mb-8">Akses dashboard project Anda.</p>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
