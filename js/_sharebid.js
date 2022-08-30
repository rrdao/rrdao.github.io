// JavaScript Document
$(document).on('click', '#shl_trigger', function(e){
  $(this).toggleClass(function(){
    return $(this).is('.shl_triggerA, .shl_triggerB') ? 'shl_triggerA shl_triggerB' : 'shl_triggerA';
  })
});

