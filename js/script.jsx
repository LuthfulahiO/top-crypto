const rootElement = document.getElementById('root');

class CoinList extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      coins: [],
      inputVal: 20,
      showLength: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({inputVal: event.target.value});
  }

  handleSubmit(event){
    console.log(Number(this.state.inputVal));
    this.setState({inputVal: Number(this.state.inputVal), isLoaded: false});
    this.componentDidMount();
    event.preventDefault();
  }

  componentDidMount() {
    fetch(`https://api.coinmarketcap.com/v1/ticker/?limit=${this.state.inputVal}`)
      .then(res => res.json())
      .then(data => {
        this.setState({showLength: data.length});
        this.setState({
          isLoaded:true,
          coins: data
        })
      })
      .catch(error=>{
        console.log(error);
        this.setState({
          isLoaded:true,
          error:error
        })
      })
  }
  render(){
    const dollarReal = (val) => {
      var usd = val * 1;
      var dollar = usd.toLocaleString();
      return dollar;
    }
    let coinsComponents;
    const {isLoaded, error, coins} = this.state;
    if(error){
      return <div>Error : {error}</div>
    }else if(!isLoaded){
      return <img src='../css/logo.svg' className="logo" alt="logo" />
    }else{
      coinsComponents = coins.map((coin) =>(
        <CoinTab
          key={coin.id}
          id={coin.rank}
          name={coin.name}
          price={dollarReal(coin.price_usd)}
          change1 ={coin.percent_change_1h}
          change7= {coin.percent_change_7d}
        />
      ));
    }
    return(
      [
      <Header len={this.state.showLength}/>,
      <SearchForm handleSubmit= {this.handleSubmit} handleChange={this.handleChange}/>,
      <h3>Show me top {this.state.inputVal} Cryptocurrency</h3>,
      <section>
        {coinsComponents}
      </section>
      ]
    );
    
  }
}
class Header extends React.Component{
  render(){
    return (
      <h1 id="heading">Top {this.props.len} Cryrptocurrencies In The World</h1>
    );
  }
}
class SearchForm extends React.Component{
    render (){
      return(
        <form onSubmit={this.props.handleSubmit}>
            <label>
              Fetch Top :
              <input onChange={this.props.handleChange} type="number" placeholder="Number of Cryptocurrency"/>
            </label>
            <input type="submit" value="Fetch"/>
        </form>
      );
    }
}
class CoinTab extends React.Component{
  render () {
    let change1h = (this.props.change1 < 0) ? 
      <button className="danger">Change in 1h: %{this.props.change1}</button> :
      <button className="success">Change in 1h: %{this.props.change1}</button>
    let change7d = (this.props.change7  < 0 )? 
      <button className="danger">Change in 7d: %{this.props.change7}</button> :
      <button className="success">Change in 7d: %{this.props.change7}</button>
    return (
      <article>
        <h2>{this.props.id} : {this.props.name}</h2>
        <p>Price: <b>$ {this.props.price}</b></p>
        {change1h}
        {change7d}
      </article>
    );
  }
}

ReactDOM.render(<CoinList/>, rootElement);