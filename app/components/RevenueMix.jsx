let React = require('react');
let { connect } = require('react-redux');

// user-defined app components
let RevenueFormContainer = require('./form/RevenueFormContainer.jsx');
let IndustryRevenueFormContainer = require('./form/IndustryRevenueFormContainer.jsx');
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
                <IndustryRevenueFormContainer />
            </div>
        );
    }
}

module.exports = RevenueMix;