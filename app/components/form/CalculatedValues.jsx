let React = require('react');
let { connect } = require('react-redux');

class CalculatedValues extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            revenueMix: props.revenueMix
        };
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
                                <td>Value</td>
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