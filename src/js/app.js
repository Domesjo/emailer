$(() => {
  const $file = $('input[type="file"]');
  const $filePath = $('.file-path');

  $file.on('change', function(){
    const pathName = $(this).val().split('fakepath\\')[1];
    $filePath.text(pathName);
  });
});
