$(document).ready(function() {
  // 如果cookie不存在，显示弹窗和背景遮罩层
  if (!$.cookie('popupShown')) {
    $('body').append('<div class="popup-background"></div>'); // 插入背景遮罩层
    $('.popup-background').fadeIn();
    $('.popup').fadeIn();
  }

  // 点击关闭按钮时的处理
  $('.popup-close').click(function() {
    $('.popup-background').fadeOut(function() {
      $(this).remove(); // 移除背景遮罩层
    });
    $('.popup').fadeOut();
    $.cookie('popupShown', 'no', { expires: 1, path: '/' }); // 设置cookie，有效期1天
  });
});
