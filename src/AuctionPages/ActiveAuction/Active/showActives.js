import React, {Fragment} from 'react';

import {currentHeight,} from '../../../auction/explorer';
import {css} from '@emotion/core';
import PropagateLoader from 'react-spinners/PropagateLoader';
import {Row,} from 'reactstrap';
import ActivePicture from './activePicture';
import SendModal from "./sendModal";
import ActiveAudio from "./activeAudio";
import ActiveOther from "./activeOther";

const override = css`
  display: block;
  margin: 0 auto;
`;

export default class ShowAuctions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastUpdated: 0,
            modal: false,
            loading: false,
            auctions: props.auctions,
            tooltip: false,
            currentHeight: 0,
            myBids: false,
        };
        this.closeMyBids = this.closeMyBids.bind(this);
        this.toggleAssemblerModal = this.toggleAssemblerModal.bind(this);
    }

    componentDidMount() {
        currentHeight().then((res) => {
            this.setState({height: res});
        });
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({auctions: nextProps.auctions})
    }

    closeMyBids() {
        this.setState(this.setState({myBids: false}));
    }

    toggleAssemblerModal(address = '', bid = 0, isAuction = false, currency = 'ERG') {
        this.setState({
            assemblerModal: !this.state.assemblerModal,
            bidAddress: address,
            bidAmount: bid,
            isAuction: isAuction,
            currency: currency
        });
    }

    render() {
        const listItems = this.state.auctions.map((box) => {
            if (box.isPicture) {
                return (
                    <ActivePicture
                        box={box}
                        assemblerModal={this.toggleAssemblerModal}
                    />
                );
            } else if (box.isAudio) {
                return (
                    <ActiveAudio
                        box={box}
                        assemblerModal={this.toggleAssemblerModal}
                    />
                );
            } else {
                return (
                    <ActiveOther
                        box={box}
                        assemblerModal={this.toggleAssemblerModal}
                    />
                );
            }
        });
        return (
            <Fragment>
                <SendModal
                    isOpen={this.state.assemblerModal}
                    close={this.toggleAssemblerModal}
                    bidAmount={this.state.bidAmount}
                    isAuction={this.state.isAuction}
                    bidAddress={this.state.bidAddress}
                    currency={this.state.currency}
                />

                {!this.state.loading && this.state.auctions.length === 0 && (
                    <strong
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        No Active Auctions
                    </strong>
                )}
                {this.state.loading ? (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <PropagateLoader
                            css={override}
                            size={20}
                            color={'#0086d3'}
                            loading={this.state.loading}
                        />
                    </div>
                ) : (
                    <Row>{listItems}</Row>
                )}
            </Fragment>
        );
    }
}
