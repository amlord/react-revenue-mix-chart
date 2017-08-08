let React = require('react');
let { connect } = require('react-redux');

class revenueChart extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            revenueMix: props.revenueMix
        };

        this.drawrevenueChart = this.drawrevenueChart.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    updateDimensions()
    {
        this.drawrevenueChart();
    }

    componentWillReceiveProps( nextProps )
    {
        let { revenueMix } = this.state;

        if( nextProps.revenueMix !== revenueMix )
        {
            this.setState({
                revenueMix: nextProps.revenueMix
            });
        }
    }

    componentDidMount()
    {
        this.drawrevenueChart();

        // add an event to redraw the chart on resize
        window.addEventListener("resize", this.updateDimensions);
    }

    componentDidUpdate()
    {
        this.drawrevenueChart();
    }

    drawrevenueChart()
    {
        const data = this.state.revenueMix,
            goldenRatio = 1.61803398875;

        // get min & max data values
        let dMax = d3.max(data, d => {
            return d.gmPercent;
        });

        // calculate height & width (using golden ratio)
        let width = document.querySelector('.revenueChart').offsetWidth;
        let height = width / goldenRatio;
        let margin = {
            top: 5,
            bottom: 20,
            left: 30,
            right: 10
        };
        let innerWidth = width - margin.left - margin.right;
        let innerHeight = height - margin.top - margin.bottom;

        d3.select(".revenueChart svg").remove();

        let svg = d3.select(".revenueChart").append("svg")
                    .attr("width", width)
                    .attr("height", height);
        
        let chart = svg.append("g")
                        .classed("revenueChart__bars", true)
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        let xAxisGroup = svg.append("g")
                        .classed("revenueChart__axis revenueChart__axis--x", true)
                        .attr("transform", "translate(" + margin.left + "," + ( height - margin.bottom ) + ")");
        
        let yAxisGroup = svg.append("g")
                        .classed("revenueChart__axis revenueChart__axis--y", true)
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let y = d3.scaleLinear()
            .domain([0, dMax])
            .range([innerHeight, 0]);

        let x = d3.scaleBand()
            .domain(data.map(d =>
            {
                return d.name;
            }))
            .range([0, innerWidth]);

        let xAxis = d3.axisBottom(x);
        let yAxis = d3.axisLeft(y);

        let yPos = [];

        // add bars to the chart
        chart.selectAll(".revenueChart__bar")
            .data(data)
            .enter()
                .append("rect")
                .classed("revenueChart__bar", true)
                .attr("x", (d, i) =>
                {
                    return x(d.name) + ( x.bandwidth() * 0.125 );
                })
                .attr("y", (d, i) =>
                {
                    yPos.push( parseFloat(d.value) );

                    // first & last bars
                    if(i === 0 || i === ( data.length - 1 ) )
                    {
                        return y(d.value);
                    }

                    /* bars 'eroding' first bar value (+ve / -ve 
                       depending on cumalative GM% effect) */
                    return ( data[i].gmPercent > data[i-1].gmPercent ) ?
                        y( parseFloat(data[i].gmPercent) ) :
                        y( parseFloat(data[i-1].gmPercent) );
                })
                .attr("width", x.bandwidth() - ( x.bandwidth() * 0.25 ) )
                .attr("height", (d, i) =>
                {
                    return  innerHeight - y(Math.abs(d.value));
                });
        
        // add the axes
        xAxisGroup.call(xAxis);
        yAxisGroup.call(yAxis);
    }

    render()
    {
        return (
            <section className="panel">
                <header className="panelHeader">
                    <h1>Revenue Mix <small>(Last 12 Months)</small></h1>
                </header>
                <div className="panelBody">
                    <div className="revenueChart"></div>
                </div>
            </section>
        );
    }
}

module.exports = revenueChart;