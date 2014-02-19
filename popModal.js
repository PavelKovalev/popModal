function popModal(elem, html, params, okFun, cancelFun, onLoad, onClose) {
  var _defaults = {
    placement: 'bottomLeft',
    showCloseBut: true,
    overflowContent: true,
    okFun: function() {return true;},
    cancelFun: function() {},
    onLoad: function() {},
    onClose: function() {}
  };
  $.extend(_defaults, params);
  
  var isFixed, overflowContentClass, closeBut;  

  var modal = elem.next('div');
  var modalClass = 'popModal';
  var popModalOpen = 'popModalOpen';

  
  if (_defaults.showCloseBut) {
    closeBut = $('<button type="button" class="close">&times;</button>');
  } else {
    closeBut = '';
  }
  if (_defaults.overflowContent) {
    overflowContentClass = 'popModal_contentOverflow';
  } else {
    overflowContentClass = '';
  }

  if (modal.hasClass(modalClass)) {
    popModalClose();
  } else {
    $('html.' + popModalOpen).off('click');
    $('.' + modalClass).remove();

    if (elem.css('position') == 'fixed') {
      isFixed = 'position:fixed;';
    } else {
      isFixed = '';
    }
    var getTop = 'top:' + eval(elem.position().top + parseInt(elem.css('marginTop')) + elem.outerHeight() + 10) + 'px';

    var tooltipContainer = $('<div class="' + modalClass + ' ' + _defaults.placement + '" style="' + isFixed + getTop + '"></div>');
    var tooltipContent = $('<div class="' + modalClass + '_content ' + overflowContentClass + '"></div>');
    tooltipContainer.append(closeBut, tooltipContent);
    tooltipContent.append(html);
    elem.after(tooltipContainer);

    animTime = $('.' + modalClass).css('transitionDuration').replace('s', '') * 1000;

    if (onLoad && $.isFunction(onLoad)) {
      onLoad();
    } else {
      _defaults.onLoad();
    }

    $('.' + modalClass).on('destroyed', function () {
      if (onClose && $.isFunction(onClose)) {
        onClose();
      } else {
        _defaults.onClose();
      }
    });

    if (_defaults.placement == 'bottomLeft') {
      $('.' + modalClass).css({left: elem.position().left + parseInt(elem.css('marginRight')) + 'px'});
    } else if (_defaults.placement == 'bottomRight') {
      $('.' + modalClass).css({left: elem.position().left + parseInt(elem.css('marginRight')) + elem.outerWidth() - $('.' + modalClass).outerWidth() + 'px', width: $('.' + modalClass).outerWidth() + 'px'});
    } else if (_defaults.placement == 'bottomCenter') {
      $('.' + modalClass).css({left: elem.position().left + parseInt(elem.css('marginRight')) + (elem.outerWidth() - $('.' + modalClass).outerWidth()) / 2 + 'px', width: $('.' + modalClass).outerWidth() + 'px'});
    }
    if (_defaults.overflowContent) {
      $('.' + modalClass).append($('.' + modalClass).find('.' + modalClass + '_content .' + modalClass + '_footer'));
    }

    setTimeout(function () {
      $('.' + modalClass).addClass('open');
    }, animTime);

    $('.popModal .close').bind('click', function () {
      popModalClose();
    });

    $('html').on('click', function (event) {
      $(this).addClass(popModalOpen);
      if ($('.' + modalClass).is(':hidden')) {
        popModalClose();
      }
      var target = $(event.target);
      if (!target.parents().andSelf().is('.' + modalClass) && !target.parents().andSelf().is(elem)) {
        popModalClose();
      }
    });

  }

  $('.popModal [data-popmodal="close"]').bind('click', function () {
    popModalClose();
  });

  $('.popModal [data-popmodal="ok"]').bind('click', function (event) {
    var ok;
    if (okFun && $.isFunction(okFun)) {
      ok = okFun(event);
    } else {
      ok = _defaults.okFun();
    }
    if (ok !== false) {
      popModalClose();
    }
  });

  $('.popModal [data-popmodal="cancel"]').bind('click', function () {
    if (cancelFun && $.isFunction(cancelFun)) {
      cancelFun();
    } else {
      _defaults.cancelFun();
    }
    popModalClose();
  });

  function popModalClose() {
    setTimeout(function () {
      $('.' + modalClass).removeClass('open');
      setTimeout(function () {
        $('.' + modalClass).remove();
        $('html.' + popModalOpen).off('click');
        $('html').removeClass(popModalOpen);
      }, animTime);
    }, animTime);
  }

  $('html').keydown(function (event) {
    if (event.keyCode == 27) {
      popModalClose();
    }
  });
}
(function ($) {
  $.event.special.destroyed = {
    remove: function (o) {
      if (o.handler) {
        o.handler()
      }
    }
  }
})(jQuery);


function notifyModal(html, duration) {
  var notifyModal = 'notifyModal';
  duration = duration || 2500;

  $('.' + notifyModal).remove();
  var notifyContainer = $('<div class="' + notifyModal + '"></div>');
  var notifyContent = $('<div class="' + notifyModal + '_content"></div>');
  var closeBut = $('<button type="button" class="close">&times;</button>');
  notifyContent.append(closeBut, html);
  notifyContainer.append(notifyContent);
  $('body').append(notifyContainer);

  animTime = $('.' + notifyModal).css('transitionDuration').replace('s', '') * 1000;

  setTimeout(function () {
    $('.' + notifyModal).addClass('open');
  }, animTime);

  $('.' + notifyModal).click(function () {
    notifyModalClose();
  });
  if (duration != -1) {
    notifDur = setTimeout(notifyModalClose, duration);
  }

  function notifyModalClose() {
    setTimeout(function () {
      $('.' + notifyModal).removeClass('open');
      setTimeout(function () {
        $('.' + notifyModal).remove();
        if (duration != -1) {
          clearTimeout(notifDur);
        }
      }, animTime);
    }, animTime);

  }

  $('html').keydown(function (event) {
    if (event.keyCode == 27) {
      notifyModalClose();
    }
  });
}


function hintModal() {
  var hintModal = 'hintModal';
  var focus = false;

  if ($('.' + hintModal).length) {
    animTime = $('.' + hintModal + '_container').css('transitionDuration').replace('s', '') * 1000;
  }

  $('.' + hintModal).mouseenter(function () {
    $('.' + hintModal + '_container').css({display: 'block'});
    setTimeout(function () {
      $('.' + hintModal + '_container').addClass('open');
      focus = true;
    }, animTime);
  });

  $('.' + hintModal).mouseleave(function () {
    if (focus) {
      setTimeout(function () {
        $('.' + hintModal + '_container').removeClass('open');
        setTimeout(function () {
          $('.' + hintModal + '_container').css({display: 'none'});
          focus = false;
        }, animTime);
      }, animTime);
    }
  });
}
(function ($) {
  hintModal();
})(jQuery);
