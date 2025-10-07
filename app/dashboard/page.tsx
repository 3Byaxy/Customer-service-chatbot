export default function UserDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl border bg-white p-4">Order History (stub)</div>
        <div className="rounded-2xl border bg-white p-4">Account Settings (stub)</div>
        <div className="rounded-2xl border bg-white p-4">Wishlist (stub)</div>
      </div>
    </div>
  )
}