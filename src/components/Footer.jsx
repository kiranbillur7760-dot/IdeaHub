function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        <div>
          <h2 className="text-3xl font-bold text-blue-400">IdeaHub</h2>
          <p className="mt-3 text-gray-400">
            A platform where innovators connect, share ideas, and build the future together.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Explore</li>
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Contact</h3>
          <p className="text-gray-400">📧 support@ideahub.com</p>
          <p className="text-gray-400">📱 +91 9876543210</p>
        </div>

      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
        © 2026 IdeaHub. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;