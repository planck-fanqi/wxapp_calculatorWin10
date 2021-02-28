Array.prototype.top = function() {
  return this[this.length-1]
};
var null_state={
  'value':'null','strs':null,'bracket':0,
  'btn':{ 'value':null, 'type':null }}
function Checker(){
  var states=[];
  var cursorIdx=-1;
  var pushCursor=false;
  this.input=function(btn){
    var inputs=btn.value
    var state=states.length==0?null_state:states.top();
    if(inputs=='AC'){
      states=[];cursorIdx=-1;
      return true;
    }
    if(inputs=='DEL') return remove()
    if(cursorIdx+1==states.length)
      return check(state,btn)
    else 
      return insert(btn)
  }
  this.toString=function(simplify=true){
    var result='';
    states.map(item=>{
      if(typeof(item.strs)==typeof[]) 
        item.strs.map(sitem=>{
          if(typeof(sitem)==typeof([])) result+=simplify?'':sitem[0];
          else result+=sitem;
        })
      else result+=item.strs;
    })
    if(!simplify && result!='') {
      result+=Array(states.top().bracket+1).join(')')
      result=result.replace('()','(0)').replace('×','*').replace('÷','/').replace('*^','^')
    }
    return result;
  }
  this.justifyCursorCharcnt=function(charCnt=-1){
    if(pushCursor && !(pushCursor=false))  return charCntByCursor(cursorIdx)
    else if(charCnt==-1) {
      cursorIdx=states.length-1
      return charCntByCursor()
    }
    return cursorCharsCntJustify(charCnt)
  }
  this.cursorEnd=function(){
    return cursorIdx==states.length-1
  }
  function charCntByCursor(){
    var cnt=0;
    for(var i=0;i<=cursorIdx;i++) {
      var chars=states[i].strs;
      if(typeof(chars)==typeof([])) 
        chars.map(item=>{ if(typeof(item)!=typeof([])) cnt+=item.length })
      else cnt+=chars.length
    }
    return cnt;
  }
  function remove(){
    if(cursorIdx==-1) return false;
    var state=cursorIdx==0?null_state:states[cursorIdx-1]
    var new_states=states.slice(0,cursorIdx)
    for(var i=cursorIdx+1;i<states.length;i++){
      state = check(state,states[i].btn,false)
      if(!state) return false;
      new_states.push(state);
    }
    states=new_states
    cursorIdx--;
    pushCursor=true;
    return true;
  }
  function insert(btn){
    var state=cursorIdx==-1?null_state:states[cursorIdx]; 
    var new_states=states.slice(0,cursorIdx+1);
    state=check(state,btn,false);
    if(!state) return false;
    new_states.push(state)
    for(var i=cursorIdx+1;i<states.length;i++){
      state = check(state,states[i].btn,false)
      if(!state) return false;
      new_states.push(state);
    }
    states=new_states
    cursorIdx++;
    pushCursor=true;
    return true;
  }
  function check(state,btn,inputEn=true){
    var new_state='null',chars=btn.value;
    var bracketCnt=state.bracket; state=state.value
    switch(btn.type){
      case 'func':
        new_state='null';
        if(state=='null' || state=='operator') chars=[chars,'(']
        else chars=[['*'],chars,'(']
        bracketCnt++;
      break
      case 'bracket':
        if(chars=='(') {
          if(state=='int' || state=='float' || state=='var') 
            chars=[['*'],'('];
          new_state='null';
          bracketCnt++;
        }
        else {
          if(!bracketCnt || state=='null' || state=='operator' || state=='minus') /*error input*/chars='error';
          else {
            new_state='var';bracketCnt--;
          }
        }
      break;
      case 'num':
        if(chars=='.') 
          if(state!='float') new_state='float';
          else /*error input*/chars='error';
        else if(state=='float') new_state='float';
        else if(state=='var'){ new_state='int';chars=[['*'],chars] }
        else new_state='int';
      break;
      case 'op':
        if(state=='var' || state=='float' || state=='int') new_state='operator'
        else if(state!='sqrt' && (state=='null' || state=='operator' || state=='minus')){
          if(state!='minus' && chars=='-')  new_state='minus';
          else if(chars=='√') new_state='sqrt'
          else /*error input*/chars='error';
        }
        else /*error input*/chars='error';
      break;
      case 'var':
        new_state='var';
        if(state=='float' || state=='int' || state=='var') chars=[['*'],chars]
      break;
    }
    if(chars=='error') return false;
    var new_state_={
      'value':new_state,'strs':chars,'bracket':bracketCnt,'btn':btn
    }
    if(inputEn) {
      states.push(new_state_)
      pushCursor=true;
      cursorIdx++
      return true;
    }
    else return new_state_
  }
  function cursorCharsCntJustify(charCnt){//simplify
    var cnt=0; var currentLen=0; var i=0;
    if(states.length==0) return 1;
    while(cnt<charCnt){
      var chars=states[i++].strs;
      currentLen=0;
      if(typeof(chars)==typeof([])) chars.map(
        item=>{ if(typeof(item)!=typeof([])) currentLen+=item.length } 
      )
      else currentLen=1;
      cnt+=currentLen;
    }
    cursorIdx=i-1;
    return cnt;
  }

}

module.exports = {
  Checker
}