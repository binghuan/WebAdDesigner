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


var idOfSetTimeout = -1;

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
            adcontent: ""
        };
    }

    getBase64Image(img) {

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
                    if (pos > 250) {
                        pos = 250;
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

        console.log("set Color");
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

    buildAdContent() {
        console.log(">> buildAdContent");
        document.getElementById("output_web_ad").value = document.getElementById("container").innerHTML;
    }

    render() {

        //let dropboxStyle= {background: "url(./images/add.png) no-repeat center", height: "250px", marginLeft: "auto", marginRight: "auto", cursor: "pointer", };

        return (
          <div className="App">
            <AppBar titleStyle={{fontSize: "2rem"}} style={{ backgroundColor: "rgb(23,53,102)"}} ref="appbar" title="Web AD Designer" />
            <p className="App-intro">
              To get started, edit <code>src/App.js</code> and save to reload.
            </p>

            <div style={{display: "flex"}}>
              <div>
                <Dropzone onDrop={this.onDrop}>
                  <p style={{textAlign: "center", marginTop: "90px"}}>Drop Image Here</p>
                </Dropzone>
              </div>
              <div style={{marginLeft: "10px", marginRight: "10px", width: "300px", height: "250px", textAlign: "center", border: "1px solid gray"}}>
                <div id="container" style={{ margin:"0px"}}>
                    <div style={{position: "relative"}}>
                        <img id="ad_image" ref="ad_image" style={{width:"300px",height:"250px"}} />
                        <div id="code_container" style={{left: "0px", width: "100%",marginLeft: "auto",display: "inline-block",position: "absolute",top: this.state.codePosUp + "px",marginRight: "auto"}}>
                            <p id="code_string" style={{fontWeight:"bold",textAlign:"center",fontSize:"1rem"}}>
                              {this.coupon}
                            </p>
                        </div>
                        <a id="link" href="{CLICK_URL}" style={{backgroundColor: this.state.touchAreaBackgroundColor, left: "0px", width: "300px",top: this.state.touchAreaTop + "px", bottom: this.state.touchAreaBottom + "px", position: "absolute"}}>
                        </a>
                    </div>
                </div>
              </div>
              <div id="controlling_area">
                <p>Adjust the position of coupon code</p>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <IconButton onTouchTap={this.onChangeCouponCodePos.bind(this,  "up")}><IconButtonUp /></IconButton>
                    <IconButton onTouchTap={this.onChangeCouponCodePos.bind(this, "down")}><IconButtonDown /></IconButton>
                </div>
                <p>Adjust the top position of touch area</p>
                <div style={{display:"flex", flexDirection:"column"}}>
                    <IconButton onTouchTap={this.onChangeTouchAreaPos.bind(this,  "top", "up")}><IconButtonUp /></IconButton>
                    <IconButton onTouchTap={this.onChangeTouchAreaPos.bind(this, "top", "down")}><IconButtonDown /></IconButton>

                </div>

                <p>Adjust the bottom position of touch area</p>
                <div style={{display:"flex", flexDirection:"column"}}>
                  <IconButton onTouchTap={this.onChangeTouchAreaPos.bind(this, "bottom", "up")}><IconButtonUp /></IconButton>
                  <IconButton onTouchTap={this.onChangeTouchAreaPos.bind(this, "bottom", "down")}><IconButtonDown /></IconButton>
                </div>

              </div>
            </div>
            <RaisedButton onTouchTap={this.buildAdContent.bind(this)} label="Get content of web AD"/>
            <div style={{width: "100%", minHeight: "50px"}}>
              <textarea id="output_web_ad" style={{width: "90%", minHeight: "50px"}} value={this.state.adcontent}/>
            </div>

          </div>
        );
    }
}

App.childContextTypes = {
    muiTheme: React.PropTypes.object.isRequired,
};

export default App;
