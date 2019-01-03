(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{118:function(e,t,a){e.exports=a.p+"static/media/CampusStoryLogo.fea71e00.svg"},376:function(e,t,a){"use strict";a.r(t);var n=a(7),r=a(8),l=a(11),s=a(9),c=a(10),i=a(0),o=a.n(i),u=a(372),h=a(120),m=a(356),d=a(378),p=a(377),f=a(373),g=a(13),E=a(380),b=a(379),v=a(14),C=a(374),y=a(370),w=a(368),S=a(178),k=a(95),j=a.n(k),O=function(e){function t(){var e,a;Object(n.a)(this,t);for(var r=arguments.length,c=new Array(r),i=0;i<r;i++)c[i]=arguments[i];return(a=Object(l.a)(this,(e=Object(s.a)(t)).call.apply(e,[this].concat(c)))).handleChange=function(e,t){var n=t.value;return a.setState({value:n})},a.state={categories:[],privateChannel:!1,officialChannel:!1,error:!1,success:!1,loading:!1,messages:[],name:"",category:"",description:"",creatorName:"",creatorEmail:"",creatorPassword:"",fileName:""},a.submitForm=function(){if(!0!==a.state.loading){var e=!1,t=[],n=document.getElementById("upload").files[0],r=document.getElementById("creator-email");if(a.setState({loading:!0}),a.state.name.length<3&&(e=!0,t.push("The channel name is less than 3 characters")),a.state.name.length>140&&(e=!0,t.push("The channel name is more than 140 characters")),a.state.description.length<10&&(e=!0,t.push("The channel description is less than 10 characters")),a.state.description.length>140&&(e=!0,t.push("The channel description is more than 140 characters")),""===a.state.category&&(e=!0,t.push("No category selected")),a.state.creatorName.length<3&&(e=!0,t.push("The creator name is less than 3 characters")),a.state.creatorName.length>140&&(e=!0,t.push("The creator name is more than 140 characters")),a.state.creatorPassword.length<3&&(e=!0,t.push("The creator password is less than 3 characters")),a.state.creatorPassword.length>140&&(e=!0,t.push("The creator password is more than 140 characters")),/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(r.value).toLowerCase())||(e=!0,t.push("Invalid Email entry")),void 0===n&&(e=!0,t.push("No file selected")),!1===e){var l=new FormData;l.append("name",a.state.name),l.append("description",a.state.description),l.append("private",a.state.privateChannel),l.append("official",a.state.officialChannel),l.append("category",a.state.category),l.append("creatorName",a.state.creatorName),l.append("creatorEmail",a.state.creatorEmail),l.append("creatorPassword",a.state.creatorPassword),l.append("poster",n),j.a.post("/admin/create-channel",l,{headers:{"Content-Type":"multipart/form-data","x-access-token":a.props.auth.user_token}}).then(function(e){(e=e.data).error?a.setState({loading:!1,messages:["Error creating the channel"],error:!0}):a.setState({loading:!1,messages:["Channel "+a.state.name+" successfully created"],error:!1,success:!0,name:"",description:"",privateChannel:"",officialChannel:"",category:"",creatorName:"",creatorEmail:"",creatorPassword:""})}).catch(function(e){return console.log(e)}).finally(function(){a.mounted&&a.setState({loading:!1}),window.scrollTo(0,0)})}else a.setState({messages:t,error:e})}},a}return Object(c.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=new FormData;this.setState({loading:!0}),j.a.post("/admin/get-categories",t,{headers:{"Content-Type":"multipart/form-data","x-access-token":this.props.auth.user_token}}).then(function(t){(t=t.data).error?e.setState({loading:!1,messages:["Error with network, please reload"],error:!0}):e.setState({loading:!1,categories:t.data})}).catch(function(e){return console.log(e)}).finally(function(){e.mounted&&e.setState({loading:!1})})}},{key:"render",value:function(){var e=this;return o.a.createElement(C.a,{stackable:!0,columns:3},o.a.createElement(C.a.Row,null,o.a.createElement(C.a.Column,null),o.a.createElement(C.a.Column,null,o.a.createElement(p.a,null,this.state.error&&o.a.createElement(y.a,{success:!0},o.a.createElement(y.a.Header,null,"Opps, there were a few problems"),o.a.createElement(y.a.List,null,this.state.messages.map(function(e,t){return o.a.createElement(y.a.Item,{key:t}," ",e)}))),this.state.success&&o.a.createElement(y.a,null,o.a.createElement(y.a.Header,null,"Success Creating a new channel"),o.a.createElement(y.a.List,null,this.state.messages.map(function(e,t){return o.a.createElement(y.a.Item,{key:t}," ",e)}))),o.a.createElement(w.a,null,o.a.createElement(w.a.Group,{widths:"equal"},o.a.createElement(w.a.Input,{value:this.state.name,onChange:function(t,a){return e.setState({name:a.value})},fluid:!0,label:"Channel Name",placeholder:"Channel Name"})),o.a.createElement(w.a.TextArea,{value:this.state.description,onChange:function(t,a){return e.setState({description:a.value})},label:"Description",placeholder:"What will this channel be about..."}),o.a.createElement(w.a.Checkbox,{label:"Make this channel private?",checked:this.state.privateChannel,onChange:function(t,a){return e.setState({privateChannel:!e.state.privateChannel})}}),o.a.createElement(w.a.Checkbox,{label:"Official Channel?",checked:this.state.officialChannel,onChange:function(t,a){return e.setState({officialChannel:!e.state.officialChannel})}}),o.a.createElement(w.a.Dropdown,{value:this.state.category,onChange:function(t,a){return e.setState({category:a.value})},label:"Category",options:this.state.categories,placeholder:"Select a category"}),o.a.createElement(w.a.Group,{widths:"equal"},o.a.createElement(w.a.Input,{value:this.state.creatorName,onChange:function(t,a){return e.setState({creatorName:a.value})},fluid:!0,label:"Creator Name",placeholder:"Creator Name"})),o.a.createElement(w.a.Group,{widths:"equal"},o.a.createElement(w.a.Input,{id:"creator-email",value:this.state.creatorEmail,type:"email",onChange:function(t,a){return e.setState({creatorEmail:a.value})},fluid:!0,label:"Email",placeholder:"Email"}),o.a.createElement(w.a.Input,{value:this.state.creatorPassword,type:"text",onChange:function(t,a){return e.setState({creatorPassword:a.value})},fluid:!0,label:"Password",placeholder:"Password"})),o.a.createElement(S.a,{as:"label",style:{backgroundColor:"#fff",marginBottom:10},htmlFor:"upload"},o.a.createElement(u.a,{icon:"upload",label:{basic:!0,content:"Select a banner for the channel"},labelPosition:"right"}),o.a.createElement("p",null,this.state.fileName),o.a.createElement("input",{accept:"image/x-png,image/gif,image/jpeg",hidden:!0,onChange:function(){var t=document.getElementById("upload").files[0];return e.setState({fileName:void 0===t.name?"":t.name})},id:"upload",multiple:!0,type:"file"})),o.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},o.a.createElement(w.a.Button,{loading:this.state.loading,onClick:this.submitForm},"Submit"))))),o.a.createElement(C.a.Column,null)))}}]),t}(o.a.Component),x=Object(g.b)(function(e){return{auth:e.auth}})(O),N=a(357),I=a(22),P=a(369),T=function(e){function t(e){var a;return Object(n.a)(this,t),(a=Object(l.a)(this,Object(s.a)(t).call(this,e))).state={channelList:[],currentSelected:{},name:"",description:"",creatorPassword:"",fileName:""},a.updateCurrent=function(e){a.setState({currentSelected:e,name:e.name,description:e.description,creatorPassword:e.creator_password})},a.submitForm=function(){var e=!1,t=[],n=document.getElementById("upload").files[0];if(a.state.name.length<3&&(e=!0,t.push("The channel name is less than 3 characters")),a.state.name.length>140&&(e=!0,t.push("The channel name is more than 140 characters")),a.state.description.length<10&&(e=!0,t.push("The channel description is less than 10 characters")),a.state.description.length>140&&(e=!0,t.push("The channel description is more than 140 characters")),a.state.creatorPassword.length<3&&(e=!0,t.push("The creator password is less than 3 characters")),a.state.creatorPassword.length>140&&(e=!0,t.push("The creator password is more than 140 characters")),!1===e){var r=new FormData,l=a.state.currentSelected._id,s=a.state.name,c=a.state.description,i=a.state.creatorPassword;r.append("_id",l),r.append("name",s),r.append("description",c),r.append("creatorPassword",i),void 0!==n&&r.append("poster",n),j.a.post("/admin/update-channel",r,{headers:{"Content-Type":"multipart/form-data","x-access-token":a.props.auth.user_token}}).then(function(e){if((e=e.data).error)a.setState({loading:!1,messages:["Error updating the channel"],error:!0});else{var t=Object(N.a)(a.state.channelList),n=t.findIndex(function(e){return e._id===l});t[n].name=s,t[n].description=c,t[n].creator_password=i,a.setState({loading:!1,messages:["Channel "+a.state.name+" update success"],error:!1,channelList:t,success:!0})}}).catch(function(e){return console.log(e)}).finally(function(){a.mounted&&a.setState({loading:!1}),window.scrollTo(0,0)})}else a.setState({messages:t,error:e})},a.updateCurrent=a.updateCurrent.bind(Object(I.a)(Object(I.a)(a))),a.submitForm=a.submitForm.bind(Object(I.a)(Object(I.a)(a))),a}return Object(c.a)(t,e),Object(r.a)(t,[{key:"componentDidMount",value:function(){var e=this,t=new FormData;this.setState({loading:!0}),j.a.post("/admin/get-channel-list",t,{headers:{"Content-Type":"multipart/form-data","x-access-token":this.props.auth.user_token}}).then(function(t){(t=t.data).error?e.setState({loading:!1,messages:["Error with network, please reload"],error:!0}):e.setState({loading:!1,channelList:t.data})}).catch(function(e){return console.log(e)}).finally(function(){e.mounted&&e.setState({loading:!1})})}},{key:"render",value:function(){var e=this;return o.a.createElement(C.a,{stackable:!0,columns:"equal"},o.a.createElement(C.a.Column,null,o.a.createElement(p.a,null,o.a.createElement(P.a,{divided:!0,relaxed:!0,style:{maxHeight:400,overflow:"scroll"}},this.state.channelList.map(function(t,a){return o.a.createElement(P.a.Item,{key:a},e.state.currentSelected._id===t._id&&o.a.createElement(P.a.Icon,{name:"angle double right",size:"large",verticalAlign:"middle"}),o.a.createElement(P.a.Content,null,o.a.createElement(P.a.Header,{onClick:function(){return e.updateCurrent(t)},as:"a"},t.college,"/",t.name),o.a.createElement(P.a.Description,null,t.category)))})))),o.a.createElement(C.a.Column,{width:12},o.a.createElement(p.a,null,this.state.error&&o.a.createElement(y.a,null,o.a.createElement(y.a.Header,null,"Opps, there were a few problems"),o.a.createElement(y.a.List,null,this.state.messages.map(function(e,t){return o.a.createElement(y.a.Item,{key:t}," ",e)}))),this.state.success&&o.a.createElement(y.a,null,o.a.createElement(y.a.Header,null,"Success Creating a new channel"),o.a.createElement(y.a.List,null,this.state.messages.map(function(e,t){return o.a.createElement(y.a.Item,{key:t}," ",e)}))),o.a.createElement(m.a,{style:{display:"block",margin:"auto",width:"100%",maxHeight:250,objectFit:"contain"},src:"https://mycampusdock.com/"+(this.state.currentSelected.media&&this.state.currentSelected.media[0]),size:"big"}),o.a.createElement(w.a,null,o.a.createElement(w.a.Group,{widths:"equal"},o.a.createElement(w.a.Input,{value:this.state.name,onChange:function(t,a){return e.setState({name:a.value})},fluid:!0,label:"Channel Name",placeholder:"Channel Name"})),o.a.createElement(w.a.TextArea,{value:this.state.description,onChange:function(t,a){return e.setState({description:a.value})},label:"Description",placeholder:"What will this channel be about..."}),o.a.createElement(w.a.Checkbox,{disabled:!0,checked:void 0!==this.state.currentSelected.private&&this.state.currentSelected.private,label:"Make this channel private?"}),o.a.createElement(w.a.Checkbox,{disabled:!0,checked:5===this.state.currentSelected.priority,label:"Official Channel?"}),o.a.createElement(w.a.Dropdown,{disabled:!0,value:this.state.currentSelected.category,placeholder:"Select a category"}),o.a.createElement(w.a.Group,{widths:"equal"},o.a.createElement(w.a.Input,{disabled:!0,value:void 0!==this.state.currentSelected.creator?this.state.currentSelected.creator:"",fluid:!0,label:"Creator Name",placeholder:"Creator Name"})),o.a.createElement(w.a.Group,{widths:"equal"},o.a.createElement(w.a.Input,{value:void 0!==this.state.currentSelected.creator_email?this.state.currentSelected.creator_email:"",id:"creator-email",disabled:!0,fluid:!0,label:"Email",placeholder:"Email"}),o.a.createElement(w.a.Input,{value:this.state.creatorPassword,type:"text",onChange:function(t,a){return e.setState({creatorPassword:a.value})},fluid:!0,label:"Password",placeholder:"Password"})),o.a.createElement(S.a,{as:"label",style:{backgroundColor:"#fff",marginBottom:10},htmlFor:"upload"},o.a.createElement(u.a,{icon:"upload",label:{basic:!0,content:"Select a banner for the channel"},labelPosition:"right"}),o.a.createElement("p",null,this.state.fileName),o.a.createElement("input",{hidden:!0,onChange:function(){var t=document.getElementById("upload").files[0];return e.setState({fileName:void 0===t.name?"":t.name})},id:"upload",multiple:!0,type:"file"})),o.a.createElement("div",{style:{display:"flex",justifyContent:"center"}},o.a.createElement(w.a.Button,{loading:this.state.loading,disabled:this.state.currentSelected==={},onClick:this.submitForm},"Submit"))))))}}]),t}(o.a.Component),F=Object(g.b)(function(e){return{auth:e.auth}})(T),_=function(e){function t(){var e,a;Object(n.a)(this,t);for(var r=arguments.length,c=new Array(r),i=0;i<r;i++)c[i]=arguments[i];return(a=Object(l.a)(this,(e=Object(s.a)(t)).call.apply(e,[this].concat(c)))).state={visible:!1},a.handleShowClick=function(){return a.setState({visible:!a.state.visible})},a.handleSidebarHide=function(){return a.setState({visible:!1})},a}return Object(c.a)(t,e),Object(r.a)(t,[{key:"render",value:function(){var e=this,t=this.state.visible,n=this.props.history;return o.a.createElement("div",{style:{flex:1}},o.a.createElement("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",padding:10}},o.a.createElement(u.a,{onClick:this.handleShowClick,icon:!0},o.a.createElement(h.a,{name:"sidebar"})),o.a.createElement("div",{style:{flex:1,marginTop:10}},o.a.createElement(m.a,{style:{display:"block",margin:"auto",width:50},src:a(118),size:"small"})),o.a.createElement(u.a,{onClick:function(){return e.props.logout()},animated:!0},o.a.createElement(u.a.Content,{visible:!0},"logout"),o.a.createElement(u.a.Content,{hidden:!0},o.a.createElement(h.a,{name:"close"})))),o.a.createElement(d.a.Pushable,{as:p.a},o.a.createElement(d.a,{as:f.a,animation:"overlay",icon:"labeled",inverted:!0,onHide:this.handleSidebarHide,vertical:!0,visible:t,width:"thin"},o.a.createElement(f.a.Item,{as:"a",onClick:function(){return n.push("/admin/create-channel")}},o.a.createElement(h.a,{name:"plus square outline"}),"Create Channel"),o.a.createElement(f.a.Item,{as:"b",onClick:function(){return n.push("/admin/manage-channel")}},o.a.createElement(h.a,{name:"edit outline"}),"Manage Channels")),o.a.createElement(d.a.Pusher,{dimmed:t},o.a.createElement(p.a,{basic:!0,style:{minHeight:"100vh",display:"flex",flexFlow:"column nowrap"}},o.a.createElement(E.a,null,o.a.createElement(b.a,{exact:!0,path:"/admin/create-channel",component:Object(v.a)(x)}),o.a.createElement(b.a,{exact:!0,path:"/admin/manage-channel",component:Object(v.a)(F)}))))))}}]),t}(i.Component);t.default=Object(g.b)(function(e){return{auth:e.auth}},function(e){return{logout:function(t){e({type:"UNAUTH_USER",payload:t})}}})(_)}}]);
//# sourceMappingURL=4.9827150d.chunk.js.map