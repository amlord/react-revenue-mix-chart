let React = require('react');
let { connect } = require('react-redux');

// user-defined app components
let GmErosionFormContainer = require('./form/GmErosionFormContainer.jsx');
let CalculatedValuesContainer = require('./form/CalculatedValuesContainer.jsx');
let WaterfallChartContainer = require('./chart/WaterfallChartContainer.jsx');

class GmErosionWaterfall extends React.Component
{
    render()
    {
        return (
            <div className="gmErosionWaterfallContainer">
                <WaterfallChartContainer />
                <CalculatedValuesContainer />
                <GmErosionFormContainer />
            </div>
        );
    }
}

module.exports = GmErosionWaterfall;