import{h as o,f as i,d as c,j as e,E as u,L as d,i as a,e as x}from"./index-a2926ad4.js";function f(){const n=o(),r=i(),t=c(["file",r],({signal:l})=>x.rawFile({params:{path:r},signal:l,responseType:"text"}));if(t.isError)return e.jsx(u,{error:t.error});if(t.isLoading)return e.jsx(d,{});const s=p(t.data);return s===null?e.jsxs("pre",{className:"relative px-2 overflow-x-scroll leading-5",children:[e.jsxs("p",{className:"absolute inset-x-0 top-0 text-xs text-center opacity-50 pointer-events-none select-none",children:["Warning: Bad .url File ",e.jsx("button",{className:"pointer-events-auto",onClick:()=>{n(e.jsxs(e.Fragment,{children:[e.jsx("p",{className:"text-center select-none",children:"Example File"}),e.jsxs("p",{className:"p-1 border rounded-md border-darker grid grid-cols-[auto,1fr] gap-x-1",children:[e.jsx("b",{className:"opacity-50 select-none",children:"1"}),e.jsx("span",{children:"[InternetShortcut]"}),e.jsx("b",{className:"opacity-50 select-none",children:"2"}),e.jsxs("span",{children:["URL=",e.jsx(a,{className:"hover:underline",target:"_blank",to:"https://www.lyberty.com/encyc/articles/tech/dot_url_format_-_an_unofficial_guide.html",children:"https://www.lyberty.com/encyc/articles/tech/dot_url_format_-_an_unofficial_guide.html"})]})]})]}))},children:"ⓘ"})]}),t.data]}):e.jsxs("div",{className:"fixed flex flex-col max-w-md gap-5 text-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2",children:[e.jsx("p",{className:"opacity-75",children:"You are about to leave this page. Are you sure?"}),e.jsx(a,{className:"text-blue-500 hover:underline",to:s,target:"_blank",rel:"noreferrer noopener",children:s})]})}function p(n){let r=!1;for(const t of n.split(`
`))if(t.startsWith("[")&&t.endsWith("]")&&(r=t==="[InternetShortcut]"),r&&t.toLowerCase().startsWith("url="))return t.slice(4).trim();return null}export{f as default};