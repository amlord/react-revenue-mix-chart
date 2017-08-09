let React = require('react');
let { connect } = require('react-redux');

class CalculatedValues extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            revenueMix: props.revenueMix,
            industryRevenueMix: props.industryRevenueMix
        };
    }

    componentWillReceiveProps( nextProps )
    {
        let { revenueMix, industryRevenueMix } = this.state;

        if( nextProps.revenueMix !== revenueMix )
        {
            this.setState({
                revenueMix: nextProps.revenueMix
            });
        }

        if( nextProps.industryRevenueMix !== industryRevenueMix )
        {
            this.setState({
                industryRevenueMix: nextProps.industryRevenueMix
            });
        }
    }

    render()
    {
        return (
            <div className="panel">
                <header className="panelHeader panelHeader--info">
                    <h1>Chart Values for Plotting</h1>
                </header>
                <div className="panelBody">
                    <table className="table table--full">
                        <thead>
                            <tr>
                                <th></th>
                                {this.state.revenueMix.map((cell, index) => {
                                    return (
                                        <CalculatedValuesHeaderCell 
                                            name={cell.name}
                                            key={index}
                                        />
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="revenueData">
                                <td>Mix %ge</td>
                                {this.state.revenueMix.map((cell, index) => {
                                    return (
                                        <CalculatedValuesCell 
                                            index={index}
                                            value={cell.revenuePercent}
                                            key={index}
                                        />
                                    )
                                })}
                            </tr>
                            <tr className="revenueData">
                                <td>Average</td>
                                {this.state.industryRevenueMix.map((cell, index) => {
                                    return (
                                        <CalculatedValuesCell 
                                            index={index}
                                            value={cell.revenuePercent}
                                            key={index}
                                        />
                                    )
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

class CalculatedValuesHeaderCell extends React.Component
{
    render()
    {
        return (
            <th>{this.props.name}</th>
        )
    }
}

class CalculatedValuesCell extends React.Component
{
    render()
    {
        return (
            <td>
                <div className="fieldContainer">
                    <input
                        value={this.props.value}
                        readOnly />
                </div>
            </td>
        )
    }
}


module.exports = CalculatedValues;