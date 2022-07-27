export default function consoleCapsule() {
  const {
    Composite,
    TextView,
    ScrollView,
    Row,
    RowLayout,
    StackLayout,
    Stack,
    $
  } = require('tabris');
 
  const consoleMethods = Object.create(null);
  const viewLogger = $('#logger').only();
  
  const appendText = (text, textColor, container) => {
    const view = new TextView({
      text,
      textColor
    })
    
    if (typeof container !== 'undefined') setTimeout(function() {view.appendTo(container);}, 1200);
    
    return view;
  }
  const getType = (val) => {
    const $type = typeof val;
    return 'view' + $type[0].toUpperCase() + $type.slice(1);
  }
  
  const types = {
    viewString(val, container) {
      return appendText(`"${val}"`, '#d8f24f', container)
    },
    viewNumber(val, container) {
      return appendText(val, '#2e99e9', container)
    },
    viewObject(objs, container) {
      const TEXT_BRACE_MORE = '{⤡}';
      
      const viewObject = new Stack({
        class: 'object',
        alignment: 'left',
        padding: {left: 15},
        //excludeFromLayout: true
      })
      
      Object.keys(objs).forEach(async (key) =>{
        await new Promise(resolve => setTimeout(()=> resolve(), 1500))
        const wrap = new Row({layoutData: 'stretch', spacing: 5})
        wrap.append(
          new TextView({id: 'objectKey', text: `${key}:`, textColor: '#00ff5b'})
        )
        this[getType(objs[key])](objs[key], wrap)
        
        viewObject.append(wrap);
      })
      
      
      const viewTextBracketClose = new TextView({
        class: 'brace', 
        text: '}', 
        excludeFromLayout: true,
        top: 'prev()', 
        textColor: 'white'
      });
      
      const viewTextBracketOpen = new TextView({
        text: TEXT_BRACE_MORE,
        textColor: 'white',
        data: {isClose: true},
        padding: {right: 50}
      }).onTap(({target}) => {
        const exclude = target.data.isClose;
        
        if (exclude === false) {
          target.text = '{';
        } else {
          target.text = TEXT_BRACE_MORE;
        }
        
        viewObject.excludeFromLayout = exclude;
        viewTextBracketClose.excludeFromLayout = exclude;
        
        target.data.isClose = !exclude;
      });
      
      const stacks = new Stack().append(
        viewTextBracketOpen,
        viewObject,
        viewTextBracketClose
      );
      
      if (typeof stacks!=='undefined')stacks.appendTo(container);
      
      return stacks;
    },
    viewFunction(val, container) {
      return appendText(typeof val, '#b365eb', container)
    },
    viewBoolean(val, container) {
      return appendText(val, '#de8734', container)
    }
  };

  ['log', 'error', 'warn'].forEach(level => {
    consoleMethods[level] = function (...args) {
      const container = new Composite({
        layoutData: 'stretchX',
        background: '#1c1c1ca2',
        padding: 10,
        layout: new RowLayout({spacing: 15})
      })
      
      try {
        args.forEach(arg => (types[getType(arg)](arg, container)));
      } catch(e) {
        console.log(e)
      }
      container.appendTo(viewLogger)
    }
  });

  function ConsoleProvider() {}

  return Object.setPrototypeOf(ConsoleProvider.prototype, consoleMethods);
}
