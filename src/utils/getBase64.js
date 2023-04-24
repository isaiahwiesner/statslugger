const getBase64 = (file, onLoad) => {
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    onLoad(reader.result.replaceAll(/^data:image\/?[A-z]*;base64,/g, ''))
  }
}

export default getBase64