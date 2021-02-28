const app = getApp()
var innerClick=false
const log=console.log
Component({
  properties:{
    outClick:{ type:Boolean,value:true},
    tap:{ type:Function,value:null }
  },
  data:{
    hidden:false
  },
  methods:{
    click(){
      console.log('clic^')
      this.setData({hidden:true})
    },
    bgClick(){
      log('out')
      if(!innerClick) this.setData({hidden:true})
    },
    inClick(){
      log('in')
      innerClick=true
    },
    tap(){
      this.properties.tap()
    }
  },
})