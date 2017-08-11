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
            totals = this.state.revenueMix.totals,
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

        const targetRadiusGap = 12;
        const targetRadius = ( Math.min(innerWidth, innerHeight) / 2 );
        const radius = targetRadius - targetRadiusGap;

        const color = d3.scaleOrdinal(["#e1f3fb", "#b6e2f5", "#7dcbec", "#52b9e6", "#0092cc"]);

        d3.select(".revenueChart svg").remove();

        let svg = d3.select(".revenueChart").append("svg")
                    .classed("revenueChart__canvas", true)
                    .attr("width", width)
                    .attr("height", height);

        let pieBg = svg.append("circle")
                        .classed("revenueChart__pieBg", true)
                        .attr("cx", width / 2 )
                        .attr("cy", height / 2 )
                        .attr("r", radius );
        
        let targetChart = svg.append("g")
                        .classed("revenueChart__targetArcs", true)
                        .attr("transform", "translate(" + ( width / 2 ) + "," + ( height / 2 ) + ")");

        let targetPieBg = svg.append("circle")
                        .classed("revenueChart__targetPieBg", true)
                        .attr("cx", width / 2 )
                        .attr("cy", height / 2 )
                        .attr("r", targetRadius - ( targetRadiusGap / 2 ) );
        
        let chart = svg.append("g")
                        .classed("revenueChart__arcs", true)
                        .attr("transform", "translate(" + ( width / 2 ) + "," + ( height / 2 ) + ")");
        
        let pieFg = svg.append("g")
                        .classed("revenueChart__pieFg", true);
        
        let segmentLabels = svg.append("g")
                        .classed("revenueChart__segmentLabels", true);
        
        let averageLabel = svg.append("g")
                        .classed("revenueChart__averageLabel", true)
                        .attr("display", "none");

        // add pie arcs to the chart
        let pie = d3.pie()
            .sort(null)
            .value(d => { return d.revenue; });

        let path = d3.arc()
            .outerRadius( radius )
            .innerRadius(0);

        let dealerPieData = pie( data );

        let arc = chart.selectAll(".revenueChart__arc")
            .data( dealerPieData )
            .enter()
                .append("g")
                .attr("class", d => { return "revenueChart__arc revenueChart__arc--" + d.data.name.toLowerCase() })
                .on("mouseover", function(d,i){
                    d3.selectAll(".revenueChart__arc path").attr("fill","#e5e5e5");
                    d3.selectAll(".revenueChart__arc--" + d.data.name.toLowerCase()  + " path").attr("fill","#666");
                    d3.select(".revenueChartLabel__type").text( d.data.name );
                    d3.select(".revenueChartLabel__revenueValue").text( formatCurrency( d.data.revenue ) );
                    d3.select(".revenueChartLabel__gmBg").attr( "fill", gmPercentColour( d.data.gmPercent ) );
                    d3.select(".revenueChartLabel__gmPercent").text( formatGM( d.data.gmPercent ) );

                    d3.selectAll(".revenueChart__targetArc--" + d.data.name.toLowerCase())
                        .classed("revenueChart__targetArc--visible", true);
                    
                    d3.selectAll(".revenueChart__segmentLabels")
                        .attr("display", "none");

                    d3.selectAll(".revenueChart__averageLabel")
                        .attr("display", "block");
                })
                .on("mouseout", function(d,i){
                    d3.selectAll(".revenueChart__arc path").attr("fill", d => { return color(d.index); });
                    d3.select(".revenueChartLabel__type").text( totals.displayName );
                    d3.select(".revenueChartLabel__revenueValue").text( formatCurrency( totals.revenue ) );
                    d3.select(".revenueChartLabel__gmBg").attr( "fill", gmPercentColour( totals.gmPercent ) );
                    d3.select(".revenueChartLabel__gmPercent").text( formatGM( totals.gmPercent ) );

                    d3.selectAll(".revenueChart__targetArc--" + d.data.name.toLowerCase())
                        .classed("revenueChart__targetArc--visible", false);
                    
                    d3.selectAll(".revenueChart__segmentLabels")
                        .attr("display", "block");

                    d3.selectAll(".revenueChart__averageLabel")
                        .attr("display", "none");
                });

        arc.append("path")
            .attr("d", path)
            .attr("fill", d => { return color(d.index); });

        // add industry average target pie arcs to the chart
        let targetPie = d3.pie()
            .sort(null)
            .value(d => { return d.industryRevenue; });

        let targetPath = d3.arc()
            .outerRadius( targetRadius )
            .innerRadius(0);

        let industryPieData = targetPie( data );

        let targetArc = targetChart.selectAll(".revenueChart__targetArc")
            .data( industryPieData.map( (d,i) =>
            {
                const angleSize = d.endAngle - d.startAngle;

                d.startAngle = dealerPieData[i].startAngle;
                d.endAngle = d.startAngle + angleSize;

                return d;
            } ) )
            .enter()
                .append("g")
                .attr("class", d => { return "revenueChart__targetArc revenueChart__targetArc--" + d.data.name.toLowerCase() });

        targetArc.append("path")
            .attr("d", targetPath);

        targetArc.append("line")
            .classed("revenueChart__targetLineEnd", true)
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", d => { return (targetRadius + 5) * Math.sin(d.endAngle); })
            .attr("y2", d => { return (targetRadius + 5) * Math.cos(d.endAngle) * -1; });

        targetArc.append("text")
            .classed("revenueChart__industryAverageText", true)
            .text( d => { return d.data.industryRevenuePercent + "%"; } )
            .attr("x", function(d) {
                const width = this.getBBox().width;
                const targetTickEnd = (targetRadius + 5) * Math.sin(d.endAngle);

                if( Math.sin(d.endAngle) < 0 )
                {
                    return targetTickEnd - width;
                }
   
                return targetTickEnd;
            })
            .attr("y", function(d) {
                const height = this.getBBox().height;
                const targetTickEnd = (targetRadius + 5) * Math.cos(d.endAngle) * -1;

                if( Math.cos(d.endAngle) < 0 )
                {
                    return targetTickEnd + height;
                }
                
                return targetTickEnd - (height / 2);
            });

        // add foreground data circle
        pieFg.append("circle")
            .classed("revenueChart__pieFg", true)
            .attr("cx", width / 2 )
            .attr("cy", height / 2 )
            .attr("r", radius / goldenRatio );

        // revenue type label
        pieFg.append("text")
            .classed("revenueChartLabel__type", true)
            .text( totals.displayName )
            .attr("dx", width / 2 )
            .attr("dy", ( height / 2 ) - 33 );

        // revenue value
        pieFg.append("text")
            .classed("revenueChartLabel__revenueValue", true)
            .text( formatCurrency( totals.revenue ) )
            .attr("dx", width / 2 )
            .attr("dy", ( height / 2 ) - 8 );

        let gmPercentPanel = {
            height: 30,
            width: 80
        };

        // gm percent text background
        pieFg.append("rect")
            .classed("revenueChartLabel__gmBg", true)
            .attr("height", gmPercentPanel.height )
            .attr("width", gmPercentPanel.width )
            .attr("x", ( width / 2 ) - ( gmPercentPanel.width / 2 ) )
            .attr("y", ( height / 2 ) + 11 )
            .attr("rx", 4 )
            .attr("ry", 4 )
            .attr("fill", gmPercentColour( totals.gmPercent ) );

        // gm percent text
        pieFg.append("text")
            .classed("revenueChartLabel__gmPercent", true)
            .text( formatGM( totals.gmPercent ) )
            .attr("dx", width / 2 )
            .attr("dy", ( height / 2 ) + 30 );

        // add pie chart segment labels
        let segmentLabel = segmentLabels.selectAll(".revenueChart__segmentLabel")
            .data( dealerPieData )
            .enter()
                .append("g")
                    .classed("revenueChart__segmentLabel", true);

        segmentLabel
            .append("rect")
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("x", 0)
            .attr("y", (d,i) => 48 * i )
            .attr("fill", d => color(d.index) );

        segmentLabel
            .append("text")
            .classed("revenueChart__segmentLabelTitleText", true)
            .text( d => d.data.name )
            .attr("x", 22)
            .attr("y", (d,i) => 48 * i )
            .attr("dy", 3);

        segmentLabel
            .append("text")
            .classed("revenueChart__segmentLabelRevenueText", true)
            .text( d => formatCurrency( d.data.revenue ) )
            .attr("x", 22)
            .attr("y", (d,i) => 48 * i )
            .attr("dy", 20);
        
        // add industry average labels
        averageLabel
            .append("rect")
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("x", 0)
            .attr("y", 0 )
            .attr("fill", color(dealerPieData.length-1) );

        averageLabel
            .append("text")
            .classed("revenueChart__averageLabelTitleText", true)
            .text( "Industry average" )
            .attr("x", 22)
            .attr("y", 0 )
            .attr("dy", 3);

        averageLabel
            .append("text")
            .classed("revenueChart__averageLabelRevenueText", true)
            .text( "Revenue Mix" )
            .attr("x", 22)
            .attr("y", 0 )
            .attr("dy", 20);

        // function to format revenue value consistently
        function formatCurrency( amount )
        {
            return "£" + amount.format(0, 3, ',', '.');
        }

        // function to format GM% value consistently
        function formatGM( amount )
        {
            return amount + "% GM";
        }

        // function to format GM% colour consistently
        function gmPercentColour( gmPercent )
        {
            if( gmPercent > 30 && gmPercent < 40 )
            {
                return "#2dd00b";
            }

            if( ( gmPercent > 25 && gmPercent <= 30 ) ||
                ( gmPercent >= 40 && gmPercent < 45 ) )
            {
                return "#fbb829";
            }

            return "#f02d52";
        }
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

Number.prototype.format = function(n, x, s, c)
{
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = this.toFixed(Math.max(0, ~~n));
    
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};

module.exports = revenueChart;