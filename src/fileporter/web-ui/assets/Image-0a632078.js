import{u as y,a as b,r as u,b as j,S as I,t as k,n as E,s as p,j as i,c as T}from"./index-dfdfc8a3.js";function $(n){var v,x;const r=y(),[o]=b("sortMode"),[c]=b("gifLike"),a=u.useRef(),h=j(["meta",n.parent],({signal:e})=>T.getFileMeta({params:{path:n.parent},signal:e}),{staleTime:6e4}),s=u.useMemo(()=>{var e;return((e=h.data)==null?void 0:e.type)!=="directory"?void 0:h.data.contents.filter(t=>{var l;return t.type==="file"&&(((l=t.mime)==null?void 0:l.startsWith("image/"))||c&&t.has_video&&!t.has_audio&&t.duration&&t.duration<=60)}).sort(o===I.alphabetic?k:E)},[h.data]);function d(){return(s==null?void 0:s.findIndex(e=>e.path===n.path))??-1}function g(){const e=d(),t=e<=0||s==null?void 0:s.at(e-1);t&&r(`/~/${t.path}`)}function m(){const e=d(),t=e<0||s==null?void 0:s.at(e+1);t&&r(`/~/${t.path}`)}C(g,m),M(g,m),u.useEffect(()=>{const e=d(),t=e<=0||s==null?void 0:s.at(e-1);if(t){const f=new Image;f.src=p(`/files/${t.path}`)}const l=e<0||s==null?void 0:s.at(e+1);if(l){const f=new Image;f.src=p(`/files/${l.path}`)}},[s]);const w=p(`/files/${n.path}`);return i.jsx("div",{className:"fixed inset-0 w-screen h-screen bg-black",children:n.has_video?i.jsxs(i.Fragment,{children:[i.jsx("video",{className:"w-full h-full",autoPlay:!0,loop:!0,onTimeUpdate:e=>{const t=e.currentTarget;a.current&&(a.current.max=t.duration,a.current.value=t.currentTime)},onDoubleClick:e=>{const t=e.currentTarget;t.paused?t.play():t.pause()},children:i.jsx("source",{src:w,type:n.mime})}),i.jsx("progress",{className:"fixed inset-x-0 bottom-0 w-full h-1 transition-[width]",ref:e=>a.current=e})]}):i.jsx("img",{className:"object-contain w-full h-full",width:(v=n.size)==null?void 0:v.width,height:(x=n.size)==null?void 0:x.height,src:w,alt:n.basename})})}function C(n,r){u.useEffect(()=>{const o=new AbortController;return window.addEventListener("keydown",c=>{switch(c.key){case"ArrowLeft":n();break;case"ArrowRight":r();break}},{signal:o.signal}),()=>o.abort()},[n,r])}function M(n,r){const o=u.useRef();u.useEffect(()=>{const c=new AbortController;return window.addEventListener("touchstart",a=>{o.current=a.changedTouches[0].screenX},{signal:c.signal}),window.addEventListener("touchend",a=>{const s=a.changedTouches[0].screenX-o.current,d=window.screen.width;Math.abs(s)>d/3&&(s>0?n():r()),o.current=void 0},{signal:c.signal}),()=>c.abort()},[n,r])}export{$ as default};