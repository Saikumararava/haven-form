export function inputClass(error?: string): string {
  return `w-full rounded-sm border bg-paper px-3 py-2.5 text-sm text-charcoal outline-none transition ${
    error ? 'border-copper ring-1 ring-copper/40' : 'border-mist focus:border-forest'
  }`
}
