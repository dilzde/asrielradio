import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import SidebarNav from "@/components/admin/SidebarNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#FDFCF7" }}>
      <SidebarNav />
      <main style={{ flex: 1, padding: "36px 48px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
