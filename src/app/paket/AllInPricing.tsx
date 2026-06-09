"use client";

import { useState } from "react";
import { allInPricing } from "./data";
import { formatRupiah } from "@/lib/format";

export default function AllInPricing() {
  const [active, setActive] = useState(0);
  const tier = allInPricing[active];

  return (
    <div>
      {/* Tab jumlah tamu */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {allInPricing.map((t, i) => (
          <button
            key={t.pax}
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2 text-sm font-medium tracking-wide transition ${
              i === active
                ? "bg-gold text-ivory shadow-card"
                : "bg-ivory/10 text-ivory/70 hover:bg-ivory/20 border border-ivory/15"
            }`}
          >
            {t.pax}
          </button>
        ))}
      </div>

      {/* Daftar harga venue */}
      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-1 max-w-3xl mx-auto">
        {tier.venues.map((v) => (
          <div
            key={v.venue}
            className="flex items-baseline justify-between gap-3 border-b border-ivory/10 py-3"
          >
            <span className="text-ivory/90">{v.venue}</span>
            <span className="flex-shrink-0 font-display text-gold text-lg">
              {formatRupiah(v.price)}
            </span>
          </div>
        ))}
      </div>

      <p className="text-center text-ivory/50 text-xs mt-8 tracking-wide">
        Harga sudah termasuk seluruh inklusi paket di atas · {tier.pax} ·
        dapat menyesuaikan kebutuhan acara Anda.
      </p>
    </div>
  );
}
