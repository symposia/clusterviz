// var margin = {top: 20, right: 120, bottom: 20, left: 120},
//     width =  $("#container").outerWidth() - margin.right - margin.left,
//     height = $("#container").outerHeight() - margin.top - margin.bottom;
var width = $("#container").outerWidth();
var height = $("#container").outerHeight();
var scale = 0.2;
console.log(width, height);
var nodes = [];
var zoomWidth = (width - (scale*width))/2;
var zoomHeight = (height - (scale*height))/2;
console.log(zoomWidth, zoomHeight)

data.forEach(function (el, index) {
    var node = el[index]
    nodes.push(node)
})

// var width = 1080,
//     height = 960,
//     centered

var fill = d3.scaleOrdinal(d3.schemeCategory10);

// var nodes = d3.range(1000).map(function(i) {
//   return {index: i, clust: (i%20)};
// });

var force = d3.forceSimulation(nodes)
    .nodes(nodes)
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))
    // .tick()
    .on("tick", tick);

// var minx = 0;
// var maxx = 0;
// var maxy = 0;
// var miny = 0;

//     nodes.forEach(function (o, i) {
//         minx = Math.min(minx, o.x);
//         miny = Math.min(miny, o.y);
//         maxx = Math.max(maxx, o.x);
//         maxy = Math.max(maxy, o.y);
//     });

// var xcenter = (maxx - minx) / 2
// var ycenter = (maxy - miny) / 2

var transform = d3.zoomIdentity.translate(zoomWidth, zoomHeight).scale(scale);

var zoom = d3.zoom()
    .scaleExtent([0.05, 2])
    .on("zoom", zoomed);

var svg = d3.select("div#container").append("svg")
    //.attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", width/2-200 + " " + 0 + " "  + width + " " + height)
    // .classed("svg-content img-fluid", true)
    .attr("width", width)
    .attr("height", height)
    .call(zoom)


    // .call(d3.zoom().on("zoom", function () {
    //       svg.attr("transform", d3.event.transform);
    // }))
    // .append("g");

    .append("svg:g")
    .attr("transform", "translate("+zoomWidth+","+zoomHeight+") scale("+scale+", "+scale+")")
    .call(zoom.transform, transform)
    // .call(zoom)

// var zoomable = svg
//     .append("g")
//     .attr("class", "zoomable")
//     .attr("transform", transform)

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var node = svg
  .selectAll(".node")
    .data(nodes)
  .enter()
  .append("svg:g")
    .attr("class", "node")
  .append("svg:image")
  .attr("xlink:href", function(d) {
    return "http://logo.clearbit.com/" + domain_from_url(d.url);
  })
  .attr("height", 50)
  .attr("width", 50)
  .attr("x", function(d) {
    return d.x;
  })
  .attr("y", function(d) {
    return d.y;
  })
    .attr("r", 30)
  .style("fill", function(d) {
    return fill(d.clust);
  })
  .style("stroke", function(d) {
    return d3.rgb(fill(d.clust)).darker(2);
  })
    // .call(force.drag) // This makes the node draggable
    // .on("zoom", zoomed)
  .on("mouseover", function(d) {
    div.transition().style("opacity", 1);
    div
      .html(
        "<p> Source: " +
          d.sourceName +
          "</p><p> Title: <a href=" +
          d.url +
          ">" +
          d.title +
          "</a></p>"
      )
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 28 + "px")
      .style("visibility", "visible");
        // setTimeout(function(){

        // }, 1000);
    })
  .on("mouseout", function(d) {
    $(function() {
      $(".node").mouseleave(function(e) {
        if (
          !$(e.toElement).hasClass("tooltip") &&
          !$(e.toElement).hasClass("node")
        ) {
          div
            .transition()
                    .duration(50)
                    .style("opacity", 0)
                    .style("pointer-events", null)
            .style("visibility", "hidden");
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

    node.attr("x", function (d) { return d.x; })
        .attr("y", function (d) { return d.y; });
}

function zoomed() {
  d3.selectAll(".node").attr("transform", d3.event.transform);
}

// function resetted() {
//   svg.transition()
//       .duration(750)
//       .call(zoom.transform, d3.zoomIdentity);
// }

// Click to center test

var g = d3.select("g");
console.log(g);
var circles = d3.selectAll("g.node");

function clicked(d) {
  var scale = 1;
  var x = scale * (-d["x"] + 286);
  var y = scale * (-d["y"] + 147.5);
  g.transition()
    .duration(750)
    .attr("transform", "translate(" + x + "," + y + ") scale(" + scale + ")");
}

circles.on("click", d => {
  console.log(d);
  clicked(d);
});

function domain_from_url(url) {
  var result;
  var match;
  if (
    (match = url.match(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
    ))
  ) {
    result = match[1];
    if ((match = result.match(/^[^\.]+\.(.*\..*\..+)$/))) {
      result = match[1];
    }
  }
  return result;
}
