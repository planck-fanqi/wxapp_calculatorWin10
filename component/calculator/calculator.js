import {varListener} from './util'
import {Checker} from './BtnCheck'
import {calculate} from './calculator_compiler'
const app = getApp()
var funcBtns=[
  ['^2' ,'^'  ,'√'   ,'ln'  ,'log' ,      'sin',  'cos',  'tan',  'cot', 'null'],
  ['e'  ,'π'   ,'('  ,')'   ,'null',     'asin', 'acos', 'atan', 'acot', 'null'],
]
var numBtns=[
  ['7'    ,'8'  ,'9'  ,'DEL'  ,'AC'], ['4'    ,'5'  ,'6'  ,'×'    ,'÷' ],
  ['1'    ,'2'  ,'3'  ,'+'    ,'-' ], ['角度制','0'  ,  '.','保存', '=' ]
]
function type(btn){
  var funcList=['sin','cos','tan','cot','asin','acos','atan','acot',
                'sqrt','log','ln', '2√']
  var FUNClist=['AC','DEL','=','保存','角度制','弧度制','^2']
  var opList=['+','-','×','÷','^','√']
  var varList=['e','π','x','y','a','b','c','d','ans']
  if(/[0-9]/.test(btn) || btn=='.') return 'num'
  if(funcList.indexOf(btn)>=0) return 'func'
  if(FUNClist.indexOf(btn)>=0) return 'FUNC'
  if(opList.indexOf(btn)>=0) return 'op'
  if(varList.indexOf(btn)>=0) return 'var'
  if(btn=='(' || btn==')') return 'bracket'
  if(!btn) return null
}
var charWidth=0,scrollBoundLeft=0,scrollLeft=0;
var mvWidth=0;
var mvX=0
var checker=new Checker()
var isCharOut=true;
var variblesDic={ans:'0',x:'0',y:'0',a:'0',b:'0',c:'0',d:'0'}
var render=new varListener(null)
function variblesDic2List(){
  var ls=[]
  for(var k in variblesDic) ls.push({ name:k,value:variblesDic[k]})
  return ls
}
var angle=true
Component({
  data: {
    Chars:'',answer:'',varibles:null,key:'ans',key_value:'0',
    mvOffset:0,autoLeftOffset:0,
    cursor_offset:0,
    funcBtns:null,numBtns:null,btnDic:null,
    modalName:false
  },
  methods: {
    ten:function(){ this.setData({Chars:'0000000000'}) },
    clear:function(){ wx.clearStorage() },
    clear:function(){ wx.clearStorage() },
    moving:function(e){  mvX=e.detail.x; } ,
    scrollListen:function(e){ scrollLeft=e.detail.scrollLeft },
    historyDataModel:function(){ this.setData({modalName:'bottomModal'}) },
    historyDataChoose:function(e){ this.setData({key:e.currentTarget.id,key_value:variblesDic[e.currentTarget.id],modalName:null}) },
    historyDataInput:function(e){ this.setData({modalName:null}); this.btnTap(e) },
    hideModal:function(){ this.setData({modalName:null}) },
    autoMv:function(){
      var cretia=mvWidth/20; var mid=mvX+mvWidth/2
      if(this.data.mvOffset==0) this.setData({mvOffset:mvX<-cretia?-mvWidth/2:0})
      else this.setData({mvOffset:mid>cretia?0:-mvWidth/2})
    },
    updateCursor:function(btn){
      if(checker.input(btn))
        this.setData({Chars:checker.toString(),cursor_offset:checker.justifyCursorCharcnt()*charWidth})
      else 
        wx.showToast({ title: '算式错误', icon: 'none', duration:300 });
    },
    btnTap:function(e){
      var btn={'value':e.currentTarget.id,'type':type(e.currentTarget.id)}
      if(btn.type=='FUNC'){
        if(btn.value=='=') {
          this.setData({answer:(variblesDic.ans=calculate(checker.toString(false),angle,variblesDic)+''),
                        varibles:variblesDic2List(),
                        key:this.data.key,key_value:variblesDic[this.data.key]})
        }
        if(btn.value=='DEL') this.updateCursor(btn)
        if(btn.value=='AC') this.updateCursor(btn)
        if(btn.value=='角度制'||btn.value=='弧度制') {
          angle=!angle;
          var numBtn_new=this.data.numBtns
          numBtns[3][0]=angle?'角度制':'弧度制';
          this.setData({numBtns:numBtn_new})
        }
        if(btn.value=='保存'){
          variblesDic[this.data.key]=this.data.answer;
          this.setData({varibles:variblesDic2List(),key:this.data.key,key_value:variblesDic[this.data.key]})
        }
        return;
      }
      if(checker.input(btn)){
        var cursor_offset=checker.justifyCursorCharcnt()*charWidth
        this.setData({Chars:checker.toString(),cursor_offset:cursor_offset})
        var that=this
        if(checker.cursorEnd())
          setTimeout(()=>{ that.setData({autoLeftOffset:cursor_offset+1}) },10)
      }
      else wx.showToast({ title: '非法输入', icon: 'none', duration:300 });
      this.setData({varibles:variblesDic2List()})
    },
    tapchar:function(e){
      isCharOut=false
      var absx=e.detail.x-scrollBoundLeft+scrollLeft;
      var char_cnt=0;
      if(charWidth<=0) {  return; }
      while(char_cnt*charWidth<absx) char_cnt++;
      if(absx<(char_cnt-.5)*charWidth) char_cnt--;
      checker.justifyCursorCharcnt(char_cnt)
      this.setData({cursor_offset:charWidth*checker.justifyCursorCharcnt(char_cnt)})
    },
    charendtap:function(e){
      if(isCharOut)
      this.setData({cursor_offset:charWidth*checker.justifyCursorCharcnt()})
      isCharOut=true
    },
    getCharInfo:function(){
      if(charWidth && scrollBoundLeft)return;
      var that=this
      wx.getStorage({ key: 'charInfo',
        success:res=>{  
          charWidth=res.data['charWidth']
          scrollBoundLeft=res.data['scrollBoundLeft']
          mvWidth=res.data['mvWidth']
          console.log(charWidth);
        },
        fail:()=>{ 
            that.setData({modalName:'TipModel'})
        }
      })
    },
    init:function(cnt){
      var that=this
      var charInfo=new varListener({});
      charInfo.addListener(val=>{
        if(Object.keys(val).length==3) {
          wx.setStorage({ 
            data:val, key:'charInfo',
            fail:()=>{ console.log('setCharInfo fail') }
          })
          charWidth=val['charWidth'];scrollBoundLeft=val['scrollBoundLeft']
        }
      })
      this.setData({Chars:new Array(11).join('0')})
      var query = wx.createSelectorQuery().in(this)
      query.select('.input_content').boundingClientRect()
      query.exec(function(res){
        if(cnt==2) console.log(`error data:${res[0].width}`);//未渲染完成
        else {
          var dic=charInfo.get();dic['charWidth']=res[0].width/10;
          charInfo.set(dic)
        }
      })
      query.select('.input_scroll').boundingClientRect()
      query.exec(function(res){
        var dic=charInfo.get();dic['scrollBoundLeft']=res[0].left;
        charInfo.set(dic)
      })
      query = wx.createSelectorQuery().in(this)
      query.select('.mv').boundingClientRect()
      query.exec(function(res){
        var dic=charInfo.get();dic['mvWidth']=res[0].width;
        charInfo.set(dic)
      })
      this.setData({modalName:null})
    },
  },
  lifetimes: {
    ready:function(){
      this.setData({ funcBtns:funcBtns, numBtns:numBtns})
      this.getCharInfo()
      this.setData({varibles:variblesDic2List()})
      this.init(2)
    }
  }
  
})
