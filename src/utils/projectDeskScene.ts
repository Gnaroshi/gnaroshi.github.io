export interface ProjectDeskScene {
  select(index:number,flipped:boolean):void;
  drag(amount:number):void;
  reset():void;
  dispose():void;
}

// The evidence is already HTML. Native perspective needs no engine or render loop.
export function createProjectDeskScene(host:HTMLElement,sheets:HTMLElement[]):ProjectDeskScene {
  let selected=0,flipped=false,drag=0,disposed=false,serial=0;
  const paint=()=>{
    if(disposed)return;
    for(const [index,sheet] of sheets.entries()){
      let distance=index-selected;
      if(distance>1)distance-=sheets.length;
      if(distance< -1)distance+=sheets.length;
      sheet.style.setProperty("--sheet-offset",String(distance));
      sheet.style.setProperty("--sheet-drag",String(drag));
      sheet.style.setProperty("--sheet-turn",`${distance===0&&flipped?180:0}deg`);
      sheet.dataset.center=String(distance===0);
    }
    host.dataset.frame=String(++serial);
  };
  paint();
  return {
    select(index,side){selected=index;flipped=side;drag=0;paint();},
    drag(amount){drag=Math.max(-1,Math.min(1,amount));paint();},
    reset(){flipped=false;drag=0;paint();},
    dispose(){disposed=true;sheets.forEach(sheet=>{sheet.removeAttribute("style");delete sheet.dataset.center;});}
  };
}
