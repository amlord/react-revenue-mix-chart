// redux
let { connect } = require('react-redux');

// user-defined app components
let RevenueChart = require('./RevenueChart.jsx');

const mapStateToProps = state =>
{
  return {
    revenueMix: state.revenueMix,
    industryRevenueMix: state.industryRevenueMix
  }
}

const mapDispatchToProps = dispatch =>
{
  return {};
}

const RevenueChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RevenueChart)

module.exports = RevenueChartContainer;