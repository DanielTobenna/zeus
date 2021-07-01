$(document).ready(function () {
 $("#admin-register-form").submit(adminRegister);
 $("#admin-login-form").submit(loginAdmin);
 $(".newForm").submit(processForm);
 $(".deleteAction").click(deleteData);
 $(".deposit_action_admin").click(processDeposite);
 $(".withdraw_action_admin").click(processDeposite);


 // $("#reset-password").submit(customerResetPassword);
});


// This function processes deposit
function processDeposite(e){
  e.preventDefault();
  $transactionId = $(this).attr("data-transaction-id");
  $userId = $(this).attr("data-user-id");
  $actionType = $(this).attr("data-action-type");
  $url = $(this).attr("href");
  $data = {id:$transactionId,user_id:$userId,actionType:$actionType}
  if(($actionType == ("approve")) || ($actionType == "decline")){
    $confirm = confirm(`Are you sure you want to ${$actionType}`);
    if(!$confirm){
      return;
    }
  }
  $.ajax({
    type: "POST",
    url: $url,
    data: $data,
    success: function ($respose) {
      $res = JSON.parse($respose);
      console.log($res);
      if($actionType == "detail"){
        console.log()
        $body = $(".body");
        $body.find(".username").html($res.userData.username);
        $body.find(".email").html($res.userData.email);
        $body.find(".amount").html(`$${$res.transaction.amount}`);
        $images =  JSON.parse($res.transaction.proof);
        $body.find(".image").html("");
        if($images.length > 0){
          $images.forEach(element => {
            $body.find(".image").append($("<img>").attr({src:element}).css({height:200,width:200}))
          });
        }
        $('#confirm-coin').modal('show');

      }else if(($actionType == ("approve")) || ($actionType == "decline")){
        if($res.success){
          swal({
            title: "",
            text: `${$res.message}`,
            icon: "success",
            buttons: true,
          })
          .then((willDelete) => {
            console.log($(`.parent${$transactionId}`));
            $(`.parent${$transactionId}`).remove();
            $(`#parent${$transactionId}`).remove();
 
          })
        }else if($res.error){
          swal({
            title: "",
            text: `${$res.message}`,
            icon: "error",
            buttons: true,
          })
        }
        console.log($res);
      }
    },
  });

}


function copyText(id) {
  var copyText = document.getElementById(id);
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
  console.log("Copied the text: " + copyText.value);
 }


// This function is used to login customer
function loginAdmin(e) {
  e.preventDefault();
  const $captchaBox = $("#captcha_error");
  $captchaBox.text("");
  const $errorBox = $("#error_box");
  $errorBox.text("");
  const $form = $(this).serializeArray();
  const $button = $(this).find("button[type=submit]");
  const $action = $(this).attr("action");
  const $data = { "login-admin": true };
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

  }else {
    $captchaBox.text("Please check the recaptCha");
  }
 }
 
// function helps to register customer
function adminRegister(e) {
e.preventDefault();
const $infoBox = $("#info_box");
$infoBox.text("");
const $frm = $(this);
const $form = $(this).serializeArray();
const $button = $(this).find("button[type=submit]");
const $action = $(this).attr("action");
const $data = { "register-admin": true };
for ($x in $form) {
  if ($form.hasOwnProperty($x)) {
    $(`#error_${$form[$x].name}`).text("");
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
        $infoBox.html($res.error).addClass("text-danger")
        $button.html("Add Admin");
      } else {
        $button.html("Successfull");
        $infoBox.html($res.success).addClass("text-success")
        $frm.trigger("reset");
        setTimeout(function () {
          $infoBox.html("").removeClass("text-success")
          $button.html("Add Admin");
        }, 2000);
      }
    },
  });

}

// function helps to register customer
function processForm(e) {
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
          $infoBox.html($res.error).addClass("text-danger")
          $button.html($button.attr("data-value"));
        }else{
          $button.html("Successfull");
          $infoBox.html($res.success).addClass("text-success")
          $frm.trigger("reset");
          swal({
            text:($res.message != undefined) ? $res.message : "Successfull" ,
            icon: "success",
            buttons: true
          }).then((responce)=>{
            if($res.url){
              location.href = $res.url;
           }else{
             setTimeout(function () {
               $infoBox.html("").removeClass("text-success")
               $button.html($button.attr("data-value"));
             }, 1000);
           }
          })

        }
      },
    });
  
  }

// This function is used for deleting 
function deleteData(e){
  e.preventDefault();
  $btn = $(this);
  const $id = $btn.attr("data-id");
  const $parent = $(`#parent${$id}`);
  const $data = {[$btn.attr("data-post-type")]: true};
  const $action = $btn.attr("data-action");  
  console.log($data)
  swal({
    title: "Are you sure?",
    text: "Once deleted, you will not be able to recover this record!",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {

      $.ajax({
        type: "POST",
        url: $action,
        data: $data,
        success: function ($response) {
          console.log($response);
          $res = JSON.parse($response);
          console.log($res);
          if ($res.error){
            swal({
              title: "Failed",
              text: `${$res.error}`,
              icon: "error"
            });
          } else {
            $parent.remove();
          }
        },
      });
    } 
  });


}