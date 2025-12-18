'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { usePets } from '@/hooks/usePets'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { GiPawHeart, GiSittingDog } from 'react-icons/gi'
import { FaHeart, FaHome, FaPlus, FaCalendarAlt } from 'react-icons/fa'
import { IoSparkles } from 'react-icons/io5'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { pets, isLoading } = usePets()
  const { logout } = useAuth()

  // 개발 중에는 인증 체크 비활성화
  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     router.push('/login')
  //   }
  // }, [isAuthenticated, router])

  // if (!user) return null

  // 개발용 임시 사용자 정보
  const displayUser = user || { name: '테스트 사용자', email: 'test@example.com' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-peach-50 to-primary-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-warm-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-peach-500 bg-clip-text text-transparent flex items-center gap-2">
              <GiPawHeart size={32} className="text-primary-500" /> EverWalk
            </h1>
            <p className="text-warm-700 mt-1 flex items-center gap-2">
              안녕하세요, {displayUser.name}님 <FaHeart size={16} className="text-red-400" />
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-warm-600 hover:text-warm-800 hover:bg-warm-50 rounded-xl transition-all"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-primary-400 to-peach-400 rounded-3xl p-8 mb-8 shadow-warm text-white">
          <h2 className="text-3xl font-bold mb-3 flex items-center gap-2">
            우리 아이들과의 특별한 시간 <IoSparkles size={28} />
          </h2>
          <p className="text-white/90 text-lg">
            무지개다리를 건넌 사랑하는 반려동물과 함께하는 따뜻한 추억의 공간입니다
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-warm-900 flex items-center gap-2">
            <FaHome size={24} className="text-primary-500" /> 우리 가족
          </h2>
          <Link
            href="/pets/new"
            className="px-6 py-3 bg-gradient-to-r from-primary-500 to-peach-500 text-white rounded-2xl font-semibold hover:shadow-warm transform hover:scale-105 transition-all flex items-center gap-2"
          >
            <FaPlus size={18} /> 새 가족 등록
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-warm-600 font-medium">불러오는 중...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-warm-100">
            <div className="flex justify-center mb-6 animate-bounce-gentle">
              <GiSittingDog size={80} className="text-primary-400" />
            </div>
            <p className="text-warm-700 text-lg mb-6">아직 등록된 가족이 없습니다</p>
            <Link
              href="/pets/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-peach-500 text-white rounded-2xl hover:shadow-warm transform hover:scale-105 transition-all font-semibold text-lg"
            >
              <FaHeart size={20} /> 첫 가족 등록하기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Link
                key={pet.id}
                href={`/pets/${pet.id}`}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft hover:shadow-warm transition-all p-6 border border-warm-100 hover:border-primary-300 transform hover:scale-105 duration-300"
              >
                {pet.primaryImageUrl ? (
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                    <img
                      src={pet.primaryImageUrl}
                      alt={pet.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-warm-100 to-peach-100 rounded-2xl h-48 flex items-center justify-center mb-4">
                    <GiPawHeart size={80} className="text-primary-400" />
                  </div>
                )}

                <h3 className="text-2xl font-bold text-warm-900 mb-2 flex items-center gap-2">
                  {pet.name}
                  <FaHeart size={20} className="text-red-400" />
                </h3>

                {pet.species && (
                  <p className="text-warm-600 mb-2 flex items-center gap-2">
                    <IoSparkles size={18} className="text-yellow-500" />
                    {pet.species}
                  </p>
                )}

                <div className="flex items-center text-sm text-warm-500 mt-3">
                  <FaCalendarAlt size={14} />
                  <span className="ml-2">
                    {new Date(pet.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
