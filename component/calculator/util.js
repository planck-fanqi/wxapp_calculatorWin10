const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function varListener(init_value){
  var value=init_value;
  var delegate=null;
  this.set=function(new_value){
      if(delegate!=null) delegate(new_value);
      value=new_value;
  }
  this.get=function(){return value;}
  this.addListener=function(new_delegate){delegate=new_delegate;}
  
}

function print(obj){
  console.log(obj)
}
module.exports = {
  formatTime,
  print,
  varListener
}
