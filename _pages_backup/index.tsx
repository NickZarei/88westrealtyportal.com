import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to 88West Realty Portal</h1>
      <p className="text-lg text-gray-700">
        This is a backup version of the homepage. You can customize this message as needed.
      </p>
      <div className="mt-6">
        <Image
          src="/88west-logo.png"
          alt="88West Realty Logo"
          width={200}
          height={80}
        />
      </div>
    </main>
  );
}
