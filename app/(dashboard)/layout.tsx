import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({ children, params }: any) {
  return (
    <div className="flex h-screen w-screen relative">
      <aside className="flex-[0_0_200px] border-r px-3 py-5 bg-blue-50">
        <Link href="/journal">
          <h1>Mood AI</h1>
        </Link>

        <nav>
          <ul></ul>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="border-b w-full p-5 flex items-center justify-end">
          <UserButton />
        </header>

        <div className="p-5 bg-blue-100 flex-1">{children}</div>
      </main>
    </div>
  );
}
