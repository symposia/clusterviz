var nodes = [];
var highlight_trans = 0.1;
// var margin = {top: 20, right: 240, bottom: 20, left: 120},
//     mWidth =  $("#container").outerWidth() - margin.right - margin.left,
//     mHeight = $("#container").outerHeight() - margin.top - margin.bottom;
var width = $("#container").outerWidth();
var height = $("#container").outerHeight();
var scale = 0.25;
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

//	filtered types
var typeFilterList = [];

// _.observe(typeFilterList, function() {
//     console.log("update filtered");
// })

$(".filter-btn").on("click", function() {
    //console.log("filter!");
    set_focus();
})

function set_focus() {
    node.style("opacity", function(o) {
        return typeFilterList.includes(o.sourceName) ? 1: highlight_trans;
    });
}

// var zoom = d3.zoom()
//     .scaleExtent([1, 40])
//     .translateExtent([[-100, -100], [width + 90, height + 100]])
//     .on("zoom", zoomed);

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

var transform = d3.zoomIdentity.translate(0, 300).scale(0.25)

var zoom = d3.zoom()
    .scaleExtent([0.05, 5])
    .on("zoom", zoomed);

var svg = d3.select(".svg-container").append("svg")
//.attr("preserveAspectRatio", "xMinYMin meet")
//.attr("viewBox", width/2 + " " + height/2 + " "  + width + " " + height)
.style("overflow", "scroll")
// .classed("svg-content img-fluid", true)
.attr("width", width)
.attr("height", height)

var gMain = svg.append('g')
.classed('g-main', true);

var rect = gMain.append('rect')
.attr('width', width)
.attr('height', height)
.style('fill', 'white')

var gDraw = gMain.append('g')
//.call(zoom)
.call(zoom.transform, transform)

gMain.call(zoom);
gMain.call(zoom.transform, transform)
//gDraw.call(zoom.transform, d3.zoomIdentity.translate((width/2)-800, 0).scale(0.5))

    // .call(d3.zoom().on("zoom", function () {
    //       svg.attr("transform", d3.event.transform);
    // }))
    // .append("g");


    // .append("svg:g")
    // .attr("transform", "translate("+zoomWidth+","+zoomHeight+") scale("+scale+", "+scale+")")
    // .call(zoom.transform, transform)
    // // .call(zoom)

// var zoomable = svg
//     .append("g")
//     .attr("class", "zoomable")
//     .attr("transform", transform)

var div = d3.select(".col").insert("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var node = gDraw
  .selectAll(".node")
    .data(nodes)
  .enter()
  .append("svg:g")
    .attr("class", "node")
  .append("svg:image")
  .attr("xlink:href", function(d) {
    return "http://logo.clearbit.com/" + domain_from_url(d.url);
  })
  .attr("height", 75)
  .attr("width", 75)
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
  .on("zoom", zoomed)
  .call(d3.drag()
  .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended))
  .on("mouseover", function(d) {
    // div.transition().style("opacity", 1);
    // div
    //   .html(
    //     "<h3>" +
    //       d.sourceName +
    //       "</h3><p><a href=" +
    //       d.url +
    //       ">" +
    //       d.title +
    //       "</a></p>"
    //   )
    //   .style("left", d3.event.pageX - div.style("width").match(/(.*)px/)[1] / 2 + "px")
    //   .style("top", d3.event.pageY - div.style("height").match(/(.*)px/)[1] * 1.5 + "px")
    //   .style("visibility", "visible");
        // setTimeout(function(){

        // }, 1000);
    })
  .on("mouseout", function(d) {
    // $(function() {
    //   $(".node").mouseleave(function(e) {
    //     if (
    //       !$(e.toElement).hasClass("tooltip") &&
    //       !$(e.toElement).hasClass("node")
    //     ) {
    //       div
    //         .transition()
    //                 .duration(50)
    //                 .style("opacity", 0)
    //                 .style("pointer-events", null)
    //         .style("visibility", "hidden");
    //             }
    //         });
    //     });
    })
  .on("click", function(d) {
    if (this.classList.contains("highlighted")) {
      // Zoom Out and remove highlight
      gNodes.transition().duration(750).attr("transform", "");
      this.classList.remove("highlighted")
      // Hide Tooltip
      div.transition()
      .duration(50)
      .style("opacity", 0)
      .style("pointer-events", null);

      div.transition()
      .style('visibility', 'hidden')
    } else {
      // zoom in and highlight node
      selectNode(d)
      var highlightedElements = document.getElementsByClassName("highlighted")
      console.log(highlightedElements)
      if (highlightedElements.length > 0) {
        for (let el of highlightedElements) {
          console.log(el);
          el.classList.remove("highlighted")
        }
      }
      this.classList.add("highlighted");
      //show tooltip
      div.transition().style("opacity", 1);
      div
        .html(
                "<h3>" +
                  d.sourceName +
                  "</h3><p><a href=" +
                  d.url +
                  ">" +
                  d.title +
                  "</a></p>"
        )
        // .style("left", d3.event.pageX - div.style("width").match(/(.*)px/)[1] / 2 + "px")
        // .style("top", d3.event.pageY - div.style("height").match(/(.*)px/)[1] * 1.5 + "px")
        .style("visibility", "visible");
          // setTimeout(function(){

          // }, 1000);
    }
  });


div.on("mouseover", function() {
        div.style("pointer-events", null);
    })
    .on("mouseleave", function () {
        // div.transition()
        // .duration(50)
        // .style("opacity", 0)
        // .style("pointer-events", null);

        // div.transition()
        //     .style('visibility', 'hidden');
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
    if (gDraw) {
        gDraw.attr("transform", d3.event.transform);
    }
}

// function resetted() {
//   svg.transition()
//       .duration(750)
//       .call(zoom.transform, d3.zoomIdentity);
// }

// Click to center test

var g = d3.select("g.node-container");
console.log(g);
var gNodes = d3.selectAll("g.node");

function selectNode(d) {
  var s = 4
  var x = s * (-d["x"] + 523);
  var y = s * (-d["y"] + 106);
  gNodes.transition()
    .duration(750)
    .attr("transform", "translate(" + x + "," + y + ") scale(" + s + ")");
}

// gNodes.on("click", d => {
//   selectNode(d);
// });

function highlight(d) {
  d.attr("class", "highlighted")
}

 function removeClass(d) {
  d.attr("class", null)
}

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

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.9).restart();

      if (!d.selected && !shiftKey) {
          // if this node isn't selected, then we have to unselect every other node
          node.classed("selected", function(p) { return p.selected =  p.previouslySelected = false; });
      }

      d3.select(this).classed("selected", function(p) { d.previouslySelected = d.selected; return d.selected = true; });

      node.filter(function(d) { return d.selected; })
      .each(function(d) { //d.fixed |= 2;
        d.fx = d.x;
        d.fy = d.y;
      })

  }

  function dragged(d) {
    //d.fx = d3.event.x;
    //d.fy = d3.event.y;
          node.filter(function(d) { return d.selected; })
          .each(function(d) {
              d.fx += d3.event.dx;
              d.fy += d3.event.dy;
          })
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
      node.filter(function(d) { return d.selected; })
      .each(function(d) { //d.fixed &= ~6;
          d.fx = null;
          d.fy = null;
      })
  }
