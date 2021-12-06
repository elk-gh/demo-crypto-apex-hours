({
    doInit: function (component, event, helper) {
        helper.generateKey(component);
    },
    onAlgorithmChange: function (component, event, helper) {
        helper.generateKey(component);
    },
});