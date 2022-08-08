const multer = require("multer")
const shortid = require("shortid")
const fs = require("fs")
const Enlaces = require("../models/Enlace")

exports.subirArchivo = async (req, res, next) => {

    const configuracionMulter = {
        limits: { fileSize: req.usuario ? 10000000 : 1000000}, // 1 mega = 1024*1024 sin cuenta, 10mb con cuenta
        storage: fileSotage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+"/../uploads")
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
                cb(null, `${shortid.generate()}${extension}`)
            }
        })
    }
    
    const upload = multer(configuracionMulter).single('archivo')

    upload( req, res, async (error) => {
        console.log(req.file)

        if(!error){
            res.json({ archivo: req.file.filename })
        } else {
            console.log(error)
            return next()
        }
    })
    
}

exports.eliminarArchivo = async (req, res) => {
    console.log(req.archivo)
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archivo}`)
        console.log("Archivo eliminado")
    } catch (error) {
        console.log(error)
    }
}

// Descarga un archivo
exports.descargar = async (req, res, next) => {

    // Obtiene el enlace
    const { archivo } = req.params
    const enlace = await Enlaces.findOne({ nombre: archivo })

    const archivoDescarga = __dirname + '/../uploads/' + archivo
    res.download(archivoDescarga)

    // Eliminar el archivo y la entrada de la DB
    // Si las descargas son iguales a 1 - Borrar la entrada y el archivo
    const { descargas, nombre } = enlace
    if(descargas === 1) {
        
        // Eliminar el archivo
        req.archivo = nombre

        // Eliminar la entrada de la db
        await Enlaces.findOneAndRemove(enlace.id)

        next()
    } else {
        // Si las descargas son mayores a 1 - Restar una descarga
        enlace.descargas--
        await enlace.save()
    }
}