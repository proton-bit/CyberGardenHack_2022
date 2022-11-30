import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import React from "react";
import Strr from "./Strr";

const MyTables = ({tabs}) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Студен/День</th>
          <th>{props.tab.firstdata}</th>
          <th>{props.tab.seconddata}</th>
          <th>{props.tab.thirhddata}</th>
          <th>{props.tab.fourthdata}</th>
          <th>{props.tab.fifthdata}</th>
          <th>{props.tab.sixthdata}</th>
          <th>{props.tab.seventhdata}</th>
        </tr>
      </thead>
      <tbody>
      {tabs.map((tab) =>
                <Strr tab={tab} key={tab.id}/>
            )}
      </tbody>
    </Table>
  );
}

export default MyTables;