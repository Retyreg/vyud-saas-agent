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

interface DecisionMaker {
  name: string
  title: string
  linkedin_url: string
  email?: string
  relevance_reason: string
}

interface AnalysisResult {
  url: string
  company_name: string
  industry: string
  tech_stack: string[]
  found_signals: string[]
  confidence_score: number
  analysis_log: string
  email_draft: string
  status: 'pending' | 'success' | 'error'
  decision_maker?: DecisionMaker
}

export default function Dashboard() {
  const router = useRouter()
  const [urlsInput, setUrlsInput] = useState('')
  const [targetRole, setTargetRole] = useState('Head of Marketing')
  const [researchKeywords, setResearchKeywords] = useState('Found tools, CRM, AI mentions')
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [isSending, setIsSending] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [tempDraft, setTempDraft] = useState('')
  const [accessStatus, setAccessStatus] = useState<'loading' | 'allowed' | 'denied'>('loading')

  useEffect(() => {
    const checkAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        if (process.env.NODE_ENV === 'production') {
          router.push('/login')
        } else {
          setUser({ email: 'dev@vyud.ai' })
          setAccessStatus('allowed')
        }
        return
      }

      setUser(session.user)

      // Проверяем статус в waitlist
      const { data, error } = await supabase
        .from('waitlist')
        .select('status')
        .eq('email', session.user.email)
        .single()

      if (data?.status === 'invited') {
        setAccessStatus('allowed')
      } else {
        setAccessStatus('denied')
      }
    }
    checkAccess()
  }, [router])

  const startEditing = (index: number) => {
    setEditingIndex(index)
    setTempDraft(results[index].email_draft)
  }

  const saveEdit = (index: number) => {
    const updatedResults = [...results]
    updatedResults[index].email_draft = tempDraft
    setResults(updatedResults)
    setEditingIndex(null)
  }

  const sendEmail = async (index: number) => {
    const res = results[index];
    if (!res || res.status !== 'success') return;

    // Определяем email получателя: либо найденный, либо тестовый заглушка
    const recipientEmail = res.decision_maker?.email || 'vatyutovd@gmail.com';

    setIsSending(index);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiSecret = process.env.NEXT_PUBLIC_API_SECRET || 'vyud-secret-key-2026';

      const response = await fetch(`${apiUrl}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiSecret
        },
        body: JSON.stringify({
          to_email: recipientEmail,
          subject: `VYUD AI Analysis for ${res.company_name}`,
          body: res.email_draft
        })
      });

      if (!response.ok) throw new Error('Failed to send');
      alert(`Письмо успешно отправлено на ${recipientEmail}!`);
    } catch (err) {
      console.error('Error sending email:', err);
      alert('Ошибка при отправке письма.');
    } finally {
      setIsSending(null);
    }
  }

  const startAnalysis = async () => {
    const urls = urlsInput.split('\n').map(u => u.trim()).filter(u => u !== '')
    
    // Лимит №1: Не более 30 компаний за раз
    if (urls.length > 30) {
      alert('В бета-версии ограничение: не более 30 компаний за один запуск.')
      return
    }

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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const apiSecret = process.env.NEXT_PUBLIC_API_SECRET || 'vyud-secret-key-2026';

        const response = await fetch(`${apiUrl}/api/analyze`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiSecret
          },
          body: JSON.stringify({ 
            url,
            target_role: targetRole,
            research_keywords: researchKeywords
          })
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

  if (accessStatus === 'loading') {
    return (
      <div className="min-h-screen bg-vyud-neutral-950 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-vyud-spin text-vyud-primary-500" />
      </div>
    )
  }

  if (accessStatus === 'denied') {
    return (
      <div className="min-h-screen bg-vyud-neutral-950 text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md vyud-card border-l-4 border-l-yellow-500">
          <ShieldCheck className="w-16 h-16 text-yellow-500 mx-auto mb-6 opacity-50" />
          <h1 className="text-2xl font-bold mb-4 font-display text-white tracking-tight">Доступ ограничен</h1>
          <p className="text-vyud-neutral-400 mb-6 font-body">Ваш аккаунт находится в очереди. Мы отправим письмо, как только откроем доступ для вашей группы бета-тестеров.</p>
          <button onClick={() => supabase.auth.signOut()} className="vyud-btn-primary w-full">Выйти из системы</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-vyud-neutral-950 text-white">
      {/* Sidebar / Topbar */}
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-md p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-vyud-primary-500 rounded-lg flex items-center justify-center font-bold font-display">V</div>
            <span className="text-xl font-bold tracking-tight font-display">VYUD <span className="text-vyud-primary-500">AI</span> <span className="text-[10px] bg-vyud-primary-500/20 text-vyud-primary-400 px-1.5 py-0.5 rounded border border-vyud-primary-500/30 ml-1 font-body">BETA</span></span>
          </div>
          <div className="flex items-center gap-4 text-sm text-vyud-neutral-400">
            <span>{user?.email}</span>
            <button onClick={() => supabase.auth.signOut()} className="hover:text-white transition-colors">Выйти</button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="vyud-card">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 font-display">
                <Plus className="w-5 h-5 text-vyud-primary-400" />
                Новая кампания
              </h2>
              <p className="text-sm text-vyud-neutral-400 mb-4 font-body">Введите список доменов или URL страниц "About Us" для анализа.</p>
              
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-vyud-neutral-500 font-bold block mb-2 font-body">Кого ищем? (Role)</label>
                  <input 
                    type="text"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="напр. Head of HR"
                    className="vyud-input w-full text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-vyud-neutral-500 font-bold block mb-2 font-body">Фокус анализа (Keywords)</label>
                  <input 
                    type="text"
                    value={researchKeywords}
                    onChange={(e) => setResearchKeywords(e.target.value)}
                    placeholder="напр. AI, Hiring plans, ATS"
                    className="vyud-input w-full text-sm"
                  />
                </div>
              </div>

              <textarea
                value={urlsInput}
                onChange={(e) => setUrlsInput(e.target.value)}
                placeholder="https://example.com&#10;https://another-site.com/about"
                className="w-full h-48 bg-black/40 border border-white/10 rounded-vyud-md p-4 text-sm outline-none focus:border-vyud-primary-500 transition-colors mb-4 resize-none font-mono"
              />
              <button
                onClick={startAnalysis}
                disabled={isProcessing || !urlsInput}
                className="vyud-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                Запустить анализ
              </button>
            </div>

            {isProcessing && (
              <div className="vyud-card">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-vyud-neutral-400">Прогресс</span>
                  <span className="font-mono font-bold text-vyud-primary-400">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-vyud-primary-400 to-vyud-primary-600 transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold font-display tracking-tight">Результаты анализа</h2>
              {results.some(r => r.status === 'success') && (
                <button 
                  onClick={downloadCSV}
                  className="flex items-center gap-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  Скачать CSV
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-vyud-neutral-500">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-body">Здесь появятся ваши персонализированные письма</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {results.map((res, i) => (
                  <div key={i} className="vyud-card hover:translate-y-[-2px] animate-vyud-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg font-display">
                            {res.status === 'success' ? res.company_name : res.url}
                          </h3>
                          {res.status === 'success' && (
                            <span className="vyud-badge bg-vyud-primary-500/10 text-vyud-primary-400 border border-vyud-primary-500/20">
                              {res.industry}
                            </span>
                          )}
                        </div>
                        <a href={res.url} target="_blank" className="text-xs text-vyud-neutral-500 hover:text-vyud-primary-400 flex items-center gap-1 transition-colors font-mono">
                          {res.url} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        {res.status === 'pending' && <Loader2 className="w-5 h-5 animate-spin text-vyud-primary-500" />}
                        {res.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.2)]" />}
                        {res.status === 'error' && <XCircle className="w-5 h-5 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]" />}
                      </div>
                    </div>

                    {res.status === 'success' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-4">
                          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-[10px] uppercase tracking-widest text-vyud-neutral-500 font-bold block mb-2 font-body">Технологический стек</span>
                            <div className="flex flex-wrap gap-2">
                              {res.tech_stack.map((t, idx) => (
                                <span key={idx} className="text-[11px] px-2 py-1 rounded bg-white/5 border border-white/10 text-vyud-neutral-300 font-medium">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-[10px] uppercase tracking-widest text-vyud-neutral-500 font-bold block mb-2 font-body">Результаты по фокусам</span>
                            <div className="flex flex-wrap gap-2">
                              {res.found_signals && res.found_signals.length > 0 ? (
                                res.found_signals.map((s, idx) => (
                                  <span key={idx} className="text-sm font-bold text-vyud-primary-400 font-display italic">
                                    {s}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-vyud-neutral-500 italic">Специфических сигналов не найдено</span>
                              )}
                            </div>
                          </div>
                          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                            <span className="text-[10px] uppercase tracking-widest text-vyud-neutral-500 font-bold block mb-2 font-body">Confidence Score</span>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all ${res.confidence_score > 0.7 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                  style={{ width: `${res.confidence_score * 100}%` }}
                                />
                              </div>
                              <span className="text-xs font-mono font-bold">{res.confidence_score}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4">
                          {res.decision_maker && (
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold block mb-2 font-body">Найденный ЛПР</span>
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-bold text-white flex items-center gap-2">
                                    {res.decision_maker.name}
                                    {res.decision_maker.email && (
                                      <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/20 font-mono uppercase tracking-tighter">Email Verified</span>
                                    )}
                                  </p>
                                  <p className="text-[11px] text-vyud-neutral-400 leading-tight mb-1">{res.decision_maker.title}</p>
                                  {res.decision_maker.email && (
                                    <p className="text-[11px] font-mono text-vyud-primary-400">{res.decision_maker.email}</p>
                                  )}
                                </div>
                                <a 
                                  href={res.decision_maker.linkedin_url} 
                                  target="_blank" 
                                  className="p-2.5 bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] rounded-xl transition-all border border-[#0077B5]/10"
                                  title="Открыть в LinkedIn"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </div>
                          )}

                          <div className="relative flex-1 p-5 rounded-xl bg-vyud-primary-500/5 border border-vyud-primary-500/20 min-h-[200px] flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-vyud-primary-400 font-bold block mb-2 font-body">Personalized Email Draft</span>
                            {editingIndex === i ? (
                              <textarea
                                value={tempDraft}
                                onChange={(e) => setTempDraft(e.target.value)}
                                className="flex-1 w-full bg-transparent text-sm text-vyud-neutral-200 leading-relaxed outline-none border-none resize-none font-body italic"
                                autoFocus
                              />
                            ) : (
                              <p className="text-sm text-vyud-neutral-200 leading-relaxed whitespace-pre-wrap font-body italic">
                                {res.email_draft}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => sendEmail(i)}
                              disabled={isSending === i || editingIndex === i}
                              className="flex-1 bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-2.5 rounded-lg transition-all active:scale-95 disabled:opacity-50"
                            >
                              {isSending === i ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Approve & Send'}
                            </button>
                            {editingIndex === i ? (
                              <button 
                                onClick={() => saveEdit(i)}
                                className="flex-1 bg-vyud-primary-500 hover:bg-vyud-primary-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all active:scale-95"
                              >
                                Save Changes
                              </button>
                            ) : (
                              <button 
                                onClick={() => startEditing(i)}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2.5 rounded-lg border border-white/10 transition-all active:scale-95"
                              >
                                Edit
                              </button>
                            )}
                            <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20 active:scale-95">
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
