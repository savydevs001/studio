import TradeInForm from '@/components/trade-in-form';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-center mb-8 mt-8">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">
          Trade-In Vision
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Get a quick and easy appraisal for your vehicle. Just follow the steps below to provide us with the necessary information and photos.
        </p>
      </div>
      <TradeInForm />
    </main>
  );
}
