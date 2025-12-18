'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { pets } from '@/lib/api'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaCamera, FaTimes } from 'react-icons/fa'
import { GiPawHeart } from 'react-icons/gi'
import { FaHeart } from 'react-icons/fa'
import { IoSparkles } from 'react-icons/io5'
import { BsCalendar3 } from 'react-icons/bs'
import { MdInfo } from 'react-icons/md'

export default function NewPetPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [memorialDate, setMemorialDate] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const createMutation = useMutation({
    mutationFn: async () => {
      // TODO: 실제로는 S3에 이미지를 업로드하고 URL을 받아와야 함
      // 현재는 임시 URL 사용 (환경변수 설정 후 구현 예정)
      const imageUrls = previewUrls.length > 0
        ? ['https://via.placeholder.com/400'] // 임시 placeholder
        : []

      return pets.create({
        name,
        species: species || undefined,
        memorialDate: memorialDate || undefined,
        imageUrls,
      })
    },
    onSuccess: (data) => {
      toast.success('우리 가족이 등록되었습니다! 💝')
      router.push(`/pets/${data.id}`)
    },
    onError: () => {
      toast.error('등록에 실패했습니다')
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // 최대 5개까지만 허용
    const limitedFiles = files.slice(0, 5)
    setSelectedFiles(limitedFiles)

    // 미리보기 URL 생성
    const urls = limitedFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const handleRemoveImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const newUrls = previewUrls.filter((_, i) => i !== index)

    // 메모리 정리
    URL.revokeObjectURL(previewUrls[index])

    setSelectedFiles(newFiles)
    setPreviewUrls(newUrls)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('반려동물의 이름을 입력해주세요')
      return
    }
    if (selectedFiles.length === 0) {
      toast.error('최소 1장의 사진을 선택해주세요')
      return
    }
    createMutation.mutate()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-peach-50 to-primary-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-warm-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-warm-600 hover:text-warm-800 hover:bg-warm-100 px-3 py-2 rounded-xl transition-all"
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-warm-900 flex items-center gap-2">
              <GiPawHeart size={28} className="text-primary-500" /> 새 가족 등록
            </h1>
            <p className="text-sm text-warm-600">소중한 추억을 함께 만들어요</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-8 border border-warm-200">
          {/* 이름 */}
          <div className="mb-8">
            <label htmlFor="name" className="block text-lg font-bold text-warm-900 mb-3 flex items-center gap-2">
              <FaHeart size={20} className="text-red-400" /> 이름 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="사랑하는 우리 아이의 이름을 입력해주세요"
              className="w-full px-5 py-4 border-2 border-warm-200 rounded-2xl focus:ring-2 focus:ring-primary-400 focus:border-transparent text-warm-900 placeholder-warm-400 transition-all bg-white/80 text-lg"
              required
            />
          </div>

          {/* 종 */}
          <div className="mb-8">
            <label htmlFor="species" className="block text-lg font-bold text-warm-900 mb-3 flex items-center gap-2">
              <IoSparkles size={20} className="text-yellow-500" /> 종 <span className="text-warm-500 text-sm font-normal">(선택)</span>
            </label>
            <input
              id="species"
              type="text"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder="예: 말티즈, 페르시안 고양이, 골든 리트리버"
              className="w-full px-5 py-4 border-2 border-warm-200 rounded-2xl focus:ring-2 focus:ring-primary-400 focus:border-transparent text-warm-900 placeholder-warm-400 transition-all bg-white/80"
            />
          </div>

          {/* 추모일 */}
          <div className="mb-8">
            <label htmlFor="memorialDate" className="block text-lg font-bold text-warm-900 mb-3 flex items-center gap-2">
              <BsCalendar3 size={20} className="text-purple-500" /> 무지개다리를 건넌 날 <span className="text-warm-500 text-sm font-normal">(선택)</span>
            </label>
            <input
              id="memorialDate"
              type="date"
              value={memorialDate}
              onChange={(e) => setMemorialDate(e.target.value)}
              className="w-full px-5 py-4 border-2 border-warm-200 rounded-2xl focus:ring-2 focus:ring-primary-400 focus:border-transparent text-warm-900 transition-all bg-white/80"
            />
          </div>

          {/* 사진 업로드 */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-warm-900 mb-3 flex items-center gap-2">
              <FaCamera size={20} className="text-primary-500" /> 사진 <span className="text-red-500">*</span>
            </label>
            <div className="mb-4">
              <label className="flex items-center justify-center w-full h-48 px-4 border-3 border-dashed border-warm-300 rounded-3xl cursor-pointer hover:bg-warm-50 transition-all bg-white/60 group">
                <div className="text-center">
                  <div className="mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FaCamera size={60} className="text-primary-400 mx-auto" />
                  </div>
                  <p className="text-lg text-warm-700 font-semibold mb-2">
                    클릭하여 사진 선택
                  </p>
                  <p className="text-sm text-warm-500">
                    우리 아이의 모습을 담은 사진을 골라주세요 (최대 5장)
                  </p>
                  <p className="text-xs text-warm-400 mt-2">
                    JPG, PNG, GIF 등 모든 이미지 형식
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* 미리보기 */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <div className="relative overflow-hidden rounded-2xl aspect-square">
                      <img
                        src={url}
                        alt={`미리보기 ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110 shadow-soft"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 p-4 bg-primary-50/50 rounded-2xl border border-primary-200">
              <p className="text-sm text-primary-700 flex items-center gap-2">
                <IoSparkles size={16} className="text-yellow-500" />
                <span>AI가 사진을 분석하여 우리 아이의 특징을 학습합니다</span>
              </p>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-4 border-2 border-warm-300 text-warm-700 rounded-2xl font-bold hover:bg-warm-50 transition-all text-lg"
              disabled={createMutation.isPending}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-primary-500 to-peach-500 text-white rounded-2xl font-bold hover:shadow-warm disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all text-lg"
            >
              {createMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> 등록 중...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <FaHeart size={18} /> 등록하기
                </span>
              )}
            </button>
          </div>

          {/* 안내 메시지 */}
          <div className="mt-6 p-6 bg-blue-50/50 rounded-2xl border-2 border-blue-200">
            <div className="flex items-start gap-3">
              <MdInfo size={24} className="text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800 font-semibold mb-2">
                  개발 중 안내
                </p>
                <p className="text-sm text-blue-700">
                  현재 이미지 업로드 기능은 개발 중입니다. 등록하신 반려동물의 사진은 임시로 저장되며, S3 연동 후 정상적으로 업로드됩니다.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
