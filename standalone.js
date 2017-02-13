// App specific
var identityPoolId = 'eu-central-1:6eaecaa6-58f1-420f-9a97-ac544534c9e6';
var userPoolId = 'eu-central-1_VtyYw2NZF';//'us-east-1_fgCWraBkF';
var appClientId = '3mivnikddsbgn7pikmuunv8so8';//'57lq262n28o7ddt8i36jcjj7qd';
var region = 'eu-central-1';

// constructed
var loginId = 'cognito-idp.' + region + '.amazonaws.com/' + userPoolId;
var poolData = {
   UserPoolId: userPoolId,
   ClientId: appClientId
};

function registerUser(user)
{
   // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
   AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'});

   var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

   var attributeList = [];

   var dataEmail = {
      Name: 'email',
      Value: user.email
   };

   var dataName = {
      Name: 'name',
      Value: user.name
   };

   attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail));
   attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataName));

   userPool.signUp(user.username, user.password, attributeList, null, function (err, result) {
      if (err) {
         console.log(err);
         return;
      }
      alert('User ' + user.username + ' Created')
   });
}

function confirmUser(username, code)
{
   // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
   AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'});

   var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

   var userData = {
      Username: username,
      Pool: userPool
   };

   var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

   cognitoUser.confirmRegistration(code, true, function (err, result){
      if (err) {
         console.log(err);
         return;
      }
      alert('User ' + username + '  Confirmed');
   });
}

function loginUser(username, password)
{
   // Need to provide placeholder keys unless unauthorised user access is enabled for user pool
   AWSCognito.config.update({accessKeyId: 'anything', secretAccessKey: 'anything'});

   var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

   var authenticationData = {
      Username: username,
      Password: password
   };

   var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

   var userData = {
      Username: username,
      Pool: userPool
   };

   var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

   cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
         alert(username + ' Logged In');
         setCredentials(result.getIdToken().getJwtToken());
      },
      onFailure: (err) => {
         console.log(err);
      }
   });
}

function getSession()
{
   var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

   var cognitoUser = userPool.getCurrentUser();

   if (cognitoUser != null) {
      cognitoUser.getSession(function(err, session){
         if (err) {
            logoutUser();
            return;
         }
         $('.session').text(session.getIdToken().getJwtToken());
         setCredentials(session.getIdToken().getJwtToken());
      });
   }
   else logoutUser();
}

function logoutUser()
{
   var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
   var cognitoUser = userPool.getCurrentUser();
   alert('Logged Out');
   if (cognitoUser != null) cognitoUser.signOut();
}

/* Helper Functions */

function setCredentials(token)
{
   AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
      Logins: {}
   });
   AWS.config.credentials.params.Logins[loginId] = token;
}

function apiVerify(token) {
    var data = null;
    var url = "https://y3op33lkfd.execute-api.eu-central-1.amazonaws.com/PROD/in";
    var method = "POST";
    var async = true;


    var request = new XMLHttpRequest();

    request.withCredentials = true;
    request.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
    });
    request.open(method, url);
    request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    request.setRequestHeader("Access-Control-Allow-Credentials", "true");
    request.setRequestHeader("test", token);
    request.setRequestHeader("cache-control", "no-cache");
    request.send();
}

