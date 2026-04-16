import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Col, Form, Row } from 'react-bootstrap';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTableById, getTablesLoading, getTablesUpdating, updateTableRequest } from '../../../redux/tablesRedux';
import Loading from '../../common/Loading/Loading';

const TABLE_STATUS = ['Free', 'Reserved', 'Busy', 'Cleaning'];

const clamp = value => {
  if(Number.isNaN(value)) return 0;
  if(value < 0) return 0;
  if(value > 10) return 10;
  return value;
};

const toNumber = value => Number.parseInt(value, 10);

const Table = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const table = useSelector(state => getTableById(state, id));
  const loading = useSelector(getTablesLoading);
  const updating = useSelector(getTablesUpdating);

  const [status, setStatus] = useState('Free');
  const [peopleAmount, setPeopleAmount] = useState(0);
  const [maxPeopleAmount, setMaxPeopleAmount] = useState(1);
  const [bill, setBill] = useState(0);

  useEffect(() => {
    if(table) {
      setStatus(table.status);
      setPeopleAmount(Number(table.peopleAmount));
      setMaxPeopleAmount(Number(table.maxPeopleAmount));
      setBill(Number(table.bill));
    }
  }, [table]);

  const canRenderForm = useMemo(() => Boolean(table), [table]);

  if(loading.active) return <Loading text="Loading table..." />;
  if(!loading.active && !canRenderForm) return <Navigate to="/" />;

  const handleStatusChange = event => {
    const nextStatus = event.target.value;
    setStatus(nextStatus);

    if(nextStatus === 'Free' || nextStatus === 'Cleaning') {
      setPeopleAmount(0);
      setBill(0);
    }

    if(nextStatus === 'Busy' && status !== 'Busy') {
      setBill(0);
    }
  };

  const handlePeopleAmountChange = event => {
    const nextPeople = clamp(toNumber(event.target.value));
    setPeopleAmount(Math.min(nextPeople, maxPeopleAmount));
  };

  const handleMaxPeopleAmountChange = event => {
    const nextMax = clamp(toNumber(event.target.value));
    setMaxPeopleAmount(nextMax);

    if(peopleAmount > nextMax) {
      setPeopleAmount(nextMax);
    }
  };

  const handleBillChange = event => {
    const nextBill = Number.parseFloat(event.target.value);

    if(Number.isNaN(nextBill) || nextBill < 0) {
      setBill(0);
      return;
    }

    setBill(nextBill);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const payload = {
      ...table,
      status,
      peopleAmount,
      maxPeopleAmount,
      bill: status === 'Busy' ? bill : 0,
    };

    const result = await dispatch(updateTableRequest(payload));

    if(result.ok) {
      navigate('/');
    }
  };

  return (
    <section>
      <h1 className="mb-4">Table {id}</h1>

      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row} className="mb-3" controlId="status">
          <Form.Label column sm={3}>Status:</Form.Label>
          <Col sm={9} md={6} lg={4}>
            <Form.Select value={status} onChange={handleStatusChange}>
              {TABLE_STATUS.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Form.Select>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="peopleAmount">
          <Form.Label column sm={3}>People amount:</Form.Label>
          <Col sm={9} md={6} lg={4}>
            <div className="d-flex align-items-center gap-2">
              <Form.Control type="number" min="0" max="10" value={peopleAmount} onChange={handlePeopleAmountChange} />
              <span>/</span>
              <Form.Control type="number" min="0" max="10" value={maxPeopleAmount} onChange={handleMaxPeopleAmountChange} />
            </div>
          </Col>
        </Form.Group>

        {status === 'Busy' && (
          <Form.Group as={Row} className="mb-3" controlId="bill">
            <Form.Label column sm={3}>Bill:</Form.Label>
            <Col sm={9} md={6} lg={4}>
              <Form.Control type="number" min="0" step="0.01" value={bill} onChange={handleBillChange} />
            </Col>
          </Form.Group>
        )}

        <Button type="submit" variant="primary" disabled={updating.active}>
          {updating.active ? 'Updating...' : 'Update'}
        </Button>
      </Form>

      {updating.error && <Alert className="mt-3" variant="danger">Could not update table.</Alert>}
    </section>
  );
};

export default Table;
