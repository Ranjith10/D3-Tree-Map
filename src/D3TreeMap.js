import React, {useEffect} from 'react'
import * as d3 from 'd3'

import './D3TreeMap.css';

const data = [
    {"market":"Origin","growthPercent":"","marketId":"","volume":"","parent":""},
    {"market":"DT_Central","growthPercent":35.58,"marketId":5,"volume":555,"parent":"Origin"},
    {"market":"DT_HCME","growthPercent":26.44,"marketId":6,"volume":1439,"parent":"Origin"},
    {"market":"DT_MKD","growthPercent":4.14,"marketId":7,"volume":757,"parent":"Origin"},
    {"market":"DT_North","growthPercent":15.65,"marketId":8,"volume":3275,"parent":"Origin"},
    {"market":"GT","growthPercent":16.57,"marketId":9,"volume":5952,"parent":"Origin"}
]

const getHeatMap = (data) => {
    //Remove the chart on each mount and re-draw the chart
    // d3.select("#generalization-heatmap").remove();

    //Set margin, height, width
    const margin = {top: 10, right: 0, bottom: 10, left: 0}
    const width = 510 - margin.left - margin.right
    const height = 350 - margin.top - margin.bottom
    
    //Select the SVG and define height and width
    var svg = d3.select('#d3-tree-map')
                .append('svg')
                .attr('id','generalization-heatmap')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr(`transform`, `translate(${margin.left},${margin.top})`)

    // stratify the data: reformatting for d3.js Tree map
    const root = d3.stratify()
                    .id(function(d) { return d.market; })   
                    .parentId(function(d) { return d.parent; })(data);
    
    root.sum(function(d) { return +Math.abs(d.volume) }) 

    //d3.treemap computes the position of each element of the hierarchy
    //The coordinates are added to the root object above
    d3.treemap()
        .size([width, height])
        .padding(4)(root)

    //Add rects to the SVG                         
    const rect = svg
                .selectAll('rect')
                .data(root.leaves())
                
    rect.enter()
        .append('rect')
        .attr('class', 'heat-map-cluster')
        .attr('x', function (d) { return d.x0 })
        .attr('y', function (d) { return d.y0 })
        .attr('width', function (d) { return d.x1 - d.x0 })
        .attr('height', function (d) { return d.y1 - d.y0 })
        .style("fill", function(d) {
            return '#cee9f6';
        })
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
   //Add the text labels
    svg
    .selectAll('text')
    .data(root.leaves())
    .enter()
    .append('text')
        .attr('x', function(d){ return (d.x0+d.x1)/2})    
        .attr('y', function(d){ return (d.y0+d.y1)/2})    
        .text(function(d){  
            if(d.x1 - d.x0 < 50) {
                return d.data.market.substr(0,1)+'..'
            } else {
                return d.data.market
            }
        })
        .attr('class', 'heat-map-cluster-text')
        .append("svg:title")
        .text(function(d){return d.data.market});
    
    //Handle mouse over 
    function handleMouseOver(d) {
        d3.select(this).transition().duration(300).style('opacity', 1).style('fill', '#74BFE3')
        .style('cursor', 'pointer')
    }
    function handleMouseOut(d) {
        d3.select(this).transition().duration(300).style('opacity', 1)
        .style('fill', '#cee9f6')
        .style('cursor', 'pointer')
    }
}

const D3TreeMap = () => {

    useEffect(() => {
        getHeatMap(data)
    }, [])

    return (
        <React.Fragment>
            <div id = 'd3-tree-map'>
            </div>
        </React.Fragment>
    )
}

export default D3TreeMap;