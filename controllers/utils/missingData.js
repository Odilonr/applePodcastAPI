function missingData (name, description, profileImage, releaseSchedule) {
  let missingData = ''
  const dataList = [
    {
      dataTitle: 'name',
      data: name
    },
    {
      dataTitle: 'description',
      data: description
    },
    {
      dataTitle: 'Profile Image',
      data: profileImage
    },
    {
      dataTitle: 'Release Schedule',
      data: releaseSchedule
    } 
  ]

  for (let dataObj of dataList) {
    if(!dataObj.data) {
      missingData += `${dataObj.dataTitle}, `
    }
  }

  return missingData
}

export { missingData }