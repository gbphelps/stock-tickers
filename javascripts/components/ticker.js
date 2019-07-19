import React from 'react';
import state from '../state/symbols';
import Spark from './spark';
import HiLo from './hilo';
import * as moment from 'moment';


export default class Ticker extends React.Component{
    constructor(props){
        super(props);
        this.state = state.data[props.symbol] || {};
    }

    componentDidMount(){ state.subscribe(this, this.props.symbol) }
    componentWillUnmount(){ state.unsubscribe(this, this.props.symbol); }
    unmount(e){ 
        e.stopPropagation();
        this.props.remove(this.props.symbol)
    }

    componentDidUpdate(_, prevState){
        if (prevState.latestPrice === undefined) return;
        if (this.state.latestPrice === prevState.latestPrice) return;
        this.setState({tick: 
            this.state.latestPrice < prevState.latestPrice ? 'down' : 'up'
        });
    }

    format(number){ return Number(number).toFixed(2); }


    getChangeColor(){
        if (this.state.change > 0) return 'lightgreen';
        if (this.state.change < 0) return 'tomato';
        return '#99a'
    }

    getChangeArrow(){
        if (this.state.change > 0) return <span style={{fontSize: '.7em'}}>&#9650;</span>;
        if (this.state.change < 0) return <span style={{fontSize: '.7em'}}>&#9660;</span>;
        return null;

    }


    render(){
        if (!this.state.symbol) return null;

        return (
            <div 
                style={{position: 'relative'}}
                className={`ticker ${this.props.active ? 'active': ''}`}
                onClick={() => this.props.setFeature(this.props.symbol)}
            >

            <div style={{display: 'flex', alignItems: 'center', width: 120}}>
                <Spark data={this.state.intraday}/>
            
                <div>
                    <h2>{ this.props.symbol }</h2>
                    <div style={{
                        color: "#99b",
                        fontSize: 10
                    }}>{ this.state.companyName }</div>
                </div>
            </div>

            <HiLo high={this.state.high} low={this.state.low} current={this.state.latestPrice}/>

            <div style={{display: "flex"}}>
                <div style={{marginRight: 8, display: 'flex', flexDirection: 'column', alignItems:'flex-end', width: 100}}>
                    <div 
                        className={ `price ${this.state.tick}`} 
                        onAnimationEnd={ () => this.setState({tick: null}) }
                        key={ this.state.latestPrice }>{ this.format(this.state.latestPrice) }</div>
                    <div className="change" style={{color: this.getChangeColor()}}>{this.getChangeArrow()}{ Math.abs(Number(this.state.change).toFixed(2)) }({ this.format(Math.abs(this.state.changePercent*100)) }<span style={{fontSize: ".7em"}}>%</span>)</div>
                    <div style={{fontSize: 10, textAlign: 'right', color: '#99b'}}>{ moment(this.state.latestUpdate).format('MMM D, h:mm A') }</div>
                </div>
                
                <div className="ex" onClick={ this.unmount.bind(this) }>&#215;</div>
            </div>
            
            
        </div>)
    }
}



