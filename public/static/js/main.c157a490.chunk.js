(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{14:function(e,t,n){"use strict";var a=n(7),o=n(8),r=n(10),c=n(9),i=n(11),u=n(0),l=n.n(u),h=n(13),s=n(1),d=n.n(s);t.a=function(e){var t=function(t){function n(){return Object(a.a)(this,n),Object(r.a)(this,Object(c.a)(n).apply(this,arguments))}return Object(i.a)(n,t),Object(o.a)(n,[{key:"componentWillMount",value:function(){this.props.authenticated||this.props.history.push("/")}},{key:"componentWillUpdate",value:function(e){e.authenticated||this.props.history.push("/")}},{key:"render",value:function(){return l.a.createElement(e,this.props)}}]),n}(u.Component);return t.contextTypes={router:d.a.object},Object(h.b)(function(e){return{authenticated:e.auth.authenticated}})(t)}},41:function(e,t,n){e.exports=n(51)},51:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(17),c=n.n(r),i=n(7),u=n(8),l=n(10),h=n(9),s=n(11),d=n(376),p=n(13),m=n(6),b=n(36),f=Object(m.c)({auth:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{authenticated:!1},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"AUTH_USER":return t.payload.keepLoggedIn&&sessionStorage.setItem("token",t.payload.token),Object(b.a)({},e,{authenticated:!0,user_token:t.payload.token});case"UNAUTH_USER":return sessionStorage.removeItem("token"),Object(b.a)({},e,{authenticated:!1});default:return e}}}),j=n(38),O=n.n(j),y=Object(m.e)(f,Object(m.d)(Object(m.a)(O.a))),E=n(378),g=n(379),w=n(14),v=n(31),k=n.n(v),x=n(39),U=function(){return o.a.createElement("h1",null,"Page not found")},I=function(){return o.a.createElement(x.a,null,o.a.createElement("rect",{x:"0",y:"2",width:"45",height:"15"}),o.a.createElement("rect",{x:"50",y:"2",width:"45",height:"15"}),o.a.createElement("rect",{x:"100",y:"2",width:"45",height:"15"}),o.a.createElement("rect",{x:"0",y:"25",width:"300",height:"300"}))},S=k()({loader:function(){return Promise.all([n.e(0),n.e(2)]).then(n.bind(null,371))},loading:I}),W=k()({loader:function(){return n.e(3).then(n.bind(null,366))},loading:I}),P=k()({loader:function(){return Promise.all([n.e(0),n.e(5),n.e(4)]).then(n.bind(null,374))},loading:I}),T=function(){return o.a.createElement(E.a,null,o.a.createElement(g.a,{path:"/admin",component:Object(w.a)(P)}),o.a.createElement(g.a,{exact:!0,path:"/home",component:Object(w.a)(W)}),o.a.createElement(g.a,{exact:!0,path:"/",component:S}),o.a.createElement(g.a,{path:"*",component:Object(w.a)(U)}))},_=function(e){function t(){return Object(i.a)(this,t),Object(l.a)(this,Object(h.a)(t).apply(this,arguments))}return Object(s.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){return o.a.createElement(p.a,{store:y},o.a.createElement(d.a,null,o.a.createElement(T,null)))}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(o.a.createElement(_,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[41,7,6]]]);
//# sourceMappingURL=main.c157a490.chunk.js.map