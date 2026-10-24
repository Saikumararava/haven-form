export function DemoNotice({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-sm border border-copper/40 bg-ivory px-4 py-3 text-sm text-charcoal ${className}`}
      role="note"
    >
      <strong className="text-forest">DEMO MODE</strong> — sample data is stored in this browser
      only. It is not production security, not a shared database, and not a live client CRM.
    </div>
  )
}
