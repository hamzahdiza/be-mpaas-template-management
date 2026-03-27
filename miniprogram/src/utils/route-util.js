const customUrlQueryData = 'customUrlQueryData'

/**
 * Routing jump with parameters, the receiving page uses my. customUrlQueryData [query. customUrlQueryData] to retrieve object data
 * @param {url:Sting,  data:Object,  success:Function,  fail:Function,  complete:Function,  mode:String}  
 */
export function customNavigateTo({
  url,
  data,
  success,
  fail,
  complete,
  mode = 'navigateTo'
}) {
  const urls = url.split('/')
  const mark = urls[urls.length - 1]
  if (my[customUrlQueryData]) {
    my[customUrlQueryData][`${mark}`] = JSON.parse(JSON.stringify(data))
  } else {
    my[customUrlQueryData] = {
      [`${mark}`] : JSON.parse(JSON.stringify(data))
    }
  }
  if (my[mode]) {
    my[mode]({
      url: `${url}?${customUrlQueryData}=${mark}`,
      success,
      fail,
      complete
    })
  }
}