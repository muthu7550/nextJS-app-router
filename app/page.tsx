// require('dotenv').config();

export default function Home() {
        //  throw new Error("Triggering global error boundary"); 

  return (
    <div className="flex flex-col flex-1 items-center justify-center">
      <main className="flex flex-1 flex-col items-center justify-between  dark:bg-black sm:items-start">
        <h1 className="text-6xl font-bold text-white dark:text-white h-16">
          Home Page
        </h1>
      </main>
    </div>
  );
}
