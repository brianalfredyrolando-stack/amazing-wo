export const PROJECT_STATUS: Record<string, { label: string; color: string }> = {
  PLANNING: { label: "Perencanaan", color: "bg-sage/30 text-botanical-dark" },
  IN_PROGRESS: { label: "Berjalan", color: "bg-gold/20 text-gold" },
  COMPLETED: { label: "Selesai", color: "bg-botanical/15 text-botanical" },
  CANCELLED: { label: "Batal", color: "bg-terracotta/15 text-terracotta" },
};

export const VENDOR_STATUS: Record<string, { label: string; color: string }> = {
  PROSPEK: { label: "Prospek", color: "bg-parchment text-muted" },
  DEAL: { label: "Deal", color: "bg-gold/20 text-gold" },
  LUNAS: { label: "Lunas", color: "bg-botanical/15 text-botanical" },
  BATAL: { label: "Batal", color: "bg-terracotta/15 text-terracotta" },
};

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function formatDate(d: string | Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function daysUntil(d: string | Date): number {
  const target = new Date(d);
  const now = new Date();
  target.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function progressOf(tasks: { done: boolean }[]): number {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
}
