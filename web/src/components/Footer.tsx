export default function Footer() {
  return (
    <footer className="relative py-12 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="mb-6">
          <img
            src="/logo.png"
            alt="Basketball Competition Logo"
            className="w-24 h-24 mx-auto object-contain"
          />
        </div>
        <p className="font-heading text-2xl font-bold mb-2">
          Basketball <span className="text-accent-yellow">Competition</span>
        </p>
        <p className="text-gray-500 text-sm mb-4">
          Games &amp; Fun 3.0 &mdash; Organized by the Sports Committee
        </p>
        <p className="text-gray-600 text-xs">
          &copy; {new Date().getFullYear()} Basketball Competition. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
