import React from "react";
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
} from "reactstrap";


//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const FormXeditable = () => {
  document.title = "Form Xeditable | Veltrix - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs maintitle="Veltrix" title="Forms" breadcrumbItem="Form Xeditable" />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <CardTitle className="h4">Inline Example</CardTitle>
                  <CardSubtitle className="mb-3">
                    This library allows you to create editable elements on your
                    page. It can be used with any engine (bootstrap, jquery-ui,
                    jquery only) and includes both popup and inline modes.
                    Please try out demo to see how it works.
                  </CardSubtitle>

                  <div className="table-responsive">
                    <Table responsive striped className="table-nowrap mb-0">
                      <thead>
                        <tr>
                          <th style={{ width: "50%" }}>Inline</th>
                          <th>Examples</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Simple Text Field</td>
                          <td>

                          </td>
                        </tr>
                        <tr>
                          <td>Empty text field, required</td>
                          <td>
                           
                          </td>
                        </tr>
                        <tr>
                          <td>Select, local array, custom display</td>
                          <td>
                            
                          </td>
                        </tr>

                        <tr>
                          <td>Combodate</td>
                          <td>
                            
                          </td>
                        </tr>
                        <tr>
                          <td>Textarea, buttons below. Submit by ctrl+enter</td>
                          <td>
                           
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default FormXeditable;
