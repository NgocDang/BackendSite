import {number_format} from '../commJS/common';
import {Pagination} from '../commJS/Pagination.jsx';

(function ($, React, ReactDOM, i18n, axios, moment, Calendar) {
    const DepositStatus = {
        Pending:1,
        Paid :2,
        Approved:3,
        Rejected:4,
        Canceled:5,
        Expired:6,
        OnHold :7
    };

    class DepositList extends React.Component {
        constructor(props) {
            super(props);

        }

        onCheckDetail(id) {
            this.props.onCheckDetail(id);
        }

        onRefresh() {
            this.props.onRefresh();
        }

        render() {
            let rows = this.props.searchData.data.map(row => 
                <tr key={row.transId}>
                    <th scope="row"><a href="#" role="button" onClick={this.onCheckDetail.bind(this, row.transId)}>{row.transId}</a></th>
                    <td>{i18n["lbl_DepositType" + row.depositType]}</td>
                    <td>{row.userName}</td>
                    <td>{i18n["lbl_Currency"+row.currencyId]}</td>
                    <td className="text-right">{number_format(row.amount)}</td>                    
                    <td>{row.accountNo}</td>
                    <td>{row.accountName}</td>
                    <td>{row.memo}</td>
                    <td>{moment(row.createTime).format('l LTS')}</td>
                    <td>{i18n["lbl_DepositStatus"+row.status]}</td>
                </tr>
            );

            return (
                <div>
                    <button type="button" className="btn btn-secondary float-right" onClick={this.onRefresh.bind(this)}>Refresh</button>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Trxn.ID</th>
                                <th scope="col">{i18n.lbl_DepositType}</th>
                                <th scope="col">{i18n.lbl_UserName}</th>
                                <th scope="col">CCY</th>
                                <th scope="col" className="text-right">{i18n.lbl_Amount}</th>
                                <th scope="col">To Acc. NO.</th>
                                <th scope="col">To Acc. Name</th>                                
                                <th scope="col">{i18n.lbl_Memo}</th>
                                <th scope="col">{i18n.lbl_CreateTime + " (" + moment().format('Z') + ")"}</th>
                                <th scope="col">{i18n.lbl_Status}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                    <Pagination Data={{...this.props.searchData}} ChangePage={this.props.ChangePage}/>
                </div>
            )
        }
    }

    class BankCardInfoPanel extends React.Component {
        constructor(props) {
            super(props);

            this.state={selectType:"", selectCurrency:"", selectStatus:"1", SelectUser:"", SelectDepositID:"", ShowDetial: false};
        }

        onRefresh() {
            let searchData = this.state.searchData;
            this.onSearch(searchData.pageNumber);
        }

        onChange(event) {
            let obj={};
            obj[event.target.name]=event.target.value;
            this.setState(obj);
        }

        onSearch(pageNumber) {
            //Loading.OnLoading();
            let data = {StartDate: this.state.StartDate, EndDate: this.state.EndDate, PageNumber: pageNumber};
            if(this.state.SelectDepositID!=""){
                data.DepositId = this.state.SelectDepositID;
            }

            if(this.state.selectType!=""){
                data.DepositType = parseInt(this.state.selectType);
            }

            if(this.state.selectStatus!=""){
                data.status = parseInt(this.state.selectStatus);
            }

            if(this.state.SelectUser!=""){
                data.UserName = this.state.SelectUser;
            }

            if(this.state.selectCurrency!=""){
                data.CurrencyID = parseInt(this.state.selectCurrency);
            }

            axios.post('/api/Deposit/GetDepositRequestList', data)
            .then(function (response) {
                //Loading.UnLoading();
                let result = response.data;
                if (result.errorCode == 0) {
                    this.setState({searchData: result, GetData: true});
                } else {
                    alert(result.message);
                }
            }.bind(this)).catch(function (error) {
                //Loading.UnLoading();
                alert(error);
            }.bind(this));
        }

        handleSubmit(event) {
            event.preventDefault();
            //this._Search = true;
            let endDate = moment(this.selectdate_end.current.value).add(1, 'days').unix()-1;
            let data = {StartDate: moment(this.selectdate_start.current.value).unix(), EndDate: endDate};

            this.setState(data, function(){
                this.onSearch(1);
            }.bind(this));
        }

        componentDidMount() {

        }

        onCheckDetail(id) {
            this.setState({transId: id, ShowDetial: true});
        }

        onBack() {
            this.setState({ShowDetial: false});
            this.onRefresh();
        }

        render() {

            return (
                <div>

                </div>
            )
        }
    }
    
    ReactDOM.render(<BankCardInfoPanel/>,document.getElementById('Panel'));
    })(jQuery, React, ReactDOM, i18n, axios, moment, Calendar);