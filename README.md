# Latch for Meteor

It is a package that integrates the Latch service with Meteor framework, allowing users to easily protect theirs own accounts.

# Table of Contents

- [Description](#)
- [Quick start](#)
- [Installation](#)
- [Configuration](#)
- [Integration](#)
- [API](#)
  - [Latch.isPaired()](#)
  - [Latch.isLocked()](#)
  - [Latch.pair(token)](#)
  - [Latch.unpair()](#)
- [Integration with accounts-ui and Bootstrap](#)
- [Low level data on MongoDB](#)
  - [Data for service configuration](#)
  - [Data for the users](#)

# Description

Meteor is an ultra-simple environment for building modern web applications. It is a framework that allows the creation of real-time applications extremely fast.

Latch is a service that allows you to protect your digital identity. By implementing a digital latch, the user can block his accounts on different services and web sites, so it isn't possible login without having explicitly allowed it, so the danger that someone stole your credentials is reduced.

This package allows the integration of the Latch service within the Meteor framework, integrating itself with the system user accounts `accounts-based`, so the users who activate Latch (pair his account), they only will access if has been activated the latch explicitly.

# Quick start

The users of the Latch service must use a mobile application available on the most of platforms. Using this app they can enable the access to the protected service (activating or deactivating the digital latch).

To add the Latch support to a Meteor application simply add the package to your project:

~~~
meteor add gimco:accounts-ui-latch
~~~

The first time the package is added, you can configure the Latch service, so you must read the configuration instructions shown:

![Adding the package](https://raw.githubusercontent.com/gimco/meteor-latch/master/docs/01-adding-package.gif)

From this moment, the users will can pair his accounts with Latch, so after they have logged in, they can select the pair with Latch option:

![Pairing account](https://raw.githubusercontent.com/gimco/meteor-latch/master/docs/02-pair-account.gif)

Once pair the account with Latch, the user must use the mobile application to enable the possibility of logging in on the web site:

![Login](https://raw.githubusercontent.com/gimco/meteor-latch/master/docs/03-login-account.gif)

# Installation

To integrate Latch with your Meteor application only is needed add the `gimo:latch` to your project. Adding the package you can use the Latch API directly and the framework will check the state of the latch for the user paired.

~~~
meteor add gimco:latch
~~~

If you use the `accounts-ui` or `ian:accounts-ui-bootstrap-3` packages, you should use the optional [`gimco:accounts-ui-latch`](https://github.com/gimco/meteor-accounts-ui-latch) or [`gimco:accounts-ui-bootstrap-3-latch`](https://github.com/gimco/meteor-accounts-ui-bootstrap-3-latch) packages respectively, which add simple UI to configure and activate Latch:

~~~
meteor add gimco:accounts-ui-latch
~~~

# Configuration

Before users can protect their accounts with Latch, we must properly configure the Lath service. If you use the `accounts-ui` and the [`gimco:accounts-ui-latch`](https://github.com/gimco/meteor-accounts-ui-latch) packages (or the corresponding bootstrap versions), then you can configure the Latch service the first time you add the package using the configuration screen.

But the recommended way is configure Latch service using the `service-configuration` package, so you must execute the next lines inside a `Meteor.startup` block on the server side:

~~~
ServiceConfiguration.configurations.remove({
  service: “latch”
});
ServiceConfiguration.configurations.insert({
  service: “latch”,
  secret: {appId: XXXX, secretKey: YYYY}
});
~~~

The `appId` and `secretKey` values are obtained after the creation of the developer account Latch and a new application on the [Lath developer website](http://latch.elevenpaths.com).

# Integration

This package provides an API through the `Latch` object which allow call the Latch services and query the state of the user latch.

Also it’s integrated into the login process in meteor registering as a new authentication validation hook ([Accounts.validateLoginAttempt](http://docs.meteor.com/#/full/accounts_validateloginattempt)), so your application will check the state of the digital latch for the Latch paired users, and thus allow or disallow the login.

# API

Further integration inside the Meteor authentication process, the package also provide an API to call directly the Lath services from the client and service sides. The `Latch` object is the entry point to query the Latch state for the authenticated user.

Then we’re going to review the available methods.

## Latch.isPaired()

This method allow query if the current authenticated user is using the Latch service, i.e the user has paired his account with Latch. The method is a reactive data source so it’s possible use it inside your client side Templates.

## Latch.isLocked()

It allows query the current state of the digital latch for the authenticated user. This method is automatically used when the user try to login. When calling from the server side it’s possible specify an user object as a optional param.

## Latch.pair(token)

This method is used to pair the authenticated user with the Latch service. The first step for the user to pair the service is use the mobile application to request a new token. To pair the account, you must call this method with the temporal token shown in the Latch mobile application. After that, the Meteor account will be protected by the Latch service and the reactive data source `Latch.isPaired` will change.

## Latch.unpair()

This unpair the user in Lath service and remove any information related to Latch. After this call the reactive data source `Latch.isPaired` is modified.

# Integration with accounts-ui and Bootstrap

In the case of using the `accounts-ui` package you can use the optional [`gimco:accounts-ui-latch`](https://github.com/gimco/meteor-accounts-ui-latch) package, which extends different templates to add Latch options in the login dropdown. Alternatively, if you use Bootstrap with the `ian:accounts-ui-bootstrap-3` you can use the [`gimco:accounts-ui-bootstrap-3-latch`](https://github.com/gimco/meteor-accounts-ui-bootstrap-3-latch). To add this package simply run the following command on the Meteor project:

~~~~
meteor add gimco:accounts-ui-latch
~~~~

The first time this package is added, and if it wasn't configured the Latch service as indicated in the previous section of Configuration, will appear a new button on the dropdown login menu to configure the service.

Clicking this new button, a new configuration window will show to guide you through the setup of Latch. After setting the service, this configuration button will disappear and it never will show again unless you remove the Latch configuration (using `ServiceConfiguration.configurations.remove` or removing the data directly in the Mongo database).

Once an user is authenticated, it will show a new link in the dropdown menu to pair their account with Latch. First, the user must use his Latch mobile application to pair the new service. By doing this, a temporary token in the mobile device appears. Clicking the link for Latch pairing it will be shown a prompt window for the user to introduce this token. Once this is done, the user account of the Meteor application with be protected by the Latch service.

From this moment, the user only will can login the application unlocking the digital latch, otherwise an error will shown and the user will be notified in his mobile device of an unauthorized login attempt.

Similarly, the user can unpair his account using the corresponding link in the dropdown menu.

# Low level data on MongoDB

This section will show you the real data inserted in the MongoDB collections related to the Latch service.

## Data for service configuration

When you configure the Latch service, whether using the UI provided for the [`gimco:accounts-ui-latch`](https://github.com/gimco/meteor-accounts-ui-latch) package (or [`gimco:accounts-ui-bootstrap-3-latch`](https://github.com/gimco/meteor-accounts-ui-bootstrap-3-latch)) or calling to `ServiceConfiguration.configurations.insert`, both options will end by inserting a JSON object in the Meteor collection for the login services, the `meteor_accounts_loginServiceConfiguration` collection. See below a mongo session example to examine the data saved for the Latch service:

~~~
$ meteor mongo
MongoDB shell version: 2.4.9
connecting to: 127.0.0.1:3001/meteor
meteor:PRIMARY> db.meteor_accounts_loginServiceConfiguration.find().pretty()
{
	"service" : "latch",
	"secret" : {
		"appId" : “XXX”,
		"secretKey" : “YYY”
	},
	"_id" : “ZZZ”
}
~~~

If necessary we could change this information directly from the MongoDB console. We can also safely delete these settings either using a method call `ServiceConfiguration.configurations.remove` or deleting directly from the console this MongoDB object:

~~~
meteor:PRIMARY> db.meteor_accounts_loginServiceConfiguration.remove({service:’latch’})
~~~

## Data for the users

When an user pair his account with Latch, some information is saved on the user object in the users MongoDB collection. This information is private and is only accessible from the server side. We're saving the Latch accountId returned by the Latch service and a boolean flag named `latch` to true. This field is published only to the authenticated user, so this is accessible from the client side. This field is internally used by the `Latch.isPaired` method as the reactive data source.

See below a example of an meteor user with Latch data inside:

~~~
meteor:PRIMARY> db.users.find().pretty()
{
    "_id" : "XXXXX",
    ...
    "latch" : true,
    "services" : {
        "latch" : {
            "accountId" : "YYYYY"
        },
        ...
    },
    ...
}
~~~

Remember that the users collection are not automatically published, so there is no way for other users to know who are using Latch service and what is the locked status of other users.

From the server side or MongoDB console we can perform a simple query for all users using the Latch service:

~~~
meteor:PRIMARY> db.users.find({latch:true})
~~~