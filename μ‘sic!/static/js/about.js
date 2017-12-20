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
//    
    $.post('getabout',{username:user},function(data){
        var obj = JSON.parse(data);
        console.log(obj[0][139]);
        render1(obj[0][139] * 10,obj[0][352] * 10,obj[0][359] * 10,obj[0][458] * 10,obj[0][465] * 10, obj[0][726] * 10, obj[0][1609] * 10,obj[0][2022] * 10);
    });

    function render1(v1, v2, v3, v4, v5, v6, v7, v8){
    var size = {
  width : 600,
  height: 600
};
        console.log(v1);
        console.log(v2);

var data = [
  {legend:"Blues", value:v1, color:"#66cccc"},
  {legend:"Electronic", value:v2, color:"#CCFF66"},
  {legend:"Others", value:v3, color:"#FF99CC"},
  {legend:"Chinese", value:v4, color:"#FF9999"},
  {legend:"Pop", value:v5, color:"#FF9900"},
  {legend:"Folk", value:v6, color:"#FFCC99"},
    {legend:"Western", value:v7, color:"#FF6666"},
//    {legend:"Rock", value:v8, color:"#FFFF66"}
 
];


var win   = d3.select(window),
    svg   = d3.select("#chart"),
    pie   = d3.layout.pie().sort(null).value(function(d){ return d.value; }),
    arc   = d3.svg.arc().innerRadius(70);


var isAnimated = false;

function render(){

  var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter()
    .append("g")
      .attr("class", "arc");
  g.append("path")
    .attr("stroke", "white")
    .attr("fill", function(d){ return d.data.color; });

  var maxValue = d3.max(data,function(d){ return d.value; });

  g.append("text")
    .attr("dy", ".35em")
    .attr("font-size", function(d){ return d.value / maxValue * 20; }) 
    .style("text-anchor", "middle")
    .text(function(d){ return d.data.legend; });
}

function update(){
  size.width = parseInt(svg.style("width"));
  size.height = parseInt(svg.style("height")); 

  arc.outerRadius(size.width / 2);

  svg
    .attr("width", size.width)
    .attr("height", size.width);

  var g = svg.selectAll(".arc")
    .attr("transform", "translate(" + (size.width / 2) + "," + (size.width / 2) + ")");

  if( isAnimated ){
    g.selectAll("path").attr("d", arc);
  }

  g.selectAll("text").attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"; });
}

function animate(){
  var g = svg.selectAll(".arc"),
      length = data.length,
      i = 0;

  g.selectAll("path")
    .transition()
    .ease("cubic-out")
    .delay(500)
    .duration(1000)
    .attrTween("d", function(d){
      var interpolate = d3.interpolate(
        {startAngle: 0, endAngle: 0},
        {startAngle: d.startAngle, endAngle: d.endAngle}
      );
      return function(t){
        return arc(interpolate(t));
      };
    })
    .each("end", function(transition, callback){
      i++;
      isAnimated = i === length; 
    });
}

render();
update();
animate();
win.on("resize", update);
   
    }   

}); 