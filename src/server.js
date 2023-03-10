require("express-async-errors")
require("dotenv/config")

const migrationsRun = require("./database/sqlite/migrations")
const AppError = require("./utils/AppError")
const uploadConfig = require("./configs/upload")

const cors = require("cors")
const { request, response } = require("express");
const express = require("express");
const routes = require("./routes")

migrationsRun()

const app = express();
app.use(cors())
app.use(express.json())

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

app.use(( error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }  

  console.error(error)

  return response.status(500).json({
    status: "error",
    message: "Internal server error",
  })

})

const PORT = process.env.PORT || 3333; //se a aplicação não encontrar a porta configurada dentro do arquivo env ele utiliza a porta 3000 ou a setada no final desta linha

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
