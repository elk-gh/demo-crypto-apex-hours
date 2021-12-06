({
    generateKey: function (component) {
        try {
            var action = component.get("c.generateKey");
            action.setParams({
                algorithm: component.get("v.selectedAlgorithm")
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    component.set("v.key", response.getReturnValue());
                }
            });
            $A.enqueueAction(action);
        } catch (error) {
            console.log(error);
        }
    },
});