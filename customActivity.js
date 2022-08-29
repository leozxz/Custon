define(["postmonger"], function (Postmonger) {
  "use strict";

  var connection = new Postmonger.Session();
  var payload = {};
  var lastStepEnabled = false;
  var phonenumber = null;
  var email = null;
  var email_value = null;
  var phoneNumber = null;
  var idade_value = null;

  /* var steps = [
     // initialize to the same value as what's set in config.json for consistency
     { label: "Step 1", key: "step1" },
     { label: "Step 2", key: "step2" },
     { label: "Step 3", key: "step3" },
     { label: "Step 4", key: "step4", active: false },
   ];
   var currentStep = steps[0].key;
 */
  $(window).ready(onRender);

  connection.on("initActivity", initialize);
  connection.on("requestedTokens", onGetTokens);
  connection.on("requestedEndpoints", onGetEndpoints);
  connection.on('clickedNext', save);




  function onRender() {
    // JB will respond the first time 'ready' is called with 'initActivity'
    connection.trigger("ready");

    connection.trigger("requestTokens");
    connection.trigger("requestEndpoints");


  }

  function initialize(data) {
    if (data) {
      payload = data;
    }

    var message;
    var hasInArguments = Boolean(
      payload["arguments"] &&
      payload["arguments"].execute &&
      payload["arguments"].execute.inArguments &&
      payload["arguments"].execute.inArguments.length > 0
    );

    var inArguments = hasInArguments
      ? payload["arguments"].execute.inArguments
      : {};

    $.each(inArguments, function (index, inArgument) {
      $.each(inArgument, function (key, val) {
        if (key === "message") {
          message = val;
        }

      });
    });



  }

  function onGetTokens(tokens) {
    // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
    // console.log(tokens);
  }

  function onGetEndpoints(endpoints) {
    // Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
    // console.log(endpoints);
  }

  var eventDefinitionKey;
  connection.trigger('requestInteraction');

  connection.on('requestedInteraction', function (settings) {
    eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
    console.log(eventDefinitionKey);
  });
  function save() {

    var email_value = "{{Contact.Attribute." + eventDefinitionKey + ".Email}}"
    var telefone_value = "{{Contact.Attribute." + eventDefinitionKey + ".Telefone}}"
    var nome_value = "{{Contact.Attribute." + eventDefinitionKey + ".Nome}}"
    var idade_value = "{{Contact.Attribute." + eventDefinitionKey + ".Idade}}"
    console.log(email_value)
    // 'payload' is initialized on 'initActivity' above.
    // Journey Builder sends an initial payload with defaults
    // set by this activity's config.json file.  Any property
    // may be overridden as desired.
    // payload.name = name;

    payload["arguments"].execute.inArguments = [{ email: email_value, Telefone: telefone_value, nome: nome_value, idade: idade_value }];

    payload["metaData"].isConfigured = true;

    connection.trigger("updateActivity", payload);


  }


});
