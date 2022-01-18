<div align="center">
  <h1>GOT API/REST gestor de órdenes de trabajo entorno BDIG 🗺️</h1>
</div>

<div align="center">
  <img src="http://www.ign.es/web/resources/docs/IGNCnig/IGN-Difusion.jpg">  
</div>

<p align="center"> 
  <a title="Languaje" href="https://vuejs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Node-16.13.1-blue">
  </a>  
  <a title="NPM version" href="#">
    <img src="https://img.shields.io/badge/npm-v8.3.0-red">
  </a>
  <a title="Language" href="https://vuejs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Lang-JavaScript-yellow">
  </a>  
  <a title="Language" href="https://vuejs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Lang-Express 4.17.1-brightgreen">
  </a>  
</p>

<h2>Acerca de</h2>
<div>
  <p>GOT API/REST está preparado para servir peticiones desde una base de datos PostgreSQL.</p>
</div>

<h2>Configuración</h2>
<div>
  <p>Para funcionar requiere de un archivo .env que se debe colocar en la raíz del proyecto. Se debe completar con los siguientes datos:</p>
  <blockquote>
    //configuracion base de datos
    <ul>
      <li>DB_HOST = '' //String, direccion IP del Host de la base de datos</li>
      <li>DB_USER = '' //String, usuario de la base de datos</li>
      <li>DB_PASSWORD = '' //String, password de la base de datos</li>
      <li>DB_DATABASE= '' //String, Nombre de la base de datos</li>
      <li>DB_PORT =  //Integer, Si no se introduce ningún puerto, tomara por defecto el 5432</li>
      <li>JWTKEY = '' //String, Cadena de texto aleatoria que se utiliza para codificar los JWT</li>
    </ul>
  </blockquote>
</div>

<hr/>
<br/>

<h2>Instalación</h2>

#### Inicializar proyecto
```
npm install
```

#### Ejecutar servidor de desarrollo
```
npm run serve
```

#### Compilar para producción
```
npm run build
```



