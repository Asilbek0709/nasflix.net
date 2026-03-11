const API_URL = "https://nasflix-net-krpr.vercel.app/"

export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/auth/google`
}

export const loginWithGithub = () => {
  window.location.href = `${API_URL}/auth/github`
}