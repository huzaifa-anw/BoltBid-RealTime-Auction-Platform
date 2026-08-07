import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white px-6">
      <div className="max-w-2xl text-center">
        <div className="text-cyan-400 text-7xl font-extrabold mb-4">404</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Page not found</h1>
        <p className="text-slate-300 text-lg mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to the auction floor.
        </p>
        <Link to="/">
          <button className="bg-cyan-400 text-black font-semibold px-8 py-3 rounded-2xl hover:bg-cyan-300 transition">
            Back to home
          </button>
        </Link>
      </div>
    </div>
  );
}
