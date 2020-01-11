import React from 'react'
import { Dropdown, Button, Icon, Table, Input, Form } from 'semantic-ui-react'
import { render } from 'react-dom';
import LoadingOverlay from 'react-loading-overlay';
import NumericTextbox from 'react-numeric-textbox'

const DropdownSelection = ({ options, label, isLoading, onChange, value }) => {
    return (
        <Dropdown
            placeholder={label}
            selection
            options={options}
            loading={isLoading}
            onChange={onChange}
            value={value}
        />
    );
}

const renderPointRow = (rowData, onEdit, onSave) => (
    <Table.Row className="point" data-point-level={rowData.pointLevel} key={rowData.pointLevel}>
        <Table.Cell>{rowData.pointLevel}</Table.Cell>
        <Table.Cell>{!rowData.isEditing && rowData.depositLeast}{rowData.isEditing && <input type="number"
            value={rowData.depositLeast}
        />}</Table.Cell>
        <Table.Cell>{!rowData.isEditing && rowData.betLeast}{rowData.isEditing && <input type="number"
            value={rowData.betLeast}
        />}</Table.Cell>
        <Table.Cell>{!rowData.isEditing && <Button
            icon
            primary
            size='mini'
            onClick={onEdit(rowData.pointLevel)}
        > <Icon name='edit' /> </Button>}
            {rowData.isEditing && <Button
                icon
                positive
                size='mini'
                onClick={onSave}
            > <Icon name='check' /> </Button>}
        </Table.Cell>
    </Table.Row>
);

const getPointLevels = async (siteId, currencyId) => {
    const response = await axios.post('/api/Marketing/GetPointLevelInfos', { siteId: siteId, currencyId: currencyId });
    try {
        const result = response.data;
        if (result.errorCode == 0) {
            const points = result.data;
            var pointLevels = points.map(point => {
                var rObj = {};
                rObj["pointLevel"] = point.pointLevel;
                rObj["depositLeast"] = point.depositLeast;
                rObj["betLeast"] = point.betLeast;
                rObj["isEditing"] = false;
                return rObj;
            });
            return pointLevels;
        } else {
            alert(result.message);
            return [];
        }
    } catch (error) {
        alert(error);
        return [];
    }
}

class Popup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deposit: 0,
            bet: 0
        }
        this.onChangeDepositLeast = this.onChangeDepositLeast.bind(this);
        this.onChangeBetLeast = this.onChangeBetLeast.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    onChangeBetLeast(e) {
        this.setState({
            bet: parseInt(e.target.value)
        });
    }

    onChangeDepositLeast(e) {
        this.setState({
            deposit: parseInt(e.target.value)
        });
    }

    onSave() {
        this.props.onClickSaveNewPoint(this.props.point, this.state.deposit, this.state.bet);
    }

    render() {
        return (
            <div className='popup'>
                <div className='popup_inner'>
                    <h1>{this.props.text}</h1>
                    <Form>
                        <Form.Field>
                            <label>Point</label>
                            <input value={this.props.point} readOnly />
                        </Form.Field>
                        <Form.Field>
                            <label>Deposit Least</label>
                            <input
                                value={this.state.deposit}
                                type="number"
                                onChange={(event) => this.onChangeDepositLeast(event)}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Bet Least</label>
                            <input
                                value={this.state.bet}
                                type="number"
                                onChange={(event) => this.onChangeBetLeast(event)}
                            />
                        </Form.Field>
                        <Button
                            icon
                            primary
                            size='mini'
                            onClick={this.onSave}
                        > <Icon name='check' />Save</Button>
                        <Button
                            icon
                            color="red"
                            size='mini'
                            onClick={this.props.closePopup}
                        > <Icon name='cancel' />Cancel</Button>
                    </Form>
                </div>
            </div>
        );
    }
}

class PointTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            points: [],
            isLoading: false,
            newPoint: {},
            isAddNew: false
        }
        this.onClickOpenAddNewPopUp = this.onClickOpenAddNewPopUp.bind(this);
        this.onClickSaveNewPoint = this.onClickSaveNewPoint.bind(this);
        this.onClickEditRow = this.onClickEditRow.bind(this);
        this.onSaveEditedRow = this.onSaveEditedRow.bind(this);
    }

    async componentDidMount() {
        this.setState({ isLoading: true });
        const points = await getPointLevels(this.props.siteId, this.props.currencyId);
        this.setState({ points: points, isLoading: false });
    }

    onClickOpenAddNewPopUp = async (e) => {
        e.preventDefault();
        this.setState({
            isAddNew: !this.state.isAddNew
        });
    }

    onClickSaveNewPoint = async (point, deposit, bet) => {
        const { points } = this.state;
        var rObj = {};
        rObj["pointLevel"] = point;
        rObj["depositLeast"] = deposit;
        rObj["betLeast"] = bet;
        rObj["isEditing"] = false;
        points.push(rObj);

        var response = await axios.post("/api/Marketing/AddPointLevelInfo", { siteId: this.props.siteId, currencyId: this.props.currencyId, pointLevel: point, depositLeast: deposit, betLeast: bet });
        try {
            const result = response.data;
            if (result.errorCode == 0) {
                this.setState({ points, isAddNew: !this.state.isAddNew });
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert(error);
        }
    }

    onSaveEditedRow(editingPoint) {
        const { points } = this.state;
        points.forEach(function (point) {
            if (point.pointLevel === editingPoint) {
                point["isEditing"] = false;
            }
        });
        this.setState({
            points
        });
    }

    onClickEditRow(editingPoint) {
        const { points } = this.state;
        points.forEach(function (point) {
            if (point.pointLevel === editingPoint) {
                point["isEditing"] = true;
            }
        });
        this.setState({
            points
        });
    }

    render() {
        const { points } = this.state;
        const pointLevels = points.map(point => point.pointLevel);
        const currentMaxPoint = pointLevels.length > 0 ? Math.max(...pointLevels) : 0;
        return (
            <LoadingOverlay
                active={this.state.isLoading}
                spinner
            >
                <div className="point-table" data-currency-id={this.props.currencyId}>
                    <Table compact celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Point</Table.HeaderCell>
                                <Table.HeaderCell>Deposit least</Table.HeaderCell>
                                <Table.HeaderCell>Bet least</Table.HeaderCell>
                                <Table.HeaderCell>Action</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Body>
                            {
                                points.map(rowData => <Table.Row className="point" data-point-level={rowData.pointLevel} key={rowData.pointLevel}>
                                    <Table.Cell>{rowData.pointLevel}</Table.Cell>
                                    <Table.Cell>{!rowData.isEditing && rowData.depositLeast}{rowData.isEditing && <input type="number"
                                        value={rowData.depositLeast}
                                    />}</Table.Cell>
                                    <Table.Cell>{!rowData.isEditing && rowData.betLeast}{rowData.isEditing && <input type="number"
                                        value={rowData.betLeast}
                                    />}</Table.Cell>
                                    <Table.Cell>{!rowData.isEditing && <Button
                                        icon
                                        primary
                                        size='mini'
                                        onClick={() => this.onClickEditRow(rowData.pointLevel)}
                                    > <Icon name='edit' /> </Button>}
                                        {rowData.isEditing && <Button
                                            icon
                                            positive
                                            size='mini'
                                            onClick={() => this.onSaveEditedRow(rowData.pointLevel)}
                                        > <Icon name='check' /> </Button>}
                                    </Table.Cell>
                                </Table.Row>
                                    )
                            }
                        </Table.Body>

                        <Table.Footer fullWidth>
                            <Table.Row>
                                <Table.HeaderCell colSpan='4'>
                                    <Button
                                        floated='right'
                                        icon
                                        labelPosition='left'
                                        primary
                                        size='tiny'
                                        onClick={(e) => this.onClickOpenAddNewPopUp(e)}
                                    >
                                        <Icon name='plus' /> Add level
          </Button>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Footer>
                    </Table>
                </div>
                {this.state.isAddNew ?
                    <Popup
                        text="Add new point level"
                        closePopup={this.onClickOpenAddNewPopUp}
                        siteId={this.props.siteId}
                        point={currentMaxPoint + 1}
                        currencyId={this.props.currencyId}
                        onClickSaveNewPoint={this.onClickSaveNewPoint}
                    />
                    : null
                }
            </LoadingOverlay>
        );
    }
}

class PointLevelManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sites: [],
            isLoadingPoints: false,
            selectedSite: null,
            currencyOptions: []
        }
        this.onChangeSite = this.onChangeSite.bind(this);
    }

    componentDidMount() {
        axios.get('/api/Marketing/GetAllSites')
            .then(function (response) {
                let result = response.data;
                if (result.errorCode == 0) {
                    var serverInfos = result.data;
                    var sites = serverInfos.map(info => {
                        var rObj = {};
                        rObj["key"] = info.siteId;
                        rObj["value"] = info.siteId;
                        rObj["text"] = info.siteName;
                        return rObj;
                    });
                    this.setState({ sites: sites });
                } else {
                    alert(result.message);
                }
            }.bind(this)).catch(function (error) {
                alert(error);
            }.bind(this)).finally(function () {
            }.bind(this));
    }

    onChangeSite = async (e, { value }) => {
        this.setState({ selectedSite: value, currencyOptions: [] });
        const response = await axios.post('/api/Marketing/GetSiteCurrencyIds', { siteId: value });
        try {
            const result = response.data;
            if (result.errorCode == 0) {
                const currencyIds = result.data;
                var currencyOptions = currencyIds.map(currency => {
                    var rObj = {};
                    rObj["key"] = currency;
                    rObj["value"] = currency;
                    rObj["text"] = currency;
                    return rObj;
                });
                this.setState({ currencyOptions: currencyOptions });
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert(error);
        }
    }

    render() {
        const { sites, selectedSite, currencyOptions } = this.state;
        return (
            <div>
                <div className="form-group">
                    <DropdownSelection options={sites} label="Select site" onChange={this.onChangeSite} value={selectedSite} />
                </div>

                {selectedSite && (currencyOptions.map(option => <div key={option.value} className="form-group">
                    <PointTable currencyId={option.value} siteId={selectedSite} />
                </div>))}
            </div>
        );
    }
}

render(<PointLevelManagement />, document.getElementById('point-management'));