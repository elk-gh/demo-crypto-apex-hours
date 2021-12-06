({
  encrypt: function (component) {
    try {
      var action = component.get("c.encryptApex");
      action.setParams({
        valueToEncrypt: component.get("v.input"),
        key: component.get("v.key"),
        algorithm: component.get("v.algorithm")
      });
      action.setCallback(this, function (response) {
        var state = response.getState();
        if (state === "SUCCESS") {
          component.set("v.output", response.getReturnValue());
        }
      });
      $A.enqueueAction(action);
    } catch (error) {
      console.log(error);
    }
  },
  decrypt: function (component) {
    try {
      var action = component.get("c.decryptApex");
      action.setParams({
        valueToDecrypt: component.get("v.input"),
        key: component.get("v.key"),
        algorithm: component.get("v.algorithm")
      });
      action.setCallback(this, function (response) {
        var state = response.getState();
        if (state === "SUCCESS") {
          component.set("v.output", response.getReturnValue());
        }
      });
      $A.enqueueAction(action);
    } catch (error) {
      console.log(error);
    }
  }
});
