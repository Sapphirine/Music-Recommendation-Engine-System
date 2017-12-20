var size = {
  width : 600,
  height: 600
};
tmp = 30
var data = [
  {legend:"139", value:30, color:"#e74c3c"},
  {legend:"352", value:10, color:"#f39c12"},
  {legend:"359", value:15, color:"#16a085"},
  {legend:"458", value:25, color:"#d35400"},
  {legend:"465", value:10, color:"#66FFFF"},
  {legend:"726", value:10, color:"#CCFF00"},
    {legend:"1609", value:10, color:"#0033FF"},
    {legend:"2022", value:10, color:"#2c3e50"}
 
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
