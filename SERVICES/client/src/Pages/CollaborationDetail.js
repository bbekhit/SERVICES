import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  subToCollaboration,
  joinCollaboration,
  subToProfile,
  leaveCollaboration,
  sendChatMessage,
  subToMessages,
  startCollaboration,
} from "../store/actions/collaborationActions";
import JoinedPeople from "../components/JoinedPeople";
import moment from "moment";
import ChatMessages from "../components/ChatMessages";
import { Timestamp } from "../db/index";
import Timer from "../components/Timer";
import Spinner from "../components/spinner/Spinner";

class CollaborationDetail extends React.Component {
  state = {
    inputValue: "",
    reload: false,
  };

  componentDidMount() {
    const { id } = this.props.match.params;
    const { user } = this.props.auth;

    joinCollaboration(id, user.uid);
    this.watchCollabChanges(id);
    this.watchMessagesChanges(id);
  }

  watchCollabChanges = id => {
    this.unsubscribeFromCollab = this.props.subToCollaboration(
      id,
      ({ joinedPeople }) => {
        this.watchJoinedPeopleChanges(joinedPeople.map(jp => jp.id));
      }
    );
  };

  watchMessagesChanges = collabId => {
    this.unsubscribeFromMessages = this.props.subToMessages(collabId);
  };

  watchJoinedPeopleChanges = ids => {
    this.peopleWatchers = {};
    ids.forEach(id => {
      this.peopleWatchers[id] = this.props.subToProfile(id);
    });
  };

  onKeyboardPress = e => {
    if (e.key === "Enter") {
      this.onSendMessage(this.state.inputValue);
    }
  };

  onSendMessage = inputValue => {
    if (inputValue.trim() === "") {
      return;
    }

    const timestamp = moment().valueOf().toString();
    const { user } = this.props.auth;
    const { collaboration } = this.props;
    console.log(collaboration);

    const message = {
      user: {
        uid: user.uid,
        avatar: user.avatar,
        name: user.fullName,
      },
      timestamp: parseInt(timestamp, 10),
      content: inputValue.trim(),
    };

    sendChatMessage({
      message,
      collabId: collaboration.id,
      timestamp,
    }).then(_ => this.setState({ inputValue: "" }));
  };

  onStartCollaboration = collaboration => {
    const { id, time } = collaboration;
    const nowSeconds = Timestamp.now().seconds;

    const expiresAt = new Timestamp(nowSeconds + time, 0);
    startCollaboration(id, expiresAt);
  };

  getCollaborationStatus = collaboration => {
    if (Object.keys(collaboration).length === 0) {
      return "loading";
    }

    if (!collaboration.expiresAt) {
      return "notStarted";
    }
    if (Timestamp.now().seconds < collaboration.expiresAt.seconds) {
      return "active";
    } else {
      return "finished";
    }
  };

  reloadPage = () => {
    this.setState({ reload: true });
  };

  componentWillUnmount() {
    const { id } = this.props.match.params;
    const { user } = this.props.auth;
    this.unsubscribeFromCollab();

    Object.keys(this.peopleWatchers).forEach(uid => this.peopleWatchers[uid]());

    leaveCollaboration(id, user.uid);
  }

  render() {
    const {
      collaboration,
      joinedPeople,
      messages,
      auth: { user },
    } = this.props;
    const { inputValue } = this.state;
    const status = this.getCollaborationStatus(collaboration);
    if (status === "loading") {
      return <Spinner />;
    }
    return (
      <div className="content-wrapper">
        <div className="root">
          <h1 className="title">{collaboration.title}</h1>
          <div className="body">
            <div className="viewListUser">
              <JoinedPeople users={joinedPeople} />
            </div>
            <div className="viewBoard">
              <div className="viewChatBoard">
                <div className="headerChatBoard">
                  <div className="headerChatUser">
                    <img
                      className="viewAvatarItem"
                      src="https://i.imgur.com/cVDadwb.png"
                      alt="icon avatar"
                    />
                    <span className="textHeaderChatBoard">{user.fullName}</span>
                  </div>
                  {status === "notStarted" && (
                    <div className="headerChatButton">
                      <button
                        onClick={() => this.onStartCollaboration(collaboration)}
                        className="button is-success"
                      >
                        Start Collaboration
                      </button>
                    </div>
                  )}
                  {status === "active" && (
                    <Timer
                      seconds={
                        collaboration.expiresAt.seconds -
                        Timestamp.now().seconds
                      }
                      timeOutCallback={this.reloadPage}
                    />
                  )}
                  {status === "finished" && (
                    <span className="tag is-warning is-large">
                      Collaboration has been finished
                    </span>
                  )}
                </div>
                <div className="viewListContentChat">
                  <ChatMessages authUser={user} messages={messages} />
                  <div style={{ float: "left", clear: "both" }}></div>
                </div>
                <div className="viewBottom">
                  <input
                    onChange={e =>
                      this.setState({ inputValue: e.target.value })
                    }
                    onKeyPress={this.onKeyboardPress}
                    value={inputValue}
                    className="viewInput"
                    placeholder="Type your message..."
                  />
                  <button
                    onClick={() => this.onSendMessage(inputValue)}
                    className="button is-primary is-large"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = () => ({
  subToCollaboration,
  subToProfile,
  sendChatMessage,
  subToMessages,
});

const mapStateToProps = state => {
  return {
    collaboration: state.collaboration.joined,
    joinedPeople: state.collaboration.joinedPeople,
    messages: state.collaboration.messages,
    auth: state.auth,
  };
};

const Collaboration = withRouter(CollaborationDetail);
export default connect(mapStateToProps, mapDispatchToProps())(Collaboration);
