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

        this.drawRevenueChart = this.drawRevenueChart.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    updateDimensions()
    {
        this.drawRevenueChart();
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
        this.drawRevenueChart();

        // add an event to redraw the chart on resize
        window.addEventListener("resize", this.updateDimensions);
    }

    componentDidUpdate()
    {
        this.drawRevenueChart();
    }

    drawRevenueChart()
    {
        const data = this.state.revenueMix.data,
            goldenRatio = 1.61803398875;

        // get min & max data values
        let dMax = d3.max(data, d => {
            return d.gmPercent;
        });

        // calculate height & width (using golden ratio)
        const width = document.querySelector('.revenueChart').offsetWidth,
            height = width / goldenRatio;
        const margin = {
            top: 30,
            bottom: 30,
            left: 30,
            right: 30
        };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const radius = Math.min(innerWidth, innerHeight) / 2;

        const color = d3.scaleOrdinal(["#e1f3fb", "#b6e2f5", "#7dcbec", "#52b9e6", "#0092cc"]);

        d3.select(".revenueChart svg").remove();

        let svg = d3.select(".revenueChart").append("svg")
                    .attr("width", width)
                    .attr("height", height);

        let pieBg = svg.append("circle")
                        .classed("revenueChart__pieBg", true)
                        .attr("cx", width / 2 )
                        .attr("cy", height / 2 )
                        .attr("r", radius );
        
        let chart = svg.append("g")
                        .classed("revenueChart__arcs", true)
                        .attr("transform", "translate(" + ( width / 2 ) + "," + ( height / 2 ) + ")");
        
        let pieFg = svg.append("g")
                        .classed("revenueChart__pieFg", true);

        let pie = d3.pie()
            .sort(null)
            .value(d => { return d.revenue; });

        let path = d3.arc()
            .outerRadius( radius )
            .innerRadius(0);

        // add pie arcs to the chart
        let arc = chart.selectAll(".revenueChart__arc")
            .data( pie(data) )
            .enter()
                .append("g")
                .classed("revenueChart__arc", true)
                .on("mouseover", function(d,i){console.log("OVER: " + d.data.name);})
                .on("mouseout", function(d,i){console.log("OUT: " + d.data.name);});;

        arc.append("path")
            .attr("d", path)
            .attr("fill", d => { return color(d.index); });
        
        // add foreground data circle
        pieFg.append("circle")
            .classed("revenueChart__pieFg", true)
            .attr("cx", width / 2 )
            .attr("cy", height / 2 )
            .attr("r", radius / goldenRatio );
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