const API_URL = "http://localhost:5000"

export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/auth/google`
}

export const loginWithGithub = () => {
  window.location.href = `${API_URL}/auth/github`
}