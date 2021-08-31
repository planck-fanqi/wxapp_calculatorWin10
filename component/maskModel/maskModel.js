const app = getApp()
var boxtaped=false
Component({
  properties:{
    text: { type: String, value:"" },
    hide: { type: Boolean, value: null }
  },
  data:{
    hidden:true
  },
  methods:{
      comfirm(){
          this.setData({hidden:true})
      }
  },
  observers: {
    'hide': function(hide) {
      if(!hide) this.setData({hidden:false})
    }
  }
})