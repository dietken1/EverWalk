'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePet } from '@/hooks/usePets'
import { useVideos } from '@/hooks/useVideos'
import { useState } from 'react'
import type { InteractionType } from '@/types'
import { GiPawHeart } from 'react-icons/gi'
import { FaHeart, FaArrowLeft, FaUtensils, FaWalking } from 'react-icons/fa'
import { MdMessage, MdOutlineEmojiEmotions, MdVideoLibrary, MdPets } from 'react-icons/md'
import { IoSparkles, IoVideocam } from 'react-icons/io5'
import { BiBookHeart } from 'react-icons/bi'
import { BsCalendar3 } from 'react-icons/bs'

const INTERACTIONS: { type: InteractionType; label: string; icon: React.ReactNode; gradient: string }[] = [
  { type: 'FEEDING', label: '밥 주기', icon: <FaUtensils size={48} />, gradient: 'from-amber-400 to-orange-400' },
  { type: 'PETTING', label: '쓰다듬기', icon: <FaHeart size={48} />, gradient: 'from-pink-400 to-rose-400' },
  { type: 'PLAYING', label: '놀아주기', icon: <MdOutlineEmojiEmotions size={48} />, gradient: 'from-green-400 to-emerald-400' },
  { type: 'WALKING', label: '산책하기', icon: <FaWalking size={48} />, gradient: 'from-blue-400 to-cyan-400' },
]

export default function PetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const petId = Number(params.id)

  const { data: pet, isLoading: petLoading } = usePet(petId)
  const { videos, isLoading: videosLoading, createVideo, isCreating } = useVideos(petId)
  const [selectedInteraction, setSelectedInteraction] = useState<InteractionType | null>(null)

  const handleCreateVideo = (interactionType: InteractionType) => {
    setSelectedInteraction(interactionType)
    createVideo({ interactionType })
  }

  if (petLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-peach-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-warm-700 font-medium">불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-peach-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <MdPets size={80} className="text-warm-400" />
          </div>
          <p className="text-warm-700 text-xl">반려동물을 찾을 수 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-peach-50 to-primary-50">
      {/* Header with pet name */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-warm-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-warm-600 hover:text-warm-800 hover:bg-warm-100 px-3 py-2 rounded-xl transition-all mb-4 inline-flex items-center gap-2"
          >
            <FaArrowLeft size={16} /> 우리 가족으로
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-warm-900">{pet.name}</h1>
            <FaHeart size={32} className="text-red-400 animate-bounce-gentle" />
          </div>
          {pet.species && (
            <p className="text-warm-600 mt-2 flex items-center gap-2">
              <IoSparkles size={18} className="text-yellow-500" />
              {pet.species}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions - Messages & Diary */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            href={`/pets/${petId}/messages`}
            className="group relative overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 text-white p-8 rounded-3xl shadow-warm hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="relative z-10">
              <MdMessage size={48} className="mb-3 animate-bounce-gentle" />
              <h3 className="text-2xl font-bold mb-2">메시지</h3>
              <p className="text-white/90">우리 아이와 마음을 나누어요</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          </Link>

          <Link
            href={`/pets/${petId}/diary`}
            className="group relative overflow-hidden bg-gradient-to-br from-primary-400 to-peach-400 text-white p-8 rounded-3xl shadow-warm hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className="relative z-10">
              <BiBookHeart size={48} className="mb-3 animate-bounce-gentle" />
              <h3 className="text-2xl font-bold mb-2">비밀일기</h3>
              <p className="text-white/90">우리 아이의 특별한 하루를 엿봐요</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          </Link>
        </div>

        {/* Pet Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 mb-8 border border-warm-200">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              {pet.primaryImageUrl ? (
                <div className="relative overflow-hidden rounded-2xl aspect-square group">
                  <img
                    src={pet.primaryImageUrl}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ) : (
                <div className="bg-gradient-to-br from-warm-100 to-peach-100 rounded-2xl aspect-square flex items-center justify-center">
                  <GiPawHeart size={120} className="text-primary-400" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-warm-900 mb-4 flex items-center gap-2">
                <IoSparkles size={24} className="text-yellow-500" /> AI 분석 정보
              </h2>
              <div className="bg-warm-50/80 rounded-2xl p-6 border border-warm-200">
                <pre className="text-warm-800 text-sm whitespace-pre-wrap leading-relaxed font-sans">
                  {pet.aiDescription || '아직 AI 분석 정보가 없습니다.\n사진을 업로드하면 AI가 우리 아이의 특징을 분석해줍니다 🤖'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Interactions */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 mb-8 border border-warm-200">
          <h2 className="text-2xl font-bold text-warm-900 mb-2 flex items-center gap-2">
            <IoVideocam size={28} className="text-primary-500" /> 함께하는 시간
          </h2>
          <p className="text-warm-600 mb-6">우리 아이와 함께하는 특별한 순간을 영상으로 만들어요</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INTERACTIONS.map((interaction) => (
              <button
                key={interaction.type}
                onClick={() => handleCreateVideo(interaction.type)}
                disabled={isCreating}
                className={`group relative overflow-hidden p-8 bg-gradient-to-br ${interaction.gradient} rounded-2xl shadow-soft hover:shadow-warm transition-all disabled:opacity-50 transform hover:scale-105`}
              >
                <div className="relative z-10">
                  <div className="mb-3 group-hover:scale-110 transition-transform flex justify-center text-white">
                    {interaction.icon}
                  </div>
                  <div className="font-bold text-white text-lg">{interaction.label}</div>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors" />
              </button>
            ))}
          </div>

          {isCreating && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-3 bg-primary-100 text-primary-700 px-6 py-3 rounded-2xl">
                <span className="animate-spin text-xl">⏳</span>
                <span className="font-semibold">영상을 만들고 있어요...</span>
              </div>
            </div>
          )}
        </div>

        {/* Video Archive */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 border border-warm-200">
          <h2 className="text-2xl font-bold text-warm-900 mb-2 flex items-center gap-2">
            <MdVideoLibrary size={28} className="text-purple-500" /> 추억 보관함
          </h2>
          <p className="text-warm-600 mb-6">우리 아이와 함께한 소중한 순간들</p>

          {videosLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-warm-600">영상을 불러오는 중...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-warm-200 rounded-2xl">
              <IoVideocam size={64} className="mx-auto mb-4 text-warm-400 animate-bounce-gentle" />
              <p className="text-warm-700 text-lg mb-2">아직 저장된 영상이 없습니다</p>
              <p className="text-warm-600">위의 버튼을 눌러 첫 영상을 만들어보세요!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="group bg-warm-50/50 rounded-2xl overflow-hidden shadow-soft hover:shadow-warm transition-all border border-warm-200">
                  <div className="relative aspect-video bg-warm-100">
                    <video
                      src={video.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-warm-900 mb-1 flex items-center gap-2">
                      <IoVideocam size={18} className="text-primary-500" />
                      {video.interactionType}
                    </p>
                    <p className="text-sm text-warm-600 flex items-center gap-2">
                      <BsCalendar3 size={14} />
                      {new Date(video.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
