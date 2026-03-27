export function firebaseScreenView(groupId, screenId) {
  my.call("firebaseScreenView", {
    "GroupId": groupId,
    "ScreenId": screenId
  }, () => {});
}

export function firebaseEvent(groupId, eventName, eventValue) {
  const eventObject = {
    "groupId": groupId,
    "event": [{
      "name": eventName,
      "value": eventValue
    }]
  };

  const stringifiedData = JSON.stringify(eventObject);

  my.call("firebaseEvent", {
    data: stringifiedData
  }, () => {});
}