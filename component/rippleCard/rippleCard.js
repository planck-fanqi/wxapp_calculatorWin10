const app = getApp()
var boxtaped=false
Component({
  properties:{
    text: { type: String, value:"" },
  },
  data:{
    rippleInfo:null,rippleHidden:true
  },
  methods:{
    cardTap(e){
      var x=e.detail.x - e.currentTarget.offsetLeft;
      var y=e.detail.y - e.currentTarget.offsetTop;
      this.setData({
        rippleInfo:{x,y},
        rippleHidden:false
      })
      setTimeout(()=>{
        this.setData({rippleHidden:true})
      },500)
    },
  },
})