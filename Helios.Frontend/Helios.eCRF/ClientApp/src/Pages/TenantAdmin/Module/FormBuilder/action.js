import React, { useState, useEffect, ListItem } from 'react';
import { Button, Card, CardBody, Col, Container, Form, FormGroup, Input, InputGroup, Label, Row } from "reactstrap";
import Select from "react-select";

const actionList = [
    {
        label: "Dependency action",
        options: [
            { label: "Show", value: 1 },
            { label: "More", value: 2 },
        ]
    }
];

const Actions = props => {
    const [selectedGroup, setselectedGroup] = useState(null);

    const handleSelectGroup = (selectedGroup) => {
        setselectedGroup(selectedGroup);
    };

    return (
        <div className="mb-3">
            <Label>Dependency action</Label>
            <Select
                value={selectedGroup}
                onChange={() => {
                    handleSelectGroup();
                }}
                options={actionList}
                classNamePrefix="select2-selection"
            />
        </div>
    )
}

export default Actions;