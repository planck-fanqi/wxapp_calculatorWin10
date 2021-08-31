const app = getApp()
var boxtaped=false
Component({
  properties:{
    hide:{ type: Boolean, value: null }
  },
  data:{
    text:'',
    hidden:true,
    tipHide:true
  },
  methods:{
    boxTap(){
      boxtaped=true
    },
    modelTap(){
      if(!boxtaped) this.setData({hidden:true})
      boxtaped=false
    },
    textInput(e){
      this.data.text=e.detail.value
    },
    confirm(){
      if(isNaN(parseFloat(this.data.text)))
        this.setData({tipHide:false})
      else{
        this.setData({hidden:true})
        this.triggerEvent('param',this.data.text)
      }
    }
  },
  observers: {
    'hide': function(hide) {
      if(!hide) this.setData({hidden:false,text:""})

    }
  }
})