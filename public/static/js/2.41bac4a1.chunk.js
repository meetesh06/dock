(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{117:function(e,t,n){e.exports=n.p+"static/media/CampusStoryLogo.fea71e00.svg"},369:function(e,t,n){"use strict";n.r(t);var o=n(6),a=n(7),r=n(10),i=n(8),s=n(9),c=n(18),u=n(0),l=n.n(u),p=n(1),h=n.n(p),d=n(4),m=n.n(d),f=n(3),g=n.n(f),y=n(24),b=n(23),v=n.n(b),w={},k=0,E=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"/",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return"/"===e?e:function(e){var t=e,n=w[t]||(w[t]={});if(n[e])return n[e];var o=v.a.compile(e);return k<1e4&&(n[e]=o,k++),o}(e)(t,{pretty:!0})},j=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e};var O=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}(this,e.apply(this,arguments))}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,e),t.prototype.isStatic=function(){return this.context.router&&this.context.router.staticContext},t.prototype.componentWillMount=function(){g()(this.context.router,"You should not use <Redirect> outside a <Router>"),this.isStatic()&&this.perform()},t.prototype.componentDidMount=function(){this.isStatic()||this.perform()},t.prototype.componentDidUpdate=function(e){var t=Object(y.b)(e.to),n=Object(y.b)(this.props.to);Object(y.c)(t,n)?m()(!1,"You tried to redirect to the same route you're currently on: \""+n.pathname+n.search+'"'):this.perform()},t.prototype.computeTo=function(e){var t=e.computedMatch,n=e.to;return t?"string"===typeof n?E(n,t.params):j({},n,{pathname:E(n.pathname,t.params)}):n},t.prototype.perform=function(){var e=this.context.router.history,t=this.props.push,n=this.computeTo(this.props);t?e.push(n):e.replace(n)},t.prototype.render=function(){return null},t}(l.a.Component);O.propTypes={computedMatch:h.a.object,push:h.a.bool,from:h.a.string,to:h.a.oneOfType([h.a.string,h.a.object]).isRequired},O.defaultProps={push:!1},O.contextTypes={router:h.a.shape({history:h.a.shape({push:h.a.func.isRequired,replace:h.a.func.isRequired}).isRequired,staticContext:h.a.object}).isRequired};var S=O,T=n(78),C=n.n(T),L=n(11),x=n(373),R=n(375),_=n(355),I=n(177),U=n(364),q=n(370),M=n(363),P=function(e){function t(e){var n;return Object(o.a)(this,t),(n=Object(r.a)(this,Object(i.a)(t).call(this,e))).state={email:"",password:"",error:!1,keepLoggedIn:!0,loading:!1},n.handleLogin=function(){n.setState({loading:!0}),C.a.post("/auth/super/signin",{email:n.state.email,password:n.state.password}).then(function(e){(e=e.data).error||n.props.login_success({keepLoggedIn:n.state.keepLoggedIn,token:e.token})}).catch(function(e){return console.log(e)}).finally(function(){n.mounted&&n.setState({loading:!1})})},n.handleLogin=n.handleLogin.bind(Object(c.a)(Object(c.a)(n))),n}return Object(s.a)(t,e),Object(a.a)(t,[{key:"componentWillUnmount",value:function(){this.mounted=!1}},{key:"componentDidMount",value:function(){var e=this,t=sessionStorage.getItem("token");if(this.mounted=!0,t&&void 0!==t&&!this.state.loading){this.setState({loading:!0}),this.setState({loading:!0});var n=new FormData;C.a.post("/auth/super/verify",n,{headers:{"Content-Type":"multipart/form-data","x-access-token":t}}).then(function(t){(t=t.data).error?e.props.login_failed():e.props.login_success({keepLoggedIn:e.state.keepLoggedIn,token:t.token})}).catch(function(e){return console.log(e)}).finally(function(){e.mounted&&e.setState({loading:!1})})}}},{key:"render",value:function(){var e=this;return l.a.createElement("div",null,this.props.auth.authenticated&&l.a.createElement(S,{to:"/admin/create-channel"}),l.a.createElement(x.a,{stackable:!0,columns:3},l.a.createElement(x.a.Row,{style:{marginTop:25}},l.a.createElement(x.a.Column,null),l.a.createElement(x.a.Column,null,l.a.createElement(R.a,{raised:!0},l.a.createElement("div",{style:{marginTop:10}},l.a.createElement(_.a,{style:{display:"block",margin:"auto",width:100},src:n(117),size:"small"})),l.a.createElement(I.a,{style:{marginTop:10,marginBottom:10}},"Email"),l.a.createElement(M.a,{placeholder:"username",type:"email",style:{width:"100%"},onChange:function(t,n){return e.setState({email:n.value})},value:this.state.email,error:this.state.error}),l.a.createElement(I.a,{style:{marginTop:10,marginBottom:10}},"Password"),l.a.createElement(M.a,{placeholder:"password",type:"password",style:{width:"100%"},onChange:function(t,n){return e.setState({password:n.value})},value:this.state.password,error:this.state.error}),l.a.createElement(U.a,{style:{marginTop:10},label:"Keep me logged in",checked:this.state.keepLoggedIn,onChange:function(t,n){return e.setState({keepLoggedIn:!e.state.keepLoggedIn})}}),l.a.createElement("div",{style:{width:"100%",display:"flex",justifyContent:"center"}},l.a.createElement(q.a,{style:{marginTop:10,AlignSelf:"center"},loading:this.state.loading,onClick:this.handleLogin},"Login")))),l.a.createElement(x.a.Column,null))))}}]),t}(l.a.Component);t.default=Object(L.b)(function(e){return{auth:e.auth}},function(e){return{login_success:function(t){e({type:"AUTH_USER",payload:t})},login_failed:function(t){e({type:"UNAUTH_USER",payload:t})}}})(P)}}]);
//# sourceMappingURL=2.41bac4a1.chunk.js.map