
  var get_avatar_url = function() {
    var url = '/avatar/view3d?';

    for (var i = 0; i < document.td_ids.length; i += 1) {
      url += '&ids[]=' + document.td_ids[i];
    }
    var st = document.skin_tone;
    var ht = document.hair_tone;
    var bt = document.background_tone;

    if (typeof st == 'undefined') {
      st = '';
    }
    if (typeof ht == 'undefined') {
      ht = '';
    }
    if (typeof bt == 'undefined') {
      bt = '';
    }
    url += '&skinTone=' + st;
    url += '&hairTone=' + ht;
    url += '&backgroundTone=' + bt;
    var theme = getParam('theme');

    if (!theme) {
      theme = 'unisex';
    }
    url += '&theme=' + theme;
    return url;
  };

    function save3DAvatar(onSuccess) {
    $(document).ajaxStart(function() {
      loading_button($('#save-3d--avatar'));
    });

    $(document).ajaxStop(function() {
      unloading_button($('#save-3d-avatar'));
    });

    var url = get_avatar_url();
    var request = $.ajax({
      url: url,
      type: 'POST',
      data: JSON.stringify({save: true}),
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      success: function(response) {
        if (onSuccess) {
          onSuccess();
        } else {
          _alert({ message: gettext('Your Avatar Has Been Saved To your Gitcoin Profile!')}, 'success');
        }
      },
      error: function(response) {
        let text = gettext('Error occurred while saving. Please try again.');

        if (response.responseJSON && response.responseJSON.message) {
          text = response.responseJSON.message;
        }
        $('#later-button').show();
        _alert({ message: text}, 'danger');
      }
    });
  }


var foo= async function(){
    save3DAvatar();
    $('.select_avatar_type').each(function() {
      var catclass = $(this).data('target');

      $('.category.' + catclass + ' .tdselection').random().click();
    });
    $('#skin_tones li').random().click();
    
    $('#hair_tones li').random().click();
    $('#background_tones li').random().click();

};
setInterval(foo, 1000);