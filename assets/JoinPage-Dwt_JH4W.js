import{r as l,j as t,a as e}from"./index-DaA-XlCL.js";function m(){const[n,i]=l.useState(""),[r,o]=l.useState("");return t("div",{className:"join",children:[e("div",{"data-reveal":!0,className:"tab-header",children:e("h1",{children:"Join"})}),e("section",{"data-reveal":!0,className:"join__section",children:t("form",{"data-reveal":!0,"data-reveal-load-delay":"80",className:"join__form",onSubmit:a=>{a.preventDefault();const s="jongbinryu@ajou.ac.kr",d=encodeURIComponent("Lab-LVM Join Inquiry"),c=encodeURIComponent(`Hello Lab-LVM,

I am interested in joining the lab.

My email: ${n||"(not provided)"}

Message:
${r||"(no message)"}
`);window.location.href=`mailto:${s}?subject=${d}&body=${c}`},children:[t("div",{"data-reveal":!0,"data-reveal-load-delay":"120",className:"join-email",children:[e("p",{children:"Your Email"}),e("input",{type:"email",placeholder:"email@example.com",value:n,onChange:a=>i(a.target.value),required:!0})]}),t("div",{"data-reveal":!0,"data-reveal-load-delay":"160",className:"join-message",children:[e("p",{children:"Message"}),e("textarea",{name:"message",className:"join__message-field",value:r,onChange:a=>o(a.target.value),required:!0})]}),e("div",{"data-reveal":!0,"data-reveal-load-delay":"200",className:"join-btn-wrapper",children:e("button",{type:"submit",className:"btn btn--primary interactive-button lift-on-hover",children:"Send Inquiry"})})]})})]})}function h(){return e(m,{})}export{h as default};
