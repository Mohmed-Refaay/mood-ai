import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children, params }: any) {
  return (
    <div className="flex h-screen w-screen relative">
      <aside className="flex-[0_0_200px] border-r px-3 py-5 bg-blue-50">
        <h1>Mood AI</h1>

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
