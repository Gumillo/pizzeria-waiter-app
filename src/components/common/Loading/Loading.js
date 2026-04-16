import { Spinner } from 'react-bootstrap';

const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="d-flex align-items-center gap-3 py-3">
      <Spinner animation="border" role="status" size="sm" />
      <span>{text}</span>
    </div>
  );
};

export default Loading;
