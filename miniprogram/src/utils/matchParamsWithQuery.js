export function matchParamsWithQuery(responseNative) {
  const context = {};
  responseNative.partnerData.params.forEach((param) => {
    if (Object.prototype.hasOwnProperty.call(responseNative.queryParam, param.queryParam)) {
      context[param.valueMapping] = responseNative.queryParam[param.queryParam];
    }
  });
  const billerNumber = context.billerNumber || null;
  const vaNumber = context.vaNumber || null;

  return {
    context,
    billerNumber,
    vaNumber
  };
}
