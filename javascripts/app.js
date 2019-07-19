import React from 'react';
import Header from './components/header';
import Feature from './components/feature';
import Feed from './components/feed';




export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            activeSymbol: "AAPL"
        }
    }

    setFeature(activeSymbol){
        this.setState({ activeSymbol })
    }

    render(){
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <Header/>
                <div className="content container" style={{height: '100%', width: "100%"}}>
                    <Feature symbol={ this.state.activeSymbol }/>
                    <Feed active={ this.state.activeSymbol } setFeature={ this.setFeature.bind(this) }/>
                </div>
            </div>
        )
    }
}

