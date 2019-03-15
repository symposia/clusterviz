d3.json("./data/venezuela.json").then(function(data) {
//d3.json("./data/US-Shutdown.json").then(function(data) {
//d3.json("./data/hw_test.json").then(function(data) {
    console.log(data);
    loadVisualization(data);
    filter(data);
});
