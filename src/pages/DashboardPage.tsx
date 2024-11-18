
import { useNavigate } from 'react-router-dom';


const DashboardPage = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="button-group">
        <button onClick={() => navigate('/customers')}>Customers Page</button>
        <button onClick={() => navigate('/deliveries')}>Deliveries Page</button>
        <button onClick={() => navigate('/fleet')}>Fleet Page</button>
        <button onClick={() => navigate('/operations')}>Operations Page</button>
        <button onClick={() => navigate('/products')}>Products Page</button>
        <button onClick={() => navigate('/reports')}>Reports Page</button>
        <button onClick={() => navigate('/route-planning')}>Route Planning Page</button>
        <button onClick={() => navigate('/user')}>User Page</button>
      </div>
    </div>
  );
};

export default DashboardPage;