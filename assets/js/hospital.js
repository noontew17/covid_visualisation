function daily_hospital(placement) {
    d3.csv("assets/data/hospital.csv").then((data) => {
        console.log(data);
        d3.select(placement).html("");
        render_hosp(data, placement)
    })
}


function render_hosp(data, placement) {

    const parse = d3.timeParse("%Y-%0m-%0d")

    // var year_scale = d3.scaleLinear().domain([0,1000]);
    // console.log(year_scale(10))
    var margin = {top: 10, right: 75, bottom: 50, left: 80},
        width = 460 - margin.left - margin.right,
        height = 310 - margin.top - margin.bottom;


    const convertedData = data.map((d) => {
        d.hosp_patients = parseInt(d.hosp_patients)
        d.icu = parseInt(d.icu)
        return d;
    })

    var minDate = _.minBy(convertedData, (d) => parse(d.date))
    var maxDate = _.maxBy(convertedData, (d) => parse(d.date))
    var minHosp = _.minBy(convertedData, (d) => d.hosp_patients)
    var maxHosp = _.maxBy(convertedData, (d) => d.hosp_patients)


    var xScale = d3.scaleTime()
        .domain([parse(minDate.date), parse(maxDate.date)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([minHosp.hosp_patients, maxHosp.hosp_patients])
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

    const line_hospital = d3.line()
        .x(d => xScale(parse(d.date)))
        .y(d => yScale(d.hosp_patients))

    const line_icu = d3.line()
        .x(d => xScale(parse(d.date)))
        .y(d => yScale(d.icu))

    const area_hosp = d3.area()
        .x(d => xScale(parse(d.date)))
        .y1(d => yScale(d.hosp_patients))
        .y0(d => yScale(0))

    const area_icu = d3.area()
        .x(d => xScale(parse(d.date)))
        .y1(d => yScale(d.icu))
        .y0(d => yScale(0))

    svg.append("path")
        .attr("fill", "#AFEEEE")
        .attr("d", area_hosp(convertedData))

    svg.append("path")
        .attr("d", line_hospital(convertedData))
        .attr("stroke", "#AFEEEE")
        .attr("fill", "none")

    svg.append("path")
        .attr("fill", "#40E0D0")
        .attr("d", area_icu(convertedData))

    svg.append("path")
        .attr("d", line_icu(convertedData))
        .attr("stroke", "#40E0D0")
        .attr("fill", "none")
    const tooltip = svg.append("g")


    svg.on("touchmove mousemove", function (event) {
        const data = bisect(d3.mouse(this)[0]);
        const hosp_patients = data.hosp_patients;
        const icu = data.icu;
        const date = data.date;
        tooltip
            .attr("transform", `translate(${xScale(parse(date))},${yScale(hosp_patients)})`)
            .call(callout, `Date: ${date} \nHospital patients:${hosp_patients}\nICU patients:${icu}`);
    });

    function bisect(mx) {
        const bisect = d3.bisector(d => parse(d.date)).left;

        const date = xScale.invert(mx);

        const index = bisect(convertedData, date, 1);
        console.log('bisect', date, index);
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


function cum_hospital(placement) {
    d3.csv("assets/data/hospital.csv").then((data) => {
        console.log(data);
        d3.select(placement).html("");
        render_cumhosp(data, placement)
    })
}

function render_cumhosp(data, placement) {

    const parse = d3.timeParse("%Y-%0m-%0d")

    var margin = {top: 10, right: 75, bottom: 50, left: 80},
        width = 460 - margin.left - margin.right,
        height = 310 - margin.top - margin.bottom;

    const convertedData = data.map((d) => {
        d.cum_hosp_patients = parseInt(d.cum_hosp_patients)
        d.cum_icu = parseInt(d.cum_icu)
        return d;
    })

    var minDate = _.minBy(convertedData, (d) => parse(d.date))
    var maxDate = _.maxBy(convertedData, (d) => parse(d.date))
    var minHosp = _.minBy(convertedData, (d) => d.cum_hosp_patients)
    var maxHosp = _.maxBy(convertedData, (d) => d.cum_hosp_patients)


    var xScale = d3.scaleTime()
        .domain([parse(minDate.date), parse(maxDate.date)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([minHosp.cum_hosp_patients, maxHosp.cum_hosp_patients])
        .range([height, 0])
    //

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(8)
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

    const line_hospital = d3.line()
        .x(d => xScale(parse(d.date)))
        .y(d => yScale(d.cum_hosp_patients))

    const line_icu = d3.line()
        .x(d => xScale(parse(d.date)))
        .y(d => yScale(d.cum_icu))

    const area_hosp = d3.area()
        .x(d => xScale(parse(d.date)))
        .y1(d => yScale(d.cum_hosp_patients))
        .y0(d => yScale(0))

    const area_icu = d3.area()
        .x(d => xScale(parse(d.date)))
        .y1(d => yScale(d.cum_icu))
        .y0(d => yScale(0))

    svg.append("path")
        .attr("fill", "#AFEEEE")
        .attr("d", area_hosp(convertedData))

    svg.append("path")
        .attr("d", line_hospital(convertedData))
        .attr("stroke", "#AFEEEE")
        .attr("fill", "none")

    svg.append("path")
        .attr("fill", "#40E0D0")
        .attr("d", area_icu(convertedData))

    svg.append("path")
        .attr("d", line_icu(convertedData))
        .attr("stroke", "#40E0D0")
        .attr("fill", "none")
    const tooltip = svg.append("g")


    svg.on("touchmove mousemove", function (event) {
        const data = bisect(d3.mouse(this)[0]);
        const hosp_patients = data.cum_hosp_patients;
        const icu = data.cum_icu;
        const date = data.date;
        tooltip
            .attr("transform", `translate(${xScale(parse(date))},${yScale(hosp_patients)})`)
            .call(callout, `Date: ${date} \nCumulative\n Hospital patients:${hosp_patients}\n ICU patients:${icu}`);
    });

    function bisect(mx) {
        const bisect = d3.bisector(d => parse(d.date)).left;

        const date = xScale.invert(mx);

        const index = bisect(convertedData, date, 1);
        console.log('bisect', date, index);
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