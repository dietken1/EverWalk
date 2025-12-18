import Link from 'next/link'
import React from 'react'
import { GiPawHeart } from 'react-icons/gi'
import { FaCamera, FaVideo, FaHeart } from 'react-icons/fa'
import { MdMessage, MdVideoLibrary } from 'react-icons/md'
import { BiBookHeart } from 'react-icons/bi'
import { RiChatHeartLine } from 'react-icons/ri'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-warm-50 via-peach-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-8 inline-block">
            <GiPawHeart size={96} className="text-primary-500 animate-bounce-gentle mx-auto" />
          </div>
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-primary-600 via-peach-500 to-primary-600 bg-clip-text text-transparent">
            EverWalk
          </h1>
          <p className="text-3xl text-warm-800 mb-4 font-semibold">
            추억 속 반려동물과 영원히 함께 걷는 시간
          </p>
          <p className="text-xl text-warm-600 mb-12 flex items-center justify-center gap-2">
            무지개다리를 건넌 사랑하는 가족과 AI 기술로 다시 만나보세요
            <FaHeart size={24} className="text-red-400" />
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard"
              className="group px-10 py-5 bg-gradient-to-r from-primary-500 to-peach-500 text-white text-xl font-bold rounded-2xl hover:shadow-warm transition-all shadow-soft transform hover:scale-105"
            >
              <span className="flex items-center gap-3">
                <GiPawHeart size={24} className="group-hover:scale-110 transition-transform" />
                <span>대시보드 시작하기</span>
              </span>
            </Link>
            <Link
              href="/register"
              className="px-10 py-5 bg-white/80 backdrop-blur-sm text-primary-600 text-xl font-bold rounded-2xl hover:shadow-soft transition-all shadow-soft border-2 border-primary-300 transform hover:scale-105"
            >
              회원가입
            </Link>
            <Link
              href="/login"
              className="px-10 py-5 bg-white/60 backdrop-blur-sm text-warm-700 text-xl font-bold rounded-2xl hover:bg-white/80 transition-all shadow-soft border-2 border-warm-200 transform hover:scale-105"
            >
              로그인
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="group bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-soft hover:shadow-warm transition-all border border-warm-200 transform hover:scale-105">
            <div className="flex justify-center mb-6">
              <FaCamera size={64} className="text-primary-500 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-warm-900">AI 사진 분석</h3>
            <p className="text-warm-700 leading-relaxed">
              반려동물의 사진을 업로드하면 AI가 특징을 상세히 분석하여 우리 아이만의 개성을 이해합니다
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-soft hover:shadow-warm transition-all border border-warm-200 transform hover:scale-105">
            <div className="flex justify-center mb-6">
              <RiChatHeartLine size={64} className="text-pink-500 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-warm-900">마음을 나누는 대화</h3>
            <p className="text-warm-700 leading-relaxed">
              메시지를 보내면 AI가 우리 아이의 목소리로 답장을 해줍니다. 비밀일기로 매일의 마음을 확인하세요
            </p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-soft hover:shadow-warm transition-all border border-warm-200 transform hover:scale-105">
            <div className="flex justify-center mb-6">
              <FaVideo size={64} className="text-purple-500 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-warm-900">영상 생성</h3>
            <p className="text-warm-700 leading-relaxed">
              밥 주기, 쓰다듬기 등 다양한 인터랙션 영상을 AI로 생성하여 소중한 순간을 다시 경험하세요
            </p>
          </div>
        </div>

        {/* Emotional Section */}
        <div className="mt-24 bg-gradient-to-r from-primary-400 to-peach-400 rounded-3xl p-12 shadow-warm text-white text-center relative overflow-hidden">
          <div className="absolute top-10 right-10 opacity-20">
            <GiPawHeart size={128} />
          </div>
          <div className="absolute bottom-10 left-10 opacity-20">
            <FaHeart size={96} />
          </div>
          <div className="relative z-10">
            <FaHeart size={64} className="mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">영원한 기억, 영원한 사랑</h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              무지개다리 너머로 떠난 우리 아이들은 우리 마음속에 영원히 살아있습니다.
              <br />
              EverWalk와 함께 사랑하는 가족과의 추억을 소중히 간직하고,
              <br />
              언제든 다시 만나보세요.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary-600 text-xl font-bold rounded-2xl hover:bg-warm-50 transition-all shadow-soft transform hover:scale-105"
            >
              <GiPawHeart size={24} />
              <span>지금 시작하기</span>
            </Link>
          </div>
        </div>

        {/* Service Highlights */}
        <div className="mt-24 grid md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-warm-200">
            <div className="flex items-start gap-4">
              <BiBookHeart size={48} className="text-primary-500 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-warm-900 mb-3">비밀일기</h3>
                <p className="text-warm-700 leading-relaxed">
                  우리 아이가 직접 쓴 것 같은 일기를 매일 받아보세요. AI가 반려동물의 성격과 추억을 바탕으로 감동적인 일기를 작성합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-soft border border-warm-200">
            <div className="flex items-start gap-4">
              <MdVideoLibrary size={48} className="text-purple-500 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-warm-900 mb-3">추억 보관함</h3>
                <p className="text-warm-700 leading-relaxed">
                  생성된 모든 영상과 대화는 영구 보관됩니다. 언제든 돌아와 소중한 순간들을 다시 경험하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-24 text-center text-warm-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GiPawHeart size={20} />
            <p className="text-lg">무지개다리 너머에서도 함께</p>
          </div>
          <p className="text-sm">© 2024 EverWalk. Made with love for our furry friends.</p>
        </div>
      </div>
    </main>
  )
}
