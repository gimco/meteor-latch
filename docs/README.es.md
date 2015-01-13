# Latch for Meteor

Es un paquete que integra el servicio Latch con el framework Meteor, permitiendo a los usuarios proteger sus cuentas fácilmente.

# Description

Meteor es un ultra simple entorno para construir aplicaciones web modernas. Es un framework que permite la creación de aplicaciones en tiempo real extrememadamente rápido. 

Latch es un servicio que permite proteger tus identidades digitales. Mediante la implementación de un pestillo digital, conseguimos bloquear nuestras cuentas de usuarios en los distintos servicios, de forma que no pueda ser utilizada sin haberlo permitido explícitamente, por lo que el peligro de que alguien consiga tus credenciales se reduce.

Este paquete permite la integración de los servicios de Latch dentro del framework de Meteor integrandose con el sistema de cuentas de usuarios (accounts-base), de forma que los usuarios que activen Latch (asocien su cuenta), sólo podrán acceder si han activado el pestillo explícitamente.

# Quick start

Los usuarios que del servicio Latch necesitan utilizar una aplicación móvil disponible en la mayoría de plataformas para habilitar manualmente el acceso a las diferentes cuentas (activar o desactivar el pestillo digital).

Para agregar soporte latch a una aplicación meteor simplemente añade el paquete al proyecto:

~~~
meteor add gimco:accounts-ui-latch
~~~

La primera vez que se agrega el paquete podrás configurar el servicio, para ello debes seguir las instrucciones indicadas:

![Añadir paquete](https://raw.githubusercontent.com/gimco/meteor-latch/master/docs/01-adding-package.gif)

Desde este momento los usuarios podrán asociar su cuenta con Latch, para ello una vez autenticados podrán seleccionar la opción de parear con el servicio de Latch:

![Enparejar cuenta](https://raw.githubusercontent.com/gimco/meteor-latch/master/docs/02-pair-account.gif)

Una vez asociado el usuario deberá activar el uso de la cuenta antes de poder logarse en el servicio:

![Autenticandonos](https://raw.githubusercontent.com/gimco/meteor-latch/master/docs/03-login-account.gif)

# Instalación

Para integrar Latch con tu aplicación meteor solo necesitas agregar el paquete `gimco:latch`a tu aplicación. Al agregar este paquete se podrá hacer uso de los métodos de la API de Latch y para los usuarios que asocien el servicio Latch, se comprobará el estado del a cuenta antes de logarse en la aplicación.

~~~
meteor add gimco:latch
~~~

En el caso de utilizar el paquete `accounts-ui` se puede utilizar el paquete opcional `gimco:accounts-ui-latch` el cual agregará un simple interfaz para configurar y activar Latch:

~~~
meteor add gimco:accounts-ui-latch
~~~

# Configuración

Antes que los usuario puedan proteger sus cuentas con Latch, debemos configurar correctamente el servicio Latch. Si usas el paquete `gimco:accounts-ui-latch` podrás configurar el servicio Latch la primera vez que agregues el paquete a través de las pantallas de configuración.

Pero lo forma mas recomendable es configurar el servicio Latch haciendo uso del paquete `service-configuration`, y para ello debemos ejecutar las siguiente líneas en algún bloque `Meteor.startup` en el lado servidor:

~~~
ServiceConfiguration.configurations.remove({
  service: “latch”
});
ServiceConfiguration.configurations.insert({
  service: “latch”,
  secret: {appId: XXXX, secretKey: YYYY}
});
~~~

Los valores `appId` y `secretKey` los puedes obtener en la [página de desarrolladores de Latch](http://latch.elevenpaths.com) una vez hayas creado la aplicación Latch para tu aplicación web.

# Integración

Este paquete proporciona una api a través del objeto `Latch` que nos permite interactuar con los servicios de Latch y consultar el estado de protección para el usuario logueado.

Además se integra en el proceso de autenticación registrándose como un método de comprobación de autenticación ([Accounts.validateLoginAttempt](http://docs.meteor.com/#/full/accounts_validateloginattempt)), de forma que para los usuarios que se hayan pareado, se comprueba el estado del pestillo Latch para permitir o no el acceso.

# API

Ademas de integrase en el proceso de autenticación de meteor, el paquete también ofrece una api para permitir interactuar con el servicio Latch tanto en el lado cliente como en el lado servidor. Al agregar el paquete se agrega el objeto `Latch` a través del cual nos permite consultar el servicio Latch para el usuario autenticado.

## Latch.isPaired()

Es un método para consultar si el usuario autenticado tiene pareado el servicio Latch con su cuenta. Este método es una fuente de datos reactiva por lo que puede ser usado dentro de plantillas en el lado cliente.

## Latch.isLocked()

Permite conocer el estado actual del pestillo digital de Latch del usuario autenticado. Esta método es utilizado automáticamente al intentar autenticar al usuario. En el lado servidor se pude especificar el usuario sobre el que se desea realizar la comprobación.

## Latch.pair(token)

Permite parear el usuario autenticado con Latch. El primer paso para parear el servicio es utilizar la aplicación móvil de Latch para solicitar un nuevo token. Para enlazar la cuenta con el servicio Latch se debe invocar a este método con el token temporal mostrado en la aplicación movil de Latch. Tras la llamada satisfactoria la fuete de datos reactiva relacionado con `Latch.isPaired` se modifica.

## Latch.unpair()

Permite eliminar toda la información de Latch del usuario autenticado. Tras la llamada satisfactoria la fuente de datos reactiva relacionado con `Latch.isPaired` se modifica.

# Integación con accounts-ui

En el caso de utilizar el paquete `accounts-ui` se puede utilizar el paquete opcional `accounts-ui-latch` el cual extiende diferentes plantillas para agregar las opciones de Latch al menú del usuario. Para agregar este paquete sólo hay que ejecutar el siguiente comando sobre el proyecto:

~~~~
meteor add gimco:accounts-ui-latch
~~~~

La primera vez que se agrega este paquete, y si no ha se ha configurado el servicio Latch como se ha indicado en la sección anterior de Configuración, aparecerá un nuevo botón en el menú desplegable que permite configurar el servicio.

Al pulsar aparecerá una ventana modal con las instrucciones necesarias para configurar el servicio Latch. Una vez configurado el servicio este botón de configuración desaparecerá, y no se volverá a mostrar hasta que no eliminemos la información de configuración de Latch (usando `ServiceConfiguration.configurations.remove` o eliminando los datos de la colección mongodb correspondiente).

Una vez que un usuario se autentica o crea una nueva cuenta, aparecerá un nuevo enlace en el menú desplegable que le permite asociar su cuenta con Latch. En primer lugar, el usuario deberá utilizar su aplicación movil de Latch para parear un nuevo servicio. Al hacer esto aparecerá un token temporal en el dispositivo movil. Al pulsar sobre el enlace de parear con Latch de la aplicación web, el usuario deberá introducir el token temporal en la ventana del prompt. Una vez hecho esto se asociará la cuenta del usuario de la aplicación Meteor con el servicio Latch.

A partir de este momento el usuario sólo podrá acceder a la aplicación activado el pestillo desde la aplicación Latch, en caso contrario recibirá un error y no podrá loguearse.

De igual manera, el usuario podrá desactivar el uso de Latch haciendo uso del enlace correspondiente en el menú de usuario de Latch.

# Datos en MongoDB

En esta sección se indican los datos que son insertados en las colecciones MongoDB para configurar el servicio de Latch.

## Datos generales del servicio

En primer lugar, al configurar el servicio, ya sea utilizando el interfaz proporcionado por el paquete `gimco:accounts-ui-latch` o haciendo uso de las llamadas `ServiceConfiguration.configurations.insert`, ambos opciones terminan por insertar un objeto JSON en la colección de meteor para los servicio de fogueo, la colección `meteor_accounts_loginServiceConfiguration`. A continuación vemos un ejemplo de conexión a la base de datos meteor y la consulta de los datos relacionados con Latch:

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

Si fuera necesario podríamos modificar estos datos directamente desde la consola de mongo. También podemos eliminar sin peligro esta configuración ya sea utilizando una llamada al método `ServiceConfiguration.configurations.remove` o eliminado directamente este objeto desde la consola de MongoDB:

~~~
meteor:PRIMARY> db.meteor_accounts_loginServiceConfiguration.remove({service:’latch’})
~~~

## Datos de Latch de los usuarios

Cuando un usuario enlaza su cuenta con Latch se agrega en la colección de usuarios el identificador de la cuenta de Latch. Esta información es privada y solo es accesible desde meteor desde el lado servidor. Además de almacenar el accountId se estable el atributo `latch` a true. Esta propiedad si se publica hacia el usuario autenticado de forma que es accesible desde el lado cliente. Esta propiedad es la utilizada internamente por el método `Latch.isPaired` como fuente de datos reactiva.

Hay que recordar que la colección de usuarios no se publica automáticamente, por lo que no hay forma de que los usuarios sepan quienes están haciendo uso de Latch y cuál es el estado de activación de otros usuarios.

Desde el lado servidor o desde la consola de MongoDB podemos realizar una simple consulta para obtener todos los usuarios con Latch activado:

~~~
meteor:PRIMARY> db.users.find({latch:true})
~~~