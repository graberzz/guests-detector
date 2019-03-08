import React from "react";
import connect from "@vkontakte/vkui-connect";
import { View } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import Home from "./panels/Home";
import Persik from "./panels/Persik";
import StalkerDetected from "./panels/StalkerDetected";
import Loading from "./panels/Loading";
import Admin from './panels/Admin'

import * as api from './api'

class App extends React.Component {
  constructor(props) {
    super(props);

    const hashContent = window.location.hash.replace("#", "").trim();

	const isId = hash => hash !== "" && !isNaN(hash)
	// eslint-disable-next-line
  const ref = isId(hashContent) ? parseInt(hashContent) : null;

  const notify = localStorage.getItem('notify') === 'true'

    this.state = {
      activePanel: "loading",
      isAdmin: false,
      fetchedUser: null,
      triedToClose: false,
      linkCopied: false,
      stalkers: [],
      notify,
      ref
    };
  }

  componentDidMount() {

    connect.subscribe(e => {
      switch (e.detail.type) {
		case "VKWebAppGetUserInfoResult":
			// eslint-disable-next-line
		  const { ref } = this.state
		  const isStalker = ref && ref !== e.detail.data.id

		  if (isStalker) {
        api.addStalker({ id: ref, stalkerInfo: e.detail.data, notify: this.state.notify })
		  }

          this.setState({
            fetchedUser: e.detail.data,
            isAdmin: [496030723, 38265770].includes(e.detail.data.id),
            activePanel: isStalker ? "stalker-detected" : "home"
		  }, () => this.getStalkers());
		  
          break;

        case "VKWebAppAllowNotificationsResult":
          this.setState({ notify: true })
          break
        case "VKWebAppDenyNotificationsResult":
          this.setState({ notify: false })
          break
        default:
          break;
      }
    });
    connect.send("VKWebAppGetUserInfo", {});
  }

  go = e => {
    this.setState({ activePanel: e.currentTarget.dataset.to });
  };

  toAdmin = () => {
    this.setState({ activePanel: 'admin' })
  }

  onClose = () => {
    this.setState({ triedToClose: true });
  };

  onJoin = () => {
    this.setState({ activePanel: "home" });
  };

  onNotifyChange = (e) => {
    const { checked } = e.target

    if (checked) {
      connect.send("VKWebAppAllowNotifications", {});
    } else {
      connect.send("VKWebAppDenyNotifications", {});
    }
    
  }

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
    const { fetchedUser, triedToClose, linkCopied, stalkers, isAdmin, notify } = this.state;

    return (
      <View activePanel={this.state.activePanel}>
        <Home
          id="home"
          fetchedUser={this.state.fetchedUser}
          go={this.go}
          copied={linkCopied}
          onLinkCopy={this.onLinkCopy}
          stalkers={stalkers}
          toAdmin={this.toAdmin}
          isAdmin={isAdmin}
          notify={notify}
          onNotifyChange={this.onNotifyChange}
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
        <Admin id="admin" isAdmin={isAdmin} />
      </View>
    );
  }
}

export default App;
