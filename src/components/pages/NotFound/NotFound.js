import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <section className="text-center py-5">
      <h1 className="mb-3">404</h1>
      <p className="mb-4">Page not found.</p>
      <Button as={Link} to="/" variant="primary">Go to home</Button>
    </section>
  );
};

export default NotFound;
