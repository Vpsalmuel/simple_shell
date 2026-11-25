// One page header everywhere: title, optional one-line description, optional actions on the right.
export default function PageHeader({ title, description, actions, children }) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
        {description && <p className="mt-1 max-w-[60ch] text-sm text-slate-500">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  )
}
