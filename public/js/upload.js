// we use jquejry

$(document).ready(function(){
    $('.upload-btn').on('click', function(){
        $('#upload-input').click();
    });

    $('#upload-input').on('change',function(){
        var uploadInput = $('#upload-input');
        if(uploadInput.val()!= ''){
            var formData = new FormData();
            formData.append('upload',uploadInput[0].files[0]);

            // the ajax method is used to perform an asynchronous http req
            // the object contains the name and the value pair
            // data: specifies the data to be sent to the server
            // url: specifies the url to send the request to 
            //type: specifies the type of request GET or POST
            // processData:false, specifying whether or not the data sent with the request should be transformed to a query string 
            // success: function() will be run when the request succedds
            $.ajax({
                url:'/uploadFile',
                type:'POST',
                data:formData,
                processData:false,
                contentType:false,
                success:function(){
                    uploadInput.val('');
                }
            });
        }
    });
});