import { WaitlistForm } from './WaitlistForm'
import { Zap, Target, Search } from 'lucide-react'

export function Hero() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      
      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span>AI-Native Sales Engagement</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            Гипер-персонализация в аутриче <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">на автопилоте</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
            VYUD AI самостоятельно исследует ваших лидов, находит их CRM, вакансии и интересы, 
            чтобы написать письмо, на которое невозможно не ответить.
          </p>
          
          <div className="w-full max-w-md">
            <WaitlistForm />
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full max-w-5xl">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <Search className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Глубокий Research</h3>
              <p className="text-gray-400 text-sm">AI заходит на сайт, читает "About Us" и вакансии, чтобы понять контекст бизнеса.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <Target className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Умный Скоринг</h3>
              <p className="text-gray-400 text-sm">Мы не гадаем. Наша система использует Chain of Thought для точной идентификации CRM и стека.</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <Zap className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">x100 к скорости</h3>
              <p className="text-gray-400 text-sm">То, на что SDR тратит 20 минут, наш агент делает за 5 секунд. Масштабируйте качество.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
