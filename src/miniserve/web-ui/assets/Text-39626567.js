import{u as x,a as l,j as e,L as p,E as u,b as g}from"./index-04e46c98.js";import{H as h}from"./index-42a3adc5.js";import{S as i}from"./ScrollProgressFix-7ea94cd1.js";function f(o){var t;const a=x(),s=l(["file",a],({signal:r})=>g.get(`/files/${a}`,{signal:r,responseType:"text"}).then(n=>n.data));if(s.isLoading)return e.jsx(p,{});if(s.isError)return e.jsx(u,{error:s.error});if((t=o.mime)!=null&&t.startsWith("text/x-")){const r=h.highlightAuto(s.data);if(r.language)return e.jsxs(e.Fragment,{children:[e.jsx(i,{}),e.jsx("pre",{className:"px-2 leading-5 break-words whitespace-break-spaces",dangerouslySetInnerHTML:{__html:r.value}})]})}return e.jsxs("pre",{className:"px-2 leading-5 break-words whitespace-break-spaces",children:[e.jsx(i,{}),s.data]})}export{f as default};