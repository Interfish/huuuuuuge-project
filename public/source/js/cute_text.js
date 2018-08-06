$(document).ready(function () {
  $(document).on("zipper:end", function(){
    $(document).off('zipper:end');
    console.log("hi");
  });
})