import register from '../state/search';
import React from 'react';
import Magnify from './magnify';


let blur;

const Entry = ({item, addTicker}) => (
    <div className="search-rec" style={{display: "flex", width: '100%', cursor: 'pointer', padding: '3px 12px'}} 
        onClick={e => { 
            e.nativeEvent.stopImmediatePropagation();
            document.removeEventListener('click', blur);
            addTicker(item.symbol);
        }}>
        <div style={{fontWeight: 700, whiteSpace: "nowrap", width: 100,}}>{item.symbol}</div>
        <div 
            style={{
                color: "#99b", 
                fontSize: 12,
                whiteSpace: 'nowrap', 
                width: '100%', 
                minWidth: 0, 
                overflow: 'hidden',
                textOverflow: 'ellipsis'}}>{item.name}</div>
    </div>
) 


export default class Search extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            symbols:[],
            searchString:"",
            fail: false
        }
    }

    componentDidMount(){ register(this) }

    update(key){
        return e => this.setState({[key]: e.target.value})
    }

    results(){
        if (this.state.searchString === "") return null;
        const foundSymbols = [];
        const foundCompanies = [];

        this.state.symbols.forEach(s => {
            if (s.symbol.toUpperCase().indexOf(this.state.searchString.toUpperCase()) === 0){ 
                foundSymbols.push(s)
            } else if (s.name.toUpperCase().indexOf(this.state.searchString.toUpperCase()) === 0){
                foundCompanies.push(s)
            }    
        })
        
        const symbols = foundSymbols.slice(0,5).map(item => <Entry item={item} addTicker={this.addTicker.bind(this)}/>);
        const companies = foundCompanies.slice(0,5).map(item => <Entry item={item} addTicker={this.addTicker.bind(this)}/>);

        const symHead = <div style={{fontSize: 10, color: '#99b', padding: '5px 0'}}>SYMBOLS</div>;
        const cmpyHead = <div style={{fontSize: 10, color: '#99b', padding: '5px 0'}}>COMPANIES</div>;
        
        if (!symbols.length && !companies.length) return null;

        return <div style={{
            position: "absolute", 
            top: "100%",
            left: 0, 
            width: '100%', 
            background: 'white',
            border: '1px solid #eee',
            boxShadow: '0 5px 10px 1px rgba(0,0,0,.05)',
            zIndex: 100,
        }}>
            { symbols.length ? symHead : null }
            { symbols }
            { companies.length ? cmpyHead : null }
            { companies }
        </div>
    }

    addTicker(string){
        const entry = this.state.symbols.find(s => {
            return s.symbol.toUpperCase() === string.toUpperCase();
        });

        if (!entry){
            this.setState({
                searchString:"",
                fail: true,
            })
    
            setTimeout(()=> this.setState({fail: false}), 2000);
            return;
        }

        this.props.add(string.toUpperCase());
        this.props.setFeature(string.toUpperCase());
        this.setState({searchString: ""});
        
    }

    render(){
        return (
            <div style={{width: '100%', marginRight: 8}}>
            <div 
                className={`search ${this.state.focus}`}
                style={{
                    width: '100%', 
                    display: 'flex', 
                    position: 'relative', 
                    height: 40,
                    boxShadow: 'inset 0 0 10px 1px rgba(0,0,0,.1)',
                    padding: '0 16px',
                }}>
                <div style={{position: 'relative', width: '100%'}}>
                <input 
                    onClick={()=> {
                        blur = () => this.setState({searchString: ""}); 
                        //if this gets called immediately, the search results are removed from the DOM before they are actually clicked.
                        setTimeout(()=> {
                            document.addEventListener('click', blur, {once: true})
                        }) //So, set a document click event. Must set timeout to avoid immediate trigger.
                        //call stopImmediatePropagation on the click event on any of the entries so that that zone is free of the document click.
                    }}

                    value={this.state.searchString} 
                    onChange={this.update("searchString")}
                    onFocus={() => this.setState({focus: true})}
                    onBlur={() => this.setState({focus: false})}
                    onKeyDown={ e => {
                        if (e.keyCode===13) this.addTicker(this.state.searchString)
                    }}
                    style={{width: '100%', height: '100%', background: 'transparent', border: 'none'}}
                    placeholder="Add Ticker...">   
                    </input>
                </div>
                <div onClick={() => this.addTicker(this.state.searchString)} style={{padding: 8}}>
                    <Magnify/>
                </div>
                { this.results() }
            </div>
                <div className={`invalid-ticker ${this.state.fail}`} style={{
                    display: 'flex', padding: '5px 0', alignItems: 'center', fontSize: 10}}>
                    <div style={{
                            height: 15,
                            width: 15,
                            background: "tomato",
                            color: "white",
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '50%',
                            marginRight: 5
                        }}>!</div>
                    <span style={{color: '#99b'}}>Invalid Ticker</span>
                </div>
            </div>
        )
    }
}
