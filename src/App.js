import React from "react";
import connect from "@vkontakte/vkui-connect";
import { View } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import Home from "./panels/Home";
import Persik from "./panels/Persik";
import StalkerDetected from "./panels/StalkerDetected";
import Loading from "./panels/Loading";

import * as api from './api'

class App extends React.Component {
  constructor(props) {
    super(props);

    const hashContent = window.location.hash.replace("#", "").trim();

	const isId = hash => hash !== "" && !isNaN(hash)
	// eslint-disable-next-line
    const ref = isId(hashContent) ? parseInt(hashContent) : null;

    this.state = {
      activePanel: "loading",
      fetchedUser: null,
      triedToClose: false,
      linkCopied: false,
      ref
    };
  }

  componentDidMount() {

    connect.subscribe(e => {
      switch (e.detail.type) {
		case "VKWebAppGetUserInfoResult":
			// eslint-disable-next-line
		  const isStalker = this.state.ref != e.detail.data.id
		  
		  if (isStalker) {
			  api.addStalker({ id: this.state.ref, stalkerInfo: e.detail.data })
		  }

          this.setState({
            fetchedUser: e.detail.data,
            activePanel: isStalker ? "stalker-detected" : "home"
		  }, () => this.getStalkers());
		  
          break;
        default:
          break;
      }
    });
    connect.send("VKWebAppGetUserInfo", {});
  }

  go = e => {
    this.setState({ activePanel: e.currentTarget.dataset.to });
  };

  onClose = () => {
    this.setState({ triedToClose: true });
  };

  onJoin = () => {
    this.setState({ activePanel: "home" });
  };

  async getStalkers() {
	  const stalkers = await api.getStalkers({ id: this.state.fetchedUser.id })

	  this.setState({ stalkers })
  }

  onLinkCopy = () => {
    this.setState({
      linkCopied: true
    });

    const ta = document.createElement('textarea');
    ta.value = `https://vk.com/app6884076#${this.state.fetchedUser.id}`;

    document.body.appendChild(ta);
    ta.focus();
    ta.select();

    try {
		const successful = document.execCommand('copy')

		if (successful) {
			this.setState({ linkCopied: true })
		}
    } catch (e) {}

    document.body.removeChild(ta);
  };

  render() {
    const { fetchedUser, triedToClose, linkCopied, stalkers } = this.state;

    return (
      <View activePanel={this.state.activePanel}>
        <Home
          id="home"
          fetchedUser={this.state.fetchedUser}
          go={this.go}
		  copied={linkCopied}
		  onLinkCopy={this.onLinkCopy}
		  stalkers={stalkers}
        />
        <StalkerDetected
          id="stalker-detected"
          stalker={fetchedUser}
          triedToClose={triedToClose}
          onClose={this.onClose}
          go={this.go}
        />
        <Persik id="persik" go={this.go} />
        <Loading id="loading" />
      </View>
    );
  }
}

export default App;
