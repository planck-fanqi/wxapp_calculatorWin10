// pages/test/test.js
const log=console.log
var menuShowBtn=false
Page({
  data: {
    hide:true,model:false
  },
  menuShow(){
    this.setData({model:true})
  },
  test(e){
    log(e.detail)
  },
  onLoad: function (options) {
    setTimeout(()=>{
      this.setData({hide:false})
    },2000)
  },
})