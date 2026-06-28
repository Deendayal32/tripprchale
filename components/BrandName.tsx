// Renders the brand name with the same tri-color treatment as the logo.
// Use dark={true} on dark/navy backgrounds so "PR" stays readable.
export default function BrandName({ dark = false }: { dark?: boolean }) {
  return (
    <span>
      <span style={{ color: '#FF914D' }}>TRIP</span>
      <span style={{ color: dark ? 'rgba(255,255,255,0.8)' : 'var(--navy)' }}>PR</span>
      <span style={{ color: '#29ABE2' }}>CHALE</span>
    </span>
  )
}
