// import React from "react";
// import { BrowserRouter as Router } from "react-router-dom";
// import firebase from "firebase/app";
// import "firebase/auth";
// import {
//   storeAuthUser,
//   resetAuthState,
//   resolveAuthState,
// } from "./store/actions/authActions";
// import { subscribeToMessages } from "./store/actions/collaborationActions";
// import { checkUserConnection } from "./store/actions/connectionActions";
// import { Provider } from "react-redux";
// import { ToastProvider } from "react-toast-notifications";
// import initStore from "./store/store";
// import ServiceApp from "./ServiceApp";

// const store = initStore();

// class App extends React.Component {
//   async componentDidMount() {
//     this.unsubscribeAuth = firebase.auth().onAuthStateChanged(async user => {
//       store.dispatch(resetAuthState());
//       if (user) {
//         await store.dispatch(storeAuthUser(user));
//         checkUserConnection(user.uid);
//         this.unsubscribeMessages = store.dispatch(
//           subscribeToMessages(user.uid)
//         );
//       } else if (!user) {
//         store.dispatch(resolveAuthState());
//         this.unsubscribeMessages && this.unsubscribeMessages();
//       }
//     });
//   }

//   componentWillUnmount() {
//     this.unsubscribeAuth();
//     this.unsubscribeMessages();
//   }

//   render() {
//     return (
//       <Provider store={store}>
//         <ToastProvider>
//           <Router>
//             <ServiceApp />
//           </Router>
//         </ToastProvider>
//       </Provider>
//     );
//   }
// }

// export default App;

import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/auth";
import {
  storeAuthUser,
  resetAuthState,
  resolveAuthState,
  onAuthStateChanged,
} from "./store/actions/authActions";
import { subscribeToMessages } from "./store/actions/collaborationActions";
import { checkUserConnection } from "./store/actions/connectionActions";
import { Provider } from "react-redux";
import { ToastProvider } from "react-toast-notifications";
import initStore from "./store/store";
import ServiceApp from "./ServiceApp";

const store = initStore();

class App extends React.Component {
  componentDidMount() {
    this.unsubscribeAuth = onAuthStateChanged(authUser => {
      store.dispatch(storeAuthUser(authUser));

      if (authUser) {
        checkUserConnection(authUser.uid);
        this.unsubscribeMessages = store.dispatch(
          subscribeToMessages(authUser.uid)
        );
      }

      if (!authUser) {
        this.unsubscribeMessages && this.unsubscribeMessages();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribeAuth();
    this.unsubscribeMessages();
  }

  render() {
    return (
      <Provider store={store}>
        <ToastProvider>
          <Router>
            <ServiceApp />
          </Router>
        </ToastProvider>
      </Provider>
    );
  }
}

export default App;
