(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{179:function(e,t,a){"use strict";var r=a(40),n=a.n(r),o=(a(54),a(41)),i=a.n(o),s=(a(1),a(0)),l=a.n(s),c=a(62),u=a(127),h=a(128),d=a(39),m=a(120),E=a(358),p=a(129);function y(e){var t=e.children,a=e.className,r=e.content,o=i()("sub header",a),s=Object(u.a)(y,e),c=Object(h.a)(y,e);return l.a.createElement(c,n()({},s,{className:o}),d.a.isNil(t)?r:t)}y.handledProps=["as","children","className","content"],y.propTypes={},y.create=Object(p.e)(y,function(e){return{content:e}});var f=y;function T(e){var t=e.children,a=e.className,r=e.content,o=i()("content",a),s=Object(u.a)(T,e),c=Object(h.a)(T,e);return l.a.createElement(c,n()({},s,{className:o}),d.a.isNil(t)?r:t)}T.handledProps=["as","children","className","content"],T.propTypes={};var b=T;function g(e){var t=e.attached,a=e.block,r=e.children,o=e.className,s=e.color,p=e.content,y=e.disabled,T=e.dividing,S=e.floated,O=e.icon,v=e.image,I=e.inverted,A=e.size,R=e.sub,N=e.subheader,w=e.textAlign,C=i()("ui",s,A,Object(c.a)(a,"block"),Object(c.a)(y,"disabled"),Object(c.a)(T,"dividing"),Object(c.e)(S,"floated"),Object(c.a)(!0===O,"icon"),Object(c.a)(!0===v,"image"),Object(c.a)(I,"inverted"),Object(c.a)(R,"sub"),Object(c.b)(t,"attached"),Object(c.d)(w),"header",o),U=Object(u.a)(g,e),L=Object(h.a)(g,e);if(!d.a.isNil(r))return l.a.createElement(L,n()({},U,{className:C}),r);var Y=m.a.create(O,{autoGenerateKey:!1}),H=E.a.create(v,{autoGenerateKey:!1}),D=f.create(N,{autoGenerateKey:!1});return Y||H?l.a.createElement(L,n()({},U,{className:C}),Y||H,(p||D)&&l.a.createElement(b,null,p,D)):l.a.createElement(L,n()({},U,{className:C}),p,D)}g.handledProps=["as","attached","block","children","className","color","content","disabled","dividing","floated","icon","image","inverted","size","sub","subheader","textAlign"],g.propTypes={},g.Content=b,g.Subheader=f;t.a=g},314:function(e,t,a){"use strict";var r=a(40),n=a.n(r),o=a(41),i=a.n(o),s=(a(1),a(0)),l=a.n(s),c=a(62),u=a(127),h=a(128),d=a(39);function m(e){var t=e.children,a=e.className,r=e.content,o=e.fluid,s=e.text,E=e.textAlign,p=i()("ui",Object(c.a)(s,"text"),Object(c.a)(o,"fluid"),Object(c.d)(E),"container",a),y=Object(u.a)(m,e),f=Object(h.a)(m,e);return l.a.createElement(f,n()({},y,{className:p}),d.a.isNil(t)?r:t)}m.handledProps=["as","children","className","content","fluid","text","textAlign"],m.propTypes={},t.a=m},315:function(e,t,a){"use strict";var r=a(40),n=a.n(r),o=a(41),i=a.n(o),s=(a(1),a(0)),l=a.n(s),c=a(62),u=a(127),h=a(128),d=a(39);function m(e){var t=e.children,a=e.className,r=e.clearing,o=e.content,s=e.fitted,E=e.hidden,p=e.horizontal,y=e.inverted,f=e.section,T=e.vertical,b=i()("ui",Object(c.a)(r,"clearing"),Object(c.a)(s,"fitted"),Object(c.a)(E,"hidden"),Object(c.a)(p,"horizontal"),Object(c.a)(y,"inverted"),Object(c.a)(f,"section"),Object(c.a)(T,"vertical"),"divider",a),g=Object(u.a)(m,e),S=Object(h.a)(m,e);return l.a.createElement(S,n()({},g,{className:b}),d.a.isNil(t)?o:t)}m.handledProps=["as","children","className","clearing","content","fitted","hidden","horizontal","inverted","section","vertical"],m.propTypes={},t.a=m},370:function(e,t,a){"use strict";a.r(t);var r=a(7),n=a(8),o=a(10),i=a(9),s=a(11),l=a(18),c=a(0),u=a.n(c),h=a(65),d=a.n(h),m=a(358),E=a(380),p=a(314),y=a(179),f=a(315),T=a(372),b=a(369),g=a(377),S=a(383),O=function(e){function t(e){var a;return Object(r.a)(this,t),(a=Object(o.a)(this,Object(i.a)(t).call(this,e))).state={name:"",email:"",subject:"",description:"",password:"",error:!1,keepLoggedIn:!0,loading:!1},a.handleSubmit=function(){var e=a.state,t=e.name,r=e.email,n=e.subject,o=e.description;if(!e.loading){a.setState({loading:!0});var i=new FormData;i.append("name",t),i.append("email",r),i.append("subject",n),i.append("description",o),d.a.post("/public/contact",i,{headers:{"Content-Type":"multipart/form-data"}}).then(function(e){a.setState({name:"",email:"",subject:"",description:""})}).catch(function(e){return console.log(e)}).finally(function(){return a.setState({loading:!1})})}},a.handleSubmit=a.handleSubmit.bind(Object(l.a)(Object(l.a)(a))),a}return Object(s.a)(t,e),Object(n.a)(t,[{key:"render",value:function(){var e=this;this.state.activeItem;return u.a.createElement("div",{style:{backgroundColor:"#333"}},u.a.createElement("nav",{style:{padding:10,display:"flex",backgroundColor:"#222",justifyContent:"center"}},u.a.createElement(m.a,{href:"/",style:{alignSelf:"center",width:60},src:a(60),size:"small"})),u.a.createElement(E.a,{style:{backgroundColor:"#fff",padding:"4em 0em"},vertical:!0},u.a.createElement(p.a,{text:!0},u.a.createElement(y.a,{as:"h3",style:{fontSize:"2em"}},"Terms of Use"),u.a.createElement("p",{style:{textAlign:"left",fontSize:"1.11em"}},"Welcome to the Campus Story Terms of Use agreement. For purposes of this agreement, \u201cApp\u201d refers to the Company\u2019s mobile Application, which can be accessed through App Store & Play Store. \u201cService\u201d refers to the Company\u2019s services accessed via the App, in which users can publish the content for which the user is designated. The terms \u201cwe,\u201d \u201cus,\u201d and \u201cour\u201d refer to the Company. \u201cYou\u201d refers to you, as a user of our App or our Service. ",u.a.createElement("br",null),"The following Terms of Use apply when you view or use the Service by accessing the Service through clicking on the application (the \u201cApp\u201d) on your mobile device.  ",u.a.createElement("br",null),"Please review the following terms carefully. By accessing or using the Service, you signify your agreement to these Terms of Use. If you do not agree to be bound by these Terms of Use in their entirety, you may not access or use the Service.",u.a.createElement("br",null)),u.a.createElement("b",null,"PRIVACY POLICY")," ",u.a.createElement("br",null),u.a.createElement("p",{style:{padding:10}},"The Company respects the privacy of its Service users. Please refer to the Company\u2019s Privacy Policy (attached with this) which explains how we collect, use, and disclose information that pertains to your privacy. When you access or use the Service, you signify your agreement to the Privacy Policy as well as these Terms of Use."),u.a.createElement("b",null,"ABOUT THE SERVICE")," ",u.a.createElement("br",null),u.a.createElement("p",{style:{padding:10}},"The Service allows you to publish the content purely generated by you or belong to you or licensed to you. You can upload such content through the Creator\u2019s Studio App which specifically designed for managing your content upload process and keeping track with the users, how they are responding to your content."),u.a.createElement("b",null,"REGISTRATION; RULES FOR USER CONDUCT AND USE OF THE SERVICE")," ",u.a.createElement("br",null),u.a.createElement("p",{style:{padding:10}},"You need to be at least 16 years of Age to register for and use the Service. ",u.a.createElement("br",null),"If you are a user who signs up for the Service, you will create a personalized account which includes a unique username and a password to access the Service. You agree to notify us immediately of any unauthorized use of your password and/or account. The Company will not be responsible for any liabilities, losses, or damages arising out of the unauthorized use of your member name, password and/or account."),u.a.createElement("b",null,"USE RESTRICTIONS")," ",u.a.createElement("br",null),u.a.createElement("p",{style:{padding:10}},"Your permission to use the App is conditioned upon the following use, posting and conduct restrictions: ",u.a.createElement("br",null),"You agree that you will not under any circumstances:"),u.a.createElement("ul",null,u.a.createElement("li",null,"access the Service for any reason other than your usage for managing , uploading content which is directed into a category your channel will belong to use solely as permitted by the normal functionality of the Service."),u.a.createElement("li",null,"collect or harvest any personal data of any user of the App or the Service;"),u.a.createElement("li",null,"use the App or the Service for the solicitation of business in the course of trade or in connection with a commercial enterprise;"),u.a.createElement("li",null,"distribute any part or parts of the App or the Service without our explicit written permission;"),u.a.createElement("li",null,"use the Service for any unlawful purpose or for the promotion of illegal activities;"),u.a.createElement("li",null,"attempt to, or harass, abuse or harm another person or group;"),u.a.createElement("li",null,"intentionally allow another user to access your account;"),u.a.createElement("li",null,"provide false or inaccurate information when registering an account;"),u.a.createElement("li",null,"interfere or attempt to interfere with the proper functioning of the Service;"),u.a.createElement("li",null,"make any automated use of the App, the Service or the related systems, or take any action that we deem to impose or to potentially impose an unreasonable or disproportionately large load on our servers or network infrastructure;"),u.a.createElement("li",null,"bypass any robot exclusion headers or other measures we take to restrict access to the Service, or use any software, technology, or device to scrape, spider, or crawl the Service or harvest or manipulate data;"),u.a.createElement("li",null,"circumvent, disable or otherwise interfere with any security-related features of the Service or features that prevent or restrict use or copying of content, or enforce limitations on use of the Service or the content accessible via the Service; or"),u.a.createElement("li",null,"publish or link to malicious content of any sort, including that intended to damage or disrupt another user\u2019s browser or computer.")),u.a.createElement("b",null,"POSTING AND CONDUCT RESTRICTIONS")," ",u.a.createElement("br",null),u.a.createElement("p",{style:{padding:10}},"When you create your own personalized account, you may be able to provide a valid identity proof, the details for channel creation like email, name of the channel, you name etc. (\u201cUser Content\u201d) to the Service. You are solely responsible for the User Content that you post, upload, link to or otherwise make available via the Service. ",u.a.createElement("br",null),"You agree that we are only acting as a passive conduit for your online distribution and publication of your User Content. The Company, however, reserves the right to remove any User Content from the Service at its sole discretion.",u.a.createElement("br",null),"We grant you permission to use and access the Service, subject to the following express conditions surrounding User Content. You agree that failure to adhere to any of these conditions constitutes a material breach of these Terms. ",u.a.createElement("br",null),"By transmitting and submitting any User Content while using the Service, you agree as follows:",u.a.createElement("br",null)),u.a.createElement("ul",null,u.a.createElement("li",null,"You are solely responsible for your account and the activity that occurs while signed in to or while using your account;"),u.a.createElement("li",null,"You will not post information that is malicious, libelous, false or inaccurate;"),u.a.createElement("li",null,"You will not post any information that is abusive, threatening, obscene, defamatory, libelous, or racially, sexually, religiously, or otherwise objectionable and offensive;"),u.a.createElement("li",null,"You retain all ownership rights in your User Content but you are required to grant the following rights to the App and to users of the Service as set forth more fully under the \u201cLicense Grant\u201d and \u201cIntellectual Property\u201d provisions below: When you upload or post User Content to the A[[ or the Service, you grant to the App a worldwide, non-exclusive, royalty-free, transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform that Content in connection with the provision of the Service; and you grant to each user of the Service, a worldwide, non-exclusive, royalty-free license to access your User Content through the Service, and to use, reproduce, distribute, prepare derivative works of, display and perform such Content to the extent permitted by the Service and under these Terms of Use;"),u.a.createElement("li",null,"You will not submit content that is copyrighted or subject to third party proprietary rights, including privacy, publicity, trade secret, or others, unless you are the owner of such rights or have the appropriate permission from their rightful owner to specifically submit such content; and"),u.a.createElement("li",null,"You hereby agree that we have the right to determine whether your User Content submissions are appropriate and comply with these Terms of Service, remove any and/or all of your submissions, and terminate your account with or without prior notice.")),u.a.createElement("p",{style:{padding:10}},"You understand and agree that any liability, loss or damage that occurs as a result of the use of any User Content that you make available or access through your use of the Service is solely your responsibility. The App is not responsible for any public display or misuse of your User Content. ",u.a.createElement("br",null),"The App does not, and cannot, pre-screen or monitor all User Content. However, at our discretion, we, or technology we employ, may monitor and/or record your interactions with the Service or with other Users."),u.a.createElement("b",null,"ONLINE CONTENT DISCLAIMER"),u.a.createElement("p",{style:{padding:10}},"Opinions, advice, statements, offers, or other information or content made available through the Service, but not directly by the App, are those of their respective authors, and should not necessarily be relied upon. Such authors are solely responsible for such content. ",u.a.createElement("br",null),"We do not guarantee the accuracy, completeness, or usefulness of any information on the App or the Service nor do we adopt nor endorse, nor are we responsible for, the accuracy or reliability of any opinion, advice, or statement made by other parties. We take no responsibility and assume no liability for any User Content that you or any other user or third party posts or sends via the Service. Under no circumstances will we be responsible for any loss or damage resulting from anyone\u2019s reliance on information or other content posted on the Service, or transmitted to users.",u.a.createElement("br",null),"Though we strive to enforce these Terms of Use, you may be exposed to User Content that is inaccurate or objectionable when you use or access the App or the Service. We reserve the right, but have no obligation, to monitor the materials posted in the public areas of the App or the Service or to limit or deny a user\u2019s access to the Service or take other appropriate action if a user violates these Terms of Use or engages in any activity that violates the rights of any person or entity or which we deem unlawful, offensive, abusive, harmful or malicious. The Company shall have the right to remove any material that in its sole opinion violates, or is alleged to violate, the law or this agreement or which might be offensive, or that might violate the rights, harm, or threaten the safety of users or others.  Unauthorized use may result in criminal and/or civil prosecution under Federal, State and local law. If you become aware of a misuse of our Service or violation of these Terms of Use, please contact us info@mycampusdock.com",u.a.createElement("br",null)),u.a.createElement("b",null,"LICENSE GRANT"),u.a.createElement("p",{style:{padding:10}},"By posting any User Content via the Service, you expressly grant, and you represent and warrant that you have a right to grant, to the Company a royalty-free, sublicensable, transferable, perpetual, irrevocable, non-exclusive, worldwide license to use, reproduce, modify, publish, list information regarding, edit, translate, distribute, publicly perform, publicly display, and make derivative works of all such User Content and your name, voice, and/or likeness as contained in your User Content, if applicable, in whole or in part, and in any form, media or technology, whether now known or hereafter developed, for use in connection with the Service."),u.a.createElement("b",null,"INTELLECTUAL PROPERTY"),u.a.createElement("p",{style:{padding:10}},"You acknowledge and agree that we and our licensors retain ownership of all intellectual property rights of any kind related to the Service, including applicable copyrights, trademarks and other proprietary rights. Other product and company names that are mentioned on the Service may be trademarks of their respective owners. We reserve all rights that are not expressly granted to you under these Terms of Use."),u.a.createElement("b",null,"EMAIL MAY NOT BE USED TO PROVIDE NOTICE"),u.a.createElement("p",{style:{padding:10}},"Communications made through the Service\u2019s email and messaging system will not constitute legal notice to the App, the Service, or any of its officers, employees, agents or representatives in any situation where legal notice is required by contract or any law or regulation."),u.a.createElement("b",null,"USER CONSENT TO RECEIVE COMMUNICATIONS IN ELECTRONIC FORM"),u.a.createElement("p",{style:{padding:10}},"For contractual purposes, you: (a) consent to receive communications from us in an electronic form via the email address you have submitted; and (b) agree that all Terms of Use, agreements, notices, disclosures, and other communications that we provide to you electronically satisfy any legal requirement that such communications would satisfy if it were in writing. The foregoing does not affect your non-waivable rights. ",u.a.createElement("br",null),"We may also use your email address to send you other messages, including information about the App or the Service and special offers. You may opt out of such email by changing your account settings, using the \u201cUnsubscribe\u201d link in the message, or by sending an email to info@mycampusdock.com."),u.a.createElement("b",null,"WARRANTY DISCLAIMER"),u.a.createElement("p",{style:{padding:10}},"THE SERVICE, IS PROVIDED \u201cAS IS,\u201d WITHOUT WARRANTY OF ANY KIND. WITHOUT LIMITING THE FOREGOING, WE EXPRESSLY DISCLAIM ALL WARRANTIES, WHETHER EXPRESS, IMPLIED OR STATUTORY, REGARDING THE SERVICE INCLUDING WITHOUT LIMITATION ANY WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, SECURITY, ACCURACY AND NON-INFRINGEMENT. WITHOUT LIMITING THE FOREGOING, WE MAKE NO WARRANTY OR REPRESENTATION THAT ACCESS TO OR OPERATION OF THE SERVICE WILL BE UNINTERRUPTED OR ERROR FREE. YOU ASSUME FULL RESPONSIBILITY AND RISK OF LOSS RESULTING FROM YOUR DOWNLOADING AND/OR USE OF FILES, INFORMATION, CONTENT OR OTHER MATERIAL OBTAINED FROM THE SERVICE. SOME JURISDICTIONS LIMIT OR DO NOT PERMIT DISCLAIMERS OF WARRANTY, SO THIS PROVISION MAY NOT APPLY TO YOU."),u.a.createElement("b",null,"LIMITATION OF DAMAGES; RELEASE"),u.a.createElement("p",{style:{padding:10}},"TO THE EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE APP, THE SERVICE, ITS AFFILIATES, DIRECTORS, OR EMPLOYEES, OR ITS LICENSORS OR PARTNERS, BE LIABLE TO YOU FOR ANY LOSS OF PROFITS, USE,  OR DATA, OR FOR ANY INCIDENTAL, INDIRECT, SPECIAL, CONSEQUENTIAL OR EXEMPLARY DAMAGES, HOWEVER ARISING, THAT RESULT FROM: (A) THE USE, DISCLOSURE, OR DISPLAY OF YOUR USER CONTENT; (B) YOUR USE OR INABILITY TO USE THE SERVICE; (C) THE SERVICE GENERALLY OR THE SOFTWARE OR SYSTEMS THAT MAKE THE SERVICE AVAILABLE; OR (D) ANY OTHER INTERACTIONS WITH USE OR WITH ANY OTHER USER OF THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE. SOME JURISDICTIONS LIMIT OR DO NOT PERMIT DISCLAIMERS OF LIABILITY, SO THIS PROVISION MAY NOT APPLY TO YOU. ",u.a.createElement("br",null),"If you have a dispute with one or more users, a restaurant or a merchant of a product or service that you review using the Service, you release us (and our officers, directors, agents, subsidiaries, joint ventures and employees) from claims, demands and damages (actual and consequential) of every kind and nature, known and unknown, arising out of or in any way connected with such disputes. ",u.a.createElement("br",null),"If you are a California resident using the Service, you may specifically waive California Civil Code \xa71542, which says: \u201cA general release does not extend to claims which the creditor does not know or suspect to exist in his favor at the time of executing the release, which if known by him must have materially affected his settlement with the debtor.\u201d",u.a.createElement("br",null)),u.a.createElement("b",null,"MODIFICATION OF TERMS OF USE"),u.a.createElement("p",{style:{padding:10}},"We can amend these Terms of Use at any time and will update these Terms of Use in the event of any such amendments. It is your sole responsibility to check the App from time to time to view any such changes in this agreement. Your continued use of the App or the Service signifies your agreement to our revisions to these Terms of Use. We will endeavor to notify you of material changes to the Terms by posting a notice on our homepage and/or sending an email to the email address you provided to us upon registration. For this additional reason, you should keep your contact and profile information current. Any changes to these Terms (other than as set forth in this paragraph) or waiver of our rights hereunder shall not be valid or effective except in a written agreement bearing the physical signature of one of our officers. No purported waiver or modification of this agreement on our part via telephonic or email communications shall be valid."),u.a.createElement("b",null,"GENERAL TERMS"),u.a.createElement("p",{style:{padding:10}},"If any part of this Terms of Use agreement is held or found to be invalid or unenforceable, that portion of the agreement will be construed as to be consistent with applicable law while the remaining portions of the agreement will remain in full force and effect. Any failure on our part to enforce any provision of this agreement will not be considered a waiver of our right to enforce such provision. Our rights under this agreement survive any transfer or termination of this agreement.",u.a.createElement("br",null),"You agree that any cause of action related to or arising out of your relationship with the Company must commence within ONE year after the cause of action accrues. Otherwise, such cause of action is permanently barred.",u.a.createElement("br",null),"We may assign or delegate these Terms of Service and/or our Privacy Policy, in whole or in part, to any person or entity at any time with or without your consent. You may not assign or delegate any rights or obligations under the Terms of Service or Privacy Policy without our prior written consent, and any unauthorized assignment or delegation by you is void.",u.a.createElement("br",null),"YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF USE, UNDERSTAND THE TERMS OF USE, AND WILL BE BOUND BY THESE TERMS AND CONDITIONS. YOU FURTHER ACKNOWLEDGE THAT THESE TERMS OF USE TOGETHER WITH THE PRIVACY POLICY ATTACHED. REPRESENT THE COMPLETE AND EXCLUSIVE STATEMENT OF THE AGREEMENT BETWEEN US AND THAT IT SUPERSEDES ANY PROPOSAL OR PRIOR AGREEMENT ORAL OR WRITTEN, AND ANY OTHER COMMUNICATIONS BETWEEN US RELATING TO THE SUBJECT MATTER OF THIS AGREEMENT.",u.a.createElement("br",null)),u.a.createElement(f.a,{as:"h4",className:"header",horizontal:!0,style:{margin:"3em 0em",textTransform:"uppercase"}},"Like What We Do"),u.a.createElement(y.a,{as:"h3",style:{fontSize:"2em"}},"Get in touch with us"),u.a.createElement(T.a,null,u.a.createElement(T.a.Field,null,u.a.createElement("label",null,"Email"),u.a.createElement(b.a,{value:this.state.email,placeholder:"Email Address",onChange:function(t,a){return e.setState({email:a.value})}})),u.a.createElement(T.a.Field,null,u.a.createElement("label",null,"Name"),u.a.createElement(b.a,{value:this.state.name,placeholder:"Full Name",onChange:function(t,a){return e.setState({name:a.value})}})),u.a.createElement(T.a.Field,null,u.a.createElement("label",null,"Subject"),u.a.createElement(b.a,{value:this.state.subject,placeholder:"Subject",onChange:function(t,a){return e.setState({subject:a.value})}})),u.a.createElement(T.a.TextArea,{value:this.state.description,label:"Description",placeholder:"Tell us more...",onChange:function(t,a){return e.setState({description:a.value})}}),u.a.createElement(g.a,{disabled:this.state.loading||""===this.state.email||""===this.state.name||""===this.state.subject||""===this.state.description,loading:this.state.loading,onClick:this.handleSubmit,size:"large",type:"submit"},"Submit")))),u.a.createElement(E.a,{inverted:!0,vertical:!0,style:{padding:"5em 0em"}},u.a.createElement(p.a,null,u.a.createElement(S.a,{divided:!0,inverted:!0,stackable:!0},u.a.createElement(S.a.Row,null,u.a.createElement(S.a.Column,{width:7},u.a.createElement(y.a,{as:"h4",inverted:!0},"Campus Story"),u.a.createElement("p",null,"Copyright 2019 Campus Story")))))))}}]),t}(u.a.Component);t.default=O},60:function(e,t,a){e.exports=a.p+"static/media/CampusStoryLogo.fea71e00.svg"}}]);
//# sourceMappingURL=6.47079782.chunk.js.map