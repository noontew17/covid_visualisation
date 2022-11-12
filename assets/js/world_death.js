function world_map_deaths(placement1, placement2) {
    d3.select(placement1).html("");
    d3.select(placement2).html("");
    // The svg
    var svg = d3.select(placement1)
        width = +svg.attr("width"),
        height = +svg.attr("height");

// Map and projection
    var projection = d3.geoMercator()
        .center([0, 20])                // GPS of location to zoom on
        .scale(150)                       // This is like the zoom
        .translate([width / 2, height / 2])

    let mapJson = d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")  // World shape
    let caseData = d3.csv("assets/data/owid-covid-geo.csv")

    Promise.all([mapJson, caseData]).then(ready_worlddeaths);


    function ready_worlddeaths(data) {
        const geoJson = data[0];
        const caseData = data[1];

        times = d3.utcDays(Date.UTC(2019, 11, 31), Date.UTC(2021, 3, 5))
        const slider = d3.sliderBottom()
            .min(d3.min(times))
            .max(d3.max(times))
            .marks(times)
            .width(500)
            .tickFormat(d3.utcFormat("%Y-%0m-%0d"))
            .tickValues(times)
            .on("onchange", (event) => {

                let format = d3.utcFormat("%Y-%0m-%0d")
                let date = format(event)
                console.log(event, format, date)
                const filteredData = caseData.filter((point) => {
                    return point.date == date;
                })
                console.log(filteredData)
                drawChart(filteredData, caseData, geoJson)
            });


        d3.select('.slider').append('svg')
            .attr("viewBox", [-70, -20, 700, 60])
            .attr("width", 500)
            .attr("height", 70)
            .call(slider)


    }

    function drawChart(filteredData, caseData, geoJson) {
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
            .text('a simple tooltip');
        svg
            .selectAll(".country-shape")
            .data(geoJson.features)
            .enter()
            .append("g")
            .classed('country-shape', true)
            .append("path")

            .attr("fill", "#b8b8b8")
            .attr("d", d3.geoPath()
                .projection(projection)
            )
            .style("stroke", "none")
            .style("opacity", .3)

        // Add a scale for bubble size
        var valueExtent = d3.extent(caseData, function (d) {
            return +d.new_deaths;
        })
        console.log('valueExtent', valueExtent)
        var size = d3.scaleSqrt()
            .domain([0, valueExtent[1]])  // What's in the data
            .range([1, 50])  // Size in pixel

        var staticColor = '#437c90';
        var hoverColor = '#eec42d';
        // var hoverColor = '#eec42d';


        // Add circles:
        let bubbles = svg
            .selectAll(".case-bubbles")
            .data(filteredData, (d) => d.location)
            .join(
                (enter) => enter
                    .append("circle")
                    .classed('case-bubbles', true)
                    .attr("cx", function (d) {
                        return projection([+d.longitude, +d.latitude])[0]
                    })
                    .attr("cy", function (d) {
                        return projection([+d.longitude, +d.latitude])[1]
                    })

                    .attr("stroke", function (d) {
                        if (d.n > 2000) {
                            return "black"
                        } else {
                            return "none"
                        }
                    })
                    .attr("stroke-width", 1)
                    .attr("fill-opacity", .4)
                    .on('mouseover', function (d) {
                        tooltip
                            .html(
                                `<div>Country: ${d.location}</div><div>Deaths: ${d.new_deaths}</div>`
                            )
                            .style('visibility', 'visible');
                        d3.select(this).transition().attr('fill', hoverColor);
                    })
                    .on('mousemove', function () {
                        tooltip
                            .style('top', d3.event.pageY - 10 + 'px')
                            .style('left', d3.event.pageX + 10 + 'px');
                    })
                    .on('mouseout', function () {
                        tooltip.html(``).style('visibility', 'hidden');
                        d3.select(this).transition().attr('fill', staticColor);
                    })
                    .attr("r", function (d) {
                        return size(+d.new_deaths)
                    })

                ,
                update => update
                    .attr("r", function (d) {
                        return size(+d.new_deaths)
                    })
                    .on('mouseover', function (d, i) {
                        tooltip
                            .html(
                                `<div>Country: ${d.location}</div><div>Deaths: ${d.new_deaths}</div>`
                            )
                            .style('visibility', 'visible');
                        d3.select(this).transition().attr('fill', hoverColor);
                    })
                    .on('mousemove', function () {
                        tooltip
                            .style('top', d3.event.pageY - 10 + 'px')
                            .style('left', d3.event.pageX + 10 + 'px');
                    })
                    .on('mouseout', function () {
                        tooltip.html(``).style('visibility', 'hidden');
                        d3.select(this).transition().attr('fill', staticColor);
                    })
                    .attr("r", function (d) {
                        return size(+d.new_deaths)
                    }))


    }
}
