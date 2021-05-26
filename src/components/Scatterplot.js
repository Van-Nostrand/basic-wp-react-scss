import React, {useState, useEffect, useRef} from "react";
import "../scss/main.scss";
import axios from "axios";
import * as d3 from "d3";
import {birthdata} from "./constants";

const Scatterplot = (props) => {

  let SVGref = useRef(null);


  useEffect(() => {
    const width = 500;
    const height = 500;
    const padding = 30;

    let yScale = d3.scaleLinear()
        .domain(d3.extent(birthdata, d => d.lifeExpectancy))
        .range([height - padding, padding]);
    
    let xScale = d3.scaleLinear()
        .domain(d3.extent(birthdata, d => d.births / d.population))
        .range([padding, width - padding]);
    
    
    let xAxis = d3.axisBottom(xScale)
        .tickSize(-height + 2 * padding)
        .tickSizeOuter(0);

    let yAxis = d3.axisLeft(yScale)
        .tickSize(-width + 2 * padding)
        .tickSizeOuter(0);

    let colorScale = d3.scaleLinear()
        .domain(d3.extent(birthdata, d => d.population / d.area))
        .range(['ligntgreen', 'black']);

    let radiusScale = d3.scaleLinear()
        .domain(d3.extent(birthdata, d => d.births))
        .range([2, 40]);

    d3.select(SVGref.current)
      .append('g')
        .attr('transform', `translate(0, ${height - padding})`)
        .call(xAxis);

    d3.select(SVGref.current)
      .append('g')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis);

    d3.select(SVGref.current)
        .attr('width', width)
        .attr('height', height)
      .selectAll('circle')
      .data(birthdata)
      .enter()
      .append('circle')
        .attr('cx', d => xScale(d.births / d.population))
        .attr('cy', d => yScale(d.lifeExpectancy))
        .attr('fill', d => colorScale(d.population / d.area))
        .attr('r', d => radiusScale(d.births))
        .attr('id', d => d.region);

    d3.select(SVGref.current)
      .append('text')
        .attr('x', width / 2)
        .attr('y', height - padding)
        .attr('dy', '1.5em')
        .style('text-anchor', 'middle')
        .text('Births per Capita');

    d3.select(SVGref.current)
      .append('text')
        .attr('x', width / 2)
        .attr('y', padding)
        .style('text-anchor', 'middle')
        .style('font-size', '1.5em')
        .text('Data on Births by Country in 2011');

    d3.select('svg')
      .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', - height / 2)
        .attr('y', padding)
        .attr('dy', '-1.1em')
        .style('text-anchor', 'middle')
        .text('Life Expectancy');
  },[]);

  return(
    <div>
      <svg 
        ref={SVGref}
        version="1.1"
        baseProfile="full"
        xmlns="http://www.w3.org/2000/svg" >
      </svg>
    </div>
  )
}

export default Scatterplot;

/**
 * http://HOST[:PORT]/PATH/athena/INSTANCE/[DIMENSION[/CODE[,CODE2[,CODEn]][.EXTENSION][?QUERY_PARAMETERS]]]
 * 
 * 
 *  region: "Albania", 
    births: 41000, 
    population: 3215988, 
    area: 27400, 
    lifeExpectancy: 77 
 */