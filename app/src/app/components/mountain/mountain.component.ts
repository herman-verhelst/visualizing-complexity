//@ts-nocheck
import {AfterViewInit, Component, ElementRef, HostListener, Input, OnChanges, OnInit} from '@angular/core';
import {Edition} from "../../models/edition";
import * as d3 from 'd3';
import {calculateAverageSpeed, convertRemToPixels} from "../../utils/units";
import {NgClass, NgStyle} from "@angular/common";
import {v4 as uuidv4} from 'uuid';
import gsap from 'gsap';
import {ScrollTrigger} from "gsap/ScrollTrigger";
import * as lookup from 'country-code-lookup'

@Component({
  selector: 'app-mountain',
  standalone: true,
  imports: [
    NgClass,
    NgStyle
  ],
  templateUrl: './mountain.component.html',
  styleUrl: './mountain.component.scss'
})
export class MountainComponent implements OnInit, AfterViewInit, OnChanges {

  @Input hoverable: boolean = true;
  @Input movable: boolean = true;
  @Input changeCount: number = 0;
  @Input({required: true}) edition?: Edition;
  @Input({required: true}) margins: { min: number, max: number } | undefined

  flag: string = '';
  flagAlt: string = '';

  stagesId: string;
  leadId: string;
  marginId: string;
  cardId: string;

  mountainSize: number = 5;
  marginSpacingLeft: number = this.mountainSize * 2;

  baseColor1: string = '#605D5280';
  baseColor2: string = '#1F1E1C80';
  graphColor1: string = '#E9E7E0';
  graphColor2: string = '#54534F';
  graphBorderColor: string = '#929085';

  graphAnimationDuration: number = 500;

  extraInfoVisible: boolean = false

  finishedFirstRender: boolean = false;
  triggeredCard: boolean = false;
  leadExplanationVisible: boolean = false;
  winExplanationVisible: boolean = false;

  averageSpeed: number = 0;

  constructor(private element: ElementRef) {
  }

  ngOnInit(): void {
    const uuid = uuidv4()
    this.stagesId = `graph-stages-${uuid}`;
    this.leadId = `graph-lead-${uuid}`;
    this.marginId = `graph-margin-${uuid}`;
    this.cardId = `card-${uuid}`;

    this.flag = `assets/flags/${lookup.byCountry(this.edition?.winner.nationality).iso2}.svg`;
    this.flagAlt = `Flag of ${this.edition?.winner.nationality}`;
    
    this.averageSpeed = this.edition?.time.hours ? Math.round(calculateAverageSpeed(this.edition) * 100) / 100 : 0;
  }

  ngAfterViewInit() {
    if (this.edition) {
      this.createGsapAnimations();
    }
    this.finishedFirstRender = true;
  }

  ngOnChanges() {
    ScrollTrigger.getAll().forEach(trigger => {
      trigger.refresh();
    });

    if (this.finishedFirstRender && this.triggeredCard) {
      d3.select(`#${this.marginId} > svg`).remove();
      this.createMargin();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (!this.triggeredCard) return;

    d3.select(`#${this.marginId} > svg`).remove();
    this.createMargin();
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

    const rect = svg.append("rect")
      .attr("x", remWidth * this.marginSpacingLeft)
      .attr("y", 0)
      .attr("rx", height / 2)
      .attr("ry", height / 2)
      .attr("width", 0)
      .attr("height", height)
      .attr('fill', 'url(#graphGradient)')
      .attr('stroke', this.graphBorderColor)
      .attr('stroke-width', 1)
      .style("filter", "url(#area-shadow)");

    rect.transition()
      .duration(this.graphAnimationDuration)
      .ease(d3.easeCubicInOut)
      .attr("width", calculatedFactor * this.edition?.marginNumber)

    const border = svg.append("rect")
      .attr("x", 0)
      .attr("y", height - 1)
      .attr("width", this.marginSpacingLeft * remWidth)
      .attr("height", 1)
      .attr('stroke', this.graphBorderColor)
      .attr('stroke-width', 1);

    border.transition()
      .duration(this.graphAnimationDuration)
      .ease(d3.easeCubicInOut)
      .attr("width", calculatedFactor * this.edition?.marginNumber + this.marginSpacingLeft * remWidth)
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

    let ground = [
      {x: 0, y: 0},
      {x: 1, y: 0},
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
      .style("filter", "url(#area-shadow)")
      .transition()
      .duration(this.graphAnimationDuration)
      .attr('d', area)
      .attrTween('d', function () {
        const interpolate = d3.interpolateArray(ground, stagesData);
        const easing = d3.easeCubicInOut;
        return function (t) {
          t = easing(t);
          return area(interpolate(t));
        };
      });

    leadSvg.append('path')
      .datum(leadData)
      .attr('fill', 'url(#graphGradient)')
      .attr('stroke', this.graphBorderColor)
      .attr('stroke-width', 1)
      .style("filter", "url(#area-shadow)")
      .transition()
      .duration(this.graphAnimationDuration)
      .attr('d', area)
      .attrTween('d', function () {
        const interpolator = d3.interpolateArray(ground, leadData);
        const easing = d3.easeQuadOut;
        return function (t) {
          t = easing(t);
          return area(interpolator(t));
        };
      })
  }

  revealInformation() {
    this.extraInfoVisible = !this.extraInfoVisible;
  }

  private createGsapAnimations(): void {
    if (this.movable) {
      gsap.fromTo(
        `#${this.cardId}`,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: `#${this.cardId}`,
            start: "top 95%",
            end: "bottom top",
            toggleActions: "play reverse restart reverse",
          },
          duration: .1
        }
      );
    }

    ScrollTrigger.create({
      trigger: `#${this.cardId}`,
      start: "top 95%",
      end: "bottom top",
      onEnter: () => {
        if (!this.triggeredCard) {
          this.createGraph()
          this.createMargin()
        }
        this.triggeredCard = true;
      },
      onLeave: () => {
        d3.select(`#${this.leadId} > svg`).remove();
        d3.select(`#${this.stagesId} > svg`).remove();
        d3.select(`#${this.marginId} > svg`).remove();
        this.triggeredCard = false;
      },
      onEnterBack: () => {
        if (!this.triggeredCard) {
          this.createGraph()
          this.createMargin()
        }
        this.triggeredCard = true;
      },
      onLeaveBack: () => {
        d3.select(`#${this.leadId} > svg`).remove();
        d3.select(`#${this.stagesId} > svg`).remove();
        d3.select(`#${this.marginId} > svg`).remove();
        this.triggeredCard = false;
      },
    })
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
