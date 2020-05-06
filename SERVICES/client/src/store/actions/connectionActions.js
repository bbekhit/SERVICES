import * as api from "../../api";

export const checkUserConnection = uid => {
  const userStatusDatabaseRef = api.createFirebaseRef("status", uid);
  //   status
  //      bzY21nKLrBSNHxPyWzZueHceROD2
  //          last_changed:1586814694062
  //           state:"online"
  api.onConnectionChanged(isConnected => {
    if (!isConnected) {
      userStatusDatabaseRef.set(api.isOfflineForDatabase);
      return null;
    }

    userStatusDatabaseRef
      .onDisconnect()
      .set(api.isOfflineForDatabase)
      .then(_ => userStatusDatabaseRef.set(api.isOnlineForDatabase));
  });
};
