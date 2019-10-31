import React from 'react';
import Ticker from './ticker';
import Search from './search';
import state from '../state/symbols';
import Sort from './sort';


export default class Feed extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            symbols: new Set(['AAPL', 'GOOG', 'NFLX', 'FB', 'AMZN', 'MSFT']),
            order: 'date added'
        }
    }

    componentDidMount(){
        const promises = Array.from(this.state.symbols).map(symbol => {
            return state.fetch(symbol)
        });
        Promise.all(promises).then(() => {
            this.setState({ready: true});
            console.log('fine')
        })
    }

    setOrder(order){
        this.setState({order})
    }

    remove(symbol){
        const symbols = new Set(this.state.symbols);
        symbols.delete(symbol);
        this.setState({ symbols });
    }

    add(symbol){
        if (this.state.symbols.has(symbol)) return false;
        state.fetch(symbol).then(() => {
            const symbols = new Set(this.state.symbols);
            symbols.add(symbol);
            this.setState({ symbols });
        })
        return true;
    }

    tickers(){
        return Array.from(this.state.symbols)
            .sort((a,b) => {
                switch(this.state.order){
                    case "date added":
                        return state.data[b]._added - state.data[a]._added;
                    case "gainers":
                        return state.data[b].changePercent - state.data[a].changePercent;
                    case "losers":
                        return state.data[a].changePercent - state.data[b].changePercent;
                }
            })
            .map(s => 
                <Ticker 
                    symbol={s} 
                    key={s} 
                    setFeature={this.props.setFeature}
                    active={ this.props.active === s }
                    remove={ this.remove.bind(this) }
                />
            )
    }

    render(){
        return (
            <div className="feed" style={{position: 'relative', height: '100%', display: 'flex', flexDirection: 'column'}}>
                <div style={{display: 'flex'}}>
                <Search 
                    setFeature={this.props.setFeature}
                    add={this.add.bind(this)}
                />

                <Sort setOrder={this.setOrder.bind(this)} order={this.state.order}/>
                </div>

                <div className="tickers-container">
                    { this.state.ready ? 
                        this.tickers() : 
                        <div style={{color: '#99b', textAlign: 'center', fontSize: 12}}>Loading Feed...</div> 
                    }
                </div>
            </div>
        )
    }
}
