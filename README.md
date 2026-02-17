#   Sistema de Gestión de Inventario

Aplicación Fullstack desarrollada con:

 - Backend: .NET Core + Dapper + SQL Server

 - Frontend: Angular

 - Seguridad: JWT Authentication

 - Base de datos con Stored Procedures

#  Estructura del Proyecto

Carpetas principales:

- ConsumoApi: Frontend.
  
- Script: Script de base de datos.
  
- PruebaApi: Backend.

#  Configuración de Base de Datos

Dentro de la carpeta Script, encontraremos el Script, ejecuta el archivo .sql para: 

  - Crear tablas.

  - Crear Stored Procedures.

  - Ejecutar la siguiente consulta para la creacion de dos usuarios:
    insert into dbo.Users (Username, PasswordHash, Role)
    values 
    (
    'admin',
    lower(convert(varchar(64), hashbytes('SHA2_256', 'admin123'), 2)),
    'Admin'
    );

    insert into dbo.Users (Username, PasswordHash, Role)
    values 
    (
    'user1',
    lower(convert(varchar(64), hashbytes('SHA2_256', 'usuario123'), 2)),
    'User'
    );

# Ejecutar el Backend (API)

Una vez terminada lo relacionado con la base de datos, vamos con la carpeta PruebaApi, dicha carpeta es el backend de la aplicación.

Detalles importantes: 

  - Editar appsettings.json: "ConnectionStrings": {
  "DefaultConnection": "Server=Tu_Servidor;Database=Prueba;User Id=Tu_Usuario;Password=Tu_Contraseña;TrustServerCertificate=True"
  }

  - Pasos para ejecutar:
      1. Abrimos una terminal y vamos a cd PruebaApi.
         
      2. dotnet restore.
         
      3. dotnet run --launch-profile https
         
Ya con esto la Api estará disponible.

#  Ejecutar el Frontend (Angular)

Ahora, enfocandonos en el Frontend.

Pasos para ejecutar: 

  - Abrimos una terminal y vamos a cd consumoApi.
    
  - npm install.
    
  - ng serve.

Con eso la aplicación ya estaria disponible

#  Flujo de Autenticación

  - El usuario inicia sesión.

  - El backend valida credenciales.

  - Se genera un JWT.

  - Angular guarda el token en localStorage.

  - Un interceptor agrega el token a cada request.

  - Los endpoints protegidos usan [Authorize].


#  Autor

Andrey Quesada
