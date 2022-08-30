// fetch latest NVL ratio && current tax from database
fetchNVL();
function fetchNVL(){

        $(".loadingimage").show();
        var dummy = 0;
        var path_main = '';//url for prod site folder
        $.post(path_main+'bank_draft.php',{'addnvl':dummy}, function(data) {
            
            $('.cartview-list').empty();
            $(".loadingimage").hide(); //hide loading image once data is received
            $('.cartview-list').append(data); //...add result
        
        }).fail(function(xhr, ajaxOptions, thrownError) { 
             //alert any HTTP error
        });	
    }