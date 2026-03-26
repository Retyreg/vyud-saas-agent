import { Hero } from '@/components/landing/Hero'
import Link from 'next/link'

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-vyud-primary-500 rounded-lg flex items-center justify-center font-bold text-white font-display">V</div>
          <span className="text-xl font-bold tracking-tight text-white font-display">VYUD <span className="text-vyud-primary-500">AI</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm text-vyud-neutral-400 hover:text-white transition-colors">Продукт</a>
          <a href="#" className="text-sm text-vyud-neutral-400 hover:text-white transition-colors">Как это работает</a>
          <a href="#" className="text-sm text-vyud-neutral-400 hover:text-white transition-colors">Бизнесу</a>
        </div>
        
        <Link href="/register" className="bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-full text-sm font-medium border border-white/10 transition-all">
          Beta Access
        </Link>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-background">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-vyud-primary-500 rounded flex items-center justify-center font-bold text-white text-xs font-display">V</div>
          <span className="text-lg font-bold tracking-tight text-white font-display">VYUD AI</span>
        </div>
        <p className="text-vyud-neutral-500 text-sm">© 2026 VYUD AI Engagement. Все права защищены.</p>
        <div className="flex gap-6">
          <a href="#" className="text-vyud-neutral-500 hover:text-white transition-colors text-sm">Twitter</a>
          <a href="#" className="text-vyud-neutral-500 hover:text-white transition-colors text-sm">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  )
}
