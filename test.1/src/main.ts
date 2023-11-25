import * as d3 from "d3";

const margin = {top: 30, right: 30, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.csv('/dataset.csv').then((data) => {
    console.log(data[9003])
})


const x = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, width]);

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// add the y Axis
const y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 0.01]);
svg.append("g")
    .call(d3.axisLeft(y));