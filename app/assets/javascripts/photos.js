$(document).ready(function () {
  if($("html").data('controller') != "photos") { return }

  function bindUploadBotton() {
    $("#input-upload").on("change", function() {
      if ($("#input-upload").val() != '') {
        var data = new FormData($("#form-upload")[0]);
        // data.append('image', $("#form-upload")[0].files[0])
        $.ajax({
          type: "POST",
          url: "/photos",
          data: data,
          cache       : false,
          contentType : false,
          processData : false,
          success: function(){},
        });
      }
    });
    $("#button-upload").on("click", function() {
      $("#input-upload").click();
    });
  }

  bindUploadBotton();
});