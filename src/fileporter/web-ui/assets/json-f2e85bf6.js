import{f as o,d as n,j as r,E as i,L as l,e as x}from"./index-a2926ad4.js";import{S as t}from"./ScrollProgressFix-0768fccf.js";function d(){const a=o(),e=n(["file",a],({signal:s})=>x.rawFile({params:{path:a},signal:s,responseType:"text"}));if(e.isError)return r.jsx(i,{error:e.error});if(e.isLoading)return r.jsx(l,{});try{const s=JSON.parse(e.data);return r.jsxs("pre",{className:"px-2 overflow-x-scroll leading-5",children:[r.jsx(t,{}),JSON.stringify(s,null,2)]})}catch{return r.jsx(r.Fragment,{children:r.jsxs("pre",{className:"relative px-2 overflow-x-scroll leading-5",children:[r.jsx(t,{}),r.jsx("p",{className:"absolute inset-x-0 top-0 text-xs text-center opacity-50 pointer-events-none",children:"Warning: Bad JSON Format"}),e.data]})})}}export{d as default};