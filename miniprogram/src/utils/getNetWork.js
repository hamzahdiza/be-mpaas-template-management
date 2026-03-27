/**
 * get network status
 */
export default function getNetWork() {
  my.getNetworkType({
    success: (res) => {
      if (!res.networkAvailable) {
        my.call("enableSwipe", { isSwipe: false }, () => {})
      }
    }
  })
}