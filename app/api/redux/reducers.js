/* CONSTANTS */
const {
  STANDARD,
  DISCOUNT,
  SEGMENTED,
  CONTRACT,
  PROMOTIONAL,
  TOTAL,
  INIT,
  SET_STANDARD_REVENUE,
  SET_DISCOUNT_REVENUE,
  SET_SEGMENTED_REVENUE,
  SET_CONTRACT_REVENUE,
  SET_PROMOTIONAL_REVENUE,
  SET_STANDARD_COGS,
  SET_DISCOUNT_COGS,
  SET_SEGMENTED_COGS,
  SET_CONTRACT_COGS,
  SET_PROMOTIONAL_COGS,
  SET_TARGET_GM
} = require('./actions');

export const INITIAL_STATE = {
  data: [
    {
      name: 'STANDARD',
      displayName: 'Standard',
      revenue: 399895,
      cogs: 202740
    },{
      name: 'DISCOUNT',
      displayName: 'Discount',
      revenue: 380779,
      cogs: 247323
    },{
      name: 'SEGMENTED',
      displayName: 'Segmented',
      revenue: 6434,
      cogs: 4166
    },{
      name: 'CONTRACT',
      displayName: 'Contract',
      revenue: 204490,
      cogs: 148697
    },{
      name: 'PROMOTIONAL',
      displayName: 'Promo',
      revenue: 9032,
      cogs: 8619
    }
  ],
  target: 35
};

/* REDUCERS */
export function gmWaterfallApp( state = initialState, action )
{
  let data, targetGm = state.target;

  switch( action.type )
  {
    case INIT:
      data = initData( state.data );
      break;
    case SET_STANDARD_REVENUE:
      data = setDataRevenue( state, STANDARD, action.revenue );
      break;
    case SET_DISCOUNT_REVENUE:
      data = setDataRevenue( state, DISCOUNT, action.revenue );
      break;
    case SET_SEGMENTED_REVENUE:
      data = setDataRevenue( state, SEGMENTED, action.revenue );
      break;
    case SET_CONTRACT_REVENUE:
      data = setDataRevenue( state, CONTRACT, action.revenue );
      break;
    case SET_PROMOTIONAL_REVENUE:
      data = setDataRevenue( state, PROMOTIONAL, action.revenue );
      break;
    case SET_STANDARD_COGS:
      data = setDataCogs( state, STANDARD, action.cogs );
      break;
    case SET_DISCOUNT_COGS:
      data = setDataCogs( state, DISCOUNT, action.cogs );
      break;
    case SET_SEGMENTED_COGS:
      data = setDataCogs( state, SEGMENTED, action.cogs );
      break;
    case SET_CONTRACT_COGS:
      data = setDataCogs( state, CONTRACT, action.cogs );
      break;
    case SET_PROMOTIONAL_COGS:
      data = setDataCogs( state, PROMOTIONAL, action.cogs );
      break;
    case SET_TARGET_GM:
      targetGm = action.target;
      data = state.data;
      break;
    default:
      data = state.data;
  }

  let waterfall = calcWaterfallChartValues(data);

  return Object.assign( {}, state, {
    data: data,
    waterfall: waterfall,
    target: targetGm
  } );
}

/* HELPER FUNCTIONS */
function initData( data )
{
  data[STANDARD].gmPercent = calcGmPercent( data, STANDARD);
  data[DISCOUNT].gmPercent = calcGmPercent( data, DISCOUNT);
  data[SEGMENTED].gmPercent = calcGmPercent( data, SEGMENTED);
  data[CONTRACT].gmPercent = calcGmPercent( data, CONTRACT);
  data[PROMOTIONAL].gmPercent = calcGmPercent( data, PROMOTIONAL);

  data[TOTAL] = {
    name: "TOTAL",
    revenue: calcDataTotalRevenue( data ),
    cogs: calcDataTotalCogs( data )
  };

  data[TOTAL].gmPercent = calcGmPercent( data, TOTAL );

  return data
}

function setDataRevenue( state, dataId, revenue )
{
  let data = state.data;

  data[dataId].revenue = parseInt( revenue );
  data[dataId].gmPercent = calcGmPercent( data, dataId );

  data[TOTAL].revenue = calcDataTotalRevenue( data );
  data[TOTAL].gmPercent = calcGmPercent( data, TOTAL );

  return data;
}

function setDataCogs( state, dataId, cogs )
{
  let data = state.data;
  
  data[dataId].cogs = parseInt( cogs );
  data[dataId].gmPercent = calcGmPercent( data, dataId );

  data[TOTAL].cogs = calcDataTotalCogs( data );
  data[TOTAL].gmPercent = calcGmPercent( data, TOTAL );

  return data;
}

function calcDataTotalRevenue( data )
{
  return data.reduce((sum, value) =>
  {
    return ( value.name !== "TOTAL" ) ? ( sum + value.revenue ) : sum;
  }, 0);
}

function calcDataTotalCogs( data )
{
  return data.reduce((sum, value) =>
  {
    return (value.name !== "TOTAL") ? (sum + value.cogs) : sum;
  }, 0);
}

function calcGmPercent( data, rowId )
{
  let gmPercent = ( ( data[rowId].revenue - data[rowId].cogs ) / data[rowId].revenue ) * 100;

  return parseFloat(Math.round(gmPercent * 100) / 100).toFixed(1);
}

function calcWaterfallChartValues( data )
{
  let chartValues = [],
      activeData = data.slice();

  // remove unneeded items
  activeData.splice( 0, 1 );
  activeData.splice( activeData.length - 1, 1 );

  // order array by GM Percentage value
  activeData.sort((a, b) =>
  {
    if(parseFloat(a.gmPercent) < parseFloat(b.gmPercent))
    {
      return 1;
    }
    if(parseFloat(a.gmPercent) > parseFloat(b.gmPercent))
    {
      return -1;
    }
    return 0;
  });

  activeData.unshift( data[STANDARD] );

  // start GM% value
  chartValues.push({
    name: "Standard",
    gmPercent: data[STANDARD].gmPercent,
    value: data[STANDARD].gmPercent
  });

  // create the waterfall chart data
  for (var i = 1; i < activeData.length; i++)
  {
    // get the cumalative revenue value
    let cumalativeRev = activeData.reduce((sum, value, index) => 
    {
      if(index <= i)
      {
        return sum + value.revenue
      }

      return sum;
    }, 0);

    // get the cumalative 'cost of goods' value
    let cumalativeCogs = activeData.reduce((sum, value, index) => 
    {
      if(index <= i)
      {
        return sum + value.cogs
      }

      return sum;
    }, 0);

    // work out the cumalative GM%
    let gmPercent = ( ( cumalativeRev - cumalativeCogs ) / cumalativeRev ) * 100;
    gmPercent = parseFloat(Math.round(gmPercent * 100) / 100).toFixed(1);

    // work out the GM difference with the previous row
    let gmDiff = chartValues[i-1].gmPercent - gmPercent;
    gmDiff = parseFloat(Math.round(gmDiff * 100) / 100).toFixed(1) * -1;

    // add chart data to the array
    chartValues.push({
      name: activeData[i].displayName,
      gmPercent: gmPercent,
      value: gmDiff
    });
  }

  // actual GM% value
  chartValues.push({
    name: "Actual",
    value: data[TOTAL].gmPercent
  });

  return chartValues;
}