const isImage = async (url) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      return false
    }
    const type = response.headers.get('content-type').split('/')[0]
    if (type !== 'image') {
      return false
    }
    return true
  }
  catch {
    return false
  }
}

export default isImage