import{u as y,a as b,r as u,b as j,S as I,t as k,n as E,s as p,j as i,c as T}from"./index-7c338a81.js";function $(n){var v,x;const r=y(),[o]=b("sortMode"),[c]=b("gifLike"),a=u.createRef(),h=j(["meta",n.parent],({signal:t})=>T.getFileMeta({params:{path:n.parent},signal:t}),{staleTime:6e4}),s=u.useMemo(()=>{var t;return((t=h.data)==null?void 0:t.type)!=="directory"?void 0:h.data.contents.filter(e=>{var l;return e.type==="file"&&(((l=e.mime)==null?void 0:l.startsWith("image/"))||c&&e.has_video&&!e.has_audio&&e.duration&&e.duration<=60)}).sort(o===I.alphabetic?k:E)},[h.data]);function d(){return(s==null?void 0:s.findIndex(t=>t.path===n.path))??-1}function g(){const t=d(),e=t<=0||s==null?void 0:s.at(t-1);e&&r(`/~/${e.path}`)}function m(){const t=d(),e=t<0||s==null?void 0:s.at(t+1);e&&r(`/~/${e.path}`)}C(g,m),M(g,m),u.useEffect(()=>{const t=d(),e=t<=0||s==null?void 0:s.at(t-1);if(e){const f=new Image;f.src=p(`/files/${e.path}`)}const l=t<0||s==null?void 0:s.at(t+1);if(l){const f=new Image;f.src=p(`/files/${l.path}`)}},[s]);const w=p(`/files/${n.path}`);return i.jsx("div",{className:"fixed inset-0 w-screen h-screen bg-black",children:n.has_video?i.jsxs(i.Fragment,{children:[i.jsx("video",{className:"w-full h-full",autoPlay:!0,loop:!0,onTimeUpdate:t=>{const e=t.currentTarget;a.current&&(a.current.max=e.duration,a.current.value=e.currentTime)},onDoubleClick:t=>{const e=t.currentTarget;e.paused?e.play():e.pause()},children:i.jsx("source",{src:w,type:n.mime})}),i.jsx("progress",{className:"fixed inset-x-0 bottom-0 w-full h-1 transition-[width]",ref:a})]}):i.jsx("img",{className:"object-contain w-full h-full",width:(v=n.dimensions)==null?void 0:v.width,height:(x=n.dimensions)==null?void 0:x.height,src:w,alt:n.basename})})}function C(n,r){u.useEffect(()=>{const o=new AbortController;return window.addEventListener("keydown",c=>{switch(c.key){case"ArrowLeft":n();break;case"ArrowRight":r();break}},{signal:o.signal}),()=>o.abort()},[n,r])}function M(n,r){const o=u.useRef();u.useEffect(()=>{const c=new AbortController;return window.addEventListener("touchstart",a=>{o.current=a.changedTouches[0].screenX},{signal:c.signal}),window.addEventListener("touchend",a=>{const s=a.changedTouches[0].screenX-o.current,d=window.screen.width;Math.abs(s)>d/3&&(s>0?n():r()),o.current=void 0},{signal:c.signal}),()=>c.abort()},[n,r])}export{$ as default};
