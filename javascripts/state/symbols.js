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
            const url = `https://cloud.iexapis.com/stable/stock/${symbol}/chart/${range}?token=pk_3df0acc055da49eb85fdb19acac48968`;
            
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
            request.open('GET',`https://cloud.iexapis.com/stable/stock/${symbol}/intraday-prices?chartInterval=15&token=pk_3df0acc055da49eb85fdb19acac48968`);
            request.send();
        })
    }

    //Promise
    function setupListener(symbol){
        return new Promise(resolve => {
            const url = `https://cloud-sse.iexapis.com/stable/stocksUSNoUTP?symbols=${symbol}&token=pk_3df0acc055da49eb85fdb19acac48968`;
            sources[symbol] = new EventSource(url);
             
            sources[symbol].onerror = () => {
                resolve();
            }

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
