import React, { useState, useEffect, ListItem } from 'react';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from "reactstrap";
import Select from "react-select";

const conditionList = [
    {
        label: "Dependency condition",
        options: [
            { label: "Less", value: 1 },
            { label: "More", value: 2 },
            { label: "Equal", value: 2 },
            { label: "More and equal", value: 2 },
            { label: "Less and equal", value: 2 },
            { label: "Not equal", value: 2 },
        ]
    }
];

const Conditions = props => {
    const [selectedGroup, setselectedGroup] = useState(null);

    const handleSelectGroup = (selectedGroup) => {
        setselectedGroup(selectedGroup);
    };

    return (
        <div className="mb-3">
            <Label>Dependency condition</Label>
            <Select
                value={selectedGroup}
                onChange={() => {
                    handleSelectGroup();
                }}
                options={conditionList}
                classNamePrefix="select2-selection"
            />
        </div>
    )
}

export default Conditions;