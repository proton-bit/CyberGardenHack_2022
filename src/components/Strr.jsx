import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import React from "react";

const Strr = (props) => {
  return (
        <tr>
          <td>{props.tab.name}</td>
          <td>{props.tab.firstday}</td>
          <td>{props.tab.secondday}</td>
          <td>{props.tab.thirhdday}</td>
          <td>{props.tab.fourthday}</td>
          <td>{props.tab.fifthday}</td>
          <td>{props.tab.sixthday}</td>
          <td>{props.tab.seventhday}</td>
        </tr>
  );
}

export default Strr;