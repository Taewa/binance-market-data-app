import MarketSearch from "./components/MarketSearch/MarketSearch";

export default function Home() {
  return (
    <div className="flex justify-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center w-full">
        <MarketSearch />
      </main>
    </div>
  );
}
