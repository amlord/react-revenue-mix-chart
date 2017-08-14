// redux
let { connect } = require('react-redux');

// user-defined app components
let CalculatedValues = require('./CalculatedValues.jsx');
let { setTargetGm } = require('../../api/redux/actions.js');

const mapStateToProps = state =>
{
  return {
    revenueMix: state.revenueMix.data,
    target: state.target
  }
}

const mapDispatchToProps = dispatch =>
{
  return {
    onTargetGmUpdate: targetGm =>
    {
      dispatch( setTargetGm( targetGm ) )
    }
  };
}

const CalculatedValuesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CalculatedValues)

module.exports = CalculatedValuesContainer;