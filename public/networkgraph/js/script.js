
var nodes = [];

data.forEach(function (el, index) {
    var node = el[index]
    nodes.push(node)
})

var width = 960,
    height = 500,
    centered

var fill = d3.scale.category10();


// var nodes = d3.range(1000).map(function(i) {
//   return {index: i, clust: (i%20)};
// });

var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .on("tick", tick)
    .start();

var svg = d3.select("div#container").append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 300 300")
    .classed("svg-content img-fluid", true)
    .attr("width", width)
    .attr("height", height)
    .call(d3.behavior.zoom().on("zoom", function () {
        svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
    }))
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
    .attr("r", 8)
    .style("fill", function (d) { return fill(d.clust); })
    .style("stroke", function (d) { return d3.rgb(fill(d.clust)).darker(2); })
    .call(force.drag) // This makes the node draggable
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


// function zoomed() {
//     svg.attr("transform", d3.event.transform);
// }

svg.style("opacity", 1e-6)
    .transition()
    .duration(1000)
    .style("opacity", 1);

function tick(e) {
    var minx = 10000, miny = 1000000;
    // Push different nodes in different directions for clustering.
    var k = 10 * e.alpha;
    nodes.forEach(function (o, i) {
        o.x += Math.floor(o.clust % 5) * k;
        o.y += Math.floor(o.clust / 5) * k;

        minx = Math.min(minx, o.x);
        miny = Math.min(miny, o.y);

        //o.y += 
        //o.y += o.group * e.alpha * 4;
        // o.y += (group) ? k : -k;
        // o.x += (i / 4) ? k : -k;

    });

    nodes.forEach(function (o, i) {
        o.x -= (minx - 10);
        o.y -= (miny - 10);
    });

    /* if (maxx > width || maxy > height) {
         zs = zoom.scale()
         zt = zoom.translate();
         dx = (w/2.0/zs) - d.x;
         dy = (h/2.0/zs) - d.y;
         zoom.translate([dx, dy]);
         zoom.scale(zs);
     }
   */

    node.attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });
}




/*
    nodes.forEach(function(o, i) {
    o.x += (Math.random() - .5) * 40;
    o.y += (Math.random() - .5) * 40;
  });
  force.resume();
*/

var root = d3.select('g')

var zoomA = d3.behavior
	.zoom()
	.on('zoom.zoom', function () {
		// console.trace("zoom", d3.event.translate, d3.event.scale);
		root.attr('transform',
			'translate(' + d3.event.translate + ')'
			+   'scale(' + d3.event.scale     + ')');
	})
;

function zoomFit(paddingPercent, transitionDuration) {
    var width = 0;
    var height = 0;

    nodes.forEach(function (o, i) {
        width = Math.max(width, o.x);
        height = Math.max(height, o.y);
    });

    width = 1.5 * width;
    height = height * 1.75;

    console.log(width);
    console.log(height);

    var bounds = root.node().getBBox();
    var parent = root.node().parentElement;
    var fullWidth = parent.clientWidth,
        fullHeight = parent.clientHeight;
    // var width = bounds.width,
    //     height = bounds.height;
    var midX = (width - 100) / 2 + 100,
        midY = height / 2;
    if (width == 0 || height == 0) return; // nothing to fit
    var scale = (paddingPercent || 0.75) / Math.max(width / fullWidth, height / fullHeight);
    var translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];

    console.log(fullWidth);


    // console.trace("zoomFit", translate, scale);
    root
        .transition()
        .duration(transitionDuration || 0) // milliseconds
        .call(zoomA.translate(translate).scale(scale).event);
}