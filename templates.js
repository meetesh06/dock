const templates = {
  TEMPLATE_EVENT : (name, id) =>{
    return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
    <!--[if gte mso 9]><xml>
     <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
     </o:OfficeDocumentSettings>
    </xml><![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width">
    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <title></title>
    <!--[if !mso]><!-- -->
	<link href="https://fonts.googleapis.com/css?family=Bitter" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
	<!--<![endif]-->
    
    <style type="text/css" id="media-query">
      body {
  margin: 0;
  padding: 0; }

table, tr, td {
  vertical-align: top;
  border-collapse: collapse; }

.ie-browser table, .mso-container table {
  table-layout: fixed; }

* {
  line-height: inherit; }

a[x-apple-data-detectors=true] {
  color: inherit !important;
  text-decoration: none !important; }

[owa] .img-container div, [owa] .img-container button {
  display: block !important; }

[owa] .fullwidth button {
  width: 100% !important; }

[owa] .block-grid .col {
  display: table-cell;
  float: none !important;
  vertical-align: top; }

.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid {
  width: 605px !important; }

.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
  line-height: 100%; }

.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4 {
  width: 200px !important; }

.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8 {
  width: 400px !important; }

.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col {
  width: 302px !important; }

.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col {
  width: 201px !important; }

.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col {
  width: 151px !important; }

.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col {
  width: 121px !important; }

.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col {
  width: 100px !important; }

.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col {
  width: 86px !important; }

.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col {
  width: 75px !important; }

.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col {
  width: 67px !important; }

.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col {
  width: 60px !important; }

.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col {
  width: 55px !important; }

.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col {
  width: 50px !important; }

@media only screen and (min-width: 625px) {
  .block-grid {
    width: 605px !important; }
  .block-grid .col {
    vertical-align: top; }
    .block-grid .col.num12 {
      width: 605px !important; }
  .block-grid.mixed-two-up .col.num4 {
    width: 200px !important; }
  .block-grid.mixed-two-up .col.num8 {
    width: 400px !important; }
  .block-grid.two-up .col {
    width: 302px !important; }
  .block-grid.three-up .col {
    width: 201px !important; }
  .block-grid.four-up .col {
    width: 151px !important; }
  .block-grid.five-up .col {
    width: 121px !important; }
  .block-grid.six-up .col {
    width: 100px !important; }
  .block-grid.seven-up .col {
    width: 86px !important; }
  .block-grid.eight-up .col {
    width: 75px !important; }
  .block-grid.nine-up .col {
    width: 67px !important; }
  .block-grid.ten-up .col {
    width: 60px !important; }
  .block-grid.eleven-up .col {
    width: 55px !important; }
  .block-grid.twelve-up .col {
    width: 50px !important; } }

@media (max-width: 625px) {
  .block-grid, .col {
    min-width: 320px !important;
    max-width: 100% !important;
    display: block !important; }
  .block-grid {
    width: calc(100% - 40px) !important; }
  .col {
    width: 100% !important; }
    .col > div {
      margin: 0 auto; }
  img.fullwidth, img.fullwidthOnMobile {
    max-width: 100% !important; }
  .no-stack .col {
    min-width: 0 !important;
    display: table-cell !important; }
  .no-stack.two-up .col {
    width: 50% !important; }
  .no-stack.mixed-two-up .col.num4 {
    width: 33% !important; }
  .no-stack.mixed-two-up .col.num8 {
    width: 66% !important; }
  .no-stack.three-up .col.num4 {
    width: 33% !important; }
  .no-stack.four-up .col.num3 {
    width: 25% !important; }
  .mobile_hide {
    min-height: 0px;
    max-height: 0px;
    max-width: 0px;
    display: none;
    overflow: hidden;
    font-size: 0px; } }

    </style>
</head>
<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #FFFFFF">
  <style type="text/css" id="media-query-bodytag">
    @media (max-width: 520px) {
      .block-grid {
        min-width: 320px!important;
        max-width: 100%!important;
        width: 100%!important;
        display: block!important;
      }

      .col {
        min-width: 320px!important;
        max-width: 100%!important;
        width: 100%!important;
        display: block!important;
      }

        .col > div {
          margin: 0 auto;
        }

      img.fullwidth {
        max-width: 100%!important;
      }
			img.fullwidthOnMobile {
        max-width: 100%!important;
      }
      .no-stack .col {
				min-width: 0!important;
				display: table-cell!important;
			}
			.no-stack.two-up .col {
				width: 50%!important;
			}
			.no-stack.mixed-two-up .col.num4 {
				width: 33%!important;
			}
			.no-stack.mixed-two-up .col.num8 {
				width: 66%!important;
			}
			.no-stack.three-up .col.num4 {
				width: 33%!important;
			}
			.no-stack.four-up .col.num3 {
				width: 25%!important;
			}
      .mobile_hide {
        min-height: 0px!important;
        max-height: 0px!important;
        max-width: 0px!important;
        display: none!important;
        overflow: hidden!important;
        font-size: 0px!important;
      }
    }
  </style>
  <!--[if IE]><div class="ie-browser"><![endif]-->
  <!--[if mso]><div class="mso-container"><![endif]-->
  <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #FFFFFF;width: 100%" cellpadding="0" cellspacing="0">
	<tbody>
	<tr style="vertical-align: top">
		<td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #FFFFFF;"><![endif]-->

    <div style="background-color:#49a6e8;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 605px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#49a6e8;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 605px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="605" style=" width:605px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 605px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 20px;padding-left: 20px;padding-top: 20px;padding-bottom: 20px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span>&#160;</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 30px;"><![endif]-->
	<div style="color:#FFFFFF;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 30px;">	
		<div style="line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;color:#FFFFFF;text-align:left;"><p style="margin: 0;line-height: 14px;text-align: center;font-size: 12px"><span style="font-size: 50px; line-height: 60px;"><strong><span style="line-height: 60px; font-size: 50px;">Dock Inc.</span></strong></span></p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 30px;"><![endif]-->
	<div style="color:#FFFFFF;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 20px; padding-bottom: 30px;">	
		<div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#FFFFFF;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 28px; line-height: 33px;">An event was successfully created</span></p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:#49a6e8;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 605px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#49a6e8;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 605px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="605" style=" width:605px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 605px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 20px;padding-left: 20px;padding-top: 20px;padding-bottom: 20px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span>&#160;</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:#f3f3f3;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 605px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#f3f3f3;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 605px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="605" style="background-color:#FFFFFF; width:605px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 605px;display: table-cell;vertical-align: top;">
              <div style="background-color: #FFFFFF; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 5px;padding-left: 5px;padding-top: 5px;padding-bottom: 5px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
<div class="">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 30px; padding-bottom: 5px;"><![endif]-->
<div style="color:#134C75;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 30px; padding-left: 30px; padding-top: 30px; padding-bottom: 5px;">	
  <div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#134C75;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 24px; line-height: 28px;"><strong>Event Information</strong></span></p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->
</div>
                
                
                  <div class="">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 5px; padding-bottom: 20px;"><![endif]-->
<div style="color:#7E7E7E;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:150%; padding-right: 30px; padding-left: 30px; padding-top: 5px; padding-bottom: 20px;">	
  <div style="font-size:12px;line-height:18px;color:#7E7E7E;font-family:'Open Sans', Helvetica, Arial, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px;text-align: center">Name: ${name}<br> Id: ${id} </p></div>	
</div>
<!--[if mso]></td></tr></table><![endif]-->
</div>


                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 30px; padding-bottom: 5px;"><![endif]-->
	<div style="color:#134C75;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 30px; padding-left: 30px; padding-top: 30px; padding-bottom: 5px;">	
		<div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#134C75;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 24px; line-height: 28px;"><strong>Got any Queries ?</strong></span></p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 30px; padding-left: 30px; padding-top: 5px; padding-bottom: 20px;"><![endif]-->
	<div style="color:#7E7E7E;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:150%; padding-right: 30px; padding-left: 30px; padding-top: 5px; padding-bottom: 20px;">	
		<div style="font-size:12px;line-height:18px;color:#7E7E7E;font-family:'Open Sans', Helvetica, Arial, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 21px;text-align: center">Please email your queries to support@mycampusdock.com, thank you.</p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 20px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span>&#160;</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
                  
                    <div align="center" class="img-container center  autowidth  " style="padding-right: 0px;  padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px;line-height:0px;"><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
  <img class="center  autowidth " align="center" border="0" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/48/marketing-template_bottom-article.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 600px" width="600">
<!--[if mso]></td></tr></table><![endif]-->
</div>

                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:#f3f3f3;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 605px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#f3f3f3;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 605px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="605" style=" width:605px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num12" style="min-width: 320px;max-width: 605px;display: table-cell;vertical-align: top;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 30px;padding-bottom: 30px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #DDDDDD;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
	<div style="color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:180%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
		<div style="font-size:12px;line-height:22px;color:#555555;font-family:'Open Sans', Helvetica, Arial, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 25px"><i>This is a auto-generated email from our registration server,&#160; if you did not request this registration request please feel free to ignore this email.</i></p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
                  
                    
<table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
    <tbody>
        <tr style="vertical-align: top">
            <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 25px;padding-left: 25px;padding-top: 25px;padding-bottom: 25px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 0px solid transparent;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                    <tbody>
                        <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span>&#160;</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>    <div style="background-color:transparent;">
      <div style="Margin: 0 auto;min-width: 320px;max-width: 605px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid mixed-two-up ">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 605px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="403" style=" width:403px; padding-right: 0px; padding-left: 0px; padding-top:15px; padding-bottom:15px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num8" style="display: table-cell;vertical-align: top;min-width: 320px;max-width: 400px;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:15px; padding-bottom:15px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->

                  
                    <div class="">
	<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
	<div style="color:#8F8F8F;font-family:'Open Sans', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
		<div style="font-size:12px;line-height:14px;color:#8F8F8F;font-family:'Open Sans', Helvetica, Arial, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px"><span style="font-size: 11px; line-height: 13px;">Copyright © 2018 Dock, All rights reserved. </span><br></p></div>	
	</div>
	<!--[if mso]></td></tr></table><![endif]-->
</div>
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
              <!--[if (mso)|(IE)]></td><td align="center" width="202" style=" width:202px; padding-right: 10px; padding-left: 10px; padding-top:15px; padding-bottom:15px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
            <div class="col num4" style="display: table-cell;vertical-align: top;max-width: 320px;min-width: 200px;">
              <div style="background-color: transparent; width: 100% !important;">
              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:15px; padding-bottom:15px; padding-right: 10px; padding-left: 10px;"><!--<![endif]-->

                  
                    &#160;
                  
              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
              </div>
            </div>
          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>   <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
		</td>
  </tr>
  </tbody>
  </table>
  <!--[if (mso)|(IE)]></div><![endif]-->


</body></html>`;},
  TEMPLATE_INVITE: (name, name1) => {
    return (
      `
      <!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head>
      <!--[if gte mso 9]><xml>
       <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
       </o:OfficeDocumentSettings>
      </xml><![endif]-->
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width">
      <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
      <title></title>
      
      
      <style type="text/css" id="media-query">
        body {
    margin: 0;
    padding: 0; }
  
  table, tr, td {
    vertical-align: top;
    border-collapse: collapse; }
  
  .ie-browser table, .mso-container table {
    table-layout: fixed; }
  
  * {
    line-height: inherit; }
  
  a[x-apple-data-detectors=true] {
    color: inherit !important;
    text-decoration: none !important; }
  
  [owa] .img-container div, [owa] .img-container button {
    display: block !important; }
  
  [owa] .fullwidth button {
    width: 100% !important; }
  
  [owa] .block-grid .col {
    display: table-cell;
    float: none !important;
    vertical-align: top; }
  
  .ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid {
    width: 500px !important; }
  
  .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {
    line-height: 100%; }
  
  .ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4 {
    width: 164px !important; }
  
  .ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8 {
    width: 328px !important; }
  
  .ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col {
    width: 250px !important; }
  
  .ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col {
    width: 166px !important; }
  
  .ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col {
    width: 125px !important; }
  
  .ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col {
    width: 100px !important; }
  
  .ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col {
    width: 83px !important; }
  
  .ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col {
    width: 71px !important; }
  
  .ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col {
    width: 62px !important; }
  
  .ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col {
    width: 55px !important; }
  
  .ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col {
    width: 50px !important; }
  
  .ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col {
    width: 45px !important; }
  
  .ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col {
    width: 41px !important; }
  
  @media only screen and (min-width: 520px) {
    .block-grid {
      width: 500px !important; }
    .block-grid .col {
      vertical-align: top; }
      .block-grid .col.num12 {
        width: 500px !important; }
    .block-grid.mixed-two-up .col.num4 {
      width: 164px !important; }
    .block-grid.mixed-two-up .col.num8 {
      width: 328px !important; }
    .block-grid.two-up .col {
      width: 250px !important; }
    .block-grid.three-up .col {
      width: 166px !important; }
    .block-grid.four-up .col {
      width: 125px !important; }
    .block-grid.five-up .col {
      width: 100px !important; }
    .block-grid.six-up .col {
      width: 83px !important; }
    .block-grid.seven-up .col {
      width: 71px !important; }
    .block-grid.eight-up .col {
      width: 62px !important; }
    .block-grid.nine-up .col {
      width: 55px !important; }
    .block-grid.ten-up .col {
      width: 50px !important; }
    .block-grid.eleven-up .col {
      width: 45px !important; }
    .block-grid.twelve-up .col {
      width: 41px !important; } }
  
  @media (max-width: 520px) {
    .block-grid, .col {
      min-width: 320px !important;
      max-width: 100% !important;
      display: block !important; }
    .block-grid {
      width: calc(100% - 40px) !important; }
    .col {
      width: 100% !important; }
      .col > div {
        margin: 0 auto; }
    img.fullwidth, img.fullwidthOnMobile {
      max-width: 100% !important; }
    .no-stack .col {
      min-width: 0 !important;
      display: table-cell !important; }
    .no-stack.two-up .col {
      width: 50% !important; }
    .no-stack.mixed-two-up .col.num4 {
      width: 33% !important; }
    .no-stack.mixed-two-up .col.num8 {
      width: 66% !important; }
    .no-stack.three-up .col.num4 {
      width: 33% !important; }
    .no-stack.four-up .col.num3 {
      width: 25% !important; }
    .mobile_hide {
      min-height: 0px;
      max-height: 0px;
      max-width: 0px;
      display: none;
      overflow: hidden;
      font-size: 0px; } }
  
      </style>
  </head>
  <body class="clean-body" style="margin: 0;padding: 5px;-webkit-text-size-adjust: 100%;background-color: #333">
    <style type="text/css" id="media-query-bodytag">
      @media (max-width: 520px) {
        .block-grid {
          min-width: 320px!important;
          max-width: 100%!important;
          width: 100%!important;
          display: block!important;
        }
  
        .col {
          min-width: 320px!important;
          max-width: 100%!important;
          width: 100%!important;
          display: block!important;
        }
  
          .col > div {
            margin: 0 auto;
          }
  
        img.fullwidth {
          max-width: 100%!important;
        }
        img.fullwidthOnMobile {
          max-width: 100%!important;
        }
        .no-stack .col {
          min-width: 0!important;
          display: table-cell!important;
        }
        .no-stack.two-up .col {
          width: 50%!important;
        }
        .no-stack.mixed-two-up .col.num4 {
          width: 33%!important;
        }
        .no-stack.mixed-two-up .col.num8 {
          width: 66%!important;
        }
        .no-stack.three-up .col.num4 {
          width: 33%!important;
        }
        .no-stack.four-up .col.num3 {
          width: 25%!important;
        }
        .mobile_hide {
          min-height: 0px!important;
          max-height: 0px!important;
          max-width: 0px!important;
          display: none!important;
          overflow: hidden!important;
          font-size: 0px!important;
        }
      }
    </style>
    <!--[if IE]><div class="ie-browser"><![endif]-->
    <!--[if mso]><div class="mso-container"><![endif]-->
    <table class="nl-container" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #333;width: 100%" cellpadding="0" cellspacing="0">
    <tbody>
    <tr style="vertical-align: top">
      <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #333;"><![endif]-->
  
      <div style="background-color:transparent;">
        <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #fff;" class="block-grid ">
          <div style="border-collapse: collapse;display: table;width: 100%;background-color:#fff;">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:#fff;"><![endif]-->
  
                <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
              <div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;">
                <div style="background-color: transparent; width: 100% !important;">
                <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->
  
                    
                      <div align="center" class="img-container center fixedwidth " style="padding-right: 0px;  padding-left: 0px;">
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px;line-height:0px;"><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->
  <div style="line-height:5px;font-size:1px">&#160;</div>
  <img class="center fixedwidth" align="center" border="0" src="http://www.mycampusdock.chat/logo.png" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 100px" width="100">
  <div class="center fixedwidth" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: 0;height: auto;float: none;width: 100%;max-width: 100px">
    
  </div>
  <!--[if mso]></td></tr></table><![endif]-->
  </div>
  
                    
                <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                </div>
              </div>
            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
      <div style="background-color:transparent;">
        <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #fff;" class="block-grid ">
          <div style="border-collapse: collapse;display: table;width: 100%;background-color:#fff;">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:#fff;"><![endif]-->
  
                <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
              <div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;">
                <div style="background-color: transparent; width: 100% !important;">
                <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->
  
                    
                      <div class="">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 5px; padding-bottom: 10px;"><![endif]-->
    <div style="color:#555555;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 5px; padding-bottom: 10px;">	
      <div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="line-height: 45px; font-size: 38px;">Campus Story</span></p></div>	
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
  </div>
                    
                    
                      <div class="">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 0px;"><![endif]-->
    <div style="color:#555555;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 0px;">	
      <div style="font-size:12px;line-height:14px;color:#555555;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 16px; line-height: 19px;">Campus Story <strong>Creators Club</strong></span></p></div>	
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
  </div>
                    
                <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                </div>
              </div>
            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
      <div style="background-color:transparent;">
        <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #fff;" class="block-grid ">
          <div style="border-collapse: collapse;display: table;width: 100%;background-color:#fff;">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:#fff;"><![endif]-->
  
                <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->
              <div class="col num12" style="min-width: 320px;max-width: 500px;display: table-cell;vertical-align: top;">
                <div style="background-color: transparent; width: 100% !important;">
                <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->
  
                    
                      
  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
      <tbody>
          <tr style="vertical-align: top">
              <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 0px;padding-left: 0px;padding-top: 0px;padding-bottom: 0px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                  <table class="divider_content" height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                      <tbody>
                          <tr style="vertical-align: top">
                              <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                  <span>&#160;</span>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>
      </tbody>
  </table>
                    
                    
                      <div class="">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 20px; padding-bottom: 20px;"><![endif]-->
    <div style="color:#555555;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 20px; padding-left: 20px; padding-top: 20px; padding-bottom: 20px;">	
      <div style="line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:12px;color:#555555;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px">Dear,</p><p style="margin: 0;font-size: 14px;line-height: 17px"><strong>${name}</strong></p><p style="margin: 0;font-size: 14px;line-height: 17px">&#160;</p><p style="margin: 0;font-size: 14px;line-height: 17px">Here are some details we require to get started.</p><ol style="font-size:12px;">
  <li style="font-size: 14px; line-height: 16px;">Your Full Name</li>
  <li style="font-size: 14px; line-height: 16px;">Contact Details (Phone Number and Email Address)</li>
  <li style="font-size: 14px; line-height: 16px;">Preferred Channel Name</li>
  <li style="font-size: 14px; line-height: 16px;">Channel Description</li>
  <li style="font-size: 14px; line-height: 16px;">Channel Category</li>
  <li style="font-size: 14px; line-height: 16px;">Channel Banner Image</li>
  <li style="font-size: 14px; line-height: 16px;">Social Media Account links</li>
  </ol><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 14px; line-height: 16px;">Please compose an email with the following details and send them to creator@mycampusdock.com.</span></p><p style="margin: 0;font-size: 12px;line-height: 14px">&#160;</p><p style="margin: 0;font-size: 12px;line-height: 14px"><strong><span style="font-size: 14px; line-height: 16px;">PLEASE NOTE:</span></strong></p><ul style="font-size:12px;">
  <li style="font-size: 12px; line-height: 14px;"><span style="font-size: 14px; line-height: 16px;">You can attach multiple images for channel banner, we will select the best looking image.</span></li>
  <li style="font-size: 12px; line-height: 14px;"><span style="font-size: 14px; line-height: 16px;">Please provide the email address you would like to be used for channel access and updates regarding the channel.</span></li>
  <li style="line-height: 14px; font-size: 12px;"><span style="font-size: 14px; line-height: 16px;">Feel free to provide any other notes if required.</span></li>
  </ul><p style="margin: 0;font-size: 12px;line-height: 14px">&#160;</p><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 14px; line-height: 16px;">We truly believe in our creators and want to create a community of amazing talented people. Thank you for being a part of Campus Story, it really means a lot to us.</span></p><p style="margin: 0;font-size: 12px;line-height: 14px">&#160;</p><p style="margin: 0;font-size: 12px;line-height: 14px"><span style="font-size: 14px; line-height: 16px;">Thanking You,</span></p><p style="margin: 0;line-height: 14px;font-size: 12px"><span style="font-size: 14px; line-height: 16px;">Yours Sincerely,</span><span style="font-size: 14px; line-height: 16px;"></span></p><p style="margin: 0;line-height: 14px;font-size: 12px"><span style="font-size: 14px; line-height: 16px;">${name1}</span><span style="font-size: 14px; line-height: 16px;"></span></p></div>	
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
  </div>
                    
                    
                      
  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="divider " style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 100%;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
      <tbody>
          <tr style="vertical-align: top">
              <td class="divider_inner" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;padding-right: 10px;padding-left: 10px;padding-top: 10px;padding-bottom: 10px;min-width: 100%;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                  <table class="divider_content" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                      <tbody>
                          <tr style="vertical-align: top">
                              <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                  <span></span>
                              </td>
                          </tr>
                      </tbody>
                  </table>
              </td>
          </tr>
      </tbody>
  </table>
                    
                    
                      <div class="">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
    <div style="color:#555555;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
      <div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 12px; line-height: 14px;">We do not share any of your personal details with third party without your consent, you can read out terms and conditions <a style="color:#0068A5;text-decoration: none;" href="https://mycampusdock.com/terms" target="_blank" rel="noopener">here</a></span></p></div>	
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
  </div>
                    
                    
                      <div class="">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->
    <div style="color:#555555;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;line-height:120%; padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">	
      <div style="font-size:12px;line-height:14px;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;color:#555555;text-align:left;"><p style="margin: 0;font-size: 14px;line-height: 17px;text-align: center"><span style="font-size: 12px; line-height: 14px;">Copyright 2019 Campus Story</span></p></div>	
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
  </div>
                    
                <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                </div>
              </div>
            <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
     <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
      </td>
    </tr>
    </tbody>
    </table>
    <!--[if (mso)|(IE)]></div><![endif]-->
  
  
  </body></html>
      `
    );
  }

};
module.exports = Object.create(templates);