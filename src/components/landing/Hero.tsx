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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vyud-primary-500/10 border border-vyud-primary-500/20 text-vyud-primary-400 text-sm font-medium mb-8 animate-vyud-fade-up">
            <Zap className="w-4 h-4" />
            <span>AI-Native Sales Engagement</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight font-display">
            Deep Account Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-vyud-primary-400 to-vyud-primary-600">на автопилоте</span>
          </h1>
          
          <p className="text-xl text-vyud-neutral-300 mb-10 max-w-2xl leading-relaxed">
            VYUD AI находит ЛПР любой роли (HR, Marketing, CTO), извлекает специфические сигналы по вашим тегам и готовит письмо, которое открывают.
          </p>
          
          <div className="w-full max-w-md animate-vyud-fade-up" style={{ animationDelay: '100ms' }}>
            <WaitlistForm />
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left w-full max-w-5xl animate-vyud-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="vyud-card border-l-4 border-l-vyud-primary-500">
              <Search className="w-10 h-10 text-vyud-primary-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2 font-display">Любая роль и ЛПР</h3>
              <p className="text-vyud-neutral-400 text-sm">Укажите роль (напр. Head of HR), и агент найдет конкретного человека в LinkedIn с верифицированным email.</p>
            </div>
            
            <div className="vyud-card border-l-4 border-l-blue-400">
              <Target className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2 font-display">Поиск по вашим тегам</h3>
              <p className="text-vyud-neutral-400 text-sm">Нужно найти упоминание AWS или планы по найму? Просто добавьте теги, и ИИ найдет эти сигналы в тексте.</p>
            </div>
            
            <div className="vyud-card border-l-4 border-l-yellow-400">
              <Zap className="w-10 h-10 text-yellow-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2 font-display">LinkedIn Connect</h3>
              <p className="text-vyud-neutral-400 text-sm">Если точный контакт не найден, система сформирует умную ссылку на поиск всех релевантных сотрудников.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
