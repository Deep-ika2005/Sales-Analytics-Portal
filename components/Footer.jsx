export default function Footer() {
  return (
    <footer className="bg-indigo-700 text-white mt-6">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center md:text-left">
        
        {/* Left: Copyright */}
        <div>
          <p className="font-semibold">
            &copy; {new Date().getFullYear()} Sales Analytics Portal
          </p>
          <p className="text-sm text-indigo-200">
            All rights reserved.
          </p>
        </div>

        {/* Middle: Navigation Links */}
        <div className="flex justify-center space-x-6">
          <a href="#" className="text-indigo-200 hover:text-white transition">
            About
          </a>
          <a href="#" className="text-indigo-200 hover:text-white transition">
            Contact
          </a>
          <a href="#" className="text-indigo-200 hover:text-white transition">
            Privacy
          </a>
        </div>


      {/* Bottom line */}
      <div className="text-center text-sm text-indigo-200 py-2 ">
        Built By Sales Analytics Portal
      </div>
      </div>
    </footer>
    
  );
}
