
$(document).ready(function () {
  var $interval;
  $("#register-form").submit(customerRegister);
  $("#login-form").submit(loginCustomer);
  $("#forgot-password").submit(customerForgotPassword);
  $("#reset-password").submit(customerResetPassword);
  $(".deposit_cash").click(processDeposit);
  $(".confirm_deposit").click(confirmDeposit);
  $(".plan_select").click(processInvestment);
  $(".withdrawal-form").submit(processForm2);
  $("#buy-coin").on("hidden.bs.modal", function () {
   location.reload();
});
});



// function helps to register customer
function processForm2(e) {
  e.preventDefault();
  const $infoBox = $("#info_box");
  $infoBox.text("");
  const $frm = $(this);
  const $form = $(this).serializeArray();
  const $button = $(this).find("button[type=submit]");
  const $action = $(this).attr("action");
  const $data = { [$frm.attr("data-post-type")]: true };
  for ($x in $form) {
    if ($form.hasOwnProperty($x)) {
      $(`#error_${$form[$x].name}`).text("");
      $data[$form[$x].name] = $form[$x].value;
    }
  }

  $button.html("<div class='spinner-grow spinner-grow-sm' role='status'><span class='sr-only'>Loading...</span></div> Processing...");
    $.ajax({
      type: "POST",
      url: $action,
      data: $data,
      success: function ($response) {
        console.log($response);
        $res = JSON.parse($response);
        console.log($res);
        if ($res.error){
          for ($x in $res) {
            if ($res.hasOwnProperty($x)) {
              $(`#error_${$x}`).text($res[$x]);
            }
          }
          $infoBox.html($res.message).addClass("text-danger")
          $button.html($button.attr("data-value"));
        }else{
          $button.html("Successfull");
          $infoBox.html($res.message).addClass("text-success")
          $frm.trigger("reset");
          swal({
            text:($res.message != undefined) ? $res.message : "Successfull" ,
            icon: "success",
            buttons: true
          }).then((responce)=>{
            if($res.url){
              location.href = $res.url;
           }else{
            $infoBox.html("").removeClass("text-success")
            $button.html($button.attr("data-value"));
            location.reload()
           }
          })

        }
      },
    });
  
  }





// This function is used to process investment
function processInvestment(e){
  e.preventDefault();
  $customerAmountObj = $(this).prev().prev(".customer_amount");
  $amount = parseInt($customerAmountObj.val());
  console.log($amount);
  $minValue = $(this).attr("data-min");
  $maxValue = $(this).attr("data-max");
  $errorBox = $(this).prev(".error_box");
  $(".error_box").html("");

  if(isNaN($amount)){
    $errorBox.html("Please Enter a valid amount");
    return;
  }else if( ($amount < $minValue) ){
    $errorBox.html(`Amount can't be less than $${$minValue}`);
    return;
  }else if( ($amount > $maxValue) ){
    $errorBox.html(`Amount can't be above  $${$maxValue}`);
    return;
  }

  $planId = $(this).attr("data-plan-id");
  $price = $amount.toFixed(2);
  $action = $(this).attr("href");
  swal({
    text: `Once approved, $${$price} will be debited from your main balance`,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willInvest) => {
    if (willInvest) {
      $.ajax({
        type: "POST",
        url: $action,
        data: {plan_id:$planId,invest:true,cutomer_amount:$price},
        success: function ($response) {
          console.log($response);
          $res = JSON.parse($response);
          if($res.success){
            swal({
              text: $res.message,
              icon: "success",
              buttons: true
            }).then((responce)=>{
              location.reload();
            })
          }else if($res.error){
            swal({
              text: $res.message,
              icon: "error",
              buttons: true,
              dangerMode:true
            }).then((responce)=>{
              location.href = `${$site}account/deposit`
            })
          }
        }
      })     
    }
  })

}


// function helps to register customer
function customerRegister(e) {
 e.preventDefault();
 const $captchaBox = $("#captcha_error");
 $captchaBox.text("");
 const $frm = $(this);
 const $form = $(this).serializeArray();
 const $button = $(this).find("button[type=submit]");
 const $action = $(this).attr("action");
 const $data = { "register-customer": true };
 for ($x in $form) {
   if ($form.hasOwnProperty($x)) {
     $(`#error_${$form[$x].name}`).text("");
     $data[$form[$x].name] = $form[$x].value;
   }
 }
 if (!$("input[type=checkbox]").is(":checked")) {
   $("#agree-term_error")
     .text("Please check the box");
 }else{
  $("#agree-term_error")
  .text("");
 }

 if (grecaptcha.getResponse()) {
   $button.html(
     "<div class='spinner-grow spinner-grow-sm' role='status'><span class='sr-only'>Loading...</span></div> Processing..."
   );


   $.ajax({
     type: "POST",
     url: $action,
     data: $data,
     success: function ($response) {
       console.log($response);
       $res = JSON.parse($response);
       console.log($res);

       if ($res.error){
         for ($x in $res) {
           if ($res.hasOwnProperty($x)) {
             $(`#error_${$x}`).text($res[$x]);
           }
         }
         $button.html("Register");
       } else {
         $button.html("Successfull");
         $frm.trigger("reset");
         grecaptcha.reset();
         setTimeout(function () {
           location.href = $res.url;
         }, 500);
       }
     },
   });
 } else {
   $captchaBox.text("Please check the recaptCha");
 }
}


// This function is used to login customer
function loginCustomer(e) {
 e.preventDefault();
 const $errorBox = $("#error_box");
 $errorBox.text("");
 const $form = $(this).serializeArray();
 const $button = $(this).find("button[type=submit]");
 const $action = $(this).attr("action");
 const $data = { "login-customer": true };
 for ($x in $form) {
   if ($form.hasOwnProperty($x)) {
     $data[$form[$x].name] = $form[$x].value;
   }
 }
 $button.html(
   "<div class='spinner-grow spinner-grow-sm' role='status'><span class='sr-only'>Loading...</span></div> Processing..."
 );

 $.ajax({
   type: "POST",
   url: $action,
   data: $data,
   success: function ($respose) {
     console.log($respose);
     $res = JSON.parse($respose);
     console.log($res);
     if ($res.error) {
       $errorBox.text($res.error);
       $button.html("Sign In");
     } else {
       location.href = $res.url;
       $button.html("Successfull");

     }
   },
 });
}

// function to process forgot password for customer
function customerForgotPassword(e) {
 e.preventDefault();
 const $infoBox = $("#info_box");
 $infoBox.text("");
 const $frm = $(this);
 const $form = $(this).serializeArray();
 const $button = $(this).find("button[type=submit]");
 const $action = $(this).attr("action");
 const $data = { "forgot-password": true };
 for ($x in $form) {
   if ($form.hasOwnProperty($x)) {
     $data[$form[$x].name] = $form[$x].value;
   }
 }
 if (grecaptcha.getResponse()) {
   $button.html(
     "<div class='spinner-grow spinner-grow-sm' role='status'><span class='sr-only'>Loading...</span></div> Processing..."
   );

   $.ajax({
     type: "POST",
     url: $action,
     data: $data,
     success: function ($response) {
       console.log($response);
       $res = JSON.parse($response);   

       if ($res.error) {
         $infoBox
           .text($res.error)
           .addClass("text-danger")
           .removeClass("text-success");
           $button.html("Send Reset Link");
       } else {
         $infoBox
           .text($res.success)
           .addClass("text-success")
           .removeClass("text-danger");
           $button.html("Send Reset Link");
         $frm.trigger("reset");
         grecaptcha.reset();
       }
     },
   });
 } else {
   $infoBox
     .text("Please check the recaptCha")
     .addClass("text-danger")
     .removeClass("text-success");
 }
}

// function to reset password for customer
function customerResetPassword(e) {
 e.preventDefault();
 const $infoBox = $("#info_box");
 $infoBox.text("");
 const $frm = $(this);
 const $form = $(this).serializeArray();
 const $button = $(this).find("button[type=submit]");
 const $action = $(this).attr("action");
 const $data = { "reset-password": true };
 console.log($data);
 for ($x in $form) {
   if ($form.hasOwnProperty($x)) {
     $data[$form[$x].name] = $form[$x].value;
   }
 }

   if ($data.password.length >= 6) {
     $button.html(
       "<div class='spinner-grow spinner-grow-sm' role='status'><span class='sr-only'>Loading...</span></div> Processing..."
     );
     $.ajax({
       type: "POST",
       url: $action,
       data: $data,
       success: function ($response) {
         console.log($response);
         $res = JSON.parse($response);
         console.log($res);
         if ($res.error) {
           $infoBox
             .text($res.error)
             .addClass("text-danger")
             .removeClass("text-success");
             $button.html("Unlock");
         } else {
           $infoBox
             .text($res.success)
             .addClass("text-success")
             .removeClass("text-danger");
             $button.html("Unlock");
           $frm.trigger("reset");
           setTimeout(function () {
             location.href = $res.url;
           }, 1500);
         }
       },
     });
   } else {
     $infoBox
       .text("Password must be at least six characters")
       .addClass("text-danger")
       .removeClass("text-success");
   }

}


// This function processes deposite
function processDeposit(e){
 e.preventDefault();
 $btn = $(this);
 $errorBox = $("#error_box");
 $value = $("#buysell-amount").val();
 $url = $(this).attr("data-url");
 $method = $("#method").val();
 if($value == "" || isNaN($value)){
  $("#buysell-amount").parent().prev().find(".error_box").html("Enter an amount");
   return;
 }else{
  $("#buysell-amount").parent().prev().find(".error_box").html("");
 }

 if($method == ""){
  $("#method").parent().prev().find(".error_box").html("Select a payment method");
   return;
 }else{
  $("#method").parent().prev().find(".error_box").html("");
  if(jQuery.inArray($method,["BTC","BCH","ETH","LTC"]) != -1){
    $(".btc").removeClass("d-none");
    $(".bank").addClass("d-none");

  }else{
    $(".bank").removeClass("d-none");
    $(".btc").addClass("d-none");
  }
 }

//  $('#buy-coin').modal('show');
//  return

 if(jQuery.inArray($method,["BTC","BCH","ETH","LTC"]) != -1){
  $btn.html("<div class='spinner-grow spinner-grow-sm' role='status'><span class='sr-only'>Loading...</span></div> Processing...");
  // set endpoint and your API access key
    $.ajax({
        url: $url,   
        method:"POST",
        data:{usd_to_crypto:true,amount:$value,convert:$method},
        success: function($res) {
          $res = JSON.parse($res);
          console.log($res);
          if($res.data.quote){
            $(".converted_payment").html(`$${$value} (${$res.data.quote[$method].price.toFixed(6)})${$method.toUpperCase()}`)
            $("#btc_amount").val(`${$res.data.quote[$method].price.toFixed(6)}`);
            $("#wallet_address").val($walletAddress[$method])
            $('#buy-coin').modal('show');
          }else{
            swal({
              text:"An error occured trying to access the Crypto API",
              icon: "error",
              buttons: true
            })
          }

        }
    });
 }else{
 $('#buy-coin').modal('show');
 }





//  $count = 9;
//  $interval = setInterval(function(){
//    $(".time_counter").html(`${$count}min`);
//    if($count == 0){
//      clearInterval($interval);
//      completeDeposit(e,{amount:$value,url:$btn.attr("data-url"),deposit:true,time_elapsed:true});
//    }
//    $count--;
//  },1000)
}

// function completes the deposit
function completeDeposit(e,$param){
  e.preventDefault();
  $(".confirm_deposit").html(
    "<div class='spinner-grow spinner-grow-sm' role='status'><span class='sr-only'>Loading...</span></div> Processing..."
  );
  $.ajax({
    type: "POST",
    url: $param.url,
    data: $param,
    success: function ($response) {
      console.log($response);
      $res = JSON.parse($response);   
      console.log($res);
      $(".confirm_deposit").html("Confirm Payment");
      if ($res.error) {
        $('#buy-coin').modal('hide');
        swal({
          text:"Your deposit request was not successfull",
          icon: "error",
          buttons: true
        }).then((responce)=>{
          location.reload();
        })
      }else {
        $('#buy-coin').modal('hide');
        swal({
          text: "Your deposit request was created successfully",
          icon: "success",
          buttons: true
        }).then((responce)=>{
          location.reload();
        })
      }
    },
  });
}


// function
function confirmDeposit(e){
  e.preventDefault();
  $param = { amount : $value = $("#buysell-amount").val() , url : $(this).attr("data-url"), deposit:true , proof:$imageArray};
  console.log($param);
  if($imageArray.length == 0){
    swal({
      text:"Please upload a proof of payment",
      icon: "error",
      buttons: true
    })
  }else{
    completeDeposit(e,$param);
  }
}


