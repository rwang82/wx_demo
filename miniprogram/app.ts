//app.ts
export interface IMyApp {
  userInfoReadyCallback?(res: wx.UserInfo): void
  globalData: {
    userInfo?: wx.UserInfo
  }
}

App<IMyApp>({
  onLaunch() {
    // 展示本地存储能力
    var logs: number[] = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success(_res) {
         console.log("[ROM_DEBUG] _res.code:" +_res.code)
        // 发送 _res.code 到后台换取 openId, sessionKey, unionId
        
        wx.request({
          url: "http://127.0.0.1:5000/login/",
          data: { code: _res.code },
          dataType: "json",
          method: "GET",
          success: res => {
            if (res.statusCode != 200) {
              // failed
              console.log("[ROM_DEBUG] request failed. res:" + JSON.stringify(res));
            } else if (res.data) {
              // success.
              console.log("[ROM_DEBUG] request success. res:" + JSON.stringify(res));
            } else {
              // failed.
              console.log("[ROM_DEBUG] request failed. res:" + JSON.stringify(res));
            }
          },
          fail: () => {
              // failed.
              console.log("[ROM_DEBUG] request failed. 4444");
          }
        })

      }
    })
    // 获取用户信息
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res.userInfo)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
  }

})