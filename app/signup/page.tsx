export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input type="text" className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input type="text" className="w-full border rounded-lg px-4 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full border rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input type="tel" className="w-full border rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input type="text" className="w-full border rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" className="w-full border rounded-lg px-4 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <input type="text" className="w-full border rounded-lg px-4 py-2" placeholder="e.g. Agent" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Approval Code</label>
            <input type="text" className="w-full border rounded-lg px-4 py-2" />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white rounded-lg py-2 hover:bg-red-700 transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
