function barchart_deaths(placement) {
    d3.csv("assets/data/countries_deaths_geo.csv").then((data) => {
        d3.select(placement).html("");
        barchart_deaths_render(data, placement)

    })
}

function barchart_deaths_render(data, placement) {


    var margin = {top: 10, right: 75, bottom: 50, left: 190},
        width = 700 - margin.left - margin.right,
        height = 8000 - margin.top - margin.bottom;


    const convertedData = data.map((d) => {
        d.new_deaths = parseInt(d.new_deaths)
        return d;
    })


    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, d3.max(data, function (d) {
            return d.new_deaths;
        })])
        .rangeRound([0, 400]);


    var y = d3.scaleBand()
        .range([0, height])
        // .padding(1)
        .domain(data.map(function (d) {
            return d.location;
        }))
        .paddingInner(0.2)
        .paddingOuter(0.3)
    ;


    var svg = d3.select(placement).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var staticColor = '#437c90';
    var hoverColor = '#eec42d';

    var tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'd3-tooltip')
        .style('position', 'absolute')
        // .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('padding', '10px')
        .style('background', 'rgba(0,0,0,0.6)')
        .style('border-radius', '4px')
        .style('color', '#fff')
        .text(d=>d);


    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", x(0))
        .attr("y", function (d) {
            return y(d.location);
        })
        .attr('width', function (d) {
            return x(d.new_deaths);
        })
        .attr("height", y.bandwidth())
        .on('mouseover', function (d, i) {
            tooltip
                .html(
                    `<div id ="cumbox"> ${d.location}</div><div>Deaths: ${d.new_deaths} <br> 
                    Hospital patients: ${d.hosp_patients} <br> ICU patients:  ${d.icu_patients} <br> 
                    Positive Tests:  ${d.new_tests}   </div>`
                )
                .style('visibility', 'visible');
            // d3.select(this).transition().attr('fill', hoverColor);
        })
        .on('mousemove', function () {
            tooltip
                .style('top', d3.event.pageY - 10 + 'px')
                .style('left', d3.event.pageX + 10 + 'px');
        })
        .on('mouseout', function () {
            tooltip.html(``).style('visibility', 'hidden');
            d3.select(this).transition().attr('fill', staticColor);
        });

    svg.selectAll(".label")
        .data(data)
        .enter().append("text")
        .attr("class", "")
        .attr("dx", function(d) {return x(d.new_deaths) + 10})
        .attr("dy", function (d) {
            return y(d.location) + y.bandwidth()/2
        })
        .attr("alignment-baseline", "middle")
        .text(function(d){ return d3.format(",")(d.new_deaths)})

    svg.append("g")
        .attr("class", "countryaxis")
        .call(d3.axisLeft(y));



}