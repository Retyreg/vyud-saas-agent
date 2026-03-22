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
    <div className="min-h-screen bg-[#030014] text-white p-8">
      <div className="container mx-auto max-w-6xl">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-purple-500" />
              <h1 className="text-3xl font-bold">Admin Console</h1>
            </div>
            <p className="text-gray-400">Управление листом ожидания и доступом к бете</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl min-w-[120px]">
              <span className="text-[10px] uppercase text-gray-500 block mb-1">Всего</span>
              <span className="text-2xl font-bold">{stats.total}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl min-w-[120px]">
              <span className="text-[10px] uppercase text-gray-500 block mb-1">В очереди</span>
              <span className="text-2xl font-bold text-yellow-500">{stats.pending}</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl min-w-[120px]">
              <span className="text-[10px] uppercase text-gray-500 block mb-1">Одобрено</span>
              <span className="text-2xl font-bold text-green-500">{stats.invited}</span>
            </div>
          </div>
        </header>

        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Поиск по email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-purple-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              Все
            </button>
            <button 
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'pending' ? 'bg-yellow-600/20 text-yellow-500 border border-yellow-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              В очереди
            </button>
            <button 
              onClick={() => setFilter('invited')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'invited' ? 'bg-green-600/20 text-green-500 border border-green-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              Одобрено
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="p-6 text-sm font-semibold text-gray-400">Пользователь</th>
                <th className="p-6 text-sm font-semibold text-gray-400">Статус</th>
                <th className="p-6 text-sm font-semibold text-gray-400">Дата заявки</th>
                <th className="p-6 text-sm font-semibold text-gray-400 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500 mb-4" />
                    <p className="text-gray-500">Загрузка данных...</p>
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-500">
                    Никого не нашли. Попробуйте изменить фильтры.
                  </td>
                </tr>
              ) : filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400 font-bold">
                        {entry.email[0].toUpperCase()}
                      </div>
                      <span className="font-medium">{entry.email}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    {entry.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-medium border border-yellow-500/20">
                        <Clock className="w-3 h-3" /> В очереди
                      </span>
                    )}
                    {entry.status === 'invited' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                        <CheckCircle className="w-3 h-3" /> Одобрен
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-sm text-gray-500">
                    {new Date(entry.created_at).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="p-6 text-right">
                    {entry.status === 'pending' ? (
                      <button 
                        onClick={() => updateStatus(entry.id, 'invited')}
                        className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all"
                      >
                        Одобрить доступ
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateStatus(entry.id, 'pending')}
                        className="text-gray-500 hover:text-white text-xs font-medium py-2 px-4 transition-all"
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
