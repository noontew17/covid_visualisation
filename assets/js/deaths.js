function daily_deaths(placement) {
    d3.csv("assets/data/deaths.csv").then((data) => {
        console.log(data);
        d3.select(placement).html("");
        render_deaths(data, placement)
    })


    function render_deaths(data, placement) {

        const parse = d3.timeParse("%Y-%0m-%0d")

        var margin = {top: 10, right: 75, bottom: 50, left: 80},
            width = 460 - margin.left - margin.right,
            height = 310 - margin.top - margin.bottom;


        const convertedData = data.map((d) => {
            d.new_deaths = parseInt(d.new_deaths)
            return d;
        })

        var minDate = _.minBy(convertedData, (d) => parse(d.date))
        var maxDate = _.maxBy(convertedData, (d) => parse(d.date))
        var minDeaths = _.minBy(convertedData, (d) => d.new_deaths)
        var maxDeaths = _.maxBy(convertedData, (d) => d.new_deaths)


        var xScale = d3.scaleTime()
            .domain([parse(minDate.date), parse(maxDate.date)])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([minDeaths.new_deaths, maxDeaths.new_deaths])
            .range([height, 0])

        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(4)
            .tickSizeOuter(0)
            .tickFormat(d3.timeFormat("%B"));


        var yAxis = d3.axisLeft()
            .scale(yScale)
            .tickFormat(d3.format(","))
            .ticks(3)


        var svg = d3.select(placement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "whiteaxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)


        svg.append("g")
            .attr("class", "whiteaxis")
            .call(yAxis)

        const line = d3.line()
            .x(d => xScale(parse(d.date)))
            .y(d => yScale(d.new_deaths))

        const area = d3.area()
            .x(d => xScale(parse(d.date)))
            .y1(d => yScale(d.new_deaths))
            .y0(d => yScale(0))


        svg.append("path")
            .attr("fill", "#AFEEEE")
            .attr("d", area(convertedData))

        svg.append("path")
            .attr("d", line(convertedData))
            .attr("stroke", "#AFEEEE")
            .attr("fill", "none")

        const tooltip = svg.append("g")

        svg.on("touchmove mousemove", function (event) {
            const data = bisect(d3.mouse(this)[0]);
            const new_deaths = data.new_deaths;
            const date = data.date;


            tooltip
                .attr("transform", `translate(${xScale(parse(date))},${yScale(new_deaths)})`)
                .call(callout, `Date: ${date} \nNew Deaths:${new_deaths}`);
        });

        function bisect(mx) {
            const bisect = d3.bisector(d => parse(d.date)).left;

            const date = xScale.invert(mx);

            const index = bisect(convertedData, date, 1);

            const a = convertedData[index - 1];
            const b = convertedData[index];
            return b && (date - a.date > b.date - date) ? b : a;

        }

        function callout(g, value) {
            if (!value) return g.style("display", "none");

            g
                .style("display", null)
                .style("pointer-events", "none")
                .style("font", "10px sans-serif");

            const path = g.selectAll("path")
                .data([null])
                .join("path")
                .attr("fill", "white")
                .attr("stroke", "black");

            const text = g.selectAll("text")
                .data([null])
                .join("text")
                .call(text => text
                    .selectAll("tspan")
                    .data((value + "").split(/\n/))
                    .join("tspan")
                    .attr("x", 0)
                    .attr("y", (d, i) => `${i * 1.1}em`)
                    .style("font-weight", (_, i) => i ? null : "bold")
                    .text(d => d));

            const {x, y, width: w, height: h} = text.node().getBBox();

            text.attr("transform", `translate(${-w / 2},${15 - y})`);
            path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);

        }
    }
}


function cum_deaths(placement) {
    d3.csv("assets/data/deaths.csv").then((data) => {
        d3.select(placement).html("");
        render_cumdeaths(data, placement)
    })

    function render_cumdeaths(data, placement) {

        const parse = d3.timeParse("%Y-%0m-%0d")

        var margin = {top: 10, right: 75, bottom: 50, left: 80},
            width = 460 - margin.left - margin.right,
            height = 310 - margin.top - margin.bottom;

        const convertedData = data.map((d) => {
            d.cum_deaths = parseInt(d.cum_deaths)
            return d;
        })

        var minDate = _.minBy(convertedData, (d) => parse(d.date))
        var maxDate = _.maxBy(convertedData, (d) => parse(d.date))
        var minDeaths = _.minBy(convertedData, (d) => d.cum_deaths)
        var maxDeaths = _.maxBy(convertedData, (d) => d.cum_deaths)

        var xScale = d3.scaleTime()
            .domain([parse(minDate.date), parse(maxDate.date)])
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([minDeaths.cum_deaths, maxDeaths.cum_deaths])
            .range([height, 0])
        //

        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(4)
            .tickSizeOuter(0)
            .tickFormat(d3.timeFormat("%B"));


        var yAxis = d3.axisLeft()
            .scale(yScale)
            .tickFormat(d3.format(","))
            .ticks(3)


        var svg = d3.select(placement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "whiteaxis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)


        svg.append("g")
            .attr("class", "whiteaxis")

            .call(yAxis)

        const line = d3.line()
            .x(d => xScale(parse(d.date)))
            .y(d => yScale(d.cum_deaths))

        const area = d3.area()
            .x(d => xScale(parse(d.date)))
            .y1(d => yScale(d.cum_deaths))
            .y0(d => yScale(0))


        svg.append("path")
            .attr("fill", "#AFEEEE")
            .attr("d", area(convertedData))

        svg.append("path")
            .attr("d", line(convertedData))
            .attr("stroke", "#AFEEEE")
            .attr("fill", "none")

        const tooltip = svg.append("g")

        svg.on("touchmove mousemove", function (event) {
            const data = bisect(d3.mouse(this)[0]);
            const cum_deaths = data.cum_deaths;
            const date = data.date;


            tooltip
                .attr("transform", `translate(${xScale(parse(date))},${yScale(cum_deaths)})`)
                .call(callout, `Date: ${date} \nCumulative Deaths:${cum_deaths}`);
        });

        function bisect(mx) {
            const bisect = d3.bisector(d => parse(d.date)).left;

            const date = xScale.invert(mx);

            const index = bisect(convertedData, date, 1);

            const a = convertedData[index - 1];
            const b = convertedData[index];
            return b && (date - a.date > b.date - date) ? b : a;

        }

        function callout(g, value) {
            if (!value) return g.style("display", "none");

            g
                .style("display", null)
                .style("pointer-events", "none")
                .style("font", "10px sans-serif");

            const path = g.selectAll("path")
                .data([null])
                .join("path")
                .attr("fill", "white")
                .attr("stroke", "black");

            const text = g.selectAll("text")
                .data([null])
                .join("text")
                .call(text => text
                    .selectAll("tspan")
                    .data((value + "").split(/\n/))
                    .join("tspan")
                    .attr("x", 0)
                    .attr("y", (d, i) => `${i * 1.1}em`)
                    .style("font-weight", (_, i) => i ? null : "bold")
                    .text(d => d));

            const {x, y, width: w, height: h} = text.node().getBBox();

            text.attr("transform", `translate(${-w / 2},${15 - y})`);
            path.attr("d", `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);

        }
    }
}