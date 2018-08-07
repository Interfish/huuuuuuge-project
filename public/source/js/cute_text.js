$(document).ready(function () {
  $(document).on("zipper:end", function(){
    $(document).off('zipper:end');
    var text = "打多久啊我看到健康拉丁舞";
    function cute(i) {
      if(i > text.length ) {
        setTimeout(function(){
          window.location.href = '/cake';
        }, 5000)
        return
      }
      if(i == text.length){
        $(".cute").text('');
      } else {
        $(".cute").text(text[i]);
      }
      if(i > 0) {
        $(".normal").text(text.slice(0, i));
      }
      setTimeout(function(){
        cute(i+1);
      }, 300);
    }
    setTimeout(function() {
      cute(0);
    }, 1500);
  });
})