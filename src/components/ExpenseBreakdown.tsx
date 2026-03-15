// src/components/story/ExpenseBreakdown.tsx
'use client'

interface Expense {
  id: string
  title: string
  amount: number
}

interface Props {
  expenses: Expense[]
  totalCost?: number
}

const USD_TO_INR = 83.5

export default function ExpenseBreakdown({ expenses, totalCost }: Props) {
  if (!expenses || expenses.length === 0) return null

  const total = totalCost ?? expenses.reduce((s, e) => s + e.amount, 0)
  const totalINR = total * USD_TO_INR

  return (
    <section className="py-20" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-sm tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--accent)' }}>
          What It Cost
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
        >
          Expense Breakdown
        </h2>
        <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
          Total trip cost:{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
            ₹{totalINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <span className="ml-2" style={{ color: 'var(--text-muted)' }}>
            (${total.toFixed(2)} USD)
          </span>
        </p>

        <div className="space-y-4">
          {expenses.map((expense) => {
            const pct = Math.round((expense.amount / total) * 100)
            const inr = expense.amount * USD_TO_INR
            return (
              <div key={expense.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {expense.title}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-semibold font-mono" style={{ color: 'var(--accent)' }}>
                      ₹{inr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                      {pct}%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'var(--border)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: 'var(--accent)',
                      opacity: 0.8,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Total row */}
        <div
          className="mt-8 pt-6 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span className="text-sm tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Total
          </span>
          <div className="text-right">
            <p className="text-2xl font-bold font-mono" style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>
              ₹{totalINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              ${total.toFixed(2)} USD
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}