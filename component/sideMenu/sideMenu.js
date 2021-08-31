const app = getApp()
var menuShowBtn=false
Component({
  properties:{
    outClick:{ type:Boolean,value:true},
    curItemIdx: { type:Number, value: null }
  },
  data:{
    urls:[
      '../../pages/index/index',
      '../../pages/program/program',
      '../../pages/setting/setting',
    ],
    menuBias:0,menuDur:100
  },
  methods:{
    menuBtn(){
      if(this.data.menuBias<0) this.menuShow()
      else this.menuHidden()
    },
    menuShow(){
      this.setData({menuBias:0,menuDur:200})
      menuShowBtn=true
    },
    menuHidden(){
      this.setData({menuBias:-70,menuDur:100})
    },
    itemTap(e){
      this.menuHidden()
      wx.redirectTo({url:this.data.urls[e.currentTarget.dataset.idx]})
    }
  },
  observers: {
    'outClick': function() {
      this.menuHidden()
    }
  }
})