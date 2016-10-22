//mailchimp subscribe form processing
jQuery('.edit_doctor_profile').on('click', function (e) {
    console.log('hello');
    e.preventDefault();
    var $html = jQuery(this);
    console.log($html.parent());
    $html.parent().hide();
    console.log($html.parent().parent().find('.doctors-profile-min-edit-details').css('display', 'block'));
    // e.preventDefault();
    // var $form = jQuery(this);
    // // update user interface
    // $form.find('.response').html('Adding email address...');
    // // Prepare query string and send AJAX request
    // jQuery.ajax({
    //     url: 'mailchimp/store-address.php',
    //     data: 'ajax=true&email=' + escape($form.find('.mailchimp_email').val()),
    //     success: function (msg) {
    //         $form.find('.response').html(msg);
    //     }
    // });
});