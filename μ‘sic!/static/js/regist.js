$(function(){
    $("#damnit").click(function(event){
    	event.preventDefault();
        console.log(12);
        var username = $('#usr').val();
        var password = $('#password').val();
        var password2 = $('#password2').val();
        var age = $('#age').val();
        var city = $('#city').val();
        var gender = $('#gender').val();
        console.log(username)
        if (age == null || age ==''){
            alert("please input age")
        }
        if (password != password2) {
            alert('different password!')
        }
        else {
            console.log(12);
            $.post('',{"username":username,"password":password, "gender": gender, "age": age, "city": city},function(data){
    			obj = JSON.parse(data);
    			if(obj['isvalid'] == false){
    				alert('username occupied');
    			}else{
                    console.log(1)
    				alert('Successflly signed up!');
                    window.location.replace("../login");
    			}
    		}); 
        }
    	
  	});
});