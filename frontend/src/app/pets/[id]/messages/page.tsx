'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { messages } from '@/lib/api'
import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa'
import { MdMessage } from 'react-icons/md'
import { GiPawHeart } from 'react-icons/gi'
import { IoSparkles } from 'react-icons/io5'

export default function MessagesPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const petId = Number(params.id)

  const [content, setContent] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: messageList = [], isLoading } = useQuery({
    queryKey: ['messages', petId],
    queryFn: () => messages.getByPet(petId),
    refetchInterval: 3000, // 3초마다 새 메시지 확인
  })

  const sendMutation = useMutation({
    mutationFn: (content: string) => messages.send(petId, content),
    onSuccess: () => {
      setContent('')
      queryClient.invalidateQueries({ queryKey: ['messages', petId] })
      toast.success('메시지를 보냈습니다! 💌')
    },
    onError: () => {
      toast.error('메시지 전송에 실패했습니다')
    },
  })

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    sendMutation.mutate(content)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messageList])

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-peach-50 to-primary-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-warm-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-warm-600 hover:text-warm-800 hover:bg-warm-100 p-2 rounded-xl transition-all"
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-warm-900 flex items-center gap-2">
              <MdMessage size={28} className="text-purple-500" /> 우리 아이와의 대화
            </h1>
            <p className="text-sm text-warm-600">마음을 나누는 따뜻한 시간</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft h-[calc(100vh-220px)] flex flex-col border border-warm-200">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
                <p className="mt-3 text-warm-600">메시지 불러오는 중...</p>
              </div>
            ) : messageList.length === 0 ? (
              <div className="text-center py-16 text-warm-600">
                <div className="flex justify-center mb-4 animate-bounce-gentle">
                  <GiPawHeart size={64} className="text-primary-400" />
                </div>
                <p className="text-lg mb-2">아직 메시지가 없습니다</p>
                <p className="text-sm">첫 메시지를 보내보세요!</p>
              </div>
            ) : (
              messageList.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.senderType === 'USER' ? 'justify-end' : 'justify-start'
                  } animate-slide-up`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div
                    className={`max-w-[75%] rounded-3xl px-5 py-3 shadow-soft ${
                      msg.senderType === 'USER'
                        ? 'bg-gradient-to-br from-primary-500 to-peach-500 text-white'
                        : 'bg-white border-2 border-warm-200 text-warm-900'
                    }`}
                  >
                    {msg.senderType === 'PET' && (
                      <div className="flex items-center gap-2 mb-1">
                        <GiPawHeart size={18} className="text-primary-500" />
                        <span className="text-xs font-semibold text-warm-600">우리 아이</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        msg.senderType === 'USER' ? 'text-white/80' : 'text-warm-500'
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-warm-200 bg-warm-50/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="우리 아이에게 마음을 전해보세요..."
                className="flex-1 px-5 py-3 border-2 border-warm-200 rounded-2xl focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white/80 placeholder-warm-400 text-warm-900 transition-all"
                disabled={sendMutation.isPending}
              />
              <button
                type="submit"
                disabled={!content.trim() || sendMutation.isPending}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-peach-500 text-white rounded-2xl font-semibold hover:shadow-warm disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all flex items-center gap-2"
              >
                {sendMutation.isPending ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    전송 중
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={16} />
                    전송
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-warm-600 mt-3 flex items-center gap-2">
              <IoSparkles size={16} className="text-yellow-500" />
              메시지를 보내면 우리 아이가 마음을 담아 답장해줍니다
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}
