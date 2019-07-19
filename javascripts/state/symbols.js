const symbolData = {};
const sources = {};
const subscribers = {};

    function set(symbol, data){
        if (!symbolData[symbol]) symbolData[symbol] = {_added: Date.now()};
        Object.assign(symbolData[symbol], data)
        subscribers[symbol].forEach(subscriber => {
            subscriber.setState(data)
        })
    }


    function addTimeSeries(symbol,range){
        return new Promise(resolve => {
            const url = `https://sandbox.iexapis.com/stable/stock/${symbol}/chart/${range}?token=Tpk_3a27df657c944490816e573504856c18`;
            
            if (symbolData[symbol] && symbolData[symbol].timeSeries){
                resolve();
                return;
            }

            const request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4 && request.status === 200){
                    const timeSeries = JSON.parse(request.responseText);
                    set(symbol, {timeSeries})
                }
                if (request.readyState === 4) resolve();
            }

            request.open('GET',url);
            request.send();
        })
    }

    //Promise
    function addIntraday(symbol){
        return new Promise(resolve => {
            const request = new XMLHttpRequest();
            request.onreadystatechange = () =>{
                if (request.readyState === 4 && request.status === 200){
                    const data = JSON.parse(request.responseText);
                    set(symbol, {intraday: data});
                }
                if (request.readyState === 4) resolve();
            }
            request.open('GET',`https://sandbox.iexapis.com/stable/stock/${symbol}/intraday-prices?chartInterval=15&token=Tpk_3a27df657c944490816e573504856c18`);
            request.send();
        })
    }

    //Promise
    function setupListener(symbol){
        return new Promise(resolve => {
            const url = `https://sandbox-sse.iexapis.com/stable/stocksUS5second?symbols=${symbol}&token=Tpk_3a27df657c944490816e573504856c18`;
            sources[symbol] = new EventSource(url);         
            sources[symbol].onmessage = m => {
                const data = JSON.parse(m.data)[0];
                set(symbol, data);

                if ( resolve ) resolve();
                resolve = null;
            }
        })
    }

    function fetch(symbol){
        if (symbolData[symbol]) return Promise.resolve();
        subscribers[symbol] = new Set();
        return new Promise(resolve => {
            Promise.all([
                setupListener(symbol),
                addIntraday(symbol)
            ]).then(() => resolve())
        })
    }






    export default {
        fetch,
        addTimeSeries,
        data: symbolData,      
        subscribe: function(ctx, symbol){
            if (subscribers[symbol]){
                subscribers[symbol].add(ctx);
                ctx.setState(symbolData[symbol]);
            } else {
                subscribers[symbol] = new Set([ctx]);
                ctx.setState(symbolData[symbol]);
            }
        },

        unsubscribe: function(ctx, symbol){
            subscribers[symbol].delete(ctx);
            if (!subscribers[symbol].size){
                sources[symbol].close();
                delete sources[symbol];
                delete subscribers[symbol];
                delete symbolData[symbol]; //Flush the cache
            }
        }
    }
