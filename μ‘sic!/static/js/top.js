$(function(){
    $("#recommend").click(function(event){
    	window.location.replace("../recommend");	
  	});
    $("#top").click(function(event){
    	window.location.replace("../top");	
  	});
    $("#cart").click(function(event){
    	window.location.replace("../cart");	
  	});
    $("#about").click(function(event){
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
    
	$.get('getmusic',function(data){
		var obj = JSON.parse(data);
		//console.log(data);

		render1(obj);

	});
	function render1(obj){
		html = ''
		for(var i = 0; i < obj.length; i++){
			item = obj[i];
			html +='<tr>'
			//console.log(item)
			html += '<td>'+ item['name']+'</td>' + '<td>'+ item['artist_name']+'</td>' + '<td>'+ item['composer']+'</td>'+ '<td>'+ item['lyricist']+'</td>'
			html += '<td><audio controls="controls"> <source src="/static/audio/'+item['name']+'.mp3" type="audio/mpeg"><embed height="100" width="100" src="/static/audio/'+item['name']+'.mp3" /></audio></td> ';
            html += '<th><a href="" class="btn btn-info btn-lg" style="size:50%"><span class="glyphicon glyphicon-heart"></span>Like it!</a></th></tr>';
			
		}
		$(".t1 tbody").append(html);
        $('.btn-info').click(function(){
            console.log(1);
            song = $(event.target).parent().parent().find("td").first().html();
            $.post('damnit2',{"user":user,"song":song},function(data){
                console.log(data);
            })
        })

        
	}
    
    $('#damnit').on('click',function(event){
            $(".t1 tbody").empty();
            event.preventDefault();
            console.log(1)
            val = $('#template-desc').val();
            
            $.get('getmusic',{"song_name": val},function(data){
                console.log(data); 
                obj = JSON.parse(data);
                render1(obj);
                
                
                
            });
        })

}); 