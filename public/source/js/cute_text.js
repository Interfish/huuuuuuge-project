$(document).ready(function () {
  $(document).on("zipper:end", function(){
    $(document).off('zipper:end');
    var text = "一个人最宝贵的不是ta的金钱，而是ta的时间。如果一个人愿意为了你花时间，说明ta真的爱你。这是我花的那份时间，I hope you like it. So, Are you ready?";
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