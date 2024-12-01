import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddEditHolding from './pages/AddEditHolding';
import Details from './pages/Details';
import ErrorBoundary from './components/ErrorBoundry';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddEditHolding />} />
          <Route path="/edit/:id" element={<AddEditHolding />} />
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;