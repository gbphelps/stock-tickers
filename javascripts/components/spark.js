import React from 'react';
import * as moment from 'moment';

export default class Spark extends React.Component{
    constructor(props){
        super(props);
        this.w = 100;
        this.h = 50;
    }

    path(){
        const {data} = this.props;
        if (!data || !data.length) return null;
    
        let max = -Infinity;
        let min = Infinity;
        let d = `M`;
    
        for (let i=0; i<data.length; i++){
            if (!data[i].close) continue;
            if (data[i].close < min) min = data[i].close;
            if (data[i].close > max) max = data[i].close;
            d += `${i} ${data[i].close} L`
        }
        d = d.slice(0, -1);
        
    
        const sx = this.w / (26); //data.length-1 (Note: 26 is 6.5/.25 - grabbing data @ 15 min intervals for 6.5 hours)
        const sy = this.h / (max - min);
        let matrix = `matrix(${sx}, 0, 0, ${-sy}, ${-sx * 0}, ${this.h + sy * min})`; 

        if (max === -Infinity) return null; //Datapoints exist, but no prices were returned from api.

        return <g transform={matrix}>
                <path 
                    d={d} 
                    fill='transparent' 
                    stroke={this.color(data[0].close, data[data.length-1].close)} 
                    strokeWidth={1} 
                    vectorEffect="non-scaling-stroke"
                />
            </g>
    }

    color(a,b){
        if (b > a){ return "lightgreen" } 
        else if (b < a){ return "tomato" }
        else { return "#ccc" }
    }



    render(){
        return (
            <svg viewBox={`0 0 ${this.w} ${this.h}`} className="spark">
                { this.path() }
            </svg>
        )
    }
}
