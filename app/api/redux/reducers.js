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
  SET_PROMOTIONAL_COGS
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
  ]
};

/* REDUCERS */
export function gmRevenueMixApp( state = initialState, action )
{
  let data;

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
    default:
      data = state.data;
  }

  let revenueMix = calcRevenueMixChartValues(data);

  return Object.assign( {}, state, {
    data: data,
    revenueMix: revenueMix
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

function calcRevenueMixChartValues( data )
{
  let chartValues = [],
      activeData = data.slice();

  // remove totals
  const TOTAL = activeData.splice( activeData.length - 1, 1 )[0];

  // create the revenue mix chart data
  for (var i = 0; i < activeData.length; i++)
  {
    let revenuePercent = ( activeData[i].revenue / TOTAL.revenue ) * 100;

    // add chart data to the array
    chartValues.push({
      name: activeData[i].displayName,
      gmPercent: activeData[i].gmPercent,
      revenue: activeData[i].revenue,
      revenuePercent: revenuePercent.toFixed(1)
    });
  }

  // order array by revenue Percentage value
  chartValues.sort((a, b) =>
  {
    if(parseFloat(a.revenuePercent) < parseFloat(b.revenuePercent))
    {
      return 1;
    }
    if(parseFloat(a.revenuePercent) > parseFloat(b.revenuePercent))
    {
      return -1;
    }
    return 0;
  });

console.log({
    data: chartValues,
    totals: TOTAL
  });
  return {
    data: chartValues,
    totals: TOTAL
  };
}