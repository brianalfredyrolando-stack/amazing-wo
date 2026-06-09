import { redirect } from "next/navigation";

// Katalog paket kini menjadi halaman utama ("/").
// Route lama "/paket" dialihkan agar tautan/bookmark lama tetap berfungsi.
export default function PaketRedirect() {
  redirect("/");
}
