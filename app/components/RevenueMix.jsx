let React = require('react');
let { connect } = require('react-redux');

// user-defined app components
let RevenueFormContainer = require('./form/RevenueFormContainer.jsx');
let CalculatedValuesContainer = require('./form/CalculatedValuesContainer.jsx');
let RevenueChartChartContainer = require('./chart/RevenueChartContainer.jsx');

class RevenueMix extends React.Component
{
    render()
    {
        return (
            <div className="gmRevenueMixContainer">
                <RevenueChartChartContainer />
                <CalculatedValuesContainer />
                <RevenueFormContainer />
            </div>
        );
    }
}

module.exports = RevenueMix;