import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

export function useAuth() {
  const router = useRouter()
  const { setAuth, clearAuth, isAuthenticated } = useAuthStore()

  const registerMutation = useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) =>
      auth.register(email, password, name),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
      toast.success('회원가입이 완료되었습니다!')
      router.push('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '회원가입에 실패했습니다')
    },
  })

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      auth.login(email, password),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken)
      toast.success('로그인되었습니다!')
      router.push('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '로그인에 실패했습니다')
    },
  })

  const logout = () => {
    clearAuth()
    router.push('/')
    toast.success('로그아웃되었습니다')
  }

  return {
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout,
    isLoading: registerMutation.isPending || loginMutation.isPending,
    isAuthenticated: isAuthenticated(),
  }
}
