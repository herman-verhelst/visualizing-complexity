//@ts-nocheck
import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Edition} from "../../models/edition";
import * as d3 from 'd3';

@Component({
  selector: 'app-mountain',
  standalone: true,
  imports: [],
  templateUrl: './mountain.component.html',
  styleUrl: './mountain.component.scss'
})
export class MountainComponent implements OnInit, AfterViewInit {

  @Input({required: true}) edition?: Edition;
  id: string;

  ngOnInit(): void {

    this.id = `graph-${this.edition.edition}`
  }

  ngAfterViewInit() {
    if (this.edition) this.createGraph()
  }


  createGraph(): void {

    const margin = {top: 30, right: 30, bottom: 30, left: 50},
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const svg = d3.select(`#${this.id}`)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    const data = {
      x: [0, 1, 2],
      y: [0, this.edition?.stageWins / this.edition?.totalStages, 0]
    };

    console.log(data)

    /*const xScale = d3.scaleLinear()
      .domain(d3.extent(year, d => d.x))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(year, d => d.y)])
      .range([height, 0]);


    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

    const area = d3.area()
      .x(d => xScale(d.x))
      .y0(() => yScale(0))
      .y1(d => yScale(d.y))
      .curve(d3.curveBumpX)

    svg.selectAll("lines")
      .data(year)
      .join("path")
      .attr("class", "area")
      .attr("stroke-width", 2)
      .attr("fill", 'red')
      .attr("d", area)*/

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data.x))
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    // Create the area generator
    const area = d3.area()
      .x(d => xScale(d[0]))
      .y0(height)
      .y1(d => yScale(d[1]));

    // Combine x and y arrays into a single array of [x, y] pairs
    const combinedData = data.x.map((x, i) => [x, data.y[i]]);

    // Append the area path to the SVG
    svg.append('path')
      .data([combinedData])
      .attr('d', area)
      .attr('fill', 'steelblue');
    
  }
}
