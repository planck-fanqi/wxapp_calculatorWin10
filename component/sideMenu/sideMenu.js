const app = getApp()
var menuShowBtn=false
Component({
  properties:{
    outClick:{ type:Boolean,value:true}
  },
  data:{
    menuBias:0,menuDur:100,curItemIdx:0
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
      this.setData({curItemIdx:e.currentTarget.dataset.idx})
    }
  },
  observers: {
    'outClick': function() {
      this.menuHidden()
    }
  }
})