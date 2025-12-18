import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { videos } from '@/lib/api'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export function useVideos(petId: number) {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['videos', petId],
    queryFn: () => videos.getByPet(petId),
    enabled: !!petId,
  })

  const createMutation = useMutation({
    mutationFn: ({ interactionType }: { interactionType: string }) =>
      videos.create(petId, interactionType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos', petId] })
      toast.success('영상 생성이 시작되었습니다!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '영상 생성에 실패했습니다')
    },
  })

  return {
    videos: data || [],
    isLoading,
    createVideo: createMutation.mutate,
    isCreating: createMutation.isPending,
  }
}

export function useVideoProgress(jobId: number | null) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!jobId) return

    const eventSource = videos.streamProgress(
      jobId,
      (data) => {
        setProgress(data.percent || 0)
        setStatus(data.status || '')
        setMessage(data.message || '')
      },
      () => {
        setIsComplete(true)
      },
      (error) => {
        console.error('Progress stream error:', error)
        toast.error('진행 상황을 불러올 수 없습니다')
      }
    )

    return () => {
      eventSource.close()
    }
  }, [jobId])

  return {
    progress,
    status,
    message,
    isComplete,
  }
}
