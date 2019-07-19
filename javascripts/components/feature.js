import React from 'react';
import state from '../state/symbols';
import Chart from './chart';



export default class Feature extends React.Component{
    constructor(props){
        super(props);
        this.state = state.data[props.symbol] || {};
    }

    componentDidMount(){ 
        state.addTimeSeries(this.props.symbol, '5y').then(()=>{
            state.subscribe(this, this.props.symbol);
        })
    }
    
    componentDidUpdate(prevProps){ 
        if (prevProps.symbol === this.props.symbol) return;
        state.addTimeSeries(this.props.symbol, '5y').then(() => {
            state.unsubscribe(this, prevProps.symbol);
            state.subscribe(this, this.props.symbol);
        })
    }

    render(){
        return (
            <div className="feature" key={ this.state.symbol }>
                <div className="feature-ticker">
                    <div>
                        <div style={{fontWeight: 600, fontSize: 28}}>{ this.state.symbol }</div>
                        <div style={{color: '#99b'}}>{ this.state.companyName }</div>
                    </div>
                    <div style={{fontSize: 28}}>
                        { this.state.latestPrice }
                    </div>
                </div>
      
                <Chart data={ this.state.timeSeries } intraday={ this.state.intraday }/>

            </div>
        )      
    }
}
