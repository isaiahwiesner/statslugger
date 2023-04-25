import { useState } from 'react'

export function useImageUpload() {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const uploadImage = async (image) => {
    setError(null)
    setIsLoading(true)
    console.log(image)
    const formData = new FormData()
    formData.append('image', image)
    try {
      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
          'Authorization': `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT_ID}`,
        },
        body: formData
      })
      const json = await response.json()
      if (!response.ok) {
        setError(json.data.error)
        setIsLoading(false)
        return false
      }
      if (response.ok) {
        setIsLoading(false)
        return json.data.link
      }
    } catch (e) {
      setError(e.message)
      setIsLoading(false)
      console.error(e)
    }
  }

  return {
    uploadImage,
    error, setError,
    isLoading, setIsLoading
  }
}