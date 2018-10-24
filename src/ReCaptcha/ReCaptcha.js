import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
    className: PropTypes.string,
    onloadCallbackName: PropTypes.string,
    elementID: PropTypes.string,
    onloadCallback: PropTypes.func,
    verifyCallback: PropTypes.func,
    expiredCallback: PropTypes.func,
    render: PropTypes.string,
    sitekey: PropTypes.string,
    theme: PropTypes.string,
    type: PropTypes.string,
    verifyCallbackName: PropTypes.string,
    expiredCallbackName: PropTypes.string,
    size: PropTypes.string,
    tabindex: PropTypes.string,
    hl: PropTypes.string,
    badge: PropTypes.string,
};//end propTypes

const defaultProps = {
    elementID: 'g-recaptcha',
    onloadCallback: undefined,
    onloadCallbackName: 'onloadCallback',
    verifyCallback: undefined,
    verifyCallbackName: 'verifyCallback',
    expiredCallback: undefined,
    expiredCallbackName: 'expiredCallback',
    render: 'onload',
    theme: 'light',
    type: 'image',
    size: 'normal',
    tabindex: '0',
    hl: 'en',
    badge: 'bottomright',
};//end defaultProps

const isReady = () => typeof window !== 'undefined' && typeof window.grecaptcha !== 'undefined' && typeof window.grecaptcha.render === 'function';

let readyCheck;

class ReCaptcha extends Component {

    constructor(props) {
        super(props);
        this._renderGrecaptcha = this._renderGrecaptcha.bind(this);
        this.reset = this.reset.bind(this);
        this.execute = this.execute.bind(this);
        this.state = {
            ready: isReady(),
            widget: null,
        };

        if (!this.state.ready) {
            readyCheck = setInterval(this._updateReadyState.bind(this), 1000);
        }
    };//end constructor

    componentDidMount() {
        if (!!(this.state.ready)) {
            this._renderGrecaptcha();
        }
    };//end componentDidMount

    componentDidUpdate(prevProps, prevState) {
        const {render, onloadCallback} = this.props;

        if (render === 'explicit' && onloadCallback && this.state.ready && !prevState.ready) {
            this._renderGrecaptcha();
        }
    };//end componentDidUpdate

    componentWillUnmount() {
        clearInterval(readyCheck);
    };//end componentWillUnmount

    reset() {
        const {ready, widget} = this.state;
        if (ready && widget !== null) {
            window.grecaptcha.reset(widget);
        }
    };//end reset

    execute() {
        const { ready, widget } = this.state;
        if (ready && widget !== null) {
            window.grecaptcha.execute(widget);
        }
    };//end execute

    _updateReadyState() {
        if (isReady()) {
            this.setState({
                ready: true,
            });

            clearInterval(readyCheck);
        }
    };//end _updateReadyState

    _renderGrecaptcha() {
        this.state.widget = window.grecaptcha.render(this.props.elementID, {
            sitekey: this.props.sitekey,
            callback: (this.props.verifyCallback) ? this.props.verifyCallback : undefined,
            theme: this.props.theme,
            type: this.props.type,
            size: this.props.size,
            tabindex: this.props.tabindex,
            hl: this.props.hl,
            badge: this.props.badge,
            'expired-callback': (this.props.expiredCallback) ? this.props.expiredCallback : undefined,
        });

        if (this.props.onloadCallback) {
            this.props.onloadCallback();
        }
    };//end _renderGrecaptcha

    render() {
        if (this.props.render === 'explicit' && this.props.onloadCallback) {
            return (
                <div id={this.props.elementID}
                     data-onloadcallbackname={this.props.onloadCallbackName}
                     data-verifycallbackname={this.props.verifyCallbackName}
                />
            );
        } else {

        return (
            <div id={this.props.elementID}
                 className="g-recaptcha"
                 data-sitekey={this.props.sitekey}
                 data-theme={this.props.theme}
                 data-type={this.props.type}
                 data-size={this.props.size}
                 data-badge={this.props.badge}
                 data-tabindex={this.props.tabindex}
            />
        );
      }
    }//end render
};//end ReCaptcha Component

ReCaptcha.propTypes = propTypes;
ReCaptcha.defaultProps = defaultProps;

export default ReCaptcha;