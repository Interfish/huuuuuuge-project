$(document).ready(function () {
  if($("html").data('controller') != "photos") { return }

  function bindUploadBotton() {
    $("#input-upload").on("change", function() {
      if ($("#input-upload").val() != '') {
        var data = new FormData($("#form-upload")[0]);
        $.ajax({
          type: "POST",
          url: "/photos",
          data: data,
          cache       : false,
          contentType : false,
          processData : false,
          success: function(){
            location.reload();
          },
        });
      }
    });
    $("#button-upload").on("click", function() {
      $("#input-upload").click();
    });
  }

  bindUploadBotton();
  window.showPhoto = function(event) {
    var photoId = $(event.target).data("photo");
    $.get("/photos/" + photoId, function(data) {
      var img_tag = "<img src=\"" + data["src"] + "\"></img>"
      $(".img-container").append(img_tag);
      if(data["comment"] != null) {
        $('textarea.form-control').val(data["comment"]);
      }
      $(".img-container").data("photo-id", data["id"]);
      $(".img-shown").show(400);
      $(".img-mask").show(400);
    });
  }
  window.hidePhoto = function(_) {
    $('.img-shown').hide(400, function(){
      $('.img-container').empty();
      $('textarea.form-control').val(null);
    });
    $('.img-mask').hide(400);
  }
  window.updateComment = function() {
    var photoId = $(".img-container").data("photo-id");
    var data = new FormData($("#form-update-comment")[0]);
    $.ajax({
      url : "/photos/" + photoId.toString(),
      type : "PUT",
      data : data,
      cache       : false,
      contentType : false,
      processData : false
    })
  }
});