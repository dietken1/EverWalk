import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pets } from '@/lib/api'
import toast from 'react-hot-toast'

export function usePets() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['pets'],
    queryFn: pets.getAll,
    // 개발 중 서버 연결 실패 시 빈 배열 반환
    onError: (err: any) => {
      if (err?.code === 'ERR_NETWORK') {
        console.warn('서버 미연결 - 빈 목록 표시')
      }
    },
  })

  const createMutation = useMutation({
    mutationFn: pets.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      toast.success('반려동물이 등록되었습니다!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '등록에 실패했습니다')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: pets.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      toast.success('반려동물이 삭제되었습니다')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '삭제에 실패했습니다')
    },
  })

  return {
    pets: data || [],
    isLoading,
    error,
    createPet: createMutation.mutate,
    deletePet: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}

export function usePet(petId: number) {
  return useQuery({
    queryKey: ['pets', petId],
    queryFn: () => pets.getById(petId),
    enabled: !!petId,
  })
}
