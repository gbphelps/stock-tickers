import React from 'react';
import SortIcon from './sortIcon';

let blur;

export default class Sort extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            orderOptions: ['date added', 'gainers', 'losers'],
            expanded: false,
        }
    }

    options(){
        const options = this.state.orderOptions.map(option => {
            return (
                <div
                    style={{padding: 4}}
                    className={this.props.order === option ? "active" : ""}
                    onClick={e=>{
                        e.nativeEvent.stopImmediatePropagation();
                        document.removeEventListener('click', blur);
                        this.props.setOrder(option);
                        this.setState({expanded: false});
                    }}
                >{ option.toUpperCase() }</div>
            )
        })
        return <div style={{
            position: 'absolute', 
            textAlign: 'left', 
            top: '100%', 
            left: 0, 
            width: '100%', 
            background: 'white', 
            zIndex:'100', 
            border: '1px solid #eee',
            borderTop: 'none'
        }}>{ options }</div>
    }
    render(){
        return (
            <div style={{
                position: 'relative', 
                flexShrink: 0, 
                width: 120, 
                fontSize: 10, 
                textAlign: 'center', 
                height: 40,
                cursor: 'pointer'}}>
                <div 
                style={{
                    display: 'flex', 
                    alignItems:'center', 
                    justifyContent: 'space-between', 
                    border: '1px solid #eee', 
                    position: 'relative', 
                    height: '100%', 
                    padding: '0 8px'
                }}

                onClick={()=>{
                    document.removeEventListener('click', blur)
                    blur = () => this.setState({expanded: false});
                    setTimeout(()=>document.addEventListener('click', blur, { once: true }))
                    this.setState({expanded: !this.state.expanded})
                }}> 
                { this.props.order.toUpperCase() }
                <SortIcon/>
                </div>   
                    { this.state.expanded ? this.options() : null }
            </div>
        )
    }
}