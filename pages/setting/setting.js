const app = getApp()
const log= console.log
Page({
  data:{
    outClick:false
  },
  tap(){
    log(app.globalData.backgroundImg)

    setTimeout(()=>{
      wx.chooseImage({
        count: 1, 
        sizeType: ['original'], 
        sourceType: ['album'], 
        success: function (res) {
            app.globalData.backgroundImg=res.tempFilePaths[0]
        }
      })
    },500)
  },
  outTap(){
    this.setData({outClick:true})
  }
})