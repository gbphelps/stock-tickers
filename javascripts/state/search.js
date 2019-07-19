/*
Note: This is a very large object, but still well below memory limits for modern browsers.
Ideally wouldn't have to store all of this in state, but there are two key benefits:
    (a) Autocomplete load time is much faster than it would be if a new AJAX request had to be made for each search string.
    (b) Financial APIs are notoriously expensive, and the one used here charges per message in production. Therefore, we want to limit redundant requests as much as possible by caching responses. 
*/

export default (function(){
    const symbols = [];
    let context = null;

    const getSymbols = new XMLHttpRequest();
    getSymbols.onreadystatechange = () => {
        if (getSymbols.readyState === 4 && getSymbols.status === 200){
            const symList = JSON.parse(getSymbols.responseText);
            symList.forEach(entry => {
                const {symbol, name} = entry;
                symbols.push({symbol, name})
            })
            if (context) context.setState({symbols})
        }
    }

    getSymbols.open('GET','https://sandbox.iexapis.com/stable/ref-data/symbols?token=Tpk_3a27df657c944490816e573504856c18');
    getSymbols.send();

    return function register(that){ context = that; context.setState({symbols}) }

})()


