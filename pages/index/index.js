import * as util from './calculatorDep/util'
import {Checker} from './calculatorDep/BtnCheck'
import {calculate} from './calculatorDep/calculator_compiler'
const app = getApp()
const log = console.log
var checker=new Checker()
var PageWidth,PageHeight
var variblesDic={Ans:'100.111111',X:'0',Y:'0',A:'0',B:'0',C:'0',D:'0',E:'0',F:'0'}
var mvX/**/,scrollLeft=0/**/,isCharOut=true,angle=true,history,charWidth=16.494791666666668
function variblesDic2List(){
  var ls=[]
  Object.keys(variblesDic).map(key=>{
    return {name:key,value:variblesDic[key]}
  })
  for(var k in variblesDic) ls.push({ name:k,value:variblesDic[k]})
  return ls
}
Page({
  data: {
    spaceHeight:0,
    answer:'',inputs:'',
    isHistoryShow:false,
    outClick:true,
    mvOffset:0,autoLeftOffset:0,cursor_offset:0,
    fbtns:null,nbtns:null,
    varibles:null,curVar:{ key:'Ans',value:'100.111111'}
  },
  //侧边栏隐藏
  pageClick(){ this.setData({outClick:true}) },
  //函数滑动翻页
  moving:function(e){  mvX=e.detail.x; } ,
  autoMv:function(){
    var mvWidth=2*PageWidth
    var cretia=mvWidth/20; var mid=mvX+mvWidth/2
    if(this.data.mvOffset==0) this.setData({mvOffset:mvX<-cretia?-mvWidth/2:0})
    else this.setData({mvOffset:mid>cretia?0:-mvWidth/2})
  },
  //光标输入交互
  scrollListen:function(e){ scrollLeft=e.detail.scrollLeft },
  cursorJump:function(e){
    if(e.detail.x-.05*PageWidth>this.data.inputs.length*charWidth) return
    var scrollRight=this.data.inputs.length*charWidth-scrollLeft-.9*PageWidth
    var charCnt=Math.round((.95*PageWidth-e.detail.x+scrollRight)/charWidth)
    this.setData({cursor_offset:charWidth*(this.data.inputs.length-checker.justifyCursorCharcnt(this.data.inputs.length-charCnt))})
  },
  //
  button:function(e){
    function variblesDic2List(){
      return Object.keys(variblesDic).map(key=>{
        return {key,value:variblesDic[key]}
      })
    }
    var that=this
    function updateCursor(btn){
      if(checker.input(btn))
        that.setData({inputs:checker.toString(),cursor_offset:checker.justifyCursorCharcnt(-1,'right')*charWidth})
      else 
        wx.showToast({ title: '算式错误', icon: 'none', duration:300 });
    }
    var btn=e.currentTarget.dataset.info
    if(btn.type=='FUNC'){
      if(btn.value=='=') {
        variblesDic.Ans=calculate(checker.toString(false),angle,variblesDic)+''
        this.setData({answer:variblesDic.Ans,
                      varibles:variblesDic2List(),
                      curVar:{key:this.data.curVar.key,value:variblesDic[this.data.curVar.key]}})
      }
      if(btn.value=='DEL') {
        if(!checker.input(btn))wx.showToast({ title: '算式错误', icon: 'none', duration:300 });
        else this.setData({inputs:checker.toString()})
      }
      if(btn.value=='AC') {
        updateCursor(btn)
        this.setData({answer:'0'})
      }
      if(btn.value=='角度制'||btn.value=='弧度制') {
        angle=!angle;
        this.data.nbtns[3][0]=angle?{value:'角度制',type:'FUNC',text:'角度制'}:{value:'弧度制',type:'FUNC',text:'弧度制'};
        this.setData({nbtns:this.data.nbtns})
      }
      if(btn.value=='保存'){
        variblesDic[this.data.curVar.key]=this.data.answer;
        this.setData({varibles:variblesDic2List(),curVar:{key:this.data.curVar.key,value:variblesDic[this.data.curVar.key]}})
      }
    }
    else if(checker.input(btn)){
      var res=checker.toString()
      this.setData({inputs:res})//先刷新文本在移动文本框
      this.setData({autoLeftOffset:(res.length+1)*charWidth})
    }
    else wx.showToast({ title: '非法输入', icon: 'none', duration:300 });
    this.setData({varibles:variblesDic2List()})
  },
  //历史记录操作
  historyShow(){
    this.setData({isHistoryShow:!this.data.isHistoryShow})
  },
  historyChoose(e){
    this.setData({curVar:e.currentTarget.dataset.info,isHistoryShow:false})
  },
  historyInput(e){
    var Var=e.currentTarget.dataset.info
    checker.input({value:Var.key,type:'var'})
    this.setData({isHistoryShow:false,inputs:checker.toString()})
  },
  onLoad: function () {
    PageWidth=wx.getSystemInfoSync().windowWidth
    PageHeight=wx.getSystemInfoSync().windowHeight;
    this.setData({spaceHeight:79-130*PageWidth/PageHeight})
    this.setData({nbtns:util.nBtns,fbtns:util.fBtns})
    this.setData({varibles:Object.keys(variblesDic).map(key=>{
      return {key,value:variblesDic[key]}
    })})
  },
})
