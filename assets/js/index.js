$("#add_user").submit(function(event){
    alert("Data Inserted Successfully!");
})

$("#update_user").submit(function(event){
    event.preventDefault();
    var unindexed_array=$(this).serializeArray();
    var data= {};
    $.map(unindexed_array,function(n,i){
        data[n['name']]= n['value']

    })
    console.log(data);
    var request = {
        "url": `http://localhost:8080/api/users/${data._id}`,
        "method": "PUT",
        "data": data
    }; 
    if(confirm("are you really want to send the result? This can't be recoved agian!")){
        $.ajax(request).done(function(response){
            alert("data updated successfully");
        });
    };

})

if(window.location.pathname == "/alletermine"){

    $ondelete = $(".table tbody .delete")
    $ondelete.click(function(){
        var id = $(this).attr('data-id');
        
        var request = {
            "url": `http://localhost:8080/api/users/${id}`,
            "method": "DELETE"
        }; 
        
    if(confirm("are you really want to delete this record? This can't be recoved agian!")){
        $.ajax(request).done(function(response){
            alert("data deleted successfully");
            location.reload();
        })
    };


    });

};

if(window.location.pathname == "/alletermine"){

    $ondelete = $(".table tbody .check")
    $ondelete.click(function(){
        var id = $(this).attr('data-id');
        var datavalue = $(this).attr('data-value');
        var data= {
            status: datavalue
        };

        var id = $(this).attr('data-id');
        var request = {
            "url": `http://localhost:8080/api/users/${id}`,
            "method": "PUT",
            "data": data
        };
        
        $.ajax(request).done(function(response){
            alert("User checked in successfully");
            location.reload();
        })



    });

};