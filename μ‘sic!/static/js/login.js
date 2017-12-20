$(function(){
	$("#damnit").click(function(event){
    	event.preventDefault();
    	var username = $('#username').val();
    	var password = $('#password').val(); 
    	if (username == '' || password == ''){
    		alert('input not valid');
    	}else{
            console.log(username);
            console.log(password);
    		$.post('',{"username":username,"password":password},function(data){
    			obj = JSON.parse(data);
    			if(obj['status'] == false){
    				alert('wrong username or password');
    			}else{
    				
    					localStorage.setItem('user',username);
    					window.location.replace("../top");	
    				
    				
    			}
    		}); 	
    	}
    	
  	});
	console.log(1);
    
});