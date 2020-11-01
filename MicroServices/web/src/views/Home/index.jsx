import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Loader from '../../components/UI/Loader';

function Home() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <h1>Home</h1>
      { loading ? (
        <Loader />
      ) : (
        <Row>

        </Row>
      ) }
    </div>
  );
}

export default Home;
