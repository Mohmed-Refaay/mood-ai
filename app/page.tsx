import Link from "next/link";

export default function Home() {
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <div className="w-full max-w-[600px]">
        <h1 className="text-6xl font-bold">Welcome to Mood ai!</h1>
        <p className="text-xl my-4">
          Mood ai is a sentiment analysis tool that helps you
          understand the sentiment of your journal entries.
        </p>
        <Link href="/journal">
          <button className="rounded-lg px-2 py-1 text-lg bg-red-400">
            Get Started
          </button>
        </Link>
      </div>
    </main>
  );
}
