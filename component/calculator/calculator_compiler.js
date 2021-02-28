function numToken(){
  var dotFlag=false;let NUMBERS = /[0-9]/;
  this.test=function(char){
    if(char=='.' && !dotFlag && (dotFlag=true)) return true;
    if(NUMBERS.test(char)) return true;
    return false;
  }
}

function tokenizer(input, varibles=null) {
  let current = 0;  let tokens = [];
  let operators=['+','-','*','/','^','√'];let op_grade={'+':1,'-':1,'*':2,'/':2,'^':3,'√':3};
  let LETTERS = /[a-z]/i;
  // let NUMBERS = /[0-9]/;
  while (current < input.length) {
    let char = input[current++];
    let NUMBERS=new numToken();
    if (char === '(') 
      tokens.push({ type: 'paren', value: '(' });
    else if (char === ')') 
      tokens.push({ type: 'paren', value: ')' });
    else if (NUMBERS.test(char)) {
      let value = char;
      while (NUMBERS.test(char=input[current]) || char=='.') {
        value += char;
        char = input[current++];
      }
      tokens.push({ type: 'Number', value: parseFloat(value) } );
    }
    else if (LETTERS.test(char) || char=='π') {
      let value = char; 
      var bugcnt='';
      while (LETTERS.test(char=input[current]) && char) {
        value += char;
        char = input[current++];
      }

      if(varibles && varibles[value])
        tokens.push({ type:'Number', value:varibles[value]});
      else if(value=='e')      
        tokens.push({ type:'Number', value:Math.E});
      else if(value=='π') 
        tokens.push({ type:'Number', value:Math.PI});
      else tokens.push({ type: 'Function', value });
    }
    else if(operators.indexOf(char)>=0)
      tokens.push({ type: 'Operator', value: char, grade:op_grade[char] });
    else throw new TypeError('I dont know what this character is: ' + char);
  }
  return tokens;
}
  
function parser(tokens) {
  let current = 0;
  
  function walk() {
    let token = tokens[current++];
    if (token.type === 'Function') 
      return { type:'Function', value:token.value, expression:walk()}
    if (token.type === 'paren' && token.value === '(' ) {
      token = tokens[current];
      let node = { type: 'CallExpression', params: [] };

      while (
        (token.type !== 'paren') ||
        (token.type === 'paren' && token.value !== ')')
      ) {
        node.params.push(walk());
        token = tokens[current];
      }
      current++;
      return node;
    }
    return token;
  }
 
  let ast = { type: 'CallExpression', params:[]};
  while (current < tokens.length)
    ast.params.push(walk());
  return ast;
}
function traverser(ast) {
  function traverseNode(params,start,end) {
    if(start+1==end) 
      if(params[start].type=='CallExpression')
        return traverser(params[start]);
      else if(params[start].type=='Function')
        return { type:'Function', value:params[start].value,
                 expression:traverser(params[start].expression)}
      else return params[start];
    var mid=end, grade_min=9;

    for(var i=start;i<end;i++) 
      if(params[i].type=='Operator' && params[i].grade<=grade_min) 
        grade_min=params[mid=i].grade;
    var node={ type:'BinaryOperator', params:[], value:params[mid].value};
    if(mid!=start) node.params.push(traverseNode(params,start,mid));
    if(mid!=end) node.params.push(traverseNode(params,mid+1,end));
    return node;
  }
  return traverseNode(ast.params,0,ast.params.length);
}
function compile(t_ast,angle=true){
  var visitor={
    '+':     (a,b)=>{ return a+b; },
    '-':     (a,b)=>{ if(b==undefined) return -a;
                      return a-b; },
    '*':     (a,b)=>{ return a*b; },
    '/':     (a,b)=>{ return a/b; },
    '^':     (a,b)=>{ return Math.pow(a,  b); },
    '√':     (a,b)=>{ if(b==undefined) return Math.pow(a,.5)
                      return Math.pow(b,1/a); },
    'sin':   (a,angle=false)=>{ return   Math.sin(  (angle?Math.PI/180:1)*a); },
    'cos':   (a,angle=false)=>{ return   Math.cos(  (angle?Math.PI/180:1)*a); },
    'tan':   (a,angle=false)=>{ return   Math.tan(  (angle?Math.PI/180:1)*a); },
    'cot':   (a,angle=false)=>{ return 1/Math.tan(  (angle?Math.PI/180:1)*a); },
    'asin':  (a,angle=false)=>{ return   Math.asin(a)/(angle?Math.PI/180:1); },
    'acos':  (a,angle=false)=>{ return   Math.acos(a)/(angle?Math.PI/180:1); },
    'atan':  (a,angle=false)=>{ return   Math.atan(a)/(angle?Math.PI/180:1); },
    'acot':  (a,angle=false)=>{ return 1/Math.atan(a)/(angle?Math.PI/180:1); },
    'log':   (a)=>{ return Math.log10(a); },
    'ln':    (a)=>{ return Math.log(a); },
    'sqrt':  (a)=>{ return Math.pow(a,0.5); },
    'square':(a)=>{ return Math.pow(a,2); },
  }
  function calculateNode(node){
    if(!node) return undefined
    if(node.type=='Number') return node.value;
    var method=visitor[node.value];
    if(node.type=='BinaryOperator') 
      return method(calculateNode(node.params[0]),calculateNode(node.params[1]));
    if(node.type=='Function')
      return method(calculateNode(node.expression),angle);
  }
  return calculateNode(t_ast);
}
function calculate(expression,angle,varibles=null){
  var tokens=tokenizer(expression,varibles);
  var ast=parser(tokens);
  var est=traverser(ast);
  var result=compile(est,angle)
  return result;
}

module.exports = {
  calculate
}