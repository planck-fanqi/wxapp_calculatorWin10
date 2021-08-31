Page({
  data:{
    tipHide:true,outClick:false,text:'',
    infos:{
      text: '二进制', type: 'b'
    }
  },
  //侧边栏隐藏
  pageClick(){ this.setData({outClick:true}) },
  confirms(){
    console.log(this.data.text)
  }
})