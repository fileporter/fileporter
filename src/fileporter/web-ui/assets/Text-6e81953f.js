<<<<<<<< HEAD:src/fileporter/web-ui/assets/Text-6e81953f.js
import{e as n,c as p,j as r,E as l,L as x,d as u}from"./index-9d6d10a8.js";import{H as c}from"./index-42a3adc5.js";import{S as i}from"./ScrollProgressFix-da10edbd.js";function d(o){var t;const a=n(),e=p(["file",a],({signal:s})=>u.rawFile({params:{path:a},signal:s,responseType:"text"}));if(e.isError)return r.jsx(l,{error:e.error});if(e.isLoading)return r.jsx(x,{});if((t=o.mime)!=null&&t.startsWith("text/x-")){const s=c.highlightAuto(e.data);if(s.language)return r.jsxs(r.Fragment,{children:[r.jsx(i,{}),r.jsx("pre",{className:"px-2 leading-5 break-words whitespace-break-spaces",dangerouslySetInnerHTML:{__html:s.value}})]})}return r.jsxs("pre",{className:"px-2 leading-5 break-words whitespace-break-spaces",children:[r.jsx(i,{}),e.data]})}export{d as default};
========
import{e as n,c as p,j as r,E as l,L as x,d as u}from"./index-a6515dc5.js";import{H as c}from"./index-42a3adc5.js";import{S as i}from"./ScrollProgressFix-9478cd03.js";function d(o){var t;const a=n(),e=p(["file",a],({signal:s})=>u.rawFile({params:{path:a},signal:s,responseType:"text"}));if(e.isError)return r.jsx(l,{error:e.error});if(e.isLoading)return r.jsx(x,{});if((t=o.mime)!=null&&t.startsWith("text/x-")){const s=c.highlightAuto(e.data);if(s.language)return r.jsxs(r.Fragment,{children:[r.jsx(i,{}),r.jsx("pre",{className:"px-2 leading-5 break-words whitespace-break-spaces",dangerouslySetInnerHTML:{__html:s.value}})]})}return r.jsxs("pre",{className:"px-2 leading-5 break-words whitespace-break-spaces",children:[r.jsx(i,{}),e.data]})}export{d as default};
>>>>>>>> 4b37c08b2a17c284592a37373e2b2dd544ca7a5b:src/fileporter/web-ui/assets/Text-53924700.js
