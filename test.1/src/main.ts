//@ts-nocheck
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


d3.json('/formatted-data.json').then((data: any) => {
    console.log(data)
    const usa = data.find((data: any) => data.noc === 'CHN')
    const years = usa.years.filter(data => data.season === 'Summer')
    console.log(years)

    const xScale = d3.scaleLinear()
        .domain(d3.extent(years, d => d.year))
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(years, d => d.g + d.s + d.b) ])
        .range([height, 0])

    svg.append("g")
        .call(d3.axisLeft(yScale));

    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "area-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", yScale(0))
        .attr("x2", 0).attr("y2", yScale(d3.max(years, d => d.g + d.s + d.b)));

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#e08484");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#b41a1a");

    const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.g + d.s + d.b));

    const area = d3.area()
        .x(d => xScale(d.year))
        .y0(d => yScale(0))
        .y1(d => yScale(d.g + d.s + d.b))
        .curve(d3.curveBumpX)

    svg.selectAll("lines")
        .data([years])
        .join("path")
        .attr("class", "area")
        .attr("stroke-width", 2)
        .attr("fill", "url(#area-gradient)")
        .attr("d", area)
})
