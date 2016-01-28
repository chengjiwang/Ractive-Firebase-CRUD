$(document).ready(function() {   
   var myDataRef = new Firebase('https://ractive-food.firebaseio.com/');
   var tainan ,food,name,key,address ,tel,openHour;
   var ractive = new Ractive({                       
          el: '#tainanData',
          template: '#template',
          data: { tainan: food ,
                nameInput:name,
                addressInput: address ,
                telInput: tel,
                openHourInput: openHour,
                status:'Add',
                statuskey :key
        }                    
    });  

    function read(callback){
         myDataRef.on('value', function(snapshot) {                                               
                snapshot.forEach(function(data) {
                var uid= data.key();
                myDataRef.child(uid).update({
                       key:  uid              
                    });                               
                });   
                 var data= snapshot.val();  
                 callback(data);          
        });  
    }

    function clearInput(){
        $('#nameInput').val('');
        $('#addressInput').val('');
        $('#telInput').val('');
        $('#openHourInput').val('');
    }
        
    read(function(data) {
        food = data ;
        ractive.set('tainan', food)
    });
  
   
    ractive.on( 'Add', function ( event ) {             
        myDataRef.push({
            name:$('#nameInput').val(),
            address: $('#addressInput').val(),
            tel:$('#telInput').val(),
            openHour:$('#openHourInput').val()
        });
        clearInput();
        read(function(data) {
            food = data ;
            ractive.set('tainan', food)
        });              
    });
    
    ractive.on( 'delete', function(event ,item,key) {                                        
        myDataRef.child(key).remove();
        clearInput();  
        read(function(data) {
            food = data ;
            ractive.set('tainan', food)
         });
    });


    ractive.on( 'edit', function(event,item,key) {     
        function edit(callback){
            myDataRef.on('value', function(snapshot) {               
                var name = snapshot.child(key).child("name").val();    
                var address = snapshot.child(key).child("address").val();
                var tel = snapshot.child(key).child("tel").val();
                var openHour = snapshot.child(key).child("openHour").val();                   
                callback(name,address,tel,openHour);                                       
            });  
         }
         
        edit(function(name,address,tel,openHour) {
            ractive.set({
                    nameInput: name,
                    addressInput: address ,
                    telInput: tel,
                    openHourInput: openHour,
                    status:'modify',
                    statuskey:key            
            });          
        });  
    });  
    ractive.on( 'modify', function ( event,item,statuskey ) {      
            myDataRef.child(statuskey).update({
                name:$('#nameInput').val(),
                address: $('#addressInput').val(),
                tel:$('#telInput').val(),
                openHour:$('#openHourInput').val()
            });
            clearInput(); 
            read(function(data) {
                food = data ;
                ractive.set({
                        tainan: food,
                        status:'Add'
                }); 
            });
    });  

});


