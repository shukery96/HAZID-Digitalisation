import React, { Component } from "react";
import { Typography, Divider } from "antd";

const { Title } = Typography;

export default class DisplayUploadData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jsonData: [],
    };
  }

  render() {
    const { data } = this.props;
    return (
      <div className="display-upload-data-component">
        <div className="dud-header">
          <Title className="dud-header-workshop-name" level={2}>
            Workshop Name : {data.workshopName}{" "}
          </Title>
          <Title className="dud-header-no-components" level={4}>
            No of Nodes in Workshop : {data.nodes.length}
          </Title>
        </div>

        <div className="dud-body">
          {data.nodes.map((node, index) => {
            return (
              <div className="dud-node-component-item" key={index}>
                <Divider style={{ minWidth: "20%" }} dashed={true} />
                <div className="dud-component-name">
                  Name of Node: {node.nodeName}
                </div>
                <div>
                  {node.subnodes.map((subnode, subIndex) => {
                    return (
                      <div key={subIndex}>
                        <div className="dud-subcomponent-name">
                          Name of Subnode: {subnode.subnodeName}
                        </div>

                        <div className="dud-col-overview">
                          <div className="dud-col-heading">Hazard</div>
                          <div className="dud-col-heading">Causes</div>
                          <div className="dud-col-heading">Consequences</div>
                          <div className="dud-col-heading">
                            Preventative Safeguards
                          </div>
                          <div className="dud-col-heading">
                            Mitigating Safeguards
                          </div>
                        </div>

                        {subnode.hazards.map((hazard, hazardIndex) => {
                          return (
                            <div
                              className="dud-hazard-overview"
                              key={hazardIndex}
                            >
                              <div className="dud-body-col">
                                <div className="dud-hazard-name">
                                  {hazard.hazardName}
                                </div>
                              </div>

                              <div className="dud-body-col">
                                <div className="dud-points">
                                  {hazard.causes.map((cause, causeIndex) => {
                                    return (
                                      <div key={causeIndex}> • {cause}</div>
                                    );
                                  })}
                                </div>
                              </div>

                              <div className="dud-body-col">
                                <div className="dud-points">
                                  {hazard.consequences.map(
                                    (consequence, consequenceIndex) => {
                                      return (
                                        <div key={consequenceIndex}>
                                          • {consequence}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>

                              <div className="dud-body-col">
                                <div className="dud-points">
                                  {hazard.preventativeSafeguards.map(
                                    (
                                      preventativeSafeguard,
                                      preventativeSafeguardIndex
                                    ) => {
                                      return (
                                        <div key={preventativeSafeguardIndex}>
                                          • {preventativeSafeguard}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>

                              <div className="dud-body-col">
                                <div className="dud-points">
                                  {hazard.mitigatingSafeguards.map(
                                    (
                                      mitigatingSafeguard,
                                      mitigatingSafeguardIndex
                                    ) => {
                                      return (
                                        <div key={mitigatingSafeguardIndex}>
                                          • {mitigatingSafeguard}
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
