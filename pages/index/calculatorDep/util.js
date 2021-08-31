var fBtns=[//fucntion buttons
  [
    {value:'^2'  ,type:'FUNC',text:'^2'  },
    {value:'^'   ,type:'op'  ,text:'^'   },
    {value:'√'   ,type:'op'  ,text:'√'   },
    {value:'ln'  ,type:'func',text:'ln'  },
    {value:'log' ,type:'func',text:'log' },
    {value:'sin' ,type:'func',text:'sin' },
    {value:'cos' ,type:'func',text:'cos' },
    {value:'tan' ,type:'func',text:'tan' },
    {value:'cot' ,type:'func',text:'cot' },
    {value:'('   ,type:'bracket',text:'('},
  ],
  [
    {value:'e'    ,type:'var'    ,text:'e'   },
    {value:'π'    ,type:'var'    ,text:'π'   },
    {value:'('    ,type:'bracket',text:'('   },
    {value:')'    ,type:'bracket',text:')'   },
    {value:'null' ,type:'null'   ,text:'null'},
    {value:'asin' ,type:'func'   ,text:'asin' },
    {value:'acos' ,type:'func'   ,text:'acos' },
    {value:'atan' ,type:'func'   ,text:'atan' },
    {value:'acot' ,type:'func'   ,text:'acot' },
    {value:')'    ,type:'bracket',text:')'    },
  ]
]
var nBtns=[//number buttons
  [
    {value:'7'  ,type:'num' ,text:'7'  },
    {value:'8'  ,type:'num' ,text:'8'  },
    {value:'9'  ,type:'num' ,text:'9'  },
    {value:'DEL',type:'FUNC',text:'DEL'},
    {value:'AC' ,type:'FUNC',text:'AC' }
  ], 
  [
    {value:'4',type:'num',text:'4'},
    {value:'5',type:'num',text:'5'},
    {value:'6',type:'num',text:'6'},
    {value:'*',type:'op' ,text:'×'},
    {value:'/',type:'op' ,text:'÷'} 
  ],
  [
    {value:'1',type:'num',text:'1'},
    {value:'2',type:'num',text:'2'},
    {value:'3',type:'num',text:'3'},
    {value:'+',type:'op' ,text:'+'},
    {value:'-',type:'op' ,text:'-'} 
  ], 
  [
    {value:'角度制',type:'FUNC',text:'角度制'},
    {value:'0'    ,type:'num' ,text:'0'     },
    {value:'.'    ,type:'num' ,text:'.'     },
    {value:'保存' ,type:'FUNC',text:'保存'   },
    {value:'='    ,type:'FUNC',text:'='     },
  ]
]
module.exports = {
  fBtns,
  nBtns,
}
