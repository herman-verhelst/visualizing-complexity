//@ts-nocheck
import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';
import {Edition} from "../../models/edition";
import * as d3 from 'd3';
import {convertRemToPixels} from "../../utils/units";

@Component({
  selector: 'app-mountain',
  standalone: true,
  imports: [],
  templateUrl: './mountain.component.html',
  styleUrl: './mountain.component.scss'
})
export class MountainComponent implements OnInit, AfterViewInit {

  @Input({required: true}) edition?: Edition;
  @Input({required: true}) margins: { min: number, max: number }

  stagesId: string;
  leadId: string;
  marginId: string;

  firstName: string;
  lastName: string;

  mountainSize: number = 5;
  marginSpacingLeft: number = this.mountainSize * 2;

  baseColor1: string = '#605D5280';
  baseColor2: string = '#1F1E1C80';
  graphColor1: string = '#E9E7E0';
  graphColor2: string = '#54534F';
  graphBorderColor: string = '#929085';

  constructor(private element: ElementRef) {
  }

  ngOnInit(): void {
    this.stagesId = `graph-stages-${this.edition?.edition}`;
    this.leadId = `graph-lead-${this.edition?.edition}`;
    this.marginId = `graph-margin-${this.edition?.edition}`;

    const nameArray = this.edition?.winner.name.split(' ');
    this.firstName = nameArray[0]
    this.lastName = nameArray.slice(1).join(' ');
  }

  ngAfterViewInit() {
    if (this.edition) {
      this.createGraph()
      this.createMargin()
    }
  }

  createMargin() {
    const svgContainer = this.element.nativeElement.querySelector('.mountain__margin')

    const
      remWidth = convertRemToPixels(1),
      containerWidth = svgContainer.offsetWidth,
      calculatedFactor = (containerWidth - this.marginSpacingLeft * remWidth) / this.margins.max

    const margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = svgContainer.offsetWidth - 2 * parseFloat(window.getComputedStyle(svgContainer).paddingLeft) - margin.left - margin.right,
      height = convertRemToPixels(.75) - margin.top - margin.bottom;

    const svg = d3.select(`#${this.marginId}`)
      .append("svg")
      .style('overflow', 'visible')
      .attr("width", width)
      .attr("height", height);

    this.createMarginGradient(svg)
    this.createGraphGradient(svg)
    this.createShadow(svg)

    svg.append("rect")
      .attr("x", remWidth * this.marginSpacingLeft)
      .attr("y", 0)
      .attr("rx", height / 2)
      .attr("ry", height / 2)
      .attr("width", calculatedFactor * this.edition?.marginNumber)
      .attr("height", height)
      .attr('fill', 'url(#graphGradient)')
      .attr('stroke', this.graphBorderColor)
      .attr('stroke-width', 1)
      .style("filter", "url(#area-shadow)");

    svg.append("rect")
      .attr("x", 0)
      .attr("y", height - 1)
      .attr("width", calculatedFactor * this.edition?.marginNumber + this.marginSpacingLeft * remWidth)
      .attr("height", 1)
      .attr('fill', 'red')
      .attr('stroke', this.graphBorderColor)
      .attr('stroke-width', 1);
  }

  createGraph(): void {
    const margin = {top: 0, right: 0, bottom: 0, left: 0},
      width = convertRemToPixels(this.mountainSize) - margin.left - margin.right,
      height = convertRemToPixels(this.mountainSize) - margin.top - margin.bottom;

    const stagesSvg = d3.select(`#${this.stagesId}`)
      .append("svg")
      .style('overflow', 'visible')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    const leadSvg = d3.select(`#${this.leadId}`)
      .append("svg")
      .style('overflow', 'visible')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    const stagesData = [
      {x: 0, y: 0},
      {
        x: 1,
        y: isNaN(this.edition?.stageWins / this.edition?.totalStages) ? 0 : this.edition?.stageWins / this.edition?.totalStages
      },
      {x: 2, y: 0}
    ];

    const leadData = [
      {x: 0, y: 0},
      {
        x: 1,
        y: isNaN(this.edition?.stagesLed / this.edition?.totalStages) ? 0 : this.edition?.stagesLed / this.edition?.totalStages
      },
      {x: 2, y: 0}
    ];


    let base = [
      {x: 0, y: 0},
      {x: 1, y: 1},
      {x: 2, y: 0}
    ];

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(stagesData, d => d.x)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    const area = d3.area()
      .x(d => xScale(d.x))
      .y0(height)
      .y1(d => yScale(d.y))
      .curve(d3.curveCardinal.tension(0.4));

    this.createBaseGradient(stagesSvg)
    this.createBaseGradient(leadSvg)
    this.createGraphGradient(stagesSvg)
    this.createGraphGradient(leadSvg)
    this.createShadow(stagesSvg)
    this.createShadow(leadSvg)

    stagesSvg.append('path')
      .datum(base)
      .attr('d', area)
      .attr('fill', 'url(#baseGradient)')
      .attr('fill-opacity', 0.2)

    leadSvg.append('path')
      .datum(base)
      .attr('d', area)
      .attr('fill', 'url(#baseGradient)')
      .attr('fill-opacity', 0.2)

    stagesSvg.append('path')
      .datum(stagesData)
      .attr('d', area)
      .attr('fill', 'url(#graphGradient)')
      .attr('stroke', this.graphBorderColor)
      .attr('stroke-width', 1)
      .style("filter", "url(#area-shadow)");

    leadSvg.append('path')
      .datum(leadData)
      .attr('d', area)
      .attr('fill', 'url(#graphGradient)')
      .attr('stroke', this.graphBorderColor)
      .attr('stroke-width', 1)
      .style("filter", "url(#area-shadow)");
  }

  private createBaseGradient(svg) {
    const baseGradient = svg.append('defs')
      .append("linearGradient")
      .attr("id", "baseGradient")
      .attr("gradientTransform", "rotate(90)");

    baseGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", this.baseColor1);

    baseGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", this.baseColor2);
  }


  private createGraphGradient(svg) {
    const graphGradient = svg.append('defs')
      .append("linearGradient")
      .attr("id", "graphGradient")
      .attr("gradientTransform", "rotate(90)");

    graphGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", this.graphColor1);

    graphGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", this.graphColor2);
  }

  private createMarginGradient(svg) {
    const graphGradient = svg.append('defs')
      .append("linearGradient")
      .attr("id", "marginGradient")
      .attr("gradientTransform", "rotate(90)");

    graphGradient.append("stop")
      .attr("offset", "-100%")
      .attr("stop-color", this.graphColor1);

    graphGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", this.graphColor2);
  }

  private createShadow(svg) {
    svg.append("defs").append("filter")
      .attr("id", "area-shadow")
      .append("feDropShadow")
      .attr("dx", 0)
      .attr("dy", 0)
      .attr("stdDeviation", 4)
      .attr("flood-color", "rgba(25, 23, 20, 0.32)");
  }
}
