import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Private from "../components/Hoc/Private";
import { fetchCollaborations } from "../store/actions/collaborationActions";
import moment from "moment";
import Spinner from "../components/spinner/Spinner";

const ReceivedCollaborations = ({ auth: { user }, fetchCollaborations }) => {
  const [collaborations, setCollaborations] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      let result = await fetchCollaborations(user.uid);
      setCollaborations(result);
    };
    fetchData();
  }, [fetchCollaborations, user.uid]);
  return (
    <div className="content-wrapper">
      <div className="container">
        <h1 className="title">Collaborations</h1>
        <div className="box content">
          {collaborations.length > 0 ? (
            collaborations.map(c => (
              <article key={c.id} className="post">
                <h4>{c.title}</h4>
                <div className="media">
                  <div className="media-left">
                    <p className="image is-32x32">
                      <img src={c.image} alt={c.title} />
                    </p>
                  </div>
                  <div className="media-content">
                    <div className="content">
                      <p>
                        <span>{c.fromUser.name}</span> replied{" "}
                        {moment(c.createdAt.toDate()).fromNow()} &nbsp;
                        <span className="tag">{c.status}</span>
                      </p>
                    </div>
                  </div>
                  <div className="media-right">
                    <span className="has-text-grey-light">
                      <Link to={`/collaborations/${c.id}`}>
                        <button className="button">Enter</button>
                      </Link>
                    </span>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default connect(null, { fetchCollaborations })(
  Private(ReceivedCollaborations, "auth")
);
