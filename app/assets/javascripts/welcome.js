$(document).ready(function () {
  if($("html").data('controller') != "welcome") { return }
  $(function () {
    $('form').bind("keypress", function (e) {
      if (e.keyCode == 13) return false;
    });
  });
  $("#submit").click(function(){
    var formData = $("form").serializeArray();
    var sendData = {};
    for(var i = 0;i < formData.length;i++) {
      sendData[formData[i]["name"]] = formData[i]["value"];
    }
    $.post(
      "/session",
      sendData
    ).done(function(){
        window.location.href = "/birthday";
      }).fail(function(){
          $("#flash").text('Login failed. Try again.');
      });
  })
});