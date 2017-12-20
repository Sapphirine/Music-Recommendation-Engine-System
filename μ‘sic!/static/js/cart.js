$(function(){
    $("#recommend").click(function(event){
    	window.location.replace("../recommend");	
  	});
    $("#top").click(function(event){
    	window.location.replace("../top");	
  	});
    $("#cart").click(function(event){
    	window.location.replace("../cart");	
  	});$("#about").click(function(event){
    	window.location.replace("../about");	
  	});
    $('#logout').click(function(){
		localStorage.clear();
		window.location.replace("../login");
	});
    
    
	var user = localStorage.getItem('user');
	if(user == null){
		alert('not login yet');
		window.location.replace("../login");
	}
    console.log(user)
    
    $.post('getfavourite',{username:user},function(data){
        var obj = JSON.parse(data);
		render1(obj);
        console.log(data);
    });
    
    
	function render1(obj){
		html = ''
		for(var i = 0; i < obj.length; i++){
			item = obj[i];
			html +='<tr>'
			//console.log(item)
			html += '<td>'+ item['name']+'</td>' + '<td>'+ item['artist_name']+'</td>' + '<td>'+ item['composer']+'</td>'+ '<td>'+ item['lyricist']+'</td>'
			html += '<td><audio controls="controls"> <source src="/static/audio/Let Me Love You.mp3" type="audio/mpeg"><embed height="100" width="100" src="/static/audio/Let Me Love You.mp3" /></audio></td></tr> ';
			
		}
		$(".t1 tbody").append(html);

        
	}
       
}); 