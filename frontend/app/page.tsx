import { CounterWidget } from "@/components/CounterWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center">
        <CounterWidget />
      </div>
    </main>
  );
}
