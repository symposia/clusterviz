
var nodes = [];

data.forEach(function (el, index) {
    var node = el[index]
    nodes.push(node)
})

var width = 1080,
    height = 960,
    centered

var fill = d3.scaleOrdinal(d3.schemeCategory10);


// var nodes = d3.range(1000).map(function(i) {
//   return {index: i, clust: (i%20)};
// });

var zoom = d3.zoom().on("zoom", zoomed);

var force = d3.forceSimulation(nodes)
    .nodes(nodes)
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))
    // .tick()
    .on("tick", tick);

var minx = 0;
var maxx = 0;
var maxy = 0;
var miny = 0;

    nodes.forEach(function (o, i) {
        minx = Math.min(minx, o.x);
        miny = Math.min(miny, o.y);
        maxx = Math.max(maxx, o.x);
        maxy = Math.max(maxy, o.y);
    });

var xcenter = (maxx - minx) / 2
var ycenter = (maxy - miny) / 2

var svg = d3.select("div#container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", 500 + " " + 0 + " "  + width + " " + height)
    // .classed("svg-content img-fluid", true)
    .attr("width", width)
    .attr("height", height)
    .call(zoom)
    // .call(d3.zoom().on("zoom", function () {
    //       svg.attr("transform", d3.event.transform);
    // }))
    .append("g");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("cx", function (d) { return d.x; })
    .attr("cy", function (d) { return d.y; })
    .attr("r", 30)
    .style("fill", function (d) { return fill(d.clust); })
    .style("stroke", function (d) { return d3.rgb(fill(d.clust)).darker(2); })
    // .call(force.drag) // This makes the node draggable
    // .on("zoom", zoomed)
    .on("mouseover", function (d) {
        div.transition()
            .style("opacity", 1)
        div.html("<p> Source: " + d.sourceName + "</p><p> Title: <a href=" + d.url + ">" + d.title + "</a></p>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .style('visibility', 'visible');
        // setTimeout(function(){

        // }, 1000);
    })
    .on("mouseout", function (d) {
        $( function() {
            $('.node').mouseleave( function(e) {
                if( ! $(e.toElement).hasClass('tooltip') &&  ! $(e.toElement).hasClass('node')) {
                    div.transition()
                    .duration(50)
                    .style("opacity", 0)
                    .style("pointer-events", null)
                    .style('visibility', 'hidden');
                }
            });
        });
    });


div.on("mouseover", function() {
        div.style("pointer-events", null);
    })
    .on("mouseleave", function () {
        div.transition()
        .duration(50)
        .style("opacity", 0)
        .style("pointer-events", null);

        div.transition()
            .style('visibility', 'hidden');
    });

svg.style("opacity", 1e-6)
    .transition()
    .duration(1000)
    .style("opacity", 1);

function tick(e) {
    var minx = 0, miny = 0;
    // Push different nodes in different directions for clustering.
    var k = this.alpha() * 20;
    nodes.forEach(function (o, i) {
        o.x += Math.floor(o.clust % 5) * k;
        o.y += Math.floor(o.clust / 5) * k;

        minx = Math.min(minx, o.x);
        miny = Math.min(miny, o.y);
    });

    nodes.forEach(function (o, i) {
        o.x -= (minx - 10);
        o.y -= (miny - 10);
    });

    node.attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });
}

function zoomed() {
  // zoom.transform(svg, d3.zoomIdentity);
  d3.selectAll(".node").attr("transform", d3.event.transform);
}

function resetted() {
  this.svg.call(this.zoom.transform, d3.zoomIdentity.scale(1));
}
