"use client";

export function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold">CrimeWatch</h3>
            <p className="text-gray-400 text-sm">Tourism Security Platform</p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
            <a
              href="#analytics"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Analytics
            </a>
            <a
              href="#about"
              className="text-gray-400 hover:text-white transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </a>
            <a
              href="#privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 CrimeWatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
