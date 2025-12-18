'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { diaries } from '@/lib/api'
import toast from 'react-hot-toast'
import { useState } from 'react'
import type { DiaryEntry } from '@/types'
import { FaArrowLeft, FaEdit } from 'react-icons/fa'
import { BiBookHeart } from 'react-icons/bi'
import { BsCalendar3, BsEnvelopePlus } from 'react-icons/bs'
import { MdClose } from 'react-icons/md'
import { GiPawHeart } from 'react-icons/gi'
import { FaHeart } from 'react-icons/fa'

const MOOD_EMOJIS = {
  HAPPY: '😊',
  PLAYFUL: '🎾',
  SLEEPY: '😴',
  MISSING_YOU: '💭',
  GRATEFUL: '🙏',
}

const MOOD_LABELS = {
  HAPPY: '행복해요',
  PLAYFUL: '신나요',
  SLEEPY: '졸려요',
  MISSING_YOU: '보고싶어요',
  GRATEFUL: '감사해요',
}

const MOOD_COLORS = {
  HAPPY: 'from-yellow-200 to-yellow-100',
  PLAYFUL: 'from-green-200 to-green-100',
  SLEEPY: 'from-blue-200 to-blue-100',
  MISSING_YOU: 'from-purple-200 to-purple-100',
  GRATEFUL: 'from-pink-200 to-pink-100',
}

export default function DiaryPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const petId = Number(params.id)

  const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null>(null)

  const { data: diaryList = [], isLoading } = useQuery({
    queryKey: ['diaries', petId],
    queryFn: () => diaries.getByPet(petId),
  })

  const createMutation = useMutation({
    mutationFn: () => diaries.create(petId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diaries', petId] })
      toast.success('새로운 일기가 작성되었습니다! 💝')
    },
    onError: () => {
      toast.error('일기 생성에 실패했습니다')
    },
  })

  const handleViewDiary = (diary: DiaryEntry) => {
    setSelectedDiary(diary)
    if (!diary.isRead) {
      diaries.markAsRead(diary.id)
      queryClient.invalidateQueries({ queryKey: ['diaries', petId] })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-peach-50 to-primary-50">
      {/* Diary Book Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-warm-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-warm-600 hover:text-warm-800 hover:bg-warm-100 p-2 rounded-xl transition-all"
              >
                <FaArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-warm-900 flex items-center gap-2">
                  <BiBookHeart size={36} className="text-primary-500" /> 우리 아이의 비밀일기
                </h1>
                <p className="text-warm-600 mt-1">마음속 이야기가 담긴 특별한 공간</p>
              </div>
            </div>
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-peach-500 text-white rounded-2xl font-semibold hover:shadow-warm transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {createMutation.isPending ? (
                <>
                  <span className="animate-spin">⏳</span> 작성 중...
                </>
              ) : (
                <>
                  <FaEdit size={18} /> 새 일기 쓰기
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Modal - Diary Page Style */}
        {selectedDiary && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={() => setSelectedDiary(null)}
          >
            <div
              className="bg-gradient-to-br from-warm-50 to-peach-50 rounded-3xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-4 border-warm-200 relative"
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f4a868' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {/* Diary Lines Effect */}
              <div className="absolute left-12 top-0 bottom-0 w-px bg-pink-200/50" />
              <div className="absolute left-14 top-0 bottom-0 w-px bg-pink-200/30" />

              <button
                onClick={() => setSelectedDiary(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/80 hover:bg-white rounded-full text-warm-600 hover:text-warm-800 shadow-soft transition-all hover:scale-110"
              >
                <MdClose size={24} />
              </button>

              <div className="ml-8">
                {/* Date Tab */}
                <div className="inline-block bg-gradient-to-r from-primary-400 to-peach-400 text-white px-6 py-2 rounded-t-2xl font-bold mb-4 shadow-soft flex items-center gap-2">
                  <BsCalendar3 size={18} />
                  {new Date(selectedDiary.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </div>

                {/* Mood & Title */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`bg-gradient-to-br ${MOOD_COLORS[selectedDiary.mood]} p-4 rounded-2xl shadow-soft`}>
                    <span className="text-5xl">{MOOD_EMOJIS[selectedDiary.mood]}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-warm-900 mb-2">
                      {selectedDiary.title}
                    </h2>
                    <p className="text-lg text-warm-600 flex items-center gap-2">
                      <span>오늘의 기분:</span>
                      <span className="font-semibold">{MOOD_LABELS[selectedDiary.mood]}</span>
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white/60 rounded-2xl p-6 shadow-soft border border-warm-200">
                  <p className="text-warm-800 whitespace-pre-wrap leading-relaxed text-lg font-['Georgia',serif] tracking-wide">
                    {selectedDiary.content}
                  </p>
                </div>

                {/* Bottom Decoration */}
                <div className="mt-6 flex justify-end items-center gap-2 text-warm-500">
                  <GiPawHeart size={20} />
                  <span className="italic text-sm">From your loving pet</span>
                  <FaHeart size={16} className="text-red-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diary List */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-warm-600 font-medium">일기를 불러오는 중...</p>
          </div>
        ) : diaryList.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border-2 border-dashed border-warm-200">
            <div className="flex justify-center mb-6 animate-bounce-gentle">
              <BiBookHeart size={80} className="text-primary-400" />
            </div>
            <p className="text-warm-700 text-xl mb-3">아직 작성된 일기가 없습니다</p>
            <p className="text-warm-600 mb-8">우리 아이의 마음속 이야기를 들어보세요</p>
            <button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-peach-500 text-white rounded-2xl font-semibold hover:shadow-warm transform hover:scale-105 transition-all"
            >
              <FaEdit size={20} /> 첫 일기 쓰기
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {diaryList.map((diary) => (
              <button
                key={diary.id}
                onClick={() => handleViewDiary(diary)}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft hover:shadow-warm transition-all p-6 text-left relative border-2 border-warm-100 hover:border-primary-300 transform hover:scale-105 duration-300"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f4a868' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              >
                {/* Unread Badge */}
                {!diary.isRead && (
                  <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-warm animate-bounce-gentle">
                    <BsEnvelopePlus size={14} /> NEW
                  </div>
                )}

                {/* Mood Badge */}
                <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${MOOD_COLORS[diary.mood]} px-4 py-2 rounded-full mb-4 shadow-soft`}>
                  <span className="text-2xl">{MOOD_EMOJIS[diary.mood]}</span>
                  <span className="font-semibold text-warm-800">{MOOD_LABELS[diary.mood]}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-warm-900 mb-3 group-hover:text-primary-600 transition-colors flex items-center gap-2">
                  <BiBookHeart size={22} className="text-primary-500" />
                  {diary.title}
                </h3>

                {/* Preview */}
                <p className="text-warm-700 line-clamp-3 mb-4 leading-relaxed">
                  {diary.content}
                </p>

                {/* Date */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-warm-500 flex items-center gap-2">
                    <BsCalendar3 size={14} />
                    {new Date(diary.createdAt).toLocaleString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <span className="text-warm-400 group-hover:text-primary-500 transition-colors">
                    자세히 보기 →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
