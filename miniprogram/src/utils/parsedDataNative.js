export function parseNestedJSON(data) {

  let result = JSON.parse(data)
  let partnerData = result.partnerData
  let queryParam = result.queryParam

  return {
    partnerData,
    queryParam
  };
}