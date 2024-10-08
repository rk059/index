var msg_to_sent = "";


function emailValidation(form_id, email) {
    jQuery(form_id + ' .has-error').hide();
    var emailExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,10}(?:\.[a-z]{2})?)$/i;
    var email_value = email.val();
    if (email_value.match(emailExp)) {
        msg_to_sent += "Email :" + email_value + "\n";
        return true;
    } else {
        email.after('<div class="alert alert-danger has-error">Please Enter Valid Email address</div>');
        return false;
    }
}

function numberValidation(form_id, ph_number) {
    jQuery(form_id + ' .has-error').hide();
    var numbexp = /^[0-9]*$/;
    var pn_value = ph_number.val();
    var f_parent = ph_number.parent().parent().children('label').text();
    if (pn_value.match(numbexp)) {
        msg_to_sent +=  f_parent + " : " + pn_value + "\n";
        return true;
    } else {
        ph_number.after('<div class="alert alert-danger has-error">Please Enter Valid Number</div>');
        return false;
    }
}

function urlValidation(form_id, Web_url) {
    jQuery(form_id + ' .has-error').hide();
    var urlexp = /^(?:(ftp|http|https):\/\/)?(?:[\w-]+\.)+[a-z]{3,6}$/;
    var web_url_value = Web_url.val();
    var f_parent = Web_url.parent().parent().children('label').text();
    if (web_url_value.match(urlexp)) {
        msg_to_sent +=  f_parent + " : " + web_url_value + "\n";
        return true;
    } else {
        Web_url.after('<div class="alert alert-danger has-error">Please Enter Valid URL</div>');
        return false;
    }
}

function noValidation(form_id, form_value) {
	var f_value = form_value.val();
	var f_parent = form_value.parent().parent().children('label').text();
	 msg_to_sent +=  f_parent + " : " + f_value + "\n";
     return true;
}

function validate(form_id) {
    var notempty = /.+/;
    var result = true;
    jQuery(form_id + " .req_field").html('');
    jQuery(form_id + " input[type=text]").each(function () {
        var valid_input = true;
        var req = jQuery(this).hasClass('required');
        var input_value = jQuery(this).val();
        var inputt = jQuery(this).data('vali');
        if (req) {
            if (input_value.match(notempty)) {
                if (inputt !== 'undefined' || inputt !== "") {
                    if (inputt === 'email') {
                        valid_input = (valid_input && emailValidation(form_id, jQuery(this)));
                    }
                    else if (inputt === 'url') {
                        valid_input = (valid_input && urlValidation(form_id, jQuery(this)));
                    }
                    else if (inputt === 'numeric') {
                        valid_input = (valid_input && numberValidation(form_id, jQuery(this)));
                    }
					else if (inputt === 'novalidation') {
                        valid_input = (valid_input && noValidation(form_id, jQuery(this)));
                    }
                }
                result = valid_input;
                return valid_input;
            }
            else {
                jQuery(form_id + " .req_field").html('<div class="alert alert-danger">Please enter the required field </div>');
                result = false;
                return false;
            }
        }
    });
    return result;
}




jQuery(document).ready(function () {

	$(this).find("input#attach_file").change(function () {
		var value = $(this).val().replace( /C:\\fakepath\\/i, "" );
		var parentdiv = jQuery(this).parent().closest(".contactformdiv");
		var inputspan = jQuery(parentdiv).find("span#upload-file");
		jQuery(inputspan).html(value);
			});

    jQuery("form").submit(function () {

        $('.submitformButton').hide();
               $('#loaderImage').show();
        
               
        var form = $(this).attr('id');
        var form_id = "#" + form;
        jQuery(form_id + ' .success').html('');

        // Replace with your EmailJS user ID

        // document.getElementById('ContactForm0').addEventListener('submit', function(event) {
        //   event.preventDefault(); // Prevent the form from submitting the traditional way
      
          // Collect form data
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const message = document.getElementById('comment').value;
      
          // Send the email
         
        // });
		// var attach_file = 'true';
        // var msg = jQuery(form_id + " .comment").val();
        // if($(form_id).find('input#attach_file').length > 0)
        // {
        // 	var attachedFile = $(form_id).find('input#attach_file')[0];
        // if(attachedFile.hasAttribute("file_extension")){
        // 	var allowedExts = attachedFile.getAttribute("file_extension");
        // }
        // else{
        // 	var allowedExts = false;
        // }
        
        // if(attachedFile.hasAttribute("size")){
	    // 	var allwdsize = attachedFile.getAttribute("size");
	    // }else{
        // 	var allwdsize = false;
        // }
        
        // var selected = attachedFile.files.length;
        // if( selected > 0)
        // {
		// 	var attach_file= uploadfile(form_id,allwdsize,allowedExts);
		// }
        // }
		
        if (validate(form_id)) {
         	// var isrecaptcha = false ;
    
     		// if(isrecaptcha){
     		// 	event.preventDefault();
            // 	grecaptcha.ready(function() {
            //     grecaptcha.execute('~sitekey', {action: 'submit'}).then(function(token) {
            //         sentmail(form_id, msg, token);
            //     });
            // });
   			// }  else {
   			// 	sentmail(form_id, msg, '');
   			// }

               

               emailjs.send("service_2jxzn6k", "template_45k2l7b", {
                to_name: 'Tirupati Packers Movers',
                from_name: name,
                email: email,
                message: message
              })
              .then(function(response) {
                alert('Email sent successfully!');
                
             

                window.location.reload();
              }, function(error) {
                alert('Failed to send email: ' + error.text);
                
               $('.submitformButton').show();
               $('#loaderImage').hide();

              });
        }
        return false;

    });

});

function sentmail(form_id, msg, token) {
    var formdata = $(form_id);
    formdata[0].elements['token'].value = token;
    var messsage_body = "From \n" + msg_to_sent + " \n Message : " + msg;
    jQuery.ajax({
       type: 'POST',
       url: 'contactform.php',
     enctype: 'multipart/form-data',
       cache: false,
   contentType: false,
       processData: false,
      data: new FormData(formdata[0]),
       success: function (msg) {
           if (msg == 'sent') {
               jQuery(form_id + ' .success').html('<div class="alert alert-success">Message Sent Successfully</div>');
               jQuery(form_id + ' .has-error').hide();
               jQuery(form_id + " .req_field").html('');
               jQuery(form_id).trigger("reset");
               msg_to_sent = "";
           } else {
               jQuery(form_id + ' .success').html('<div class="alert alert-danger">Sorry there was an error sending your message. Please try again later.</div>');
               msg_to_sent = "";
           }
       }
   });
}

function uploadfile(form_id,allwdsize,allowedExts)
{
		var fileinfo = $(form_id).find('input#attach_file')[0].files[0];
		var filesize = fileinfo.size/(1024*1024);
		var filename = fileinfo.name;
		var type =   filename.substring(filename.indexOf("."));
		var errmsg = "";
		var resultArray = sizeerr = errflag = false;
		if(allowedExts){
		var resultArray = allowedExts.split(',').map(function(allowedExts){return String(allowedExts);});
		}

	   
	   if(allwdsize && filesize > allwdsize)
	   {
	   var sizeerr = errflag = true;
	   errmsg += "Please upload valid file (filesize must be less than " + allwdsize + "Mb";	   
	   }
	   
	   var res = $.inArray(type,resultArray);
	   if((resultArray) && (res == -1))
	   {
		if(sizeerr)
		{
			errmsg += " and file type must be one of " + allowedExts + ")";
		}
		else
		{
			errmsg += "Please upload valid file(file type must be one of " + allowedExts + ")";
		}
		errflag = true;
	   }else{
	   		errmsg += ")";
	   		}
	   
	   
	   if(errflag)
	   {
	   	alert(errmsg);
	   	return false;
	   }
	   else
	   {
		   return true;
	   }
}