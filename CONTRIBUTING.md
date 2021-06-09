## División de la Plataforma

Pynpon cuenta con 3 sistemas que engloban el funcionamiento total de la plataforma, estos son:
- Centro de Compras
- Centro de Ventas
- Sistema Administrativo

# Pynpon Node.js estándares

Para garantizar la consistencia en todo el código fuente, es necesario tener las siguiente reglas en cuanta al momento de programar:

## Prácticas de código

Es importante conocer los términos de [Node.js Style Guide](https://nodejs.org/es/docs/guides) estos deben seguirse y 
respetarse para garantizar la coherencia en todo el código fuente, es necesario aplicar las reglas al momento de programar.

Cualquier regla que sea considerada útil podrá ser integrada luego de ser conversada por los miembros del equipo.

#### Idioma: Inglés

Los comentarios, sentencias, variables y todo lo que este en el código debe estar unicamente en inglés.

#### Envolver las utilidades comunes como paquetes de NPM

En una aplicación grande que se constituye de múltples bases de código, utilidades transversales como los 
loggers, cifrado y similares, deben de estar envueltos por su propio código y expuestos como paquetes privados de NPM. 
Esto permite compartirlos entre múltiples base de código y proyectos.

#### Trabajar con modulos en NestJS

Al realizar una aplicación escalable con NestJS ofrece la oportunidad de trabajar con modulos
donde cada modulo es el recurso a utilizar como "usuarios", "ordenes", "pagos", entre otros.

#### Modulos

Trabajar por modulos hace que cada logica este independiente del resto esto ayuda a la organización y busqueda en el proyecto.

#### TypeORM

###### Entidades

Las entidades deben estar ubicadas en el directorio "models" y cada una de ellas deben estar en singular, minuscula y con el sufijo ".entity", de manera que puedan ser cargadas automaticamente por el ORM una sola vez.

#### Evitar comentar código antiguo

No es necesario ni factible comentar código antiguo.

#### Evitar métodos y variables sin usar

No dejar métodos y variables inútiles.

#### Comenzar llaves de un método en la misma linea

Las llaves de apertura de un bloque de código deben estar en la misma línea de la declaración de apertura.

#### No olvidar el punto y coma (;)

Si bien no se acordó por unanimidad, aún se recomienda poner un punto y coma al final de cada declaración. 
Esto hará que el código sea más legible y explícito para otros desarrolladores que lo lean.

#### Escribir comentarios descriptivos y útiles

Los comentarios que explican qué hace algún bloque de código son parte de las buenas prácticas, pueden brevemente 
describir una lógica sin analizar el código.

Ejemplo de comentario no muy útil:

```ts
// Set default tabindex.
if (!$attrs['tabindex']) {
  $element.attr('tabindex', '-1');
}
```

Ejemplo de comentario mucho más útil

```ts
// Unless the user specifies so, the calendar should not be a tab stop.
// This is necessary because ngAria might add a tabindex to anything with an ng-model
// (based on whether or not the user has turned that particular feature on/off).
if (!$attrs['tabindex']) {
  $element.attr('tabindex', '-1');
}
```

En el código TypeScript .ts, se utiliza el estilo JsDoc para descripciones (en clases, miembros, etc.) y 
los comentarios de estilo `//` para todo lo demás (explicaciones, información de fondo, etc.).

#### Probar nuevos features, hotfixes, etc.

Se debe verificar que cada una de las funciones y los hotfix siguen los requisitos antes de comenzar un Pull Request.

#### Menos es más

Una vez que se lanza una función, nunca desaparece. Debemos evitar agregar funciones que no ofrecen
alto valor para el usuario por el precio que pagamos tanto en mantenimiento, complejidad y tamaño de la carga útil.

### Límite de 100 columnas

Todo el código y documentos en el repositorio deben tener 100 columnas o menos. Esto se aplica a TypeScript, JavaScript, 
scripts de bash y archivos de rebajas.

### Diseño de API

#### Manejo de Errores

##### Usar Async-Await o promesas para manejo de errores asíncronos

El manejo de errores asincrónicos en el estilo de callback es probablemente la manera más rápida de ir al infierno 
(a.k.a, pyramid of doom o pirámide de la perdición). Lo mejor es utilizar una biblioteca de promesas o 
async-await que proporcione una sintaxis de código muy compacta y familiar como try-catch.

##### Usar solo el objeto Error incorporado

Muchos arrojan errores como una cadena o como un tipo personalizado, esto complica la lógica de manejo de errores 
y la interoperabilidad entre módulos. Ya sea que genere una excepción o emita un error, usar solo el objeto de Error 
incorporado aumentará la uniformidad y evitará la pérdida de información.

##### Manejar los errores centralmente, no dentro de un middleware Express

La lógica de manejo de errores, como un correo al administrador y registro de logs, debe encapsularse en un objeto 
dedicado y centralizado al que todos los end-points (por ejemplo, Express middleware, cron jobs, unit-testing) llaman cuando se produce un error.

#### Argumentos Booleanos

Evitar agregar argumentos booleanos a un método en los casos en que ese argumento signifique "hacer algo extra".
En estos casos, es preferible dividir el comportamiento en diferentes funciones.

#### Usar Arrow Functions (=>)

Las funciones de flecha hacen que la estructura del código sea más compacta y mantiene el contexto léxico de la función raíz (es decir, 'esto').
[Arrow Functions Docs](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Funciones/Arrow_functions)

```ts
// Evitar
function settTargetElement(createIfNotFound = false) {
  // ...
}
```

```ts
// Preferir
function setExistingTargetElement() {
  // ...
}

function createTargetElement() {
  // ...
}
```

#### Importar los require primero

Importar módulos al comienzo de cada archivo, antes y fuera de cualquier función. Esta práctica recomendada simple 
no solo ayuda a identificar fácil y rápidamente las dependencias de un archivo en la parte superior, sino que también 
evita un par de posibles problemas.

#### Importar de las carpetas no directamente de los archivos

Al desarrollar un módulo en una carpeta, colocar un archivo index que exponga los componentes internos del módulo para 
que todos los consumidores lo atraviesen. Esto sirve como una 'interfaz' para el módulo y facilita los cambios futuros 
sin romper el contrato.

Ejemplo:

```ts
  Evitar 
  module.exports.SMSProvider = require('./SMSProvider/SMSProvider.js');
  module.exports.SMSNumberResolver = require('./SMSNumberResolver/SMSNumberResolver.js');

  module.exports.SMSProvider = require('./SMSProvider');
  module.exports.SMSNumberResolver = require('./SMSNumberResolver');
```

#### Pruebas y prácticas generales de calidad

Se deben realizar las pruebas de la API que son las más fáciles de escribir y brinden más cobertura 
que las pruebas unitarias (utilizando herramientas como Postman).

#### Remover información sensible de los archivos de configuración o usar paquetes para cifrarlos

Nunca almacenar información sensible de texto sin formato en archivos de configuración o código fuente.
Como último recurso, esta información almacenada en el control de código fuente debe ser encriptada y administrada mediante 
(claves rodantes, vencimiento, auditoría, etc.).

#### Mejores prácticas de seguridad
[Rules and tips for more security in Node.js apps](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

### TypeScript

#### Nomenclatura

##### Notación Camel Case

- Upper Camel Case (la primera letra de cada una de las palabras es mayúscula).
  Usar para Clases y Modelos, Constantes ejemplo: `User`.
- Lower Camel Case (igual que Upper Camel Case con la excepción de que la primera letra es minúscula). 
  Usar para variables y métodos, ejemplo: `setUsers()`.

#### Tipado

Para los métodos y propiedades que forman parte de la API pública de un componente, todos los tipos deben ser explícitamente
especificados porque nuestras herramientas de documentación no pueden inferir tipos en lugares donde TypeScript si puede.

#### Comentarios de JsDoc

Las API privadas e internas deben tener JsDoc cuando no son obvias. En definitiva es el ámbito
del revisor de código en cuanto a lo que es "obvio", pero la regla general es que la mayoría de clases,
propiedades y métodos deben tener una descripción JsDoc.

Las propiedades deben tener una descripción concisa de lo que significa la propiedad.

Los bloques de métodos deben describir lo que hace la función y proporcionar una descripción para cada parámetro
y valor de retorno:

```ts
  /**
   * Abre un cuadro de diálogo modal que contiene el componente dado.
   * @param component Tipo del componente para cargar en el diálogo.
   * @param config Opciones de configuración de diálogo.
   * @returns Referencia al cuadro de diálogo recién abierto.
   */
  open<T>(component: ComponentType<T>, config?: DialogConfig): DialogRef<T> { ... }
```

Las propiedades booleanas y los valores de retorno deben usar "Si" en lugar de "Verdadero si...":

```ts
/** Si el valor está desactivado. */
disabled: boolean = false;
```

#### Nombres

##### General

- Escribir palabras en lugar de usar abreviaturas.
- Usar nobres exactos sobre nombres cortos (dentro de lo razonable). Por ejemplo, `userPosition` es mejor que 
`uposition` porque el primero comunica mucho más exactamente lo que significa la propiedad.

##### Clases

Las clases deben nombrarse en función de lo que son responsables. Los nombres deben capturar lo que el código
hace, no cómo se usa:

```
/** NO: */
class RadioService { }

/** Si: */
class UniqueSelectionDispatcher { }
```

##### Métodos

El nombre de un método debe capturar la acción realizada por ese método en lugar de
describir cuándo se llamará al método. Por ejemplo:

```ts
/** EVITAR: No describe lo que hace la función. */
handleClick() {
  // ...
}

/** Preferir: describe la acción realizada por la función. */
activateRipple() {
  // ...
}
```

#### Herencia

Evitar usar la herencia para aplicar comportamientos reutilizables a múltiples componentes. Esto limita cuanto
los comportamientos pueden ser compuestos. En cambio, [TypeScript mixins][ts-mixins] se puede usar para componer múltiples
comportamientos comunes en un solo componente.

#### Todo lo que sea private debe comenzar con un guión bajo

Los métodos private deben comenzar con un guión bajo _.

```ts
  private _bar = 40 + 2;

class Foo {
  private _bar() {}
}
```

[ts-mixins]: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#support-for-mix-in-classes

#### Pre-commit, pre-push y linter

Se debe ejecutar el lint antes de hacer commit o push, por lo tanto, en el proyecto, para las dependencias de desarrollo se usa Husky, 
que permite ejecutar algunos enlaces antes de hacer commits.

Evitar en todo momento desactivar el TS-Linter.


## Pautas para Commits

Mientras más legibles sean los mensajes serán mas fáciles de seguir cuando se miren a través del historial del proyecto **project history**. 

### Formato de los mensajes en los Commits

Cada mensaje de commit debe estar en inglés, consta de un **header**, un **body** y un **footer**. 
El header tiene un formato especial que incluye un **type**, un **scope** y un **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

El **header** es obligatorio y el **scope** del header es opcional.

Cualquier línea del mensaje de commit no puede tener más de 100 caracteres. Esto permite que el mensaje sea más fácil de leer.

```
docs(changelog): update changelog to beta.5
```

```
fix(release): need to depend on latest rxjs and zone.js
The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

```
feat(payment): add payment method to checkout on product
```

### Revertir

Si el commit revierte un commit anterior, debe comenzar con `revert:`, seguido del encabezado del commit revertido. En el cuerpo debería decir: 
`This reverts commit <hash>.`, donde el hash es el SHA del commit que se revierte.

### Tipos

Debe ser uno de los siguientes:

* **build**: Cambios que afectan el sistema de compilación o dependencias externas (ejemplos de scopes: gulp, broccoli, npm)
* **docs**: Cambios en la documentación del proyecto
* **feat**: Nueva característica
* **fix**: Correción de errores
* **perf**: Un cambio de código que mejora el rendimiento
* **refactor**: Un cambio de código para reestructurar la lógica implementada anteriormente sin cambiar su comportamiento externo
* **style**: Cambios que no afectan el significado del código. (white-space, formatting, missing semi-colons, etc)
* **test**: Agregar pruebas faltantes o corregir pruebas existentes

### Scope

El alcance debe ser el nombre del paquete npm afectado (como lo percibe la persona que lee el registro de 
cambios generado a partir de los mensajes de commit).

La siguiente es la lista de scopes compatibles:

* **admin**
* **auth**
* **config**
* **core**
* **layout**
* **maintenance**
* **shared**
* ...
* ...
* ...

y así sucesivamente, es importante mencionar el nombre del módulo

Actualmente hay algunas excepciones para la regla "usar nombre de paquete":

* **packaging**: utilizado para cambios que cambian el diseño del paquete npm en todos los paquetes,
  cambios de ruta pública (public path), cambios de package.json a todos los paquetes, cambios de file/format d.ts, cambios
  a bundles, etc.
* **changelog**: utilizado para actualizar las notas de la versión en CHANGELOG.md

### Subject

El subject contiene una breve descripción del cambio:

* usar el imperativo, tiempo presente: "change" no "changed" ni "changes"
* no capitalizar la primera letra
* sin punto (.) al final

### Body

Al igual que en el **subject**, usar el imperativo, presente: "change" no "changed" ni "changes"
El cuerpo debe incluir la motivación para el cambio y contrastar esto con el comportamiento anterior.

### Footer

El pie de página debe contener cualquier información sobre **Breaking Changes** y también es el lugar para la
referencia de Jira que emite que este commit **Closes**.

**Breaking Changes** debe comenzar con la palabra `BREAKING CHANGE:` con un espacio o dos líneas nuevas. 
El resto del mensaje de confirmación se usa para esto.

### Usar Smart Commits

Los Smart Commits permiten que los encargados del repositorio realicen acciones como la transición de problemas de 
Jira o la creación de revisiones de código [Crucible](https://www.atlassian.com/es/software/crucible) al incorporar comandos 
específicos en sus mensajes de confirmación.

Es posible:

Comentar problemas
Información de seguimiento de tiempo récord contra problemas
Problemas de transición a cualquier estado definido en el flujo de trabajo del proyecto en Jira.
Hay otras acciones disponibles si se usa Crucible.

Cada mensaje de un Smart Commit no debe abarcar más de una línea (es decir, no puede usar un carriage return en el comando), 
pero se puede agregar múltiples comandos a la misma línea.

[Jira smart commits documentation](https://confluence.atlassian.com/fisheye/using-smart-commits-960155400.html)

### Requerido para commits

- Considerar comenzar el mensaje del commit con un emoji aplicable: [Lista de emojis](https://gist.github.com/parmentf/035de27d6ed1dce0b36a)
- Agregar ISSUE_KEY después del emoji
- Header, body y footer si fuera necesario
- Al final, es necesario colocar el **Time Tracking Information** y la **Workflow transition**

#### Ejemplo 

```
:sparkles: LO-105 feat(payment): add payment method to checkout on product #time 4h 30m #review
```

