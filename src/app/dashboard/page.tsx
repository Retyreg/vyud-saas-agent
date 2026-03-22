'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  Zap, 
  Search, 
  Send, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Download,
  Plus
} from 'lucide-react'

interface AnalysisResult {
  url: string
  company_name: string
  industry: string
  tech_stack: string[]
  crm_detected: string
  confidence_score: number
  analysis_log: string
  email_draft: string
  status: 'pending' | 'success' | 'error'
}

export default function Dashboard() {
  const router = useRouter()
  const [urlsInput, setUrlsInput] = useState('')
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session && process.env.NODE_ENV === 'production') {
        router.push('/')
      } else {
        setUser(session?.user || { email: 'beta-tester@vyud.ai' })
      }
    }
    checkUser()
  }, [router])

  const startAnalysis = async () => {
    const urls = urlsInput.split('\n').map(u => u.trim()).filter(u => u !== '')
    if (urls.length === 0) return

    setIsProcessing(true)
    setProgress(0)
    
    // Initialize results with pending state
    const initialResults: AnalysisResult[] = urls.map(url => ({
      url,
      company_name: '',
      industry: '',
      tech_stack: [],
      crm_detected: '',
      confidence_score: 0,
      analysis_log: '',
      email_draft: '',
      status: 'pending'
    }))
    setResults(initialResults)

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]
      try {
        const response = await fetch('http://localhost:8000/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'vyud-secret-key-2026' // Use the default key for now
          },
          body: JSON.stringify({ url })
        })

        if (!response.ok) throw new Error('Failed to analyze')

        const data = await response.json()
        
        setResults(prev => prev.map((item, idx) => 
          idx === i ? { ...data, url, status: 'success' as const } : item
        ))
      } catch (err) {
        console.error(`Error analyzing ${url}:`, err)
        setResults(prev => prev.map((item, idx) => 
          idx === i ? { ...item, status: 'error' as const } : item
        ))
      }
      setProgress(((i + 1) / urls.length) * 100)
    }

    setIsProcessing(false)
  }

  const downloadCSV = () => {
    const headers = ["URL", "Company", "Industry", "CRM", "Score", "Email"]
    const rows = results
      .filter(r => r.status === 'success')
      .map(r => [
        r.url, 
        r.company_name, 
        r.industry, 
        r.crm_detected, 
        r.confidence_score, 
        `"${r.email_draft.replace(/"/g, '""')}"`
      ])
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "vyud_outreach_results.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-[#030014] text-white">
      {/* Sidebar / Topbar */}
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-md p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center font-bold">V</div>
            <span className="text-xl font-bold tracking-tight">VYUD <span className="text-purple-500">AI</span> <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded border border-purple-500/30 ml-1">BETA</span></span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{user?.email}</span>
            <button onClick={() => supabase.auth.signOut()} className="hover:text-white transition-colors">Выйти</button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                Новая кампания
              </h2>
              <p className="text-sm text-gray-400 mb-4">Введите список доменов или URL страниц "About Us" для анализа.</p>
              <textarea
                value={urlsInput}
                onChange={(e) => setUrlsInput(e.target.value)}
                placeholder="https://example.com&#10;https://another-site.com/about"
                className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-purple-500 transition-colors mb-4 resize-none"
              />
              <button
                onClick={startAnalysis}
                disabled={isProcessing || !urlsInput}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-purple-500/10"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                Запустить анализ
              </button>
            </div>

            {isProcessing && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Прогресс</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Результаты анализа</h2>
              {results.some(r => r.status === 'success') && (
                <button 
                  onClick={downloadCSV}
                  className="flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Скачать CSV
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-gray-500">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>Здесь появятся ваши персонализированные письма</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {results.map((res, i) => (
                  <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">
                            {res.status === 'success' ? res.company_name : res.url}
                          </h3>
                          {res.status === 'success' && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {res.industry}
                            </span>
                          )}
                        </div>
                        <a href={res.url} target="_blank" className="text-xs text-gray-500 hover:text-purple-400 flex items-center gap-1 transition-colors">
                          {res.url} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        {res.status === 'pending' && <Loader2 className="w-5 h-5 animate-spin text-purple-500" />}
                        {res.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {res.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                      </div>
                    </div>

                    {res.status === 'success' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-2">Технологический стек</span>
                            <div className="flex flex-wrap gap-2">
                              {res.tech_stack.map((t, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-2">Выявленная CRM</span>
                            <span className="text-sm font-medium text-purple-400">{res.crm_detected || 'Не определено'}</span>
                          </div>
                          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-2">Confidence Score</span>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all ${res.confidence_score > 0.7 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                  style={{ width: `${res.confidence_score * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono">{res.confidence_score}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          <div className="relative flex-1 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                            <span className="text-[10px] uppercase tracking-wider text-purple-400 block mb-2">Email Draft</span>
                            <p className="text-sm text-gray-300 leading-relaxed italic whitespace-pre-wrap">
                              {res.email_draft}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 bg-green-600 hover:bg-green-500 text-white text-sm py-2 rounded-lg font-medium transition-colors">Approve</button>
                            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm py-2 rounded-lg font-medium transition-colors border border-white/10">Edit</button>
                            <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20">
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
