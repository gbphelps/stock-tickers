import React from 'react';
import * as moment from 'moment';

export default class Chart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            range: '1m'
        };
        this.w = 100;
        this.h = 50;
    }

    getPathParams(){
        const data = this.state.range === '1d' ? this.props.intraday : this.props.data;
        let cutoff;

        let max = -Infinity;
        let min = Infinity;

        switch(this.state.range){
            case '1m': 
                cutoff = new moment().subtract(1, 'months');
                break;
            case '1y':
                cutoff = new moment().subtract(1, 'years');
                break;
            case '2y':
                cutoff = new moment().subtract(2, 'years');
                break;
            case '5y':
                cutoff = new moment().subtract(5, 'years');
                break;
            case '1d':
                cutoff = new moment().subtract(1, 'days');
        }

        const window = this.state.range === '1d' ? data : data.filter(d => moment(d.date).isAfter(cutoff));

        for (let i=0; i<window.length; i++){
            if (!window[i].close) continue;
            if (window[i].close < min) min = window[i].close;
            if (window[i].close > max) max = window[i].close;
        }

        const sx = (this.w) / (window.length-1);
        const sy = this.h / (max - min);
        return {
            matrix: `matrix(${sx}, 0, 0, ${-sy}, ${-(sx) * (data.length - window.length)}, ${this.h + sy * min})`,
            color: this.color(window[0].close, window[window.length-1].close)
        };     
    }

    path(){
        const data = this.state.range === '1d' ? this.props.intraday : this.props.data;
        if (!data) return null;

        let d = `M 0 0`;
    
        for (let i=0; i<data.length; i++){
            if (!data[i].close) continue;
            d += `L ${i} ${data[i].close}`
        }
        d += `L ${data.length} 0`

        const { matrix, color } = this.getPathParams();

        return <g style={{
                    transform: matrix, 
                    stroke: color, 
                    fill: color,
                    fillOpacity: .2,
                    transition: this.state.range === '1d' ? 'none' : 'transform 1.5s, stroke 1.5s, fill 1.5s'
                }}
                key={ this.state.range === "1d" ? "intraday" : "series" }>

                <path 
                    d={d} 
                    strokeWidth={1.5} 
                    vectorEffect="non-scaling-stroke"
                />
            </g>
    }

    color(a,b){
        if (b > a){ return "lightgreen" } 
        else if (b < a){ return "tomato" }
        else { return "#ccc" }
    }

    panels(){
        return ['1d', '1m', '1y', '2y', '5y'].map(range => <div 
                key={ range }
                className={`series-button ${this.state.range === range ? 'active' : ''}`} 
                onClick={ () => this.setState({range}) }
            >{ range }</div>
        )
    }

    render(){
        return (
            <div className="chart">
                <svg viewBox={`0 0 ${this.w} ${this.h}`} style={{border: "1px solid #eee"}}>
                    { this.path() }
                </svg>
                <div className="chart-options">
                    { this.panels() }
                </div>
            </div>
        )
    }
}
