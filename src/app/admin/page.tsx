'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Users, 
  Mail, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ShieldCheck,
  Search,
  Filter,
  Loader2
} from 'lucide-react'

interface WaitlistEntry {
  id: number
  email: string
  status: 'pending' | 'invited' | 'blocked'
  created_at: string
}

export default function AdminPanel() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'invited'>('all')

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false })

      const { data, error } = await query
      if (error) throw error
      setEntries(data || [])
    } catch (err) {
      console.error('Error fetching waitlist:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: number, newStatus: 'invited' | 'pending' | 'blocked') => {
    try {
      const { error } = await supabase
        .from('waitlist')
        .update({ status: newStatus })
        .eq('id', id)
      
      if (error) throw error
      
      setEntries(prev => prev.map(entry => 
        entry.id === id ? { ...entry, status: newStatus } : entry
      ))
    } catch (err) {
      alert('Ошибка при обновлении статуса')
    }
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || entry.status === filter
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: entries.length,
    pending: entries.filter(e => e.status === 'pending').length,
    invited: entries.filter(e => e.status === 'invited').length
  }

  return (
    <div className="min-h-screen bg-vyud-neutral-950 text-white p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-vyud-fade-up">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-vyud-primary-500" />
              <h1 className="text-3xl font-bold font-display tracking-tight text-white">Admin Console</h1>
            </div>
            <p className="text-vyud-neutral-400 font-body">Управление листом ожидания и доступом к бете</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="vyud-card p-4 min-w-[120px] flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-widest text-vyud-neutral-500 font-bold block mb-1">Всего</span>
              <span className="text-2xl font-bold font-display">{stats.total}</span>
            </div>
            <div className="vyud-card p-4 min-w-[120px] flex flex-col justify-center border-l-2 border-l-yellow-500">
              <span className="text-[10px] uppercase tracking-widest text-vyud-neutral-500 font-bold block mb-1">В очереди</span>
              <span className="text-2xl font-bold text-yellow-500 font-display">{stats.pending}</span>
            </div>
            <div className="vyud-card p-4 min-w-[120px] flex flex-col justify-center border-l-2 border-l-green-500">
              <span className="text-[10px] uppercase tracking-widest text-vyud-neutral-500 font-bold block mb-1">Одобрено</span>
              <span className="text-2xl font-bold text-green-500 font-display">{stats.invited}</span>
            </div>
          </div>
        </header>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 animate-vyud-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-vyud-neutral-500" />
            <input 
              type="text"
              placeholder="Поиск по email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="vyud-input w-full pl-12"
            />
          </div>
          <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === 'all' ? 'bg-vyud-primary-500 text-white shadow-lg shadow-vyud-primary-500/20' : 'text-vyud-neutral-400 hover:text-white'}`}
            >
              Все
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === 'pending' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-vyud-neutral-400 hover:text-white'}`}
            >
              В очереди
            </button>
            <button 
              onClick={() => setFilter('invited')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filter === 'invited' ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'text-vyud-neutral-400 hover:text-white'}`}
            >
              Одобрено
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="vyud-card !p-0 overflow-hidden animate-vyud-fade-up shadow-2xl shadow-black" style={{ animationDelay: '200ms' }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/10">
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-vyud-neutral-500">Пользователь</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-vyud-neutral-500">Статус</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-vyud-neutral-500">Дата заявки</th>
                <th className="p-6 text-[10px] uppercase tracking-widest font-bold text-vyud-neutral-500 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <Loader2 className="w-8 h-8 animate-vyud-spin mx-auto text-vyud-primary-500 mb-4" />
                    <p className="text-vyud-neutral-500 font-body">Загрузка данных...</p>
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-vyud-neutral-500 font-body">
                    Никого не нашли. Попробуйте изменить фильтры.
                  </td>
                </tr>
              ) : filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-vyud-primary-500/10 flex items-center justify-center text-vyud-primary-400 font-bold font-display border border-vyud-primary-500/10 group-hover:border-vyud-primary-500/30 transition-colors">
                        {entry.email[0].toUpperCase()}
                      </div>
                      <span className="font-medium font-body">{entry.email}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    {entry.status === 'pending' && (
                      <span className="vyud-badge bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                        <Clock className="w-3 h-3" /> В очереди
                      </span>
                    )}
                    {entry.status === 'invited' && (
                      <span className="vyud-badge bg-green-500/10 text-green-500 border border-green-500/20">
                        <CheckCircle className="w-3 h-3" /> Одобрен
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-sm text-vyud-neutral-500 font-mono">
                    {new Date(entry.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="p-6 text-right">
                    {entry.status === 'pending' ? (
                      <button 
                        onClick={() => updateStatus(entry.id, 'invited')}
                        className="bg-vyud-primary-500 hover:bg-vyud-primary-600 text-white text-[10px] uppercase tracking-widest font-bold py-2 px-4 rounded-lg transition-all active:scale-95 shadow-lg shadow-vyud-primary-500/20"
                      >
                        Одобрить доступ
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateStatus(entry.id, 'pending')}
                        className="text-vyud-neutral-500 hover:text-white text-[10px] uppercase tracking-widest font-bold py-2 px-4 transition-all"
                      >
                        Вернуть в очередь
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
