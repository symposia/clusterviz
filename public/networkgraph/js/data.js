d3.json("./data/hw_test.json").then(function(data) {
    console.log(data);
    loadVisualization(data);
    filter(data);
});