import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="p-4 bg-black text-white flex justify-between">
      <Link href="/" className="font-bold text-lg">
        TripprChalo
      </Link>

      <div className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/trips">Trips</Link>
        <Link href="/#contact">Contact</Link>
      </div>
    </nav>
  )
}
