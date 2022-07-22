/* eslint-disable no-restricted-globals */

export function getPaginationData(arrayData, pageNumber, pageSize) {
  const startIndex = pageNumber * pageSize - pageSize
  const endIndex = startIndex + pageSize
  const result = arrayData.slice(startIndex, endIndex)
  return result
}

export function getPageNumber(evt) {
  // @ts-ignore
  const currentPageNumber = Number(event.target.textContent)
  return currentPageNumber
}
