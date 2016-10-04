import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Dropzone from 'react-dropzone';

import IconButton from 'material-ui/IconButton';
import AppBar from 'material-ui/AppBar';

//## Include Icon Component
import IconButtonUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import IconButtonDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Slider from 'material-ui/Slider';


var idOfSetTimeout = -1;

const DEF_AD_WIDTH = 250;
const DEF_AD_HEIGHT = 300;
const DEF_COUPON_CODE = "{COUPON}";
const DEF_URL_FOR_LINK = "{CLICK_URL}";

class App extends Component {

    getChildContext() {
        return {
            muiTheme: getMuiTheme(baseTheme)
        };
    }

    constructor(props) {
        console.log("## constructor");
        super(props); // exception thrown here when not called

        this.state = {
            codePosUp: "193",
            touchAreaTop: "0",
            touchAreaBottom: "70",
            touchAreaBackgroundColor: "transparent",
            adcontent: "",
            urlForLink: DEF_URL_FOR_LINK,
            couponCode: DEF_COUPON_CODE
        };
    }

    onDrop(files) {
        console.log(">> onDrop:", files[0]);
        let file = files[0];

        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = window.URL.createObjectURL(file);
        console.log("img src: ", img.src);

        img.onload = () => {

            console.log("++ image.onLoad");
            // Create an empty canvas element
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            // Copy the image contents to the canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // Get the data-URL formatted image
            // Firefox supports PNG and JPEG. You could check img.src to
            // guess the original format, but be aware the using "image/jpg"
            // will re-encode the image.
            var dataURL = canvas.toDataURL("image/png");

            //console.log(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
            //console.log(dataURL);
            console.log("Change Image");
            // this.setState({
            //     adImageSrc: dataURL
            // });

            document.getElementById("ad_image").setAttribute("src", dataURL);
        }
    }

    componentDidMount() {
        document.getElementById("code_string").innerHTML = "{COUPON}"
    }

    onChangeCouponCodePos(action) {
        console.log(">> onChangeCouponCodePos");
        let posTop = this.state.codePosUp;
        if (action == "up") {
            posTop = parseInt(posTop) - 1;
            console.log("move code pos top: ", posTop);
        } else if (action == "down") {
            posTop = parseInt(posTop) + 1;
            console.log("move code pos down: ", posTop);
        }

        this.setState({
            codePosUp: posTop
        });
    }

    onChangeTouchAreaPos(position, action) {
        console.log(">> onChangeTouchAreaPos:", position);

        switch (position) {
            case "top":

                if (action == "up") {
                    let pos = this.state.touchAreaTop;
                    pos = parseInt(pos) - 1;
                    if (pos < 0) {
                        pos = 0;
                    }
                    console.log("move touch area top: ", pos);
                    this.setState({
                        touchAreaTop: pos
                    });
                } else if (action == "down") {
                    let pos = this.state.touchAreaTop;
                    pos = parseInt(pos) + 1;
                    if (pos > DEF_AD_WIDTH) {
                        pos = DEF_AD_WIDTH;
                    }
                    console.log("move touch area top: ", pos);
                    this.setState({
                        touchAreaTop: pos
                    });
                }

                break;

            case "bottom":

                if (action == "up") {
                    let pos = this.state.touchAreaBottom;
                    pos = parseInt(pos) - 1;
                    console.log("move touch area bottom: ", pos);
                    this.setState({
                        touchAreaBottom: pos
                    });
                } else if (action == "down") {
                    let pos = this.state.touchAreaBottom;
                    pos = parseInt(pos) - 1;
                    console.log("move touch area bottom: ", pos);
                    this.setState({
                        touchAreaBottom: pos
                    });
                }

                break;
        }

        this.showTouchAreaTemporarily();
    }

    showTouchAreaTemporarily() {
        console.log(">> showTouchAreaTemporarily");
        this.setState({
            touchAreaBackgroundColor: "rgba(255,0,0,0.2)"
        });

        clearTimeout(idOfSetTimeout);
        idOfSetTimeout = setTimeout(() => {
            this.setState({
                touchAreaBackgroundColor: "transparent"
            });
        }, 2000);
    }

    onCodePosSliderChange(event, value) {
        console.log(">> onCodePosSliderChange:", value, value*(DEF_AD_WIDTH*100/100));
        this.setState({
            codePosUp: parseInt(value*(DEF_AD_WIDTH*100/100))
        });
    }

    onLinkPosTopSliderChange(event, value) {
        console.log(">> onLinkPosTopSliderChange:", value, value*(DEF_AD_HEIGHT*100/100));
        this.setState({
            touchAreaTop: parseInt(value*(DEF_AD_HEIGHT*100/100))
        });
        this.showTouchAreaTemporarily();
    }

    onLinkPosBottomSliderChange(event, value) {
        console.log(">> onLinkPosBottomSliderChange:", value, value*(DEF_AD_HEIGHT*100/100));
        this.setState({
            touchAreaBottom: parseInt(value*(DEF_AD_HEIGHT*100/100))
        });
        this.showTouchAreaTemporarily();
    }

    splashOutput() {

    }

    buildAdContent() {
        console.log(">> buildAdContent");
        this.copyToClipboard(document.getElementById("output_web_ad"));
        this.setState({backgroundForResult: "yellow"});
        setTimeout(() => {
            this.setState({backgroundForResult: "white"});
            document.getElementById("output_web_ad").value = document.getElementById("container").innerHTML;
        }, 500);
    }

    copyToClipboard(elem) {
    	  // create hidden text element, if it doesn't already exist
        var targetId = "_hiddenCopyText_";
        var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
        var origSelectionStart, origSelectionEnd;
        if (isInput) {
            // can just use the original source element for the selection and copy
            target = elem;
            origSelectionStart = elem.selectionStart;
            origSelectionEnd = elem.selectionEnd;
        } else {
            // must use a temporary form element for the selection and copy
            target = document.getElementById(targetId);
            if (!target) {
                var target = document.createElement("textarea");
                target.style.position = "absolute";
                target.style.left = "-9999px";
                target.style.top = "0";
                target.id = targetId;
                document.body.appendChild(target);
            }
            target.textContent = elem.textContent;
        }
        // select the content
        var currentFocus = document.activeElement;
        target.focus();
        target.setSelectionRange(0, target.value.length);

        // copy the selection
        var succeed;
        try {
        	  succeed = document.execCommand("copy");
        } catch(e) {
            succeed = false;
        }
        // restore original focus
        if (currentFocus && typeof currentFocus.focus === "function") {
            currentFocus.focus();
        }

        if (isInput) {
            // restore prior selection
            elem.setSelectionRange(origSelectionStart, origSelectionEnd);
        } else {
            // clear temporary content
            target.textContent = "";
        }
        return succeed;
    }

    onCouponCodeTextChange(e) {
        this.setState({
            couponCode: e.target.value
        });
    }

    onLinkUrlChange(e) {
        this.setState({
            urlForLink: e.target.value
        });
    }

    resetPlaceholder() {
        this.setState({
            urlForLink: DEF_URL_FOR_LINK,
            couponCode: DEF_COUPON_CODE
        });
    }

    render() {

        //let dropboxStyle= {background: "url(./images/add.png) no-repeat center", height: "250px", marginLeft: "auto", marginRight: "auto", cursor: "pointer", };

        return (
          <div className="App">
            <AppBar titleStyle={{fontSize: "2rem"}} style={{ backgroundColor: "rgb(23,53,102)"}} ref="appbar" title="Web AD Designer" />
            <p className="App-intro">
              Here is a tool to get web content for AD
            </p>

            <div style={{display: "flex"}}>
              <div>
                <h4>1. Provide an image</h4>
                <Dropzone onDrop={this.onDrop}>
                  <p style={{textAlign: "center", marginTop: "90px"}}>Drop Image Here</p>
                </Dropzone>
              </div>
              <div>
              <h4>2. Preview</h4>
              <div style={{marginLeft: "10px", marginRight: "10px", width: "300px", height: "250px", textAlign: "center", border: "1px solid gray"}}>
                <div id="container" style={{ margin:"0px"}}>
                    <div style={{position: "relative"}}>
                        <img id="ad_image" ref="ad_image" style={{width:"300px",height:"250px"}} />
                        <div id="code_container" style={{left: "0px", width: "100%",marginLeft: "auto",display: "inline-block",position: "absolute",top: this.state.codePosUp + "px",marginRight: "auto"}}>
                            <p id="code_string" style={{fontWeight:"bold",textAlign:"center",fontSize:"1rem"}}>
                              {this.state.couponCode}
                            </p>
                        </div>
                        <a id="link" href={this.state.urlForLink} style={{backgroundColor: this.state.touchAreaBackgroundColor, left: "0px", width: "300px",top: this.state.touchAreaTop + "px", bottom: this.state.touchAreaBottom + "px", position: "absolute"}}>
                        </a>
                    </div>
                </div>
              </div>
              </div>
              <div id="controlling_area">
                <h4>3. Fine-tune positions</h4>
                <div style={{display: "flex"}}>
                    <div style={{display:"flex", flexDirection:"column"}}>
                        <IconButton onTouchTap={this.onChangeCouponCodePos.bind(this,  "up")}><IconButtonUp /></IconButton>
                        <IconButton onTouchTap={this.onChangeCouponCodePos.bind(this, "down")}><IconButtonDown /></IconButton>
                    </div>
                    <div>
                        <TextField
                            value={this.state.codePosUp}
                          hintText="Hint Text"
                          floatingLabelText="Position of coupon code. (px)"
                          disabled={true} />
                          <Slider value={this.state.codePosUp/DEF_AD_WIDTH}
                            onChange={this.onCodePosSliderChange.bind(this)}/>
                    </div>
                </div>
                <div style={{display: "flex"}}>
                    <div style={{display:"flex", flexDirection:"column"}}>
                        <IconButton onTouchTap={this.onChangeTouchAreaPos.bind(this,  "top", "up")}><IconButtonUp /></IconButton>
                        <IconButton onTouchTap={this.onChangeTouchAreaPos.bind(this, "top", "down")}><IconButtonDown /></IconButton>
                    </div>
                    <div>
                        <TextField
                            value={this.state.touchAreaTop}
                          floatingLabelText="Top position for link. (px)"
                          disabled={true} />
                          <Slider value={this.state.touchAreaTop/DEF_AD_HEIGHT}
                            onChange={this.onLinkPosTopSliderChange.bind(this)}/>
                    </div>
                </div>

                <div style={{display: "flex"}}>
                    <div style={{display:"flex", flexDirection:"column"}}>
                      <IconButton onTouchTap={this.onChangeTouchAreaPos.bind(this, "bottom", "up")}><IconButtonUp /></IconButton>
                      <IconButton onTouchTap={this.onChangeTouchAreaPos.bind(this, "bottom", "down")}><IconButtonDown /></IconButton>
                    </div>
                    <div>
                        <TextField
                            value={this.state.touchAreaBottom}
                          floatingLabelText="Bottom position for link. (px)"
                          disabled={true} />
                          <Slider value={this.state.touchAreaBottom/DEF_AD_HEIGHT}
                            onChange={this.onLinkPosBottomSliderChange.bind(this)}/>
                    </div>
                </div>
              </div>
              <div style={{marginLeft: "30px"}}>
                  <div style={{display:"flex", flexDirection:"column"}}>
                      <h3>Optional:</h3>
                      <TextField
                          value={this.state.couponCode}
                        floatingLabelText="Placeholder for coupon"
                        onChange={this.onCouponCodeTextChange.bind(this)}
                        />

                      <TextField
                        value={this.state.urlForLink}
                      floatingLabelText="URL for link"
                      onChange={this.onLinkUrlChange.bind(this)}
                      />
                      <RaisedButton style={{marginTop: "20px"}} onTouchTap={this.resetPlaceholder.bind(this)} label="reset"/>
                  </div>
              </div>
            </div>
            <RaisedButton primary={true} onTouchTap={this.buildAdContent.bind(this)} label="Get content of web AD"/>
            <div style={{width: "100%", minHeight: "50px"}}>
              <textarea id="output_web_ad" style={{width: "90%", minHeight: "50px", backgroundColor: this.state.backgroundForResult}} value={this.state.adcontent}/>
            </div>

          </div>
        );
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};

export default App;
