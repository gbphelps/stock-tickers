import React from 'react';

export default ({high, low, current}) => {

    [high, low] = high > low ? [high, low] : [low, high] //Test API is scrambled and low is not always lower than high.
    high = current > high ? current : high; //Same issue here.
    low = current < low ? current : low; //And here. 

    const w = 40;
    const r = 10;
    const trackHeight = 4;
    const left = (current - low) / (high - low) * w - r/2;

    return (
        <div style={{display: 'flex', alignItems: 'center', fontSize: 8, position: 'relative'}}>
            <div style={{position: 'absolute', right: w + 6 }}>{ Number(low).toFixed(2) }</div>
            <div style={{height: trackHeight, width: w, position: 'relative', background: '#cddae7'}}>
                <div style={{height: 10, width: 10, background: '#cddae7', borderRadius: "50%", position: 'absolute', top: -(r-trackHeight)/2 , left: left}}></div>
            </div>
            <div style={{position: 'absolute', left: w + 6 }}>{ Number(high).toFixed(2) }</div>
        </div>
    )   
}