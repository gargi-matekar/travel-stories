// src/components/QuestionHighlight.tsx
export default function QuestionHighlight({ question }: { question: string }) {
  return (
    <div className="text-center py-8">
      <p className="text-sand-400 tracking-[0.3em] text-xs uppercase mb-8">
        This place asked me one question:
      </p>
      <blockquote className="relative">
        {/* Decorative quotes */}
        <span className="absolute -top-8 -left-4 text-8xl text-white/5 font-serif leading-none select-none">
          "
        </span>
        <p className="text-3xl md:text-5xl font-serif font-light text-white leading-tight relative z-10 italic">
          {question}
        </p>
        <span className="absolute -bottom-12 -right-4 text-8xl text-white/5 font-serif leading-none select-none">
          "
        </span>
      </blockquote>
    </div>
  )
}
