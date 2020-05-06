import React from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  markMessageAsRead,
  subscribeToMessages,
} from "../store/actions/collaborationActions";

const ReceivedMessages = ({ auth: { user }, markMessageAsRead }) => {
  const history = useHistory();

  const goToCollaboration = message => {
    markMessageAsRead(message);
    history.push(message.cta);
  };

  const renderMessages = messages => {
    const filteredMessages = messages
      .filter(m => !m.isRead)
      .map(message => (
        <div key={message.id}>
          <div className="from-user">
            <span>From: </span>
            {message.fromUser.name}
          </div>
          <hr />
          <div className="navbar-item navbar-item-message">
            <div>{message.text}</div>
            <div onClick={() => goToCollaboration(message)}>
              <div className="button is-success" style={{ margin: "0 10px" }}>
                Join
              </div>
            </div>
            <button
              onClick={() => markMessageAsRead(message)}
              className="button is-warning"
            >
              Later
            </button>
          </div>
        </div>
      ));

    if (filteredMessages.length === 0) {
      return <div className="navbar-item">No Messages :(</div>;
    }

    return filteredMessages;
  };

  return renderMessages(user.messages);
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  markMessageAsRead,
  subscribeToMessages,
})(ReceivedMessages);
