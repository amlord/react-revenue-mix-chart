// redux
let { connect } = require('react-redux');

// user-defined app components
let CalculatedValues = require('./CalculatedValues.jsx');

const mapStateToProps = state =>
{
  return {
    revenueMix: state.revenueMix.data
  }
}

const mapDispatchToProps = dispatch =>
{
  return {};
}

const CalculatedValuesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CalculatedValues)

module.exports = CalculatedValuesContainer;