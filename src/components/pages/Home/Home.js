import { Alert, Button, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAllTables, getTablesLoading } from '../../../redux/tablesRedux';
import Loading from '../../common/Loading/Loading';

const Home = () => {
  const tables = useSelector(getAllTables);
  const loading = useSelector(getTablesLoading);

  return (
    <section>
      <h1 className="mb-4">All tables</h1>

      {loading.active && <Loading text="Loading tables..." />}
      {loading.error && <Alert variant="danger">Could not load tables.</Alert>}

      {!loading.active && !loading.error && (
        <Row className="g-3">
          {tables.map(table => (
            <Col xs={12} key={table.id}>
              <Card>
                <Card.Body className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <strong>Table {table.id}</strong>
                    <span className="ms-3">Status: {table.status}</span>
                  </div>
                  <Button as={Link} to={`/table/${table.id}`} variant="primary">Show more</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </section>
  );
};

export default Home;
